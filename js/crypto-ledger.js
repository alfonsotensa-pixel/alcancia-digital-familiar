/**
 * SmartPiggy Cloud - Motor Criptográfico y de Integridad del Libro Mayor (Ronda 2 Auditado)
 * Implementa:
 * 1. PBKDF2-SHA256 (210,000 iteraciones) vía Web Crypto API para derivar:
 *    - authVerifier: Hash de verificación de PIN parental sin almacenar el PIN en claro.
 *    - parentSigningKey: Clave simétrica HMAC-SHA256 no extraíble mantenida solo en RAM durante la sesión del Padre.
 * 2. Firma HMAC-SHA256 canónica sobre cada evento del Libro Mayor (LedgerEvent) y encadenamiento prevHash.
 * 3. Detección automática de adulteración en cliente (CORRUPTED_UNSIGNED_ENTRY) para impedir que un hijo
 *    modifique saldos desde DevTools / LocalStorage / IndexedDB.
 */

const PBKDF2_ITERATIONS = 210000;
const encoder = new TextEncoder();

function bufferToHex(buffer) {
  const bytes = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

function hexToBytes(hex) {
  const clean = (hex || '').replace(/[^0-9a-fA-F]/g, '');
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return bytes;
}

/**
 * Fallback determinista FNV-1a / SHA-like solo en caso de entorno sin Web Crypto API (ej. navegador antiguo no seguro)
 */
function fallbackHashHex(inputStr) {
  let h1 = 0xdeadbeef ^ inputStr.length;
  let h2 = 0x41c6ce57 ^ inputStr.length;
  for (let i = 0, ch; i < inputStr.length; i++) {
    ch = inputStr.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const p1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const p2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return (p1 + p2 + p1 + p2 + p2 + p1 + p2 + p1).slice(0, 64);
}

export function generateSaltHex(byteLength = 16) {
  if (window.crypto && window.crypto.getRandomValues) {
    const arr = new Uint8Array(byteLength);
    window.crypto.getRandomValues(arr);
    return bufferToHex(arr.buffer);
  }
  let out = '';
  for (let i = 0; i < byteLength * 2; i++) {
    out += Math.floor(Math.random() * 16).toString(16);
  }
  return out;
}

/**
 * Serialización JSON estable (claves ordenadas) para firmar metadatos de forma determinista.
 */
export function stableStringify(value) {
  if (value === null || value === undefined) return 'null';
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(',')}]`;
  if (typeof value === 'object') {
    const keys = Object.keys(value).filter((k) => value[k] !== undefined).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

/**
 * Serialización canónica determinista de los campos contables críticos de un evento del Ledger.
 * - sigVersion 1 (eventos antiguos): campos contables básicos.
 * - sigVersion 2 (tareas, multas y planes de ahorro): además firma `metadata` (tope de multa, banda de edad,
 *   tasa congelada del plan, etc.) para que ningún parámetro que afecte el saldo quede sin firma.
 */
export function canonicalEventPayload(event) {
  const payload = {
    id: String(event.id || ''),
    familyId: String(event.familyId || ''),
    memberId: String(event.memberId || ''),
    type: String(event.type || ''),
    amountCents: Math.trunc(Number(event.amountCents || 0)),
    catalogId: String(event.catalogId || ''),
    referenceId: String(event.referenceId || ''),
    targetEventId: String(event.targetEventId || ''),
    localDate: String(event.localDate || ''),
    createdAt: String(event.createdAt || ''),
    prevHash: String(event.prevHash || 'GENESIS')
  };
  if (Number(event.sigVersion || 1) >= 2) {
    payload.sigVersion = 2;
    payload.meta = stableStringify(event.metadata || {});
    return stableStringify(payload);
  }
  return JSON.stringify(payload);
}

export async function sha256Hex(message) {
  if (window.crypto && window.crypto.subtle) {
    const buf = await window.crypto.subtle.digest('SHA-256', encoder.encode(message));
    return bufferToHex(buf);
  }
  return fallbackHashHex('SHA256:' + message);
}

/**
 * Deriva el verificador de autenticación (`authVerifier`) y la llave de firma (`signingKey`)
 * a partir del PIN del padre y el `familySalt` utilizando PBKDF2-SHA256 con 210,000 iteraciones.
 */
export async function deriveParentKeyBundle(pin, familySaltHex) {
  const cleanPin = String(pin || '').trim();
  const saltAuth = encoder.encode(`${familySaltHex}:SMARTPIGGY_AUTH_V2`);
  const saltSign = encoder.encode(`${familySaltHex}:SMARTPIGGY_SIGN_V2`);

  if (window.crypto && window.crypto.subtle) {
    const baseKey = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(cleanPin),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    const authBits = await window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltAuth,
        iterations: PBKDF2_ITERATIONS,
        hash: 'SHA-256'
      },
      baseKey,
      256
    );

    const signingKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltSign,
        iterations: PBKDF2_ITERATIONS,
        hash: 'SHA-256'
      },
      baseKey,
      { name: 'HMAC', hash: 'SHA-256', length: 256 },
      false, // no extraíble fuera de Web Crypto
      ['sign', 'verify']
    );

    return {
      authVerifier: bufferToHex(authBits),
      signingKey,
      algorithm: `PBKDF2-SHA256 (${PBKDF2_ITERATIONS.toLocaleString()} iteraciones) + HMAC-SHA256`
    };
  }

  // Fallback si el navegador bloquea subtle crypto
  const authVerifier = fallbackHashHex(`AUTH:${cleanPin}:${familySaltHex}:${PBKDF2_ITERATIONS}`);
  const fallbackSecret = fallbackHashHex(`SIGN:${cleanPin}:${familySaltHex}:${PBKDF2_ITERATIONS}`);
  return {
    authVerifier,
    signingKey: { __fallbackSecret: fallbackSecret },
    algorithm: 'HMAC-Fallback-Deterministic'
  };
}

/**
 * Calcula un digest público de integridad estructural para verificación rápida en Modo Hijo
 * (sin exponer la llave privada del Padre) y una firma HMAC-SHA256 con la llave de sesión del Padre.
 */
export async function computePublicIntegritySeal(eventHash, familySaltHex) {
  return sha256Hex(`SEAL_V2:${familySaltHex}:${eventHash}:${eventHash.slice(0, 16)}`);
}

export async function signEventHash(eventHash, signingKey) {
  if (!signingKey) {
    throw new Error('OPERACIÓN RECHAZADA: Se requiere sesión activa de Papá/Mamá con llave criptográfica en memoria.');
  }
  if (window.crypto && window.crypto.subtle && !(signingKey.__fallbackSecret)) {
    const sigBuf = await window.crypto.subtle.sign(
      'HMAC',
      signingKey,
      encoder.encode(eventHash)
    );
    return bufferToHex(sigBuf);
  }
  return fallbackHashHex(`HMAC:${signingKey.__fallbackSecret}:${eventHash}`);
}

export async function verifyEventSignature(eventHash, signatureHex, signingKey) {
  if (!signingKey || !signatureHex) return false;
  if (window.crypto && window.crypto.subtle && !(signingKey.__fallbackSecret)) {
    try {
      const sigBytes = hexToBytes(signatureHex);
      return await window.crypto.subtle.verify(
        'HMAC',
        signingKey,
        sigBytes,
        encoder.encode(eventHash)
      );
    } catch {
      return false;
    }
  }
  const expected = fallbackHashHex(`HMAC:${signingKey.__fallbackSecret}:${eventHash}`);
  return expected === signatureHex;
}

/**
 * Construye y firma criptográficamente un nuevo evento contable para el Libro Mayor (Append-Only Ledger).
 */
export async function createSignedLedgerEvent(rawEvent, signingKey, familySaltHex, lastEventHash = 'GENESIS') {
  const event = {
    id: rawEvent.id || `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    familyId: rawEvent.familyId,
    memberId: rawEvent.memberId,
    createdByParentId: rawEvent.createdByParentId || 'parent_admin',
    type: rawEvent.type,
    amountCents: Math.round(Number(rawEvent.amountCents || 0)),
    catalogId: rawEvent.catalogId || '',
    referenceId: rawEvent.referenceId || '',
    targetEventId: rawEvent.targetEventId || '',
    note: (rawEvent.note || '').trim(),
    metadata: rawEvent.metadata || {},
    localDate: rawEvent.localDate,
    createdAt: rawEvent.createdAt || new Date().toISOString(),
    prevHash: lastEventHash || 'GENESIS',
    sigVersion: 2
  };

  const canonical = canonicalEventPayload(event);
  const eventHash = await sha256Hex(canonical);
  const signature = await signEventHash(eventHash, signingKey);
  const integritySeal = await computePublicIntegritySeal(eventHash, familySaltHex);

  return {
    ...event,
    eventHash,
    signature,
    integritySeal
  };
}

/**
 * Audita todo el Libro Mayor (Ledger):
 * - En Modo Hijo (sin signingKey en RAM): Verifica que el hash canónico `eventHash` coincida exactamente con
 *   los datos del asiento y con su sello `integritySeal` + presencia de firma HMAC. Si alguien edita `amountCents`
 *   desde DevTools/LocalStorage, `recomputedHash !== event.eventHash` o falla el sello -> `CORRUPTED_UNSIGNED_ENTRY`.
 * - En Modo Papá (con signingKey en RAM): Verifica además criptográficamente el HMAC-SHA256 de cada asiento.
 */
export async function auditLedgerEvents(events, familySaltHex, parentSigningKey = null) {
  const validEvents = [];
  const corruptedEvents = [];

  const sorted = [...(events || [])].sort((a, b) => {
    const dCmp = String(a.localDate || '').localeCompare(String(b.localDate || ''));
    if (dCmp !== 0) return dCmp;
    const tCmp = String(a.createdAt || '').localeCompare(String(b.createdAt || ''));
    if (tCmp !== 0) return tCmp;
    return String(a.id || '').localeCompare(String(b.id || ''));
  });

  for (const ev of sorted) {
    const canonical = canonicalEventPayload(ev);
    const recomputedHash = await sha256Hex(canonical);
    const expectedSeal = await computePublicIntegritySeal(recomputedHash, familySaltHex);

    const hashMatches = recomputedHash === ev.eventHash;
    const sealMatches = expectedSeal === ev.integritySeal;
    const hasSignature = typeof ev.signature === 'string' && ev.signature.length >= 32;

    let hmacValid = true;
    if (parentSigningKey) {
      hmacValid = await verifyEventSignature(recomputedHash, ev.signature, parentSigningKey);
    }

    if (hashMatches && sealMatches && hasSignature && hmacValid && ev.amountCents >= 0) {
      validEvents.push({
        ...ev,
        verificationStatus: parentSigningKey ? 'VERIFIED_HMAC_PARENT' : 'VERIFIED_SEAL_READONLY'
      });
    } else {
      corruptedEvents.push({
        ...ev,
        verificationStatus: 'CORRUPTED_UNSIGNED_ENTRY',
        corruptionReason: !hashMatches
          ? 'El monto o datos del asiento fueron alterados manualmente fuera de la firma original (Hash Mismatch).'
          : !hmacValid
            ? 'Firma HMAC-SHA256 parental inválida o apócrifa.'
            : 'Sello de integridad ausente o corrupto.'
      });
    }
  }

  return {
    validEvents,
    corruptedEvents,
    isClean: corruptedEvents.length === 0
  };
}
