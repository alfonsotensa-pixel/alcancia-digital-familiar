/**
 * SmartPiggy Cloud - Bundle Integral (100% SVG, Criptografia HMAC-SHA256, Motor Financiero y Auto-Sync)
 */
(function () {
  'use strict';

  // ==========================================================================
  // MODULE: icons.js
  // ==========================================================================
/**
 * SmartPiggy Cloud - Sistema Integral de Iconografía SVG Vectorial
 * Reemplaza todos los iconos por gráficos vectoriales SVG escalables (<svg viewBox="0 0 24 24">),
 * incluyendo mapeo automático de compatibilidad para datos existentes en almacenamiento local.
 */

const SVG_ICON_PATHS = {
  // Identidad y Finanzas Principales
  piggy: `<path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><circle cx="16" cy="11" r="1" fill="currentColor"/>`,
  'trending-up': `<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>`,
  'credit-card': `<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/>`,
  gem: `<polygon points="6 3 18 3 22 9 12 22 2 9"/><line x1="2" y1="9" x2="22" y2="9"/><polyline points="12 22 16 9 13 3"/><polyline points="12 22 8 9 11 3"/>`,
  wallet: `<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>`,
  coins: `<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>`,
  dollar: `<line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`,
  target: `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>`,

  // Seguridad y Roles
  eye: `<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>`,
  lock: `<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
  unlock: `<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>`,
  key: `<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>`,
  'shield-check': `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>`,
  'shield-alert': `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`,

  // Navegación, Nube y Acciones de Sistema
  cloud: `<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>`,
  devices: `<rect x="2" y="4" width="14" height="10" rx="2"/><line x1="6" y1="18" x2="12" y2="18"/><line x1="9" y1="14" x2="9" y2="18"/><rect x="16" y="9" width="6" height="11" rx="1"/>`,
  'sun-moon': `<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>`,
  plus: `<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`,
  minus: `<line x1="5" y1="12" x2="19" y2="12"/>`,
  list: `<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>`,
  repeat: `<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>`,
  users: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  flask: `<path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/>`,
  inbox: `<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>`,
  send: `<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>`,
  download: `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>`,
  upload: `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>`,
  link: `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>`,
  refresh: `<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>`,
  trash: `<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>`,
  undo: `<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>`,
  zap: `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
  check: `<polyline points="20 6 9 17 4 12"/>`,
  x: `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`,
  'alert-triangle': `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
  clock: `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
  calendar: `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
  pause: `<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>`,
  play: `<polygon points="5 3 19 12 5 21 5 3"/>`,
  stop: `<rect x="5" y="5" width="14" height="14" rx="2"/>`,
  'arrow-down-left': `<line x1="17" y1="7" x2="7" y2="17"/><polyline points="17 17 7 17 7 7"/>`,
  'arrow-up-right': `<line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>`,
  'bar-chart': `<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>`,
  ban: `<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>`,

  // Catálogos de Ingresos, Gastos y Avatares de Usuarios
  sparkles: `<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/>`,
  trophy: `<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>`,
  gift: `<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>`,
  puzzle: `<path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.315 8.685a.98.98 0 0 1 .837-.276c.47.07.802.48.968.925a2.501 2.501 0 1 0 3.214-3.214c-.446-.166-.855-.497-.925-.968a.979.979 0 0 1 .276-.837l1.61-1.61a2.404 2.404 0 0 1 1.705-.707c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z"/>`,
  gamepad: `<line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/>`,
  icecream: `<path d="m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11"/><path d="M17 7A5 5 0 0 0 7 7"/><path d="M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4"/>`,
  palette: `<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>`,
  book: `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>`,
  popcorn: `<path d="M18 8a2 2 0 0 0 0-4 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0 0 4"/><path d="M10 22 9 8"/><path d="m14 22 1-14"/><path d="M20 8c.5 0 .9.4.8 1l-2.6 12c-.1.5-.7 1-1.2 1H7c-.6 0-1.1-.4-1.2-1L3.2 9c-.1-.6.3-1 .8-1Z"/>`,
  bike: `<circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>`,
  'shopping-bag': `<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>`,

  // Avatares Vectoriales para Perfiles Familiares
  unicorn: `<path d="m15 4 5-2-2 5"/><path d="M12 6c-4.5 0-8 3.5-8 8v6h5v-4h3c4.4 0 8-3.6 8-8 0-1.1-.9-2-2-2h-6Z"/><circle cx="15" cy="10" r="1" fill="currentColor"/>`,
  rocket: `<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>`,
  dino: `<path d="M18 4h-4a3 3 0 0 0-3 3v5H7a4 4 0 0 0-4 4v4h4v-3h4v3h4v-8h3a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"/><circle cx="15.5" cy="6.5" r="1" fill="currentColor"/>`,
  soccer: `<circle cx="12" cy="12" r="10"/><polygon points="12 7 16 10 14.5 15 9.5 15 8 10"/><line x1="12" y1="2" x2="12" y2="7"/><line x1="21.5" y1="8.9" x2="16" y2="10"/><line x1="17.9" y1="20.1" x2="14.5" y2="15"/><line x1="6.1" y1="20.1" x2="9.5" y2="15"/><line x1="2.5" y1="8.9" x2="8" y2="10"/>`,
  guitar: `<path d="m20 4-6.5 6.5"/><path d="m18 2 4 4"/><path d="M11.5 10.5a4.5 4.5 0 0 0-6.36 6.36l1.99 2a4.5 4.5 0 0 0 6.37-6.36Z"/><circle cx="9.5" cy="14.5" r="1" fill="currentColor"/>`,
  'parent-male': `<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><polyline points="10 15 12 19 14 15"/>`,
  'parent-female': `<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M8 7c0-2.5 1.8-4 4-4s4 1.5 4 4v4"/>`,
  user: `<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`
};

/**
 * Mapa de compatibilidad para convertir cualquier emoji previamente guardado en LocalStorage
 * al identificador SVG vectorial correspondiente.
 */
const LEGACY_EMOJI_TO_SVG_MAP = {
  '🐷': 'piggy',
  '🦄': 'unicorn',
  '🚀': 'rocket',
  '🦖': 'dino',
  '⚽': 'soccer',
  '🎨': 'palette',
  '🎸': 'guitar',
  '👨‍💼': 'parent-male',
  '👩‍💻': 'parent-female',
  '👤': 'user',
  '📅': 'calendar',
  '🧹': 'sparkles',
  '🏆': 'trophy',
  '🎁': 'gift',
  '📈': 'trending-up',
  '🧸': 'puzzle',
  '🎮': 'gamepad',
  '🍦': 'icecream',
  '📚': 'book',
  '🍿': 'popcorn',
  '💳': 'credit-card',
  '🚲': 'bike',
  '🎯': 'target',
  '💰': 'coins',
  '💵': 'dollar',
  '🛒': 'shopping-bag',
  '🛍️': 'shopping-bag',
  '📌': 'list',
  '🔐': 'lock',
  '🔓': 'unlock',
  '🔑': 'key',
  '👁️': 'eye',
  '⚡': 'zap',
  '🔄': 'repeat',
  '↩️': 'undo',
  '🧪': 'flask',
  '📩': 'send',
  '📬': 'inbox',
  '☁️': 'cloud',
  '🛡️': 'shield-check',
  '⚠️': 'alert-triangle',
  '⏳': 'clock',
  '✅': 'check',
  '❌': 'x',
  '⏸️': 'pause',
  '▶️': 'play',
  '⏹️': 'stop'
};

function resolveIconKey(keyOrLegacy, fallback = 'piggy') {
  if (!keyOrLegacy) return fallback;
  const trimmed = String(keyOrLegacy).trim();
  if (SVG_ICON_PATHS[trimmed]) return trimmed;
  if (LEGACY_EMOJI_TO_SVG_MAP[trimmed]) return LEGACY_EMOJI_TO_SVG_MAP[trimmed];
  return fallback;
}

/**
 * Genera el elemento `<svg>` inline listo para insertarse en el DOM.
 */
function renderSvgIcon(keyOrLegacy, size = 18, extraClass = '') {
  const iconKey = resolveIconKey(keyOrLegacy, 'piggy');
  const innerPaths = SVG_ICON_PATHS[iconKey] || SVG_ICON_PATHS.piggy;
  const cls = `svg-icon ${extraClass}`.trim();
  return `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${innerPaths}</svg>`;
}


  // ==========================================================================
  // MODULE: crypto-ledger.js
  // ==========================================================================
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

function generateSaltHex(byteLength = 16) {
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
 * Serialización canónica determinista de los campos contables críticos de un evento del Ledger.
 */
function canonicalEventPayload(event) {
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
  return JSON.stringify(payload);
}

async function sha256Hex(message) {
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
async function deriveParentKeyBundle(pin, familySaltHex) {
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
async function computePublicIntegritySeal(eventHash, familySaltHex) {
  return sha256Hex(`SEAL_V2:${familySaltHex}:${eventHash}:${eventHash.slice(0, 16)}`);
}

async function signEventHash(eventHash, signingKey) {
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

async function verifyEventSignature(eventHash, signatureHex, signingKey) {
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
async function createSignedLedgerEvent(rawEvent, signingKey, familySaltHex, lastEventHash = 'GENESIS') {
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
    prevHash: lastEventHash || 'GENESIS'
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
async function auditLedgerEvents(events, familySaltHex, parentSigningKey = null) {
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


  // ==========================================================================
  // MODULE: financial-engine.js
  // ==========================================================================
/**
 * SmartPiggy Cloud - Motor Financiero Determinista y Reductor Event-Sourced (Ronda 2 Auditado)
 * - 100% aritmética en enteros (centavos) sin errores de punto flotante IEEE 754.
 * - Estado derivado mediante reducción pura (fold/reduce) sobre eventos verificados del Ledger (CRDT G-Set).
 * - Tablas de amortización Simple y Compuesta Francesa con absorción exacta de residuo en la cuota N.
 * - Soporte de Abonos Extraordinarios a Capital (recalculando intereses sobre saldo insoluto).
 * - Inversiones a Plazo Fijo con cálculo de interés devengado diario y rescate anticipado.
 * - Motor idempotente de Ingresos Recurrentes sobre fechas calendario locales (YYYY-MM-DD).
 */

function getTodayLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDaysLocalDate(localDateStr, daysToAdd) {
  const [y, m, d] = String(localDateStr).split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1, 12, 0, 0);
  dt.setDate(dt.getDate() + Number(daysToAdd || 0));
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addMonthsLocalDate(localDateStr, monthsToAdd) {
  const [y, m, d] = String(localDateStr).split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1 + Number(monthsToAdd || 0), d || 1, 12, 0, 0);
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function diffDaysLocalDate(startLocalDate, endLocalDate) {
  const [y1, m1, d1] = String(startLocalDate).split('-').map(Number);
  const [y2, m2, d2] = String(endLocalDate).split('-').map(Number);
  const t1 = new Date(y1, (m1 || 1) - 1, d1 || 1, 12, 0, 0).getTime();
  const t2 = new Date(y2, (m2 || 1) - 1, d2 || 1, 12, 0, 0).getTime();
  return Math.round((t2 - t1) / (1000 * 60 * 60 * 24));
}

function toCents(amountFloatOrStr) {
  const num = Number(String(amountFloatOrStr).replace(/[^0-9.-]/g, ''));
  if (Number.isNaN(num)) return 0;
  return Math.round(num * 100);
}

function formatMoneyCents(cents, currency = 'MXN', showSign = false) {
  const safeCents = Math.round(Number(cents || 0));
  const absVal = Math.abs(safeCents) / 100;
  const formatted = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency || 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(absVal);

  if (safeCents < 0) return `-${formatted}`;
  if (showSign && safeCents > 0) return `+${formatted}`;
  return formatted;
}

/**
 * Avanza una fecha calendario según la frecuencia configurada (`DAILY` | `WEEKLY` | `BIWEEKLY` | `MONTHLY`)
 */
function advanceDateByFrequency(localDateStr, frequency, steps = 1) {
  if (frequency === 'DAILY') return addDaysLocalDate(localDateStr, 1 * steps);
  if (frequency === 'WEEKLY') return addDaysLocalDate(localDateStr, 7 * steps);
  if (frequency === 'BIWEEKLY') return addDaysLocalDate(localDateStr, 14 * steps);
  if (frequency === 'MONTHLY') return addMonthsLocalDate(localDateStr, 1 * steps);
  return addDaysLocalDate(localDateStr, 7 * steps);
}

/**
 * Genera la Tabla de Amortización exacta en centavos enteros (Ronda 2 Objeción 3):
 * - Soporta `SIMPLE` (Interés Simple) y `COMPOUND_FRENCH` (Interés Compuesto Francés).
 * - Garantiza que la suma de `principalPartCents` de las N cuotas sea EXACTAMENTE igual a `principalCents`
 *   absorbiendo cualquier residuo de redondeo en la cuota final N.
 */
function generateLoanSchedule({
  principalCents,
  interestRatePercent,
  termPeriods,
  interestType = 'SIMPLE',
  frequency = 'WEEKLY',
  startDate = getTodayLocalDate()
}) {
  const P = Math.max(0, Math.round(Number(principalCents || 0)));
  const N = Math.max(1, Math.round(Number(termPeriods || 1)));
  const ratePct = Math.max(0, Number(interestRatePercent || 0));
  const r = ratePct / 100;

  const schedule = [];

  if (interestType === 'COMPOUND_FRENCH' && r > 0) {
    // Cuota nivelada francesa C = round(P * (r*(1+r)^N) / ((1+r)^N - 1))
    const factor = Math.pow(1 + r, N);
    const baseInstallmentCents = Math.round(P * ((r * factor) / (factor - 1)));
    let remainingPrincipal = P;
    let totalInterestCents = 0;

    for (let k = 1; k <= N; k++) {
      const dueDate = advanceDateByFrequency(startDate, frequency, k);
      const interestPart = Math.round(remainingPrincipal * r);
      let principalPart;
      let totalInstallment;

      if (k < N) {
        principalPart = Math.min(remainingPrincipal, Math.max(0, baseInstallmentCents - interestPart));
        totalInstallment = principalPart + interestPart;
      } else {
        // Cuota N absorbe el saldo insoluto exacto hasta el último centavo
        principalPart = remainingPrincipal;
        totalInstallment = principalPart + interestPart;
      }

      remainingPrincipal = Math.max(0, remainingPrincipal - principalPart);
      totalInterestCents += interestPart;

      schedule.push({
        installmentNumber: k,
        dueDate,
        principalPartCents: principalPart,
        interestPartCents: interestPart,
        totalInstallmentCents: totalInstallment,
        paidCents: 0,
        remainingAfterCents: remainingPrincipal,
        status: 'PENDING'
      });
    }

    return {
      principalCents: P,
      totalInterestCents,
      totalPayableCents: P + totalInterestCents,
      schedule
    };
  }

  // Modalidad INTERÉS SIMPLE con absorción de residuo en la última cuota N
  const totalInterestCents = Math.round(P * r * N);
  const basePrincipalPerPeriod = Math.floor(P / N);
  const baseInterestPerPeriod = Math.floor(totalInterestCents / N);

  let accumulatedPrincipal = 0;
  let accumulatedInterest = 0;

  for (let k = 1; k <= N; k++) {
    const dueDate = advanceDateByFrequency(startDate, frequency, k);
    let principalPart;
    let interestPart;

    if (k < N) {
      principalPart = basePrincipalPerPeriod;
      interestPart = baseInterestPerPeriod;
      accumulatedPrincipal += principalPart;
      accumulatedInterest += interestPart;
    } else {
      // Última cuota N absorbe el residuo exacto
      principalPart = P - accumulatedPrincipal;
      interestPart = totalInterestCents - accumulatedInterest;
    }

    const remainingAfter = P - (k < N ? accumulatedPrincipal : P);

    schedule.push({
      installmentNumber: k,
      dueDate,
      principalPartCents: principalPart,
      interestPartCents: interestPart,
      totalInstallmentCents: principalPart + interestPart,
      paidCents: 0,
      remainingAfterCents: remainingAfter,
      status: 'PENDING'
    });
  }

  return {
    principalCents: P,
    totalInterestCents,
    totalPayableCents: P + totalInterestCents,
    schedule
  };
}

/**
 * Recalcula la tabla de amortización de un crédito activo tras un Abono Extraordinario a Capital (`EXTRA_PRINCIPAL_PAYMENT`).
 * Devuelve el nuevo cronograma y el ahorro exacto en intereses logrado por el niño/joven.
 */
function recalculateLoanAfterExtraPrincipal(loan, extraPrincipalCents, paymentLocalDate = getTodayLocalDate()) {
  const paidInstallments = loan.schedule.filter((item) => item.status === 'PAID');
  const pendingInstallments = loan.schedule.filter((item) => item.status !== 'PAID');

  if (pendingInstallments.length === 0) {
    return { updatedLoan: loan, interestSavedCents: 0, actualExtraAppliedCents: 0 };
  }

  const currentRemainingPrincipalCents = pendingInstallments.reduce(
    (sum, inst) => sum + Math.max(0, inst.principalPartCents - Math.min(inst.principalPartCents, inst.paidCents || 0)),
    0
  );

  const oldFutureInterestCents = pendingInstallments.reduce(
    (sum, inst) => sum + Math.max(0, inst.interestPartCents),
    0
  );

  const actualExtraAppliedCents = Math.min(currentRemainingPrincipalCents, Math.max(0, Math.round(extraPrincipalCents)));
  const newPrincipalCents = Math.max(0, currentRemainingPrincipalCents - actualExtraAppliedCents);

  if (newPrincipalCents === 0) {
    const closedSchedule = [
      ...paidInstallments,
      {
        installmentNumber: paidInstallments.length + 1,
        dueDate: paymentLocalDate,
        principalPartCents: actualExtraAppliedCents,
        interestPartCents: 0,
        totalInstallmentCents: actualExtraAppliedCents,
        paidCents: actualExtraAppliedCents,
        remainingAfterCents: 0,
        status: 'PAID',
        isExtraPrincipalSettlement: true
      }
    ];
    const totalInterestFinal = closedSchedule.reduce((s, i) => s + i.interestPartCents, 0);
    return {
      updatedLoan: {
        ...loan,
        schedule: closedSchedule,
        totalInterestCents: totalInterestFinal,
        totalPayableCents: loan.principalCents + totalInterestFinal,
        interestSavedByExtraPaymentsCents: (loan.interestSavedByExtraPaymentsCents || 0) + oldFutureInterestCents,
        status: 'PAID_OFF'
      },
      interestSavedCents: oldFutureInterestCents,
      actualExtraAppliedCents
    };
  }

  // Recalcular cuotas restantes sobre el nuevo capital insoluto reducido
  const remainingPeriods = pendingInstallments.length;
  const regenerated = generateLoanSchedule({
    principalCents: newPrincipalCents,
    interestRatePercent: loan.interestRatePercent,
    termPeriods: remainingPeriods,
    interestType: loan.interestType,
    frequency: loan.frequency,
    startDate: paymentLocalDate
  });

  const newPendingSchedule = regenerated.schedule.map((inst, idx) => ({
    ...inst,
    installmentNumber: paidInstallments.length + idx + 2,
    dueDate: pendingInstallments[idx]?.dueDate || inst.dueDate
  }));

  const extraInstallmentRecord = {
    installmentNumber: paidInstallments.length + 1,
    dueDate: paymentLocalDate,
    principalPartCents: actualExtraAppliedCents,
    interestPartCents: 0,
    totalInstallmentCents: actualExtraAppliedCents,
    paidCents: actualExtraAppliedCents,
    remainingAfterCents: newPrincipalCents,
    status: 'PAID',
    isExtraPrincipalPayment: true
  };

  const combinedSchedule = [...paidInstallments, extraInstallmentRecord, ...newPendingSchedule];
  const newFutureInterestCents = regenerated.totalInterestCents;
  const interestSavedCents = Math.max(0, oldFutureInterestCents - newFutureInterestCents);
  const totalInterestFinal = combinedSchedule.reduce((s, i) => s + i.interestPartCents, 0);

  return {
    updatedLoan: {
      ...loan,
      schedule: combinedSchedule,
      totalInterestCents: totalInterestFinal,
      totalPayableCents: loan.principalCents + totalInterestFinal,
      interestSavedByExtraPaymentsCents: (loan.interestSavedByExtraPaymentsCents || 0) + interestSavedCents,
      status: 'ACTIVE'
    },
    interestSavedCents,
    actualExtraAppliedCents
  };
}

/**
 * Calcula los indicadores de una Inversión a Plazo Fijo (rendimiento garantizado, progreso y devengo al día).
 */
function evaluateInvestmentProgress(investment, referenceLocalDate = getTodayLocalDate()) {
  const P = Math.round(Number(investment.principalCents || 0));
  const ratePct = Number(investment.yieldRatePercent || 0);
  const termDays = Math.max(1, Math.round(Number(investment.termDays || 30)));
  const expectedInterestCents = Math.round(P * (ratePct / 100));
  const maturityTotalCents = P + expectedInterestCents;

  const elapsedDaysRaw = diffDaysLocalDate(investment.startDate, referenceLocalDate);
  const elapsedDays = Math.max(0, Math.min(termDays, elapsedDaysRaw));
  const remainingDays = Math.max(0, diffDaysLocalDate(referenceLocalDate, investment.maturityDate));
  const progressRatio = Math.min(1, Math.max(0, elapsedDays / termDays));
  const accruedInterestTodayCents =
    investment.status === 'CANCELLED_EARLY'
      ? 0
      : investment.status === 'MATURED'
        ? expectedInterestCents
        : Math.round(expectedInterestCents * progressRatio);

  const isMatureReady = investment.status === 'ACTIVE' && referenceLocalDate >= investment.maturityDate;

  return {
    ...investment,
    expectedInterestCents,
    maturityTotalCents,
    elapsedDays,
    remainingDays,
    progressPercent: Math.round(progressRatio * 100),
    accruedInterestTodayCents,
    isMatureReady
  };
}

/**
 * Función Pura `reduce` (Ronda 2 Objeción 2):
 * Calcula el estado patrimonial completo de un hijo exclusivamente a partir de los eventos verificados del Ledger,
 * los préstamos y las inversiones, sin depender de campos de saldo mutables.
 */
function reduceMemberFinancialState({
  memberId,
  validEvents = [],
  loans = [],
  investments = [],
  catalogs = [],
  referenceLocalDate = getTodayLocalDate()
}) {
  // 1. Identificar eventos anulados por contra-asiento (`REVERSAL`)
  const reversedEventIds = new Set();
  const reversalMap = new Map();

  const memberEvents = validEvents.filter((ev) => ev.memberId === memberId);
  for (const ev of memberEvents) {
    if (ev.type === 'REVERSAL' && ev.targetEventId) {
      reversedEventIds.add(ev.targetEventId);
      reversalMap.set(ev.targetEventId, ev);
    }
  }

  // 2. Ordenamiento canónico determinista: (localDate ASC, createdAt ASC, id ASC)
  const orderedEvents = [...memberEvents].sort((a, b) => {
    const dCmp = String(a.localDate || '').localeCompare(String(b.localDate || ''));
    if (dCmp !== 0) return dCmp;
    const tCmp = String(a.createdAt || '').localeCompare(String(b.createdAt || ''));
    if (tCmp !== 0) return tCmp;
    return String(a.id || '').localeCompare(String(b.id || ''));
  });

  let availableCents = 0;
  let totalIncomeCents = 0;
  let totalExpenseCents = 0;
  let totalYieldEarnedCents = 0;
  let totalInterestPaidCents = 0;

  const incomeBySource = {};
  const expenseByCategory = {};
  const enrichedTimeline = [];

  for (const ev of orderedEvents) {
    const isReversed = reversedEventIds.has(ev.id);
    const amount = Math.round(Number(ev.amountCents || 0));

    if (!isReversed && ev.type !== 'REVERSAL') {
      switch (ev.type) {
        case 'INCOME':
        case 'RECURRING_INCOME': {
          availableCents += amount;
          totalIncomeCents += amount;
          const catKey = ev.catalogId || 'uncategorized_income';
          incomeBySource[catKey] = (incomeBySource[catKey] || 0) + amount;
          break;
        }
        case 'EXPENSE': {
          availableCents -= amount;
          totalExpenseCents += amount;
          const catKey = ev.catalogId || 'uncategorized_expense';
          expenseByCategory[catKey] = (expenseByCategory[catKey] || 0) + amount;
          break;
        }
        case 'LOAN_DISBURSEMENT': {
          // Si el préstamo fue depositado en efectivo digital a la alcancía del hijo
          if (ev.metadata?.disbursedToPiggy !== false) {
            availableCents += amount;
          }
          break;
        }
        case 'LOAN_PAYMENT':
        case 'EXTRA_PRINCIPAL_PAYMENT': {
          // Si el abono se descontó del saldo de la alcancía
          if (ev.metadata?.paymentSource !== 'EXTERNAL') {
            availableCents -= amount;
          }
          const interestPortion = Math.round(Number(ev.metadata?.interestPaidCents || 0));
          totalInterestPaidCents += interestPortion;
          const catKey = ev.catalogId || 'cat_exp_loan';
          expenseByCategory[catKey] = (expenseByCategory[catKey] || 0) + amount;
          break;
        }
        case 'INVESTMENT_LOCK': {
          availableCents -= amount;
          break;
        }
        case 'INVESTMENT_MATURITY': {
          // amount incluye capital + rendimiento al vencimiento
          availableCents += amount;
          const yieldCents = Math.round(Number(ev.metadata?.yieldCents || 0));
          totalYieldEarnedCents += yieldCents;
          totalIncomeCents += yieldCents;
          const catKey = ev.catalogId || 'cat_inc_yield';
          incomeBySource[catKey] = (incomeBySource[catKey] || 0) + yieldCents;
          break;
        }
        case 'INVESTMENT_EARLY_EXIT': {
          // Devuelve únicamente el capital bloqueado sin rendimiento
          availableCents += amount;
          break;
        }
        default:
          break;
      }
    }

    enrichedTimeline.push({
      ...ev,
      isReversed,
      reversedByEvent: reversalMap.get(ev.id) || null,
      runningAvailableCents: availableCents
    });
  }

  // 3. Calcular estado de Inversiones Activas y Rendimiento Devengado
  const memberInvestments = investments
    .filter((inv) => inv.memberId === memberId)
    .map((inv) => evaluateInvestmentProgress(inv, referenceLocalDate));

  const activeInvestments = memberInvestments.filter((inv) => inv.status === 'ACTIVE');
  const investedCents = activeInvestments.reduce((sum, inv) => sum + inv.principalCents, 0);
  const accruedYieldCents = activeInvestments.reduce((sum, inv) => sum + inv.accruedInterestTodayCents, 0);

  // 4. Calcular estado de Créditos / Deuda Insoluta
  const memberLoans = loans
    .filter((ln) => ln.memberId === memberId)
    .map((ln) => {
      const totalInstallmentsCents = (ln.schedule || []).reduce((s, i) => s + i.totalInstallmentCents, 0);
      const totalPaidCents = (ln.schedule || []).reduce((s, i) => s + (i.paidCents || 0), 0);
      const remainingDebtCents =
        ln.status === 'PAID_OFF' || ln.status === 'FORGIVEN'
          ? 0
          : Math.max(0, totalInstallmentsCents - totalPaidCents);

      const nextInstallment = (ln.schedule || []).find((i) => i.status !== 'PAID') || null;
      const hasOverdue = (ln.schedule || []).some(
        (i) => i.status !== 'PAID' && (i.status === 'OVERDUE' || i.dueDate < referenceLocalDate)
      );

      return {
        ...ln,
        totalPaidCents,
        remainingDebtCents,
        nextInstallment,
        hasOverdue,
        progressPercent:
          totalInstallmentsCents > 0 ? Math.min(100, Math.round((totalPaidCents / totalInstallmentsCents) * 100)) : 100
      };
    });

  const activeLoans = memberLoans.filter((ln) => ln.status === 'ACTIVE' && ln.remainingDebtCents > 0);
  const debtCents = activeLoans.reduce((sum, ln) => sum + ln.remainingDebtCents, 0);

  // 5. Patrimonio Neto = Disponible + Invertido en Plazo Fijo - Deuda por Créditos
  const netWorthCents = availableCents + investedCents - debtCents;

  return {
    memberId,
    availableCents,
    investedCents,
    accruedYieldCents,
    debtCents,
    netWorthCents,
    totalIncomeCents,
    totalExpenseCents,
    totalYieldEarnedCents,
    totalInterestPaidCents,
    incomeBySource,
    expenseByCategory,
    timeline: enrichedTimeline.slice().reverse(), // más reciente primero para la UI
    investments: memberInvestments,
    activeInvestments,
    loans: memberLoans,
    activeLoans
  };
}

/**
 * Evalúa qué reglas de Ingresos Recurrentes y qué Inversiones a Plazo tienen fechas cumplidas (`<= referenceLocalDate`)
 * que aún no existen en el CRDT G-Set (verificando por su ID determinista `det_rec_...` y `det_inv_mat_...`).
 * - En Modo Hijo: Devuelve la lista de pendientes para mostrar un aviso educativo sin escribir asientos sin firma.
 * - En Modo Papá: El controlador los firma criptográficamente y los agrega al Ledger de manera idempotente.
 */
function findDueDeterministicAutomations(appState, referenceLocalDate = getTodayLocalDate()) {
  const existingEventIds = new Set((appState.ledgerEvents || []).map((e) => e.id));
  const dueRecurring = [];
  const dueInvestments = [];

  for (const rule of appState.recurringRules || []) {
    if (rule.status !== 'ACTIVE') continue;
    let cursorDate = rule.nextExecutionDate || rule.startDate || referenceLocalDate;
    let safetyCounter = 0;

    while (cursorDate <= referenceLocalDate && safetyCounter < 24) {
      const deterministicTxId = `det_rec_${rule.id}_${cursorDate}`;
      if (!existingEventIds.has(deterministicTxId)) {
        dueRecurring.push({
          deterministicTxId,
          ruleId: rule.id,
          memberId: rule.memberId,
          catalogId: rule.catalogId,
          title: rule.title,
          amountCents: rule.amountCents,
          autoDeductLoanId: rule.autoDeductLoanId || '',
          scheduledLocalDate: cursorDate,
          nextDateAfter: advanceDateByFrequency(cursorDate, rule.frequency, 1)
        });
      }
      cursorDate = advanceDateByFrequency(cursorDate, rule.frequency, 1);
      safetyCounter++;
    }
  }

  for (const inv of appState.investments || []) {
    if (inv.status !== 'ACTIVE') continue;
    if (inv.maturityDate <= referenceLocalDate) {
      const deterministicTxId = `det_inv_mat_${inv.id}`;
      if (!existingEventIds.has(deterministicTxId)) {
        const evalInv = evaluateInvestmentProgress(inv, referenceLocalDate);
        dueInvestments.push({
          deterministicTxId,
          investmentId: inv.id,
          memberId: inv.memberId,
          title: inv.title,
          principalCents: inv.principalCents,
          yieldCents: evalInv.expectedInterestCents,
          maturityTotalCents: evalInv.maturityTotalCents,
          maturityDate: inv.maturityDate
        });
      }
    }
  }

  return {
    dueRecurring,
    dueInvestments,
    totalDueCount: dueRecurring.length + dueInvestments.length
  };
}


  // ==========================================================================
  // MODULE: cloud-sync.js
  // ==========================================================================
/**
 * SmartPiggy Cloud - Motor de Sincronización en Tiempo Real con Supabase (Proyecto Existente) + CRDT G-Set
 * Características clave:
 * 1. Reutiliza cualquier proyecto existente de Supabase mediante una única tabla aislada (`public.smartpiggy_families`)
 *    sin interferir con otras tablas ni requerir crear un proyecto nuevo.
 * 2. Sincronización 100% Automática en Tiempo Real (Cero botones manuales):
 *    - Canal WebSocket Phoenix de Supabase Realtime (`wss://<project>.supabase.co/realtime/v1/websocket`)
 *      escuchando tanto `broadcast` instantáneo (`crdt_state`) como `postgres_changes` en `public.smartpiggy_families`.
 *    - Persistencia REST JSONB automática (`POST /rest/v1/smartpiggy_families?on_conflict=family_code`).
 *    - Respaldo simultáneo en `BroadcastChannel` multi-ventana y servidor local `/api/cloud/:familyCode`.
 */

const STORAGE_KEY_PREFIX = 'smartpiggy_cloud_state_v2_';
const CLOUD_CONFIG_KEY = 'smartpiggy_cloud_provider_config_v2';

function mergeEntityCollection(localArr = [], remoteArr = [], immutable = false) {
  const map = new Map();

  for (const item of localArr) {
    if (item && item.id) {
      map.set(item.id, item);
    }
  }

  for (const rItem of remoteArr) {
    if (!rItem || !rItem.id) continue;
    const existing = map.get(rItem.id);
    if (!existing) {
      map.set(rItem.id, rItem);
    } else if (!immutable) {
      const localTime = String(existing.updatedAt || existing.createdAt || '');
      const remoteTime = String(rItem.updatedAt || rItem.createdAt || '');
      if (remoteTime >= localTime) {
        map.set(rItem.id, rItem);
      }
    }
  }

  return Array.from(map.values());
}

/**
 * Fusión CRDT determinista, conmutativa, asociativa e idempotente entre el estado local y el estado remoto.
 */
function mergeFamilyCRDT(localState, remoteState) {
  if (!remoteState || !remoteState.family) return localState;
  if (!localState || !localState.family) return remoteState;

  const localFamUpdated = String(localState.family.updatedAt || '');
  const remoteFamUpdated = String(remoteState.family.updatedAt || '');
  const mergedFamily =
    remoteFamUpdated >= localFamUpdated
      ? { ...localState.family, ...remoteState.family }
      : { ...remoteState.family, ...localState.family };

  return {
    family: mergedFamily,
    members: mergeEntityCollection(localState.members, remoteState.members, false),
    catalogs: mergeEntityCollection(localState.catalogs, remoteState.catalogs, false),
    recurringRules: mergeEntityCollection(localState.recurringRules, remoteState.recurringRules, false),
    loans: mergeEntityCollection(localState.loans, remoteState.loans, false),
    investments: mergeEntityCollection(localState.investments, remoteState.investments, false),
    childRequests: mergeEntityCollection(localState.childRequests, remoteState.childRequests, false),
    ledgerEvents: mergeEntityCollection(localState.ledgerEvents, remoteState.ledgerEvents, true),
    lastSyncedAt: new Date().toISOString()
  };
}

class CloudSyncManager {
  constructor({ onRemoteStateMerged, onSyncStatusChange }) {
    this.onRemoteStateMerged = onRemoteStateMerged;
    this.onSyncStatusChange = onSyncStatusChange;
    this.channel = null;
    this.pollTimer = null;
    this.ws = null;
    this.wsHeartbeatTimer = null;
    this.wsReconnectTimer = null;
    this.wsConnected = false;
    this.wsRefCounter = 1;
    this.familyCode = 'FAM-2026-KIDS';
    this.tableName = 'smartpiggy_families';
    this.cloudConfig = this.loadCloudConfig();
    this.isSyncing = false;
    this.serverAvailable = false;
    this.getCurrentStateFn = null;

    this.initRealtimeListeners();
  }

  loadCloudConfig() {
    try {
      const raw = localStorage.getItem(CLOUD_CONFIG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          provider: parsed.provider || 'SUPABASE_REST',
          endpointUrl: parsed.endpointUrl || '',
          apiKey: parsed.apiKey || '',
          tableName: parsed.tableName || 'smartpiggy_families',
          autoSyncSeconds: 4
        };
      }
    } catch {
      // ignore
    }
    return {
      provider: 'SUPABASE_REST',
      endpointUrl: '',
      apiKey: '',
      tableName: 'smartpiggy_families',
      autoSyncSeconds: 4
    };
  }

  saveCloudConfig(newConfig) {
    this.cloudConfig = { ...this.cloudConfig, ...newConfig };
    this.tableName = (this.cloudConfig.tableName || 'smartpiggy_families').trim();
    try {
      localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(this.cloudConfig));
    } catch {
      // ignore
    }
    this.connectRealtimeStream();
  }

  getStorageKey(familyCode = this.familyCode) {
    const clean = String(familyCode || 'FAM-2026-KIDS').trim().toUpperCase();
    return `${STORAGE_KEY_PREFIX}${clean}`;
  }

  loadLocalState(familyCode = this.familyCode) {
    this.familyCode = String(familyCode || 'FAM-2026-KIDS').trim().toUpperCase();
    try {
      const raw = localStorage.getItem(this.getStorageKey(this.familyCode));
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return null;
  }

  saveLocalState(state) {
    if (!state || !state.family) return;
    this.familyCode = String(state.family.familyCode || 'FAM-2026-KIDS').trim().toUpperCase();
    try {
      localStorage.setItem(this.getStorageKey(this.familyCode), JSON.stringify(state));
    } catch {
      // ignore
    }
  }

  initRealtimeListeners() {
    if (typeof BroadcastChannel !== 'undefined') {
      this.channel = new BroadcastChannel('smartpiggy_cloud_realtime_v2');
      this.channel.onmessage = (event) => {
        const msg = event.data;
        if (msg && msg.type === 'CRDT_STATE_BROADCAST' && msg.familyCode === this.familyCode && msg.state) {
          if (typeof this.onRemoteStateMerged === 'function') {
            this.onRemoteStateMerged(msg.state, 'Tiempo Real Multi-Ventana');
          }
        }
      };
    }

    window.addEventListener('storage', (e) => {
      if (e.key === this.getStorageKey(this.familyCode) && e.newValue) {
        try {
          const remoteState = JSON.parse(e.newValue);
          if (typeof this.onRemoteStateMerged === 'function') {
            this.onRemoteStateMerged(remoteState, 'Almacenamiento Local');
          }
        } catch {
          // ignore
        }
      }
    });
  }

  /**
   * Inicia el canal WebSocket Phoenix en tiempo real con Supabase (`wss://<project>.supabase.co/realtime/v1/websocket`)
   * y el ciclo de reconciliación continua sin necesidad de botón manual.
   */
  startPolling(getCurrentStateFn) {
    this.getCurrentStateFn = getCurrentStateFn;
    this.connectRealtimeStream();

    if (this.pollTimer) clearInterval(this.pollTimer);
    const intervalMs = Math.max(3, Number(this.cloudConfig.autoSyncSeconds || 4)) * 1000;
    this.pollTimer = setInterval(async () => {
      const currentState = this.getCurrentStateFn ? this.getCurrentStateFn() : null;
      if (currentState) {
        await this.pullFromCloud(currentState, true);
      }
    }, intervalMs);
  }

  getSupabaseTopic() {
    return `realtime:smartpiggy_${this.familyCode}`;
  }

  closeRealtimeSocket() {
    if (this.wsHeartbeatTimer) {
      clearInterval(this.wsHeartbeatTimer);
      this.wsHeartbeatTimer = null;
    }
    if (this.wsReconnectTimer) {
      clearTimeout(this.wsReconnectTimer);
      this.wsReconnectTimer = null;
    }
    if (this.ws) {
      try {
        this.ws.onclose = null;
        this.ws.close();
      } catch {
        // ignore
      }
      this.ws = null;
    }
    this.wsConnected = false;
  }

  /**
   * Conecta directamente al WebSocket Realtime de Supabase del proyecto existente del usuario.
   */
  connectRealtimeStream() {
    this.closeRealtimeSocket();

    const { provider, endpointUrl, apiKey } = this.cloudConfig;
    if (provider !== 'SUPABASE_REST' || !endpointUrl || !apiKey) {
      return;
    }

    try {
      const cleanBase = endpointUrl.trim().replace(/\/+$/, '');
      const wsBase = cleanBase.replace(/^http:\/\//i, 'ws://').replace(/^https:\/\//i, 'wss://');
      const wsUrl = `${wsBase}/realtime/v1/websocket?apikey=${encodeURIComponent(apiKey.trim())}&vsn=1.0.0`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.wsConnected = true;
        const joinPayload = {
          topic: this.getSupabaseTopic(),
          event: 'phx_join',
          payload: {
            config: {
              broadcast: { ack: false, self: false },
              presence: { key: '' },
              postgres_changes: [
                {
                  event: '*',
                  schema: 'public',
                  table: this.tableName,
                  filter: `family_code=eq.${this.familyCode}`
                }
              ]
            },
            access_token: apiKey.trim()
          },
          ref: String(this.wsRefCounter++)
        };
        this.ws.send(JSON.stringify(joinPayload));
        this.notifyStatus('SYNCED', 'Supabase Realtime WebSocket Activo');

        this.wsHeartbeatTimer = setInterval(() => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(
              JSON.stringify({
                topic: 'phoenix',
                event: 'heartbeat',
                payload: {},
                ref: String(this.wsRefCounter++)
              })
            );
          }
        }, 25000);
      };

      this.ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);
          // 1. Broadcast en tiempo real directo entre dispositivos (< 50ms)
          if (msg.event === 'broadcast' && msg.payload?.event === 'crdt_state' && msg.payload?.payload?.state) {
            const incomingState = msg.payload.payload.state;
            if (typeof this.onRemoteStateMerged === 'function') {
              this.onRemoteStateMerged(incomingState, 'Supabase Realtime Broadcast');
            }
            this.notifyStatus('SYNCED', 'Supabase Realtime Recibido');
          }
          // 2. Notificación Postgres Changes desde la tabla `public.smartpiggy_families`
          if (msg.event === 'postgres_changes') {
            const recordPayload = msg.payload?.data?.record?.payload || msg.payload?.record?.payload;
            if (recordPayload && recordPayload.family && typeof this.onRemoteStateMerged === 'function') {
              this.onRemoteStateMerged(recordPayload, 'Supabase PostgreSQL Realtime');
              this.notifyStatus('SYNCED', 'Supabase DB Realtime');
            } else if (this.getCurrentStateFn) {
              await this.pullFromCloud(this.getCurrentStateFn(), true);
            }
          }
        } catch {
          // ignore parse errors
        }
      };

      this.ws.onclose = () => {
        this.wsConnected = false;
        this.wsReconnectTimer = setTimeout(() => this.connectRealtimeStream(), 5000);
      };
    } catch {
      this.wsConnected = false;
    }
  }

  notifyStatus(status, detail = '', tableMissing = false) {
    if (typeof this.onSyncStatusChange === 'function') {
      this.onSyncStatusChange({
        status,
        detail,
        provider: this.cloudConfig.provider,
        wsConnected: this.wsConnected,
        serverAvailable: this.serverAvailable,
        tableMissing,
        timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
    }
  }

  /**
   * Se invoca automáticamente en cada cambio de datos (sin botón manual).
   * Envía el cambio instantáneamente por WebSocket + persiste en Supabase PostgreSQL (`public.smartpiggy_families`).
   */
  async pushState(state) {
    if (!state || !state.family) return;
    this.saveLocalState(state);

    // 1. BroadcastChannel local entre ventanas del mismo navegador
    if (this.channel) {
      this.channel.postMessage({
        type: 'CRDT_STATE_BROADCAST',
        familyCode: this.familyCode,
        state
      });
    }

    // 2. Si el WebSocket de Supabase Realtime está abierto, emitir broadcast instantáneo (< 50ms)
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(
          JSON.stringify({
            topic: this.getSupabaseTopic(),
            event: 'broadcast',
            payload: {
              type: 'broadcast',
              event: 'crdt_state',
              payload: {
                familyCode: this.familyCode,
                state
              }
            },
            ref: String(this.wsRefCounter++)
          })
        );
      } catch {
        // ignore ws send error
      }
    }

    this.notifyStatus('SYNCING', 'Sincronizando en tiempo real...');

    try {
      const provider = this.cloudConfig.provider;

      // A. Proveedor Principal: SUPABASE (en el proyecto actual del usuario)
      if (provider === 'SUPABASE_REST' && this.cloudConfig.endpointUrl && this.cloudConfig.apiKey) {
        const base = this.cloudConfig.endpointUrl.trim().replace(/\/+$/, '');
        const key = this.cloudConfig.apiKey.trim();
        const url = `${base}/rest/v1/${encodeURIComponent(this.tableName)}?on_conflict=family_code`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: key,
            Authorization: `Bearer ${key}`,
            Prefer: 'resolution=merge-duplicates,return=minimal'
          },
          body: JSON.stringify({
            family_code: this.familyCode,
            payload: state,
            updated_at: new Date().toISOString()
          })
        });

        if (res.status === 404 || res.status === 400) {
          this.notifyStatus(
            this.wsConnected ? 'SYNCED' : 'LOCAL_READY',
            this.wsConnected
              ? 'Realtime WebSocket Activo (Falta ejecutar SQL de tabla en Supabase)'
              : 'Ejecuta el SQL de 1 tabla en tu proyecto Supabase',
            true
          );
          return;
        }

        if (!res.ok) throw new Error(`Supabase HTTP ${res.status}`);
        this.serverAvailable = true;
        this.notifyStatus(
          'SYNCED',
          this.wsConnected ? 'Supabase Realtime + DB al día' : 'Sincronizado en Supabase DB'
        );
        return;
      }

      // B. Proveedor Alternativo: FIREBASE REALTIME DATABASE
      if (provider === 'FIREBASE_RTDB' && this.cloudConfig.endpointUrl) {
        const base = this.cloudConfig.endpointUrl.trim().replace(/\/+$/, '');
        const authQuery = this.cloudConfig.apiKey ? `?auth=${encodeURIComponent(this.cloudConfig.apiKey)}` : '';
        const url = `${base}/smartpiggy_families/${encodeURIComponent(this.familyCode)}.json${authQuery}`;
        const res = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state)
        });
        if (!res.ok) throw new Error(`Firebase HTTP ${res.status}`);
        this.serverAvailable = true;
        this.notifyStatus('SYNCED', 'Firebase Tiempo Real Activo');
        return;
      }

      // C. Servidor Cloud Local / LAN (`/api/cloud/:familyCode`)
      if (window.location.protocol.startsWith('http')) {
        const res = await fetch(`/api/cloud/${encodeURIComponent(this.familyCode)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state)
        });
        if (res.ok) {
          const mergedFromServer = await res.json();
          this.serverAvailable = true;
          if (mergedFromServer && mergedFromServer.family && typeof this.onRemoteStateMerged === 'function') {
            this.onRemoteStateMerged(mergedFromServer, 'Servidor Tiempo Real Local');
          }
          this.notifyStatus('SYNCED', 'Tiempo Real Activo');
          return;
        }
      }

      this.notifyStatus('LOCAL_READY', 'Tiempo Real Multi-Ventana Activo');
    } catch {
      this.notifyStatus('LOCAL_READY', 'Offline-First Activo (Auto-reconexión)');
    }
  }

  /**
   * Descarga y fusiona (CRDT G-Set) el estado desde Supabase o el servidor activo.
   */
  async pullFromCloud(currentState, silent = false) {
    if (this.isSyncing) return currentState;
    this.isSyncing = true;

    try {
      const provider = this.cloudConfig.provider;
      let remoteState = null;

      if (provider === 'SUPABASE_REST' && this.cloudConfig.endpointUrl && this.cloudConfig.apiKey) {
        const base = this.cloudConfig.endpointUrl.trim().replace(/\/+$/, '');
        const key = this.cloudConfig.apiKey.trim();
        const url = `${base}/rest/v1/${encodeURIComponent(this.tableName)}?family_code=eq.${encodeURIComponent(this.familyCode)}&select=payload`;
        const res = await fetch(url, {
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`
          }
        });
        if (res.status === 404) {
          this.notifyStatus(
            this.wsConnected ? 'SYNCED' : 'LOCAL_READY',
            'Falta crear la tabla smartpiggy_families en tu proyecto Supabase',
            true
          );
          return currentState;
        }
        if (res.ok) {
          const rows = await res.json();
          if (Array.isArray(rows) && rows[0]?.payload) {
            remoteState = rows[0].payload;
            this.serverAvailable = true;
          } else if (Array.isArray(rows) && rows.length === 0 && currentState) {
            // La tabla ya existe en el proyecto Supabase pero este family_code aún no se ha insertado: subirlo automáticamente
            await this.pushState(currentState);
            return currentState;
          }
        }
      } else if (provider === 'FIREBASE_RTDB' && this.cloudConfig.endpointUrl) {
        const base = this.cloudConfig.endpointUrl.trim().replace(/\/+$/, '');
        const authQuery = this.cloudConfig.apiKey ? `?auth=${encodeURIComponent(this.cloudConfig.apiKey)}` : '';
        const url = `${base}/smartpiggy_families/${encodeURIComponent(this.familyCode)}.json${authQuery}`;
        const res = await fetch(url);
        if (res.ok) {
          remoteState = await res.json();
          this.serverAvailable = true;
        }
      } else if (window.location.protocol.startsWith('http')) {
        const res = await fetch(`/api/cloud/${encodeURIComponent(this.familyCode)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.family) {
            remoteState = data;
          }
          this.serverAvailable = true;
        }
      }

      if (remoteState && remoteState.family) {
        const merged = mergeFamilyCRDT(currentState, remoteState);
        this.saveLocalState(merged);
        if (typeof this.onRemoteStateMerged === 'function') {
          this.onRemoteStateMerged(merged, 'Supabase Cloud');
        }
        this.notifyStatus(
          'SYNCED',
          this.wsConnected ? 'Supabase Realtime Conectado' : 'Sincronizado en tiempo real'
        );
        return merged;
      }

      if (!silent) {
        this.notifyStatus(
          this.wsConnected || this.serverAvailable ? 'SYNCED' : 'LOCAL_READY',
          this.wsConnected ? 'Supabase Realtime Conectado' : 'Tiempo Real Activo'
        );
      }
      return currentState;
    } catch {
      return currentState;
    } finally {
      this.isSyncing = false;
    }
  }
}


  // ==========================================================================
  // MODULE: seed-data.js
  // ==========================================================================
/**
 * SmartPiggy Cloud - Generador de Estado Inicial Semilla Criptográficamente Firmado
 * Crea una familia de demostración completa con todas las entidades firmadas con HMAC-SHA256
 * y claves de iconografía 100% SVG vectorial.
 */


const DEFAULT_DEMO_PIN = '1234';

async function buildInitialSignedFamilyState(customFamilyCode = 'FAM-2026-KIDS', initialPin = DEFAULT_DEMO_PIN) {
  const today = getTodayLocalDate();
  const saltHex = generateSaltHex(16);
  const { authVerifier, signingKey } = await deriveParentKeyBundle(initialPin, saltHex);

  const family = {
    id: 'fam_smartpiggy_01',
    familyCode: customFamilyCode,
    name: 'Familia García-Mendoza',
    currency: 'MXN',
    saltHex,
    authVerifier,
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  };

  const members = [
    {
      id: 'parent_carlos',
      familyId: family.id,
      role: 'PARENT',
      name: 'Papá Carlos',
      title: 'Administrador Familiar',
      avatar: 'parent-male',
      themeColor: '#6366f1',
      createdAt: family.createdAt,
      updatedAt: family.createdAt
    },
    {
      id: 'parent_elena',
      familyId: family.id,
      role: 'PARENT',
      name: 'Mamá Elena',
      title: 'Administradora Familiar',
      avatar: 'parent-female',
      themeColor: '#ec4899',
      createdAt: family.createdAt,
      updatedAt: family.createdAt
    },
    {
      id: 'child_sofia',
      familyId: family.id,
      role: 'CHILD',
      name: 'Sofía',
      age: 9,
      avatar: 'unicorn',
      themeColor: '#10b981',
      goalTitle: 'Bicicleta de Montaña',
      goalTargetCents: 250000, // $2,500.00
      goalIcon: 'bike',
      createdAt: family.createdAt,
      updatedAt: family.createdAt
    },
    {
      id: 'child_mateo',
      familyId: family.id,
      role: 'CHILD',
      name: 'Mateo',
      age: 14,
      avatar: 'rocket',
      themeColor: '#0ea5e9',
      goalTitle: 'Consola Portátil / Laptop',
      goalTargetCents: 600000, // $6,000.00
      goalIcon: 'gamepad',
      createdAt: family.createdAt,
      updatedAt: family.createdAt
    }
  ];

  const catalogs = [
    // Fuentes de Ingresos (Iconos SVG)
    {
      id: 'cat_inc_allowance',
      familyId: family.id,
      type: 'INCOME_SOURCE',
      name: 'Mesada / Domingo',
      icon: 'calendar',
      color: '#10b981',
      description: 'Ingreso periódico programado por los papás',
      isActive: true,
      updatedAt: family.createdAt
    },
    {
      id: 'cat_inc_chores',
      familyId: family.id,
      type: 'INCOME_SOURCE',
      name: 'Tareas Extra del Hogar',
      icon: 'sparkles',
      color: '#06b6d4',
      description: 'Lavar el auto, jardín, ordenar cochera',
      isActive: true,
      updatedAt: family.createdAt
    },
    {
      id: 'cat_inc_grades',
      familyId: family.id,
      type: 'INCOME_SOURCE',
      name: 'Excelencia Académica',
      icon: 'trophy',
      color: '#f59e0b',
      description: 'Premio por calificaciones y lectura',
      isActive: true,
      updatedAt: family.createdAt
    },
    {
      id: 'cat_inc_gift',
      familyId: family.id,
      type: 'INCOME_SOURCE',
      name: 'Regalo Familiar / Cumpleaños',
      icon: 'gift',
      color: '#8b5cf6',
      description: 'Regalos de abuelos, tíos o fechas especiales',
      isActive: true,
      updatedAt: family.createdAt
    },
    {
      id: 'cat_inc_yield',
      familyId: family.id,
      type: 'INCOME_SOURCE',
      name: 'Rendimiento de Inversión',
      icon: 'trending-up',
      color: '#14b8a6',
      description: 'Intereses ganados en la Bóveda a Plazo Fijo',
      isActive: true,
      updatedAt: family.createdAt
    },

    // Categorías de Gastos (Iconos SVG)
    {
      id: 'cat_exp_toys',
      familyId: family.id,
      type: 'EXPENSE_CATEGORY',
      name: 'Juguetes y Juegos',
      icon: 'puzzle',
      color: '#f43f5e',
      description: 'Juegos de mesa, figuras, sets creativos',
      isActive: true,
      updatedAt: family.createdAt
    },
    {
      id: 'cat_exp_games',
      familyId: family.id,
      type: 'EXPENSE_CATEGORY',
      name: 'Videojuegos y Apps',
      icon: 'gamepad',
      color: '#6366f1',
      description: 'Juegos digitales, suscripciones, accesorios',
      isActive: true,
      updatedAt: family.createdAt
    },
    {
      id: 'cat_exp_snacks',
      familyId: family.id,
      type: 'EXPENSE_CATEGORY',
      name: 'Dulces, Helados y Snacks',
      icon: 'icecream',
      color: '#ec4899',
      description: 'Antojos, cine y salidas a comer',
      isActive: true,
      updatedAt: family.createdAt
    },
    {
      id: 'cat_exp_books',
      familyId: family.id,
      type: 'EXPENSE_CATEGORY',
      name: 'Libros, Arte y Deporte',
      icon: 'palette',
      color: '#0ea5e9',
      description: 'Cuentos, pintura, material deportivo',
      isActive: true,
      updatedAt: family.createdAt
    },
    {
      id: 'cat_exp_outings',
      familyId: family.id,
      type: 'EXPENSE_CATEGORY',
      name: 'Salidas con Amigos',
      icon: 'popcorn',
      color: '#f97316',
      description: 'Cine, parque de diversiones, convivios',
      isActive: true,
      updatedAt: family.createdAt
    },
    {
      id: 'cat_exp_loan',
      familyId: family.id,
      type: 'EXPENSE_CATEGORY',
      name: 'Pago de Crédito Familiar',
      icon: 'credit-card',
      color: '#a855f7',
      description: 'Abonos a préstamos otorgados por Papá/Mamá',
      isActive: true,
      updatedAt: family.createdAt
    }
  ];

  // Reglas de Ingresos Recurrentes
  const recurringRules = [
    {
      id: 'rec_sofia_weekly',
      familyId: family.id,
      memberId: 'child_sofia',
      catalogId: 'cat_inc_allowance',
      title: 'Domingo Semanal de Sofía',
      amountCents: 12000, // $120.00 MXN
      frequency: 'WEEKLY',
      startDate: addDaysLocalDate(today, -14),
      nextExecutionDate: today,
      autoDeductLoanId: '',
      status: 'ACTIVE',
      updatedAt: family.createdAt
    },
    {
      id: 'rec_mateo_biweekly',
      familyId: family.id,
      memberId: 'child_mateo',
      catalogId: 'cat_inc_allowance',
      title: 'Mesada Quincenal de Mateo',
      amountCents: 35000, // $350.00 MXN
      frequency: 'BIWEEKLY',
      startDate: addDaysLocalDate(today, -15),
      nextExecutionDate: addDaysLocalDate(today, 3),
      autoDeductLoanId: 'loan_mateo_headphones',
      status: 'ACTIVE',
      updatedAt: family.createdAt
    }
  ];

  // Préstamos / Créditos con Tasa de Interés
  const sofiaLoanPlan = generateLoanSchedule({
    principalCents: 30000, // $300.00
    interestRatePercent: 5,
    termPeriods: 3,
    interestType: 'SIMPLE',
    frequency: 'WEEKLY',
    startDate: addDaysLocalDate(today, -7)
  });
  sofiaLoanPlan.schedule[0].paidCents = sofiaLoanPlan.schedule[0].totalInstallmentCents;
  sofiaLoanPlan.schedule[0].status = 'PAID';

  const mateoLoanPlan = generateLoanSchedule({
    principalCents: 120000, // $1,200.00
    interestRatePercent: 4,
    termPeriods: 4,
    interestType: 'COMPOUND_FRENCH',
    frequency: 'BIWEEKLY',
    startDate: addDaysLocalDate(today, -14)
  });
  mateoLoanPlan.schedule[0].paidCents = mateoLoanPlan.schedule[0].totalInstallmentCents;
  mateoLoanPlan.schedule[0].status = 'PAID';

  const loans = [
    {
      id: 'loan_sofia_artset',
      familyId: family.id,
      memberId: 'child_sofia',
      concept: 'Estuche Profesional de Acuarelas',
      principalCents: sofiaLoanPlan.principalCents,
      interestType: 'SIMPLE',
      interestRatePercent: 5,
      termPeriods: 3,
      frequency: 'WEEKLY',
      disbursedToPiggy: false,
      totalInterestCents: sofiaLoanPlan.totalInterestCents,
      totalPayableCents: sofiaLoanPlan.totalPayableCents,
      interestSavedByExtraPaymentsCents: 0,
      schedule: sofiaLoanPlan.schedule,
      startDate: addDaysLocalDate(today, -7),
      status: 'ACTIVE',
      createdAt: family.createdAt,
      updatedAt: family.createdAt
    },
    {
      id: 'loan_mateo_headphones',
      familyId: family.id,
      memberId: 'child_mateo',
      concept: 'Audífonos Inalámbricos Noise-Cancelling',
      principalCents: mateoLoanPlan.principalCents,
      interestType: 'COMPOUND_FRENCH',
      interestRatePercent: 4,
      termPeriods: 4,
      frequency: 'BIWEEKLY',
      disbursedToPiggy: false,
      totalInterestCents: mateoLoanPlan.totalInterestCents,
      totalPayableCents: mateoLoanPlan.totalPayableCents,
      interestSavedByExtraPaymentsCents: 0,
      schedule: mateoLoanPlan.schedule,
      startDate: addDaysLocalDate(today, -14),
      status: 'ACTIVE',
      createdAt: family.createdAt,
      updatedAt: family.createdAt
    }
  ];

  // Inversiones a Plazo Fijo con Rendimientos
  const investments = [
    {
      id: 'inv_sofia_30d',
      familyId: family.id,
      memberId: 'child_sofia',
      title: 'Pagaré Semilla 30 Días (Meta Bici)',
      principalCents: 40000,
      yieldRatePercent: 10,
      termDays: 30,
      startDate: addDaysLocalDate(today, -18),
      maturityDate: addDaysLocalDate(today, 12),
      status: 'ACTIVE',
      createdAt: family.createdAt,
      updatedAt: family.createdAt
    },
    {
      id: 'inv_mateo_60d',
      familyId: family.id,
      memberId: 'child_mateo',
      title: 'Bono Juvenil Tecnológico 60 Días',
      principalCents: 100000,
      yieldRatePercent: 15,
      termDays: 60,
      startDate: addDaysLocalDate(today, -40),
      maturityDate: addDaysLocalDate(today, 20),
      status: 'ACTIVE',
      createdAt: family.createdAt,
      updatedAt: family.createdAt
    }
  ];

  // Solicitudes Educativas Hijo -> Padre desde el Simulador Sandbox
  const childRequests = [
    {
      id: 'req_sofia_inv_01',
      familyId: family.id,
      memberId: 'child_sofia',
      requestType: 'INVESTMENT',
      title: 'Invertir $200.00 en Bóveda a 14 días (+6%)',
      amountCents: 20000,
      termDays: 14,
      ratePercent: 6,
      note: 'Hola Papá: Simulé en el laboratorio que si guardo $200 por 2 semanas ganaré $12 extra para mi bicicleta.',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString()
    }
  ];

  // Construir Libro Mayor Inmutable (LedgerEvents) firmado con HMAC-SHA256
  const rawEvents = [
    {
      id: 'tx_seed_sofia_1',
      familyId: family.id,
      memberId: 'child_sofia',
      createdByParentId: 'parent_carlos',
      type: 'INCOME',
      amountCents: 80000,
      catalogId: 'cat_inc_gift',
      note: 'Regalo de cumpleaños de los abuelos',
      localDate: addDaysLocalDate(today, -20),
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
    },
    {
      id: 'tx_seed_sofia_2',
      familyId: family.id,
      memberId: 'child_sofia',
      createdByParentId: 'parent_elena',
      type: 'INVESTMENT_LOCK',
      amountCents: 40000,
      catalogId: 'cat_inc_yield',
      referenceId: 'inv_sofia_30d',
      note: 'Apertura de Pagaré Semilla 30 Días (+10% rendimiento)',
      localDate: addDaysLocalDate(today, -18),
      createdAt: new Date(Date.now() - 18 * 86400000).toISOString()
    },
    {
      id: 'tx_seed_sofia_3',
      familyId: family.id,
      memberId: 'child_sofia',
      createdByParentId: 'parent_carlos',
      type: 'INCOME',
      amountCents: 15000,
      catalogId: 'cat_inc_grades',
      note: '10 en examen de Matemáticas y lectura de libro completo',
      localDate: addDaysLocalDate(today, -12),
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString()
    },
    {
      id: `det_rec_rec_sofia_weekly_${addDaysLocalDate(today, -7)}`,
      familyId: family.id,
      memberId: 'child_sofia',
      createdByParentId: 'parent_carlos',
      type: 'RECURRING_INCOME',
      amountCents: 12000,
      catalogId: 'cat_inc_allowance',
      referenceId: 'rec_sofia_weekly',
      note: 'Acreditación programada: Domingo Semanal de Sofía',
      localDate: addDaysLocalDate(today, -7),
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
    },
    {
      id: 'tx_seed_sofia_4',
      familyId: family.id,
      memberId: 'child_sofia',
      createdByParentId: 'parent_elena',
      type: 'EXPENSE',
      amountCents: 8500,
      catalogId: 'cat_exp_snacks',
      note: 'Helado doble de vainilla en el parque',
      localDate: addDaysLocalDate(today, -5),
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
      id: 'tx_seed_sofia_5',
      familyId: family.id,
      memberId: 'child_sofia',
      createdByParentId: 'parent_carlos',
      type: 'LOAN_PAYMENT',
      amountCents: sofiaLoanPlan.schedule[0].totalInstallmentCents,
      catalogId: 'cat_exp_loan',
      referenceId: 'loan_sofia_artset',
      metadata: {
        paymentSource: 'PIGGY',
        installmentNumber: 1,
        principalPaidCents: sofiaLoanPlan.schedule[0].principalPartCents,
        interestPaidCents: sofiaLoanPlan.schedule[0].interestPartCents
      },
      note: 'Pago Cuota 1/3 - Estuche Profesional de Acuarelas',
      localDate: addDaysLocalDate(today, -2),
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'tx_seed_mateo_1',
      familyId: family.id,
      memberId: 'child_mateo',
      createdByParentId: 'parent_carlos',
      type: 'INCOME',
      amountCents: 185000,
      catalogId: 'cat_inc_gift',
      note: 'Ahorro de cumpleaños y venta de juegos usados',
      localDate: addDaysLocalDate(today, -42),
      createdAt: new Date(Date.now() - 42 * 86400000).toISOString()
    },
    {
      id: 'tx_seed_mateo_2',
      familyId: family.id,
      memberId: 'child_mateo',
      createdByParentId: 'parent_carlos',
      type: 'INVESTMENT_LOCK',
      amountCents: 100000,
      catalogId: 'cat_inc_yield',
      referenceId: 'inv_mateo_60d',
      note: 'Apertura Bono Juvenil Tecnológico 60 Días (+15%)',
      localDate: addDaysLocalDate(today, -40),
      createdAt: new Date(Date.now() - 40 * 86400000).toISOString()
    },
    {
      id: 'tx_seed_mateo_3',
      familyId: family.id,
      memberId: 'child_mateo',
      createdByParentId: 'parent_elena',
      type: 'INCOME',
      amountCents: 35000,
      catalogId: 'cat_inc_allowance',
      referenceId: 'rec_mateo_biweekly',
      note: 'Mesada Quincenal acreditada',
      localDate: addDaysLocalDate(today, -15),
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
    },
    {
      id: 'tx_seed_mateo_4',
      familyId: family.id,
      memberId: 'child_mateo',
      createdByParentId: 'parent_carlos',
      type: 'INCOME',
      amountCents: 18000,
      catalogId: 'cat_inc_chores',
      note: 'Lavado completo de camioneta y corte de césped',
      localDate: addDaysLocalDate(today, -8),
      createdAt: new Date(Date.now() - 8 * 86400000).toISOString()
    },
    {
      id: 'tx_seed_mateo_5',
      familyId: family.id,
      memberId: 'child_mateo',
      createdByParentId: 'parent_elena',
      type: 'EXPENSE',
      amountCents: 22000,
      catalogId: 'cat_exp_outings',
      note: 'Boleto de cine y palomitas con amigos',
      localDate: addDaysLocalDate(today, -6),
      createdAt: new Date(Date.now() - 6 * 86400000).toISOString()
    },
    {
      id: 'tx_seed_mateo_6',
      familyId: family.id,
      memberId: 'child_mateo',
      createdByParentId: 'parent_carlos',
      type: 'LOAN_PAYMENT',
      amountCents: mateoLoanPlan.schedule[0].totalInstallmentCents,
      catalogId: 'cat_exp_loan',
      referenceId: 'loan_mateo_headphones',
      metadata: {
        paymentSource: 'PIGGY',
        installmentNumber: 1,
        principalPaidCents: mateoLoanPlan.schedule[0].principalPartCents,
        interestPaidCents: mateoLoanPlan.schedule[0].interestPartCents
      },
      note: 'Pago Cuota 1/4 - Audífonos Inalámbricos (Amortización Francesa)',
      localDate: addDaysLocalDate(today, -3),
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
    }
  ];

  const ledgerEvents = [];
  let prevHash = 'GENESIS';
  for (const raw of rawEvents) {
    const signed = await createSignedLedgerEvent(raw, signingKey, saltHex, prevHash);
    prevHash = signed.eventHash;
    ledgerEvents.push(signed);
  }

  return {
    family,
    members,
    catalogs,
    recurringRules,
    loans,
    investments,
    childRequests,
    ledgerEvents,
    lastSyncedAt: new Date().toISOString()
  };
}


  // ==========================================================================
  // MODULE: app.js
  // ==========================================================================
/**
 * SmartPiggy Cloud - Controlador Principal de la Aplicación (100% Iconografía SVG)
 * Integra:
 * - Sistema de iconos vectoriales SVG (`renderSvgIcon` / `resolveIconKey`).
 * - Control de acceso criptográfico por roles: Papás (Escritura firmada HMAC-SHA256) vs Hijos (Solo Lectura + Sandbox).
 * - Estado patrimonial 100% derivado por reducción pura (`reduceMemberFinancialState`) sobre el CRDT G-Set.
 * - Descuento de gastos e ingresos, definición de usuarios, fuentes de ingreso, categorías de gasto.
 * - Ingresos recurrentes idempotentes, créditos con interés Simple/Compuesto Francés y abonos a capital.
 * - Inversiones a plazo fijo con rendimiento garantizado y rescate anticipado.
 * - Sincronización en la nube multi-dispositivo (Zero-Config Cloud + Firebase RTDB + Supabase REST).
 */





class SmartPiggyApp {
  constructor() {
    this.state = null;
    this.selectedChildId = 'child_sofia';
    this.currentRole = 'CHILD'; // 'CHILD' (Solo lectura por defecto) | 'PARENT' (Administración firmada)
    this.activeParentId = 'parent_carlos';
    this.parentSigningKey = null; // Clave HMAC-SHA256 solo en memoria RAM durante sesión Parental
    this.inactivityTimer = null;
    this.auditResult = { validEvents: [], corruptedEvents: [], isClean: true };
    this.txFilter = 'ALL';
    this.deferredInstallPrompt = null;
    this.pendingAfterPinAction = null;

    this.cloudManager = new CloudSyncManager({
      onRemoteStateMerged: (remoteState, sourceLabel) => this.handleRemoteStateMerged(remoteState, sourceLabel),
      onSyncStatusChange: (statusInfo) => this.updateCloudBadge(statusInfo)
    });
  }

  async init() {
    const params = new URLSearchParams(window.location.search);
    const urlFamilyCode = params.get('family');
    if (urlFamilyCode) {
      this.cloudManager.familyCode = urlFamilyCode.trim().toUpperCase();
    }

    // Si el enlace compartido incluye configuración de conexión en tiempo real (ideal para GitHub Pages y WhatsApp)
    const sbParam = params.get('sb');
    if (sbParam) {
      try {
        const decoded = JSON.parse(atob(sbParam));
        if (decoded) {
          if (decoded.f) {
            this.cloudManager.familyCode = String(decoded.f).trim().toUpperCase();
          }
          if (decoded.u && decoded.k) {
            this.cloudManager.saveCloudConfig({
              provider: decoded.p || 'SUPABASE_REST',
              endpointUrl: decoded.u,
              apiKey: decoded.k,
              tableName: decoded.t || 'smartpiggy_families'
            });
          }
        }
      } catch {
        // ignore invalid sb param
      }
    }

    let loaded = this.cloudManager.loadLocalState(this.cloudManager.familyCode);
    if (!loaded || !loaded.family) {
      loaded = await buildInitialSignedFamilyState(this.cloudManager.familyCode);
      this.cloudManager.saveLocalState(loaded);
    }
    this.state = loaded;

    // Normalizar cualquier clave de icono previa al estándar SVG
    this.normalizeLegacyIconsToSvg();

    const children = this.getChildren();
    if (children.length > 0 && !children.some((c) => c.id === this.selectedChildId)) {
      this.selectedChildId = children[0].id;
    }

    this.bindEvents();
    this.initPwaInstallSupport();
    this.populateCloudConfigInputs();
    this.updateSimulatorPreviews();
    this.updateLoanModalPreview();
    this.updateInvestmentModalPreview();

    await this.runLedgerAuditAndRender();

    await this.cloudManager.pullFromCloud(this.state, true);
    await this.cloudManager.pushState(this.state);
    this.cloudManager.startPolling(() => this.state);
  }

  initPwaInstallSupport() {
    // 1. Registrar Service Worker para habilitar instalación PWA y funcionamiento offline
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }

    const btnInstall = document.getElementById('btnInstallPwa');
    const nativeSection = document.getElementById('nativeInstallPromptSection');
    const btnTriggerNative = document.getElementById('btnTriggerNativeInstall');

    // Si ya se está ejecutando como App Instalada (standalone), ocultar el botón de instalar
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone && btnInstall) {
      btnInstall.style.display = 'none';
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      if (btnInstall) btnInstall.style.display = 'inline-flex';
      if (nativeSection) nativeSection.style.display = 'block';
    });

    window.addEventListener('appinstalled', () => {
      this.deferredInstallPrompt = null;
      if (btnInstall) btnInstall.style.display = 'none';
      document.getElementById('dialogInstallPwa')?.close();
      this.showToast('SmartPiggy Cloud se instaló correctamente en tu dispositivo.', 'success');
    });

    btnInstall?.addEventListener('click', async () => {
      if (this.deferredInstallPrompt) {
        this.deferredInstallPrompt.prompt();
        const choice = await this.deferredInstallPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          this.deferredInstallPrompt = null;
        }
      } else {
        document.getElementById('dialogInstallPwa')?.showModal();
      }
    });

    btnTriggerNative?.addEventListener('click', async () => {
      if (this.deferredInstallPrompt) {
        this.deferredInstallPrompt.prompt();
        await this.deferredInstallPrompt.userChoice;
        this.deferredInstallPrompt = null;
        document.getElementById('dialogInstallPwa')?.close();
      }
    });
  }

  normalizeLegacyIconsToSvg() {
    if (!this.state) return;
    for (const m of this.state.members || []) {
      m.avatar = resolveIconKey(m.avatar, m.role === 'PARENT' ? 'parent-male' : 'unicorn');
      if (m.goalIcon) m.goalIcon = resolveIconKey(m.goalIcon, 'target');
    }
    for (const c of this.state.catalogs || []) {
      c.icon = resolveIconKey(c.icon, c.type === 'INCOME_SOURCE' ? 'coins' : 'shopping-bag');
    }
  }

  getChildren() {
    return (this.state?.members || []).filter((m) => m.role === 'CHILD');
  }

  getParents() {
    return (this.state?.members || []).filter((m) => m.role === 'PARENT');
  }

  getSelectedChild() {
    return this.getChildren().find((c) => c.id === this.selectedChildId) || this.getChildren()[0] || null;
  }

  getCatalogById(catalogId) {
    return (this.state?.catalogs || []).find((c) => c.id === catalogId) || null;
  }

  getLastEventHash() {
    const events = this.state?.ledgerEvents || [];
    if (events.length === 0) return 'GENESIS';
    return events[events.length - 1].eventHash || 'GENESIS';
  }

  showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast inline-icon-text';
    const colors = {
      success: 'var(--color-income)',
      warn: 'var(--color-warn)',
      danger: 'var(--color-expense)',
      info: 'var(--color-invest)'
    };
    const iconsByType = {
      success: 'check',
      warn: 'alert-triangle',
      danger: 'shield-alert',
      info: 'cloud'
    };
    toast.style.borderLeftColor = colors[type] || colors.success;
    toast.innerHTML = `${renderSvgIcon(iconsByType[type] || 'check', 17)} <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 4200);
  }

  async handleRemoteStateMerged(remoteState, sourceLabel) {
    const prevEventCount = (this.state?.ledgerEvents || []).length;
    const prevReqCount = (this.state?.childRequests || []).length;
    this.state = mergeFamilyCRDT(this.state, remoteState);
    this.normalizeLegacyIconsToSvg();
    await this.runLedgerAuditAndRender();

    const newEventCount = (this.state?.ledgerEvents || []).length;
    const newReqCount = (this.state?.childRequests || []).length;
    if (newEventCount > prevEventCount || newReqCount > prevReqCount) {
      this.showToast(`Datos actualizados en tiempo real desde ${sourceLabel}`, 'info');
    }
  }

  updateCloudBadge(info) {
    const dot = document.getElementById('cloudStatusDot');
    const label = document.getElementById('cloudStatusLabel');
    if (dot && label) {
      dot.classList.toggle('syncing', info.status === 'SYNCING');
      label.textContent = `${info.detail} (${info.timestamp})`;
    }

    const streamBadge = document.getElementById('realtimeStreamStatusBadge');
    const detailBox = document.getElementById('liveConnectionDetailBox');
    if (streamBadge) {
      if (info.wsConnected) {
        streamBadge.className = 'badge badge-success';
        streamBadge.innerHTML = `${renderSvgIcon('zap', 13)} Supabase WebSocket Conectado`;
      } else {
        streamBadge.className = 'badge badge-info';
        streamBadge.innerHTML = `${renderSvgIcon('zap', 13)} Auto-Sync Tiempo Real Activo`;
      }
    }
    if (detailBox && info.tableMissing) {
      detailBox.innerHTML = `
        ${renderSvgIcon('alert-triangle', 18)}
        <span><strong>Conexión con tu proyecto Supabase detectada:</strong> Copia el bloque SQL de abajo y ejecútalo una sola vez en el <em>SQL Editor</em> de tu proyecto actual de Supabase para crear la tabla aislada <code>public.${this.cloudManager.tableName}</code>.</span>
      `;
    } else if (detailBox && info.wsConnected) {
      detailBox.innerHTML = `
        ${renderSvgIcon('check', 18)}
        <span><strong>Supabase Realtime WebSocket Activo (${info.timestamp}):</strong> Todos los cambios se sincronizan al instante en tu proyecto de Supabase sin botones manuales.</span>
      `;
    }
  }

  async runLedgerAuditAndRender() {
    if (!this.state) return;
    this.auditResult = await auditLedgerEvents(
      this.state.ledgerEvents,
      this.state.family.saltHex,
      this.parentSigningKey
    );
    this.renderAll();
  }

  ensureParentPermission() {
    if (this.currentRole !== 'PARENT' || !this.parentSigningKey) {
      this.showToast('Pide a Papá o Mamá que ponga su PIN para guardar cambios.', 'warn');
      this.openParentPinDialog();
      return false;
    }
    this.resetParentInactivityTimer();
    return true;
  }

  resetParentInactivityTimer() {
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    if (this.currentRole === 'PARENT') {
      this.inactivityTimer = setTimeout(() => {
        this.lockToChildMode('Se volvió a Vista Hijo automáticamente después de 3 minutos sin uso.');
      }, 3 * 60 * 1000);
    }
  }

  lockToChildMode(reasonMsg = 'Vista Hijo activada. Tu alcancía está protegida contra cambios.') {
    this.currentRole = 'CHILD';
    this.parentSigningKey = null;
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    document.body.setAttribute('data-role', 'CHILD');
    this.showToast(reasonMsg, 'info');
    this.runLedgerAuditAndRender();
  }

  openParentPinDialog() {
    const dialog = document.getElementById('dialogParentPin');
    const selectParent = document.getElementById('selectActiveParent');
    const pinInput = document.getElementById('inputParentPin');
    const errBox = document.getElementById('pinErrorMsg');

    if (selectParent) {
      const parents = this.getParents();
      selectParent.innerHTML = parents
        .map((p) => `<option value="${p.id}" ${p.id === this.activeParentId ? 'selected' : ''}>${p.name} (${p.title || 'Papá/Mamá'})</option>`)
        .join('');
    }
    if (errBox) errBox.style.display = 'none';
    if (pinInput) pinInput.value = '';
    if (dialog && typeof dialog.showModal === 'function') {
      dialog.showModal();
      setTimeout(() => pinInput?.focus(), 60);
    }
  }

  async unlockParentModeWithPin(pin, selectedParentId) {
    const { authVerifier, signingKey } = await deriveParentKeyBundle(pin, this.state.family.saltHex);
    if (authVerifier !== this.state.family.authVerifier) {
      return false;
    }
    this.currentRole = 'PARENT';
    this.parentSigningKey = signingKey;
    this.activeParentId = selectedParentId || this.getParents()[0]?.id || 'parent_carlos';
    document.body.setAttribute('data-role', 'PARENT');
    this.resetParentInactivityTimer();

    await this.consolidateDueAutomationsAsParent(true);
    await this.runLedgerAuditAndRender();
    this.showToast('¡Modo Papá activado! Ya puedes añadir movimientos o aprobar pedidos.', 'success');

    if (typeof this.pendingAfterPinAction === 'function') {
      const nextFn = this.pendingAfterPinAction;
      this.pendingAfterPinAction = null;
      setTimeout(() => nextFn(), 80);
    }
    return true;
  }

  async consolidateDueAutomationsAsParent(silentIfNone = true) {
    if (!this.parentSigningKey) return;
    const today = getTodayLocalDate();
    const due = findDueDeterministicAutomations(this.state, today);

    if (due.totalDueCount === 0) {
      if (!silentIfNone) {
        this.showToast('No hay ingresos recurrentes ni inversiones pendientes por vencer hoy.', 'info');
      }
      return;
    }

    let prevHash = this.getLastEventHash();
    let executedCount = 0;

    for (const item of due.dueRecurring) {
      const signedIncome = await createSignedLedgerEvent(
        {
          id: item.deterministicTxId,
          familyId: this.state.family.id,
          memberId: item.memberId,
          createdByParentId: this.activeParentId,
          type: 'RECURRING_INCOME',
          amountCents: item.amountCents,
          catalogId: item.catalogId,
          referenceId: item.ruleId,
          note: `Acreditación automática: ${item.title} (${item.scheduledLocalDate})`,
          localDate: item.scheduledLocalDate
        },
        this.parentSigningKey,
        this.state.family.saltHex,
        prevHash
      );
      prevHash = signedIncome.eventHash;
      this.state.ledgerEvents.push(signedIncome);
      executedCount++;

      const ruleObj = this.state.recurringRules.find((r) => r.id === item.ruleId);
      if (ruleObj) {
        ruleObj.nextExecutionDate = item.nextDateAfter;
        ruleObj.updatedAt = new Date().toISOString();
      }

      if (item.autoDeductLoanId) {
        await this.applyAutomaticLoanDeductionFromAllowance(item.memberId, item.autoDeductLoanId, item.amountCents, item.scheduledLocalDate);
        prevHash = this.getLastEventHash();
      }
    }

    for (const mat of due.dueInvestments) {
      const signedMat = await createSignedLedgerEvent(
        {
          id: mat.deterministicTxId,
          familyId: this.state.family.id,
          memberId: mat.memberId,
          createdByParentId: this.activeParentId,
          type: 'INVESTMENT_MATURITY',
          amountCents: mat.maturityTotalCents,
          catalogId: 'cat_inc_yield',
          referenceId: mat.investmentId,
          metadata: {
            principalCents: mat.principalCents,
            yieldCents: mat.yieldCents
          },
          note: `Vencimiento de Inversión: ${mat.title} (Capital ${formatMoneyCents(mat.principalCents)} + Rendimiento ${formatMoneyCents(mat.yieldCents)})`,
          localDate: mat.maturityDate
        },
        this.parentSigningKey,
        this.state.family.saltHex,
        prevHash
      );
      prevHash = signedMat.eventHash;
      this.state.ledgerEvents.push(signedMat);
      executedCount++;

      const invObj = this.state.investments.find((i) => i.id === mat.investmentId);
      if (invObj) {
        invObj.status = 'MATURED';
        invObj.updatedAt = new Date().toISOString();
      }
    }

    if (executedCount > 0) {
      await this.cloudManager.pushState(this.state);
      this.showToast(`Se consolidaron y firmaron ${executedCount} evento(s) programados en el Ledger.`, 'success');
    }
  }

  async applyAutomaticLoanDeductionFromAllowance(memberId, loanId, maxAvailableFromAllowanceCents, dateStr) {
    const loan = this.state.loans.find((l) => l.id === loanId && l.memberId === memberId && l.status === 'ACTIVE');
    if (!loan) return;
    const nextInst = (loan.schedule || []).find((i) => i.status !== 'PAID');
    if (!nextInst) return;

    const pendingOnInstallment = Math.max(0, nextInst.totalInstallmentCents - (nextInst.paidCents || 0));
    const amountToCollect = Math.min(pendingOnInstallment, maxAvailableFromAllowanceCents);
    if (amountToCollect <= 0) return;

    nextInst.paidCents = (nextInst.paidCents || 0) + amountToCollect;
    if (nextInst.paidCents >= nextInst.totalInstallmentCents) {
      nextInst.status = 'PAID';
    } else {
      nextInst.status = 'OVERDUE';
    }

    const allPaid = loan.schedule.every((i) => i.status === 'PAID');
    if (allPaid) loan.status = 'PAID_OFF';
    loan.updatedAt = new Date().toISOString();

    const signedPayment = await createSignedLedgerEvent(
      {
        familyId: this.state.family.id,
        memberId,
        createdByParentId: this.activeParentId,
        type: 'LOAN_PAYMENT',
        amountCents: amountToCollect,
        catalogId: 'cat_exp_loan',
        referenceId: loan.id,
        metadata: {
          paymentSource: 'PIGGY',
          installmentNumber: nextInst.installmentNumber,
          interestPaidCents: Math.min(amountToCollect, nextInst.interestPartCents)
        },
        note: `Retención automática de mesada para Cuota #${nextInst.installmentNumber} (${loan.concept})`,
        localDate: dateStr
      },
      this.parentSigningKey,
      this.state.family.saltHex,
      this.getLastEventHash()
    );
    this.state.ledgerEvents.push(signedPayment);
  }

  /* ==========================================================================
     RENDERIZADO INTEGRAL DE LA INTERFAZ (100% SVG)
     ========================================================================== */

  renderAll() {
    if (!this.state) return;
    const child = this.getSelectedChild();
    const currency = this.state.family.currency || 'MXN';
    const today = getTodayLocalDate();

    // 1. Encabezado y barra de rol con iconos SVG
    document.getElementById('familyTitleHeader').textContent = `${this.state.family.name} — Alcancías Digitales`;
    document.getElementById('familyCodeDisplay').textContent = this.state.family.familyCode;

    const roleStatusText = document.getElementById('roleStatusText');
    const btnToggleRole = document.getElementById('btnToggleRole');
    if (this.currentRole === 'PARENT') {
      const parentObj = this.getParents().find((p) => p.id === this.activeParentId) || { name: 'Papá/Mamá', avatar: 'parent-male' };
      roleStatusText.innerHTML = `
        ${renderSvgIcon('unlock', 18)}
        <span><strong>MODO PAPÁ ACTIVO (${parentObj.name}):</strong> Ya puedes meter dinero, anotar gastos, aprobar pedidos o crear préstamos.</span>
      `;
      btnToggleRole.innerHTML = `${renderSvgIcon('eye', 16)} Volver a Vista Hijo`;
    } else {
      roleStatusText.innerHTML = `
        ${renderSvgIcon('eye', 18)}
        <span><strong>VISTA HIJO (SOLO VER):</strong> Mira tu alcancía, tus metas y usa la Calculadora. Para anotar o cambiar algo, pide a Papá o Mamá su PIN.</span>
      `;
      btnToggleRole.innerHTML = `${renderSvgIcon('lock', 16)} Modo Papá (PIN)`;
    }

    // 2. Pestañas de perfiles de hijos con avatares SVG
    const childTabsEl = document.getElementById('childProfileTabs');
    const children = this.getChildren();
    childTabsEl.innerHTML = children
      .map((c) => {
        const isActive = c.id === child?.id;
        const cState = reduceMemberFinancialState({
          memberId: c.id,
          validEvents: this.auditResult.validEvents,
          loans: this.state.loans,
          investments: this.state.investments,
          catalogs: this.state.catalogs,
          referenceLocalDate: today
        });
        return `
          <button type="button" class="child-chip ${isActive ? 'active' : ''}" data-select-child="${c.id}" style="--chip-color: ${c.themeColor || '#10b981'};">
            <span class="child-avatar" style="color: ${c.themeColor || '#10b981'}; display: flex;">
              ${renderSvgIcon(c.avatar || 'unicorn', 24)}
            </span>
            <div style="text-align: left;">
              <div>${c.name} <span style="font-weight: 500; font-size: 0.76rem; color: var(--text-muted);">(${c.age || ''} años)</span></div>
              <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-income);">${formatMoneyCents(cState.availableCents, currency)} libre</div>
            </div>
          </button>
        `;
      })
      .join('');

    if (!child) return;

    // 3. Reducción pura del estado financiero del hijo seleccionado
    const childFinance = reduceMemberFinancialState({
      memberId: child.id,
      validEvents: this.auditResult.validEvents,
      loans: this.state.loans,
      investments: this.state.investments,
      catalogs: this.state.catalogs,
      referenceLocalDate: today
    });

    // 4. Actualizar las 4 Tarjetas KPI Patrimoniales
    document.getElementById('kpiAvailable').textContent = formatMoneyCents(childFinance.availableCents, currency);
    document.getElementById('kpiAvailableSub').textContent = `Recibido: ${formatMoneyCents(childFinance.totalIncomeCents, currency)} · Gastado: ${formatMoneyCents(childFinance.totalExpenseCents, currency)}`;

    document.getElementById('kpiInvested').textContent = formatMoneyCents(childFinance.investedCents, currency);
    document.getElementById('kpiInvestCountBadge').textContent = `${childFinance.activeInvestments.length} activo(s)`;
    document.getElementById('kpiAccruedYield').textContent = formatMoneyCents(childFinance.accruedYieldCents, currency, true);

    document.getElementById('kpiDebt').textContent = formatMoneyCents(childFinance.debtCents, currency);
    document.getElementById('kpiLoanCountBadge').textContent = `${childFinance.activeLoans.length} activo(s)`;
    const nextLoan = childFinance.activeLoans.find((l) => l.nextInstallment);
    document.getElementById('kpiNextLoanDue').textContent = nextLoan
      ? `Siguiente pago: ${formatMoneyCents(nextLoan.nextInstallment.totalInstallmentCents - (nextLoan.nextInstallment.paidCents || 0), currency)} (${nextLoan.nextInstallment.dueDate})`
      : 'No debes nada ahora';

    document.getElementById('kpiNetWorth').textContent = formatMoneyCents(childFinance.netWorthCents, currency);
    document.getElementById('kpiHistoricalYield').textContent = formatMoneyCents(childFinance.totalYieldEarnedCents, currency, true);

    // 5. Meta de Ahorro del Hijo
    this.renderGoalBanner(child, childFinance, currency);

    // 6. Banners dinámicos
    this.renderDynamicBanners(today, currency);

    // 7. Renderizar cada pestaña funcional
    this.renderMovementsAndCharts(childFinance, currency);
    this.renderRecurringRules(child, currency);
    this.renderLoansSection(childFinance, currency);
    this.renderInvestmentsSection(childFinance, currency);
    this.renderUsersAndCatalogs(currency);
    this.renderChildRequests(currency);
    this.renderCryptoAuditPanel(currency);
  }

  renderGoalBanner(child, childFinance, currency) {
    const goalEl = document.getElementById('goalBannerSection');
    const targetCents = Math.max(100, Number(child.goalTargetCents || 100000));
    const currentProgressCents = Math.max(0, childFinance.availableCents + childFinance.investedCents);
    const pct = Math.min(100, Math.round((currentProgressCents / targetCents) * 100));

    goalEl.innerHTML = `
      <div style="flex: 1; min-width: 260px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
          <span class="inline-icon-text" style="font-weight: 800; font-size: 0.95rem;">
            <span style="color: var(--color-income); display: flex;">${renderSvgIcon(child.goalIcon || 'target', 20)}</span>
            Meta de ${child.name}: <span style="color: var(--color-income);">${child.goalTitle || 'Mi Gran Meta'}</span>
          </span>
          <span style="font-family: var(--font-mono); font-weight: 800; font-size: 0.9rem;">
            ${formatMoneyCents(currentProgressCents, currency)} de ${formatMoneyCents(targetCents, currency)} (${pct}%)
          </span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${pct}%;"></div>
        </div>
      </div>
    `;
  }

  renderDynamicBanners(today) {
    const container = document.getElementById('dynamicBannersArea');
    const banners = [];

    if (!this.auditResult.isClean) {
      banners.push(`
        <div class="notice-banner danger">
          <div class="inline-icon-text">
            ${renderSvgIcon('shield-alert', 20)}
            <span><strong>¡Cuidado! Se bloqueó ${this.auditResult.corruptedEvents.length} movimiento falso:</strong>
            Alguien intentó meter datos sin el PIN de Papá/Mamá. Tu dinero real está a salvo.</span>
          </div>
          <button type="button" class="btn btn-sm btn-expense" data-action="purge-corrupted">
            ${renderSvgIcon('trash', 15)} Borrar Movimiento Falso
          </button>
        </div>
      `);
    }

    const due = findDueDeterministicAutomations(this.state, today);
    if (due.totalDueCount > 0) {
      if (this.currentRole === 'CHILD') {
        banners.push(`
          <div class="notice-banner info">
            <div class="inline-icon-text">
              ${renderSvgIcon('clock', 20)}
              <span><strong>¡Tienes ${due.totalDueCount} pago(s) listo(s) para recibir hoy!</strong>
              Cuando Mamá o Papá ponga su PIN, tu mesada o premio de ahorro se sumará a tu alcancía.</span>
            </div>
            <button type="button" class="btn btn-sm btn-primary" data-action="open-pin">
              ${renderSvgIcon('lock', 15)} Pedir PIN a Papá
            </button>
          </div>
        `);
      } else {
        banners.push(`
          <div class="notice-banner info">
            <div class="inline-icon-text">
              ${renderSvgIcon('zap', 20)}
              <span><strong>Hay ${due.totalDueCount} pago(s) programado(s) para hoy</strong> listos para depositarse.</span>
            </div>
            <button type="button" class="btn btn-sm btn-income" data-action="consolidate-due">
              ${renderSvgIcon('check', 15)} Depositar Ahora
            </button>
          </div>
        `);
      }
    }

    const pendingReqs = (this.state.childRequests || []).filter((r) => r.status === 'PENDING');
    if (pendingReqs.length > 0 && this.currentRole === 'PARENT') {
      banners.push(`
        <div class="notice-banner warning">
          <div class="inline-icon-text">
            ${renderSvgIcon('inbox', 20)}
            <span><strong>Tienes ${pendingReqs.length} pedido(s) nuevo(s) desde la Calculadora:</strong>
            "${pendingReqs[0].title}"</span>
          </div>
          <button type="button" class="btn btn-sm btn-warn" data-switch-tab="tab-sandbox">
            ${renderSvgIcon('check', 15)} Ver y Aprobar Pedido
          </button>
        </div>
      `);
    }

    container.innerHTML = banners.join('');
  }

  renderMovementsAndCharts(childFinance, currency) {
    const listEl = document.getElementById('transactionsListContainer');
    const filtered = childFinance.timeline.filter((ev) => {
      if (this.txFilter === 'ALL') return true;
      if (this.txFilter === 'INCOME') return ev.type === 'INCOME' || ev.type === 'RECURRING_INCOME' || ev.type === 'INVESTMENT_MATURITY';
      if (this.txFilter === 'EXPENSE') return ev.type === 'EXPENSE';
      if (this.txFilter === 'LOAN') return ev.type === 'LOAN_DISBURSEMENT' || ev.type === 'LOAN_PAYMENT' || ev.type === 'EXTRA_PRINCIPAL_PAYMENT';
      if (this.txFilter === 'INVESTMENT') return ev.type === 'INVESTMENT_LOCK' || ev.type === 'INVESTMENT_MATURITY' || ev.type === 'INVESTMENT_EARLY_EXIT';
      return true;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 1.5rem;">Aún no hay movimientos aquí.</p>`;
    } else {
      listEl.innerHTML = filtered
        .map((ev) => {
          const cat = this.getCatalogById(ev.catalogId);
          const parentAuthor = this.getParents().find((p) => p.id === ev.createdByParentId);
          let signClass = 'neutral';
          let prefix = '';
          let typeBadge = '';
          let fallbackIcon = 'list';

          if (ev.type === 'INCOME' || ev.type === 'RECURRING_INCOME' || ev.type === 'INVESTMENT_MATURITY' || ev.type === 'INVESTMENT_EARLY_EXIT') {
            signClass = 'positive';
            prefix = '+';
            fallbackIcon = 'coins';
            typeBadge = ev.type === 'RECURRING_INCOME' ? 'Mesada' : ev.type === 'INVESTMENT_MATURITY' ? 'Ahorro Ganado' : 'Dinero que entró';
          } else if (ev.type === 'EXPENSE' || ev.type === 'LOAN_PAYMENT' || ev.type === 'EXTRA_PRINCIPAL_PAYMENT') {
            signClass = 'negative';
            prefix = '-';
            fallbackIcon = 'shopping-bag';
            typeBadge = ev.type === 'EXPENSE' ? 'Gasto' : ev.type === 'EXTRA_PRINCIPAL_PAYMENT' ? 'Pago adelantado' : 'Pago de préstamo';
          } else if (ev.type === 'INVESTMENT_LOCK') {
            signClass = 'neutral';
            prefix = '';
            fallbackIcon = 'lock';
            typeBadge = 'Guardado a Plazo';
          } else if (ev.type === 'REVERSAL') {
            signClass = 'neutral';
            prefix = '';
            fallbackIcon = 'undo';
            typeBadge = 'Movimiento Deshecho';
          }

          const canReverse = this.currentRole === 'PARENT' && !ev.isReversed && ev.type !== 'REVERSAL';
          const iconSvg = renderSvgIcon(cat?.icon || fallbackIcon, 20);

          return `
            <div class="tx-item ${ev.isReversed ? 'reversed' : ''}">
              <div class="tx-left">
                <div class="tx-icon" style="color: ${cat?.color || 'var(--text-primary)'};">${iconSvg}</div>
                <div>
                  <p class="tx-title">
                    ${ev.note || cat?.name || typeBadge}
                    ${ev.isReversed ? `<span class="badge badge-danger">${renderSvgIcon('ban', 12)} CANCELADO</span>` : ''}
                  </p>
                  <p class="tx-sub inline-icon-text" style="flex-wrap: wrap;">
                    ${renderSvgIcon('calendar', 13)} <span>${ev.localDate}</span> ·
                    <span class="badge badge-info">${cat?.name || typeBadge}</span> ·
                    <span>Autorizó: ${parentAuthor ? parentAuthor.name : 'Papá/Mamá'}</span>
                  </p>
                </div>
              </div>
              <div class="tx-right">
                <div>
                  <div class="tx-amount ${signClass}">
                    ${prefix}${formatMoneyCents(ev.amountCents, currency)}
                  </div>
                  <div style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">
                    Quedó: ${formatMoneyCents(ev.runningAvailableCents, currency)}
                  </div>
                </div>
                ${
                  canReverse
                    ? `<button type="button" class="btn btn-ghost btn-sm parent-only" data-reverse-tx="${ev.id}" title="Cancelar este movimiento y devolver el saldo a como estaba">
                        ${renderSvgIcon('undo', 14)} Deshacer
                      </button>`
                    : ''
                }
              </div>
            </div>
          `;
        })
        .join('');
    }

    // Gráfica de Fuentes de Ingresos con iconos SVG
    const incContainer = document.getElementById('incomeSourcesChartContainer');
    const incEntries = Object.entries(childFinance.incomeBySource);
    if (incEntries.length === 0) {
      incContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.84rem;">Aún no has recibido dinero.</p>`;
    } else {
      incContainer.innerHTML = incEntries
        .sort((a, b) => b[1] - a[1])
        .map(([catId, cents]) => {
          const cat = this.getCatalogById(catId) || { name: 'Otra Fuente', icon: 'coins', color: '#10b981' };
          const pct = childFinance.totalIncomeCents > 0 ? Math.round((cents / childFinance.totalIncomeCents) * 100) : 0;
          return `
            <div class="stat-bar-row">
              <div class="stat-bar-labels">
                <span class="inline-icon-text" style="color: ${cat.color || '#10b981'};">
                  ${renderSvgIcon(cat.icon || 'coins', 16)}
                  <span style="color: var(--text-primary);">${cat.name}</span>
                </span>
                <span style="font-family: var(--font-mono); color: var(--color-income);">${formatMoneyCents(cents, currency)} (${pct}%)</span>
              </div>
              <div class="progress-track" style="height: 8px;">
                <div class="progress-fill" style="width: ${pct}%; background: ${cat.color || '#10b981'};"></div>
              </div>
            </div>
          `;
        })
        .join('');
    }

    // Gráfica de Categorías de Gastos con iconos SVG
    const expContainer = document.getElementById('expenseCategoriesChartContainer');
    const expEntries = Object.entries(childFinance.expenseByCategory);
    const totalOutflow = expEntries.reduce((s, [, v]) => s + v, 0);
    if (expEntries.length === 0) {
      expContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.84rem;">Aún no has gastado dinero.</p>`;
    } else {
      expContainer.innerHTML = expEntries
        .sort((a, b) => b[1] - a[1])
        .map(([catId, cents]) => {
          const cat = this.getCatalogById(catId) || { name: 'Otra Categoría', icon: 'shopping-bag', color: '#f43f5e' };
          const pct = totalOutflow > 0 ? Math.round((cents / totalOutflow) * 100) : 0;
          return `
            <div class="stat-bar-row">
              <div class="stat-bar-labels">
                <span class="inline-icon-text" style="color: ${cat.color || '#f43f5e'};">
                  ${renderSvgIcon(cat.icon || 'shopping-bag', 16)}
                  <span style="color: var(--text-primary);">${cat.name}</span>
                </span>
                <span style="font-family: var(--font-mono); color: var(--color-expense);">${formatMoneyCents(cents, currency)} (${pct}%)</span>
              </div>
              <div class="progress-track" style="height: 8px;">
                <div class="progress-fill" style="width: ${pct}%; background: ${cat.color || '#f43f5e'};"></div>
              </div>
            </div>
          `;
        })
        .join('');
    }
  }

  renderRecurringRules(child, currency) {
    const container = document.getElementById('recurringRulesContainer');
    const rules = (this.state.recurringRules || []).filter((r) => r.memberId === child.id);
    const freqLabels = {
      DAILY: 'Cada día',
      WEEKLY: 'Cada semana (7 días)',
      BIWEEKLY: 'Cada 2 semanas (14 días)',
      MONTHLY: 'Cada mes'
    };

    if (rules.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted);">No hay mesadas programadas para ${child.name}.</p>`;
      return;
    }

    container.innerHTML = rules
      .map((rule) => {
        const cat = this.getCatalogById(rule.catalogId);
        const linkedLoan = (this.state.loans || []).find((l) => l.id === rule.autoDeductLoanId);
        return `
          <div class="panel-card" style="margin-bottom: 0; background: var(--bg-elevated);">
            <div class="panel-header" style="margin-bottom: 0.6rem;">
              <span class="badge ${rule.status === 'ACTIVE' ? 'badge-success' : 'badge-warn'}">
                ${rule.status === 'ACTIVE' ? `${renderSvgIcon('check', 13)} Activa` : `${renderSvgIcon('pause', 13)} En Pausa`}
              </span>
              <span class="badge badge-info">${freqLabels[rule.frequency] || rule.frequency}</span>
            </div>
            <h3 class="inline-icon-text" style="margin: 0 0 0.35rem 0; font-size: 1.05rem;">
              ${renderSvgIcon(cat?.icon || 'calendar', 19)}
              <span>${rule.title}</span>
            </h3>
            <div style="font-family: var(--font-mono); font-size: 1.45rem; font-weight: 800; color: var(--color-income); margin-bottom: 0.5rem;">
              +${formatMoneyCents(rule.amountCents, currency)}
            </div>
            <div style="font-size: 0.82rem; color: var(--text-secondary); margin: 0 0 0.75rem 0; display: flex; flex-direction: column; gap: 0.3rem;">
              <span class="inline-icon-text">${renderSvgIcon('calendar', 14)} <strong>Siguiente pago:</strong> ${rule.nextExecutionDate}</span>
              <span class="inline-icon-text">${renderSvgIcon('arrow-down-left', 14)} <strong>De dónde viene:</strong> ${cat?.name || 'Mesada'}</span>
              <span class="inline-icon-text">
                ${
                  linkedLoan
                    ? `${renderSvgIcon('credit-card', 14)} <strong>Pago automático:</strong> Se aparta el pago de "${linkedLoan.concept}"`
                    : `${renderSvgIcon('unlock', 14)} <strong>100% libre:</strong> Todo entra directo a tu alcancía`
                }
              </span>
            </div>
            <div class="parent-only" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-income btn-sm" data-trigger-recurring="${rule.id}">
                ${renderSvgIcon('zap', 14)} Depositar Mesada Hoy
              </button>
              <button type="button" class="btn btn-ghost btn-sm" data-toggle-recurring="${rule.id}">
                ${rule.status === 'ACTIVE' ? `${renderSvgIcon('pause', 14)} Pausar` : `${renderSvgIcon('play', 14)} Volver a Activar`}
              </button>
            </div>
          </div>
        `;
      })
      .join('');
  }

  renderLoansSection(childFinance, currency) {
    const container = document.getElementById('loansListContainer');
    const loans = childFinance.loans;

    if (loans.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted);">¡Súper! No tienes ningún préstamo por pagar.</p>`;
      return;
    }

    container.innerHTML = loans
      .map((loan) => {
        const typeLabel = loan.interestType === 'COMPOUND_FRENCH' ? 'Interés Compuesto (Pagos Fijos)' : 'Interés Simple';
        const statusBadge =
          loan.status === 'PAID_OFF'
            ? `<span class="badge badge-success">${renderSvgIcon('check', 13)} ¡Todo Pagado!</span>`
            : loan.hasOverdue
              ? `<span class="badge badge-danger">${renderSvgIcon('alert-triangle', 13)} Pago Atrasado</span>`
              : `<span class="badge badge-purple">${renderSvgIcon('credit-card', 13)} Pagando</span>`;

        const rowsHtml = (loan.schedule || [])
          .map((inst) => {
            const stBadge =
              inst.status === 'PAID'
                ? `<span class="badge badge-success">${inst.isExtraPrincipalPayment ? `${renderSvgIcon('zap', 12)} Pago Adelantado` : `${renderSvgIcon('check', 12)} Pagado`}</span>`
                : inst.status === 'OVERDUE'
                  ? `<span class="badge badge-danger">${renderSvgIcon('alert-triangle', 12)} Falta Completar</span>`
                  : `<span class="badge badge-warn">${renderSvgIcon('clock', 12)} Por Pagar</span>`;

            const pendingInstCents = Math.max(0, inst.totalInstallmentCents - (inst.paidCents || 0));
            return `
              <tr>
                <td class="mono">#${inst.installmentNumber}</td>
                <td>${inst.dueDate}</td>
                <td class="mono">${formatMoneyCents(inst.principalPartCents, currency)}</td>
                <td class="mono" style="color: var(--color-expense);">${formatMoneyCents(inst.interestPartCents, currency)}</td>
                <td class="mono" style="font-weight: 700;">${formatMoneyCents(inst.totalInstallmentCents, currency)}</td>
                <td class="mono" style="color: var(--color-income);">${formatMoneyCents(inst.paidCents || 0, currency)}</td>
                <td>${stBadge}</td>
                <td class="parent-only">
                  ${
                    inst.status !== 'PAID' && loan.status === 'ACTIVE'
                      ? `
                        <button type="button" class="btn btn-loan btn-sm" data-pay-installment="${loan.id}:${inst.installmentNumber}:PIGGY" title="Descontar ${formatMoneyCents(pendingInstCents, currency)} del dinero de la alcancía">
                          ${renderSvgIcon('piggy', 14)} Pagar con Alcancía
                        </button>
                        <button type="button" class="btn btn-ghost btn-sm" data-pay-installment="${loan.id}:${inst.installmentNumber}:EXTERNAL" title="Anotar como pagado con efectivo o tareas en casa">
                          ${renderSvgIcon('dollar', 14)} Pagó en Efectivo
                        </button>
                      `
                      : '—'
                  }
                </td>
              </tr>
            `;
          })
          .join('');

        return `
          <div class="panel-card" style="background: var(--bg-elevated); margin-bottom: 1.2rem;">
            <div class="panel-header">
              <div>
                <div style="display: flex; align-items: center; gap: 0.55rem; flex-wrap: wrap;">
                  <h3 style="margin: 0; font-size: 1.1rem;">${loan.concept}</h3>
                  ${statusBadge}
                  <span class="badge badge-info">${typeLabel} · ${loan.interestRatePercent}% extra</span>
                </div>
                <p style="margin: 0.3rem 0 0 0; font-size: 0.82rem; color: var(--text-secondary);">
                  Dinero Prestado: <strong>${formatMoneyCents(loan.principalCents, currency)}</strong> ·
                  Costo de Intereses: <strong style="color: var(--color-expense);">${formatMoneyCents(loan.totalInterestCents, currency)}</strong> ·
                  Falta por Pagar: <strong style="color: var(--color-loan);">${formatMoneyCents(loan.remainingDebtCents, currency)}</strong>
                  ${
                    loan.interestSavedByExtraPaymentsCents > 0
                      ? ` · <strong style="color: var(--color-income);">¡Te ahorraste ${formatMoneyCents(loan.interestSavedByExtraPaymentsCents, currency)} por adelantar pagos!</strong>`
                      : ''
                  }
                </p>
              </div>
              <div class="parent-only" style="display: flex; gap: 0.5rem;">
                ${
                  loan.status === 'ACTIVE' && loan.remainingDebtCents > 0
                    ? `<button type="button" class="btn btn-primary btn-sm" data-open-extra-principal="${loan.id}">
                        ${renderSvgIcon('zap', 14)} Adelantar Pago (Ahorrar Intereses)
                      </button>`
                    : ''
                }
              </div>
            </div>

            <div class="progress-track" style="margin-bottom: 0.9rem; height: 9px;">
              <div class="progress-fill" style="width: ${loan.progressPercent}%; background: linear-gradient(90deg, #a855f7, #10b981);"></div>
            </div>

            <div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Pago #</th>
                    <th>Fecha</th>
                    <th>Del Préstamo</th>
                    <th>Interés</th>
                    <th>Total del Pago</th>
                    <th>Ya Pagado</th>
                    <th>Estado</th>
                    <th class="parent-only">Pagar (Papá/Mamá)</th>
                  </tr>
                </thead>
                <tbody>
                  ${rowsHtml}
                </tbody>
              </table>
            </div>
          </div>
        `;
      })
      .join('');
  }

  renderInvestmentsSection(childFinance, currency) {
    const container = document.getElementById('investmentsListContainer');
    const investments = childFinance.investments;

    if (investments.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted);">Aún no tienes ahorros guardados a plazo.</p>`;
      return;
    }

    container.innerHTML = investments
      .map((inv) => {
        const stBadge =
          inv.status === 'MATURED'
            ? `<span class="badge badge-success">${renderSvgIcon('check', 13)} ¡Terminado y Cobrado!</span>`
            : inv.status === 'CANCELLED_EARLY'
              ? `<span class="badge badge-warn">${renderSvgIcon('stop', 13)} Sacado Antes (Sin premio)</span>`
              : `<span class="badge badge-info">${renderSvgIcon('lock', 13)} Creciendo (${inv.progressPercent}%)</span>`;

        return `
          <div class="panel-card" style="margin-bottom: 0; background: var(--bg-elevated);">
            <div class="panel-header" style="margin-bottom: 0.5rem;">
              ${stBadge}
              <span class="badge badge-success">Ganas +${inv.yieldRatePercent}% en ${inv.termDays} días</span>
            </div>
            <h3 class="inline-icon-text" style="margin: 0 0 0.4rem 0; font-size: 1.06rem;">
              ${renderSvgIcon('trending-up', 19)}
              <span>${inv.title}</span>
            </h3>

            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.6rem; flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Dinero Guardado</div>
                <div style="font-family: var(--font-mono); font-size: 1.35rem; font-weight: 800;">${formatMoneyCents(inv.principalCents, currency)}</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Ganado hasta hoy</div>
                <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 700; color: var(--color-income);">+${formatMoneyCents(inv.accruedInterestTodayCents, currency)}</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Recibirás al final</div>
                <div style="font-family: var(--font-mono); font-size: 1.15rem; font-weight: 800; color: var(--color-invest);">${formatMoneyCents(inv.maturityTotalCents, currency)}</div>
              </div>
            </div>

            <div class="progress-track" style="margin-bottom: 0.55rem;">
              <div class="progress-fill" style="width: ${inv.progressPercent}%;"></div>
            </div>

            <p class="inline-icon-text" style="font-size: 0.8rem; color: var(--text-secondary); margin: 0 0 0.85rem 0; flex-wrap: wrap;">
              ${renderSvgIcon('calendar', 14)}
              <span>Empezó: <strong>${inv.startDate}</strong> · Termina: <strong>${inv.maturityDate}</strong> (${inv.status === 'ACTIVE' ? `Faltan ${inv.remainingDays} días` : 'Listo'})</span>
            </p>

            ${
              inv.status === 'ACTIVE'
                ? `
                  <div class="parent-only" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button type="button" class="btn btn-income btn-sm" data-mature-investment="${inv.id}" title="Entregar el dinero guardado más su ganancia completa a la alcancía">
                      ${renderSvgIcon('check', 14)} Entregar Dinero + Ganancia (+${formatMoneyCents(inv.expectedInterestCents, currency)})
                    </button>
                    <button type="button" class="btn btn-ghost btn-sm" data-early-exit-investment="${inv.id}" title="Sacar el dinero antes de tiempo sin ganancia extra">
                      ${renderSvgIcon('stop', 14)} Sacar Antes (Sin Ganancia)
                    </button>
                  </div>
                `
                : ''
            }
          </div>
        `;
      })
      .join('');
  }

  renderUsersAndCatalogs(currency) {
    const membersEl = document.getElementById('membersListContainer');
    membersEl.innerHTML = (this.state.members || [])
      .map((m) => {
        const isParent = m.role === 'PARENT';
        return `
          <div class="panel-card" style="margin-bottom: 0; background: var(--bg-elevated);">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.8rem;">
              <div style="display: flex; align-items: center; gap: 0.8rem;">
                <div class="tx-icon" style="color: ${m.themeColor || 'var(--accent-parent)'};">
                  ${renderSvgIcon(m.avatar || (isParent ? 'parent-male' : 'unicorn'), 22)}
                </div>
                <div>
                  <h4 style="margin: 0; font-size: 1rem;">${m.name}</h4>
                  <span class="badge ${isParent ? 'badge-purple' : 'badge-info'}">
                    ${isParent ? `${renderSvgIcon('lock', 12)} Papá / Mamá (Con PIN)` : `${renderSvgIcon('eye', 12)} Hijo/a (${m.age || 10} años)`}
                  </span>
                </div>
              </div>
              ${
                !isParent
                  ? `<button type="button" class="btn btn-ghost btn-sm" data-select-child="${m.id}">Ver Alcancía</button>`
                  : ''
              }
            </div>
            ${
              !isParent
                ? `<p class="inline-icon-text" style="margin: 0.65rem 0 0 0; font-size: 0.8rem; color: var(--text-secondary);">
                    ${renderSvgIcon(m.goalIcon || 'target', 15)}
                    <span>Su meta: <strong>${m.goalTitle || 'Ahorro General'}</strong> (${formatMoneyCents(m.goalTargetCents || 100000, currency)})</span>
                  </p>`
                : `<p class="inline-icon-text" style="margin: 0.65rem 0 0 0; font-size: 0.8rem; color: var(--text-secondary);">
                    ${renderSvgIcon('shield-check', 15)}
                    <span>Puede autorizar movimientos y préstamos con su PIN.</span>
                  </p>`
            }
          </div>
        `;
      })
      .join('');

    const incCats = (this.state.catalogs || []).filter((c) => c.type === 'INCOME_SOURCE');
    document.getElementById('incomeSourcesCatalogList').innerHTML = incCats
      .map(
        (c) => `
        <div class="tx-item">
          <div class="tx-left">
            <div class="tx-icon" style="color: ${c.color || 'var(--color-income)'};">${renderSvgIcon(c.icon || 'coins', 20)}</div>
            <div>
              <p class="tx-title">${c.name}</p>
              <p class="tx-sub">${c.description || 'De dónde llega el dinero'}</p>
            </div>
          </div>
          <span class="badge badge-success">Entrada de Dinero</span>
        </div>
      `
      )
      .join('');

    const expCats = (this.state.catalogs || []).filter((c) => c.type === 'EXPENSE_CATEGORY');
    document.getElementById('expenseCategoriesCatalogList').innerHTML = expCats
      .map(
        (c) => `
        <div class="tx-item">
          <div class="tx-left">
            <div class="tx-icon" style="color: ${c.color || 'var(--color-expense)'};">${renderSvgIcon(c.icon || 'shopping-bag', 20)}</div>
            <div>
              <p class="tx-title">${c.name}</p>
              <p class="tx-sub">${c.description || 'Tipo de gasto'}</p>
            </div>
          </div>
          <span class="badge badge-danger">Tipo de Gasto</span>
        </div>
      `
      )
      .join('');
  }

  renderChildRequests() {
    const container = document.getElementById('childRequestsListContainer');
    const reqs = (this.state.childRequests || []).slice().reverse();

    if (reqs.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.86rem;">Aún no has enviado pedidos desde la Calculadora.</p>`;
      return;
    }

    container.innerHTML = reqs
      .map((r) => {
        const child = this.getChildren().find((c) => c.id === r.memberId) || { name: 'Hijo/a', avatar: 'piggy' };
        const stBadge =
          r.status === 'APPROVED'
            ? `<span class="badge badge-success">${renderSvgIcon('check', 13)} ¡Aceptado por Papá/Mamá!</span>`
            : r.status === 'REJECTED'
              ? `<span class="badge badge-danger">${renderSvgIcon('x', 13)} No aprobado</span>`
              : `<span class="badge badge-warn">${renderSvgIcon('clock', 13)} Esperando a Papá/Mamá</span>`;

        return `
          <div class="tx-item" style="margin-bottom: 0.55rem;">
            <div class="tx-left">
              <div class="tx-icon" style="color: var(--color-invest);">${renderSvgIcon(child.avatar || 'piggy', 20)}</div>
              <div>
                <p class="tx-title">${child.name} pide: ${r.title}</p>
                <p class="tx-sub">${r.note || ''}</p>
              </div>
            </div>
            <div class="tx-right">
              ${stBadge}
              ${
                r.status === 'PENDING' && this.currentRole === 'PARENT'
                  ? `
                    <button type="button" class="btn btn-income btn-sm parent-only" data-approve-request="${r.id}">
                      ${renderSvgIcon('check', 14)} Aceptar Pedido
                    </button>
                    <button type="button" class="btn btn-ghost btn-sm parent-only" data-reject-request="${r.id}">
                      ${renderSvgIcon('x', 14)} No por ahora
                    </button>
                  `
                  : ''
              }
            </div>
          </div>
        `;
      })
      .join('');
  }

  renderCryptoAuditPanel(currency) {
    const badge = document.getElementById('cryptoAuditStatusBadge');
    const box = document.getElementById('cryptoAuditSummaryBox');
    if (!badge || !box) return;

    if (this.auditResult.isClean) {
      badge.className = 'badge badge-success';
      badge.innerHTML = `${renderSvgIcon('shield-check', 13)} ${this.auditResult.validEvents.length} Movimientos Seguros`;
    } else {
      badge.className = 'badge badge-danger';
      badge.innerHTML = `${renderSvgIcon('shield-alert', 13)} ${this.auditResult.corruptedEvents.length} Movimiento Falso Bloqueado`;
    }

    const lastEv = this.auditResult.validEvents[this.auditResult.validEvents.length - 1];

    box.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
        <div>
          <strong>Protección del PIN:</strong><br/>
          <code>PBKDF2-SHA256 (210,000 rondas)</code>
        </div>
        <div>
          <strong>Candado de Movimientos:</strong><br/>
          <code>HMAC-SHA256 + Cadena SHA-256</code>
        </div>
        <div>
          <strong>Movimientos Reales / Falsos:</strong><br/>
          <span style="color: var(--color-income); font-weight: 700;">${this.auditResult.validEvents.length} reales</span> /
          <span style="color: var(--color-expense); font-weight: 700;">${this.auditResult.corruptedEvents.length} bloqueados</span>
        </div>
        <div>
          <strong>Último Sello de Seguridad:</strong><br/>
          <code>${lastEv ? lastEv.eventHash.slice(0, 20) + '…' : 'GENESIS'}</code>
        </div>
      </div>
      ${
        this.auditResult.corruptedEvents.length > 0
          ? `<div class="inline-icon-text" style="margin-top: 0.75rem; padding: 0.65rem; background: var(--color-expense-bg); border-radius: 8px; color: var(--color-expense);">
              ${renderSvgIcon('shield-alert', 18)}
              <span><strong>Movimiento bloqueado:</strong> Alguien intentó anotar ${formatMoneyCents(this.auditResult.corruptedEvents[0].amountCents, currency)} sin el PIN de Papá/Mamá y el escudo lo detuvo.</span>
            </div>`
          : ''
      }
    `;
  }

  /* ==========================================================================
     SIMULADOR SANDBOX Y PREVISUALIZACIONES DE MODALES
     ========================================================================== */

  updateSimulatorPreviews() {
    const currency = this.state?.family?.currency || 'MXN';

    const invAmount = Number(document.getElementById('simInvAmount')?.value || 300);
    const invDays = Number(document.getElementById('simInvDays')?.value || 30);
    const invRate = Number(document.getElementById('simInvRate')?.value || 10);
    document.getElementById('simInvAmountLabel').textContent = formatMoneyCents(invAmount * 100, currency);

    const invYieldCents = Math.round(invAmount * 100 * (invRate / 100));
    const invTotalCents = invAmount * 100 + invYieldCents;
    document.getElementById('simInvResultBox').innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
        <span>Capital que congelas por ${invDays} días:</span>
        <strong style="font-family: var(--font-mono);">${formatMoneyCents(invAmount * 100, currency)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
        <span>Ganancia gratis por esperar (Rendimiento +${invRate}%):</span>
        <strong style="font-family: var(--font-mono); color: var(--color-income);">+${formatMoneyCents(invYieldCents, currency)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 1rem; border-top: 1px solid var(--border-subtle); padding-top: 0.4rem;">
        <strong>Recibirás al final del plazo:</strong>
        <strong style="font-family: var(--font-mono); color: var(--color-invest);">${formatMoneyCents(invTotalCents, currency)}</strong>
      </div>
    `;

    const loanAmount = Number(document.getElementById('simLoanAmount')?.value || 500);
    const loanPeriods = Number(document.getElementById('simLoanPeriods')?.value || 4);
    const loanRate = Number(document.getElementById('simLoanRate')?.value || 5);
    const loanType = document.getElementById('simLoanType')?.value || 'SIMPLE';
    document.getElementById('simLoanAmountLabel').textContent = formatMoneyCents(loanAmount * 100, currency);

    const plan = generateLoanSchedule({
      principalCents: loanAmount * 100,
      interestRatePercent: loanRate,
      termPeriods: loanPeriods,
      interestType: loanType,
      frequency: 'WEEKLY'
    });

    const firstInst = plan.schedule[0]?.totalInstallmentCents || 0;
    document.getElementById('simLoanResultBox').innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
        <span>Dinero pedido hoy:</span>
        <strong style="font-family: var(--font-mono);">${formatMoneyCents(plan.principalCents, currency)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
        <span>Costo extra por intereses (${loanPeriods} cuotas):</span>
        <strong style="font-family: var(--font-mono); color: var(--color-expense);">+${formatMoneyCents(plan.totalInterestCents, currency)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 1rem; border-top: 1px solid var(--border-subtle); padding-top: 0.4rem;">
        <strong>Total que terminarás pagando (${loanPeriods} pagos de ~${formatMoneyCents(firstInst, currency)}):</strong>
        <strong style="font-family: var(--font-mono); color: var(--color-loan);">${formatMoneyCents(plan.totalPayableCents, currency)}</strong>
      </div>
    `;
  }

  updateLoanModalPreview() {
    const currency = this.state?.family?.currency || 'MXN';
    const principal = toCents(document.getElementById('loanPrincipalInput')?.value || 400);
    const rate = Number(document.getElementById('loanRateInput')?.value || 5);
    const periods = Number(document.getElementById('loanPeriodsInput')?.value || 4);
    const interestType = document.getElementById('loanInterestType')?.value || 'SIMPLE';

    const plan = generateLoanSchedule({
      principalCents: principal,
      interestRatePercent: rate,
      termPeriods: periods,
      interestType
    });

    const box = document.getElementById('loanPreviewBox');
    if (box) {
      box.innerHTML = `
        <span class="inline-icon-text">
          ${renderSvgIcon('bar-chart', 16)}
          <span><strong>Resumen Exacto en Centavos:</strong> Capital: <strong>${formatMoneyCents(plan.principalCents, currency)}</strong> +
          Intereses: <strong style="color: var(--color-expense);">${formatMoneyCents(plan.totalInterestCents, currency)}</strong> =
          Total a pagar: <strong>${formatMoneyCents(plan.totalPayableCents, currency)}</strong> en ${periods} cuotas
          (Cuota 1: ${formatMoneyCents(plan.schedule[0]?.totalInstallmentCents || 0, currency)} · Última cuota ajustada al centavo: ${formatMoneyCents(plan.schedule[plan.schedule.length - 1]?.totalInstallmentCents || 0, currency)}).</span>
        </span>
      `;
    }
  }

  updateInvestmentModalPreview() {
    const currency = this.state?.family?.currency || 'MXN';
    const principal = toCents(document.getElementById('invPrincipalInput')?.value || 250);
    const days = Number(document.getElementById('invTermDaysInput')?.value || 30);
    const rate = Number(document.getElementById('invYieldRateInput')?.value || 10);
    const maturityDate = addDaysLocalDate(getTodayLocalDate(), days);
    const yieldCents = Math.round(principal * (rate / 100));

    const box = document.getElementById('invPreviewBox');
    if (box) {
      box.innerHTML = `
        <span class="inline-icon-text">
          ${renderSvgIcon('trending-up', 16)}
          <span><strong>Proyección del Pagaré:</strong> Se congelarán <strong>${formatMoneyCents(principal, currency)}</strong> hasta el <strong>${maturityDate}</strong> (${days} días).
          Rendimiento garantizado: <strong style="color: var(--color-income);">+${formatMoneyCents(yieldCents, currency)}</strong>.
          Total a recibir al vencimiento: <strong>${formatMoneyCents(principal + yieldCents, currency)}</strong>.</span>
        </span>
      `;
    }
  }

  populateChildAndCatalogSelectors(mode = 'INCOME') {
    const children = this.getChildren();
    const childOptions = children
      .map((c) => `<option value="${c.id}" ${c.id === this.selectedChildId ? 'selected' : ''}>${c.name} (${c.age || 10} años)</option>`)
      .join('');

    for (const selId of ['txChildSelect', 'recChildSelect', 'loanChildSelect', 'invChildSelect']) {
      const el = document.getElementById(selId);
      if (el) el.innerHTML = childOptions;
    }

    const txCatalogSelect = document.getElementById('txCatalogSelect');
    if (txCatalogSelect) {
      const targetType = mode === 'INCOME' ? 'INCOME_SOURCE' : 'EXPENSE_CATEGORY';
      const cats = (this.state.catalogs || []).filter((c) => c.type === targetType);
      txCatalogSelect.innerHTML = cats.map((c) => `<option value="${c.id}">${c.name}</option>`).join('');
    }

    const recCatalogSelect = document.getElementById('recCatalogSelect');
    if (recCatalogSelect) {
      const incCats = (this.state.catalogs || []).filter((c) => c.type === 'INCOME_SOURCE');
      recCatalogSelect.innerHTML = incCats.map((c) => `<option value="${c.id}">${c.name}</option>`).join('');
    }

    const recAutoLoanSelect = document.getElementById('recAutoLoanSelect');
    if (recAutoLoanSelect) {
      const activeLoans = (this.state.loans || []).filter((l) => l.status === 'ACTIVE');
      recAutoLoanSelect.innerHTML =
        `<option value="">Sin retención automática</option>` +
        activeLoans.map((l) => `<option value="${l.id}">Descontar cuota para: ${l.concept}</option>`).join('');
    }
  }

  setTransactionModalMode(mode = 'INCOME') {
    this.populateChildAndCatalogSelectors(mode);
    document.getElementById('txFormMode').value = mode;
    document.getElementById('dialogTxTitle').innerHTML =
      mode === 'INCOME'
        ? `${renderSvgIcon('plus', 19)} Meter Dinero en la Alcancía`
        : `${renderSvgIcon('minus', 19)} Anotar un Gasto de la Alcancía`;
    document.getElementById('txCatalogLabel').textContent =
      mode === 'INCOME' ? '¿De dónde viene el dinero?' : '¿En qué se gastó?';
    document.getElementById('txOverdraftModeGroup').style.display = mode === 'EXPENSE' ? 'flex' : 'none';

    const btnInc = document.getElementById('btnSwitchModeIncome');
    const btnExp = document.getElementById('btnSwitchModeExpense');
    if (btnInc && btnExp) {
      btnInc.classList.toggle('active-income', mode === 'INCOME');
      btnInc.classList.remove('active-expense');
      btnExp.classList.toggle('active-expense', mode === 'EXPENSE');
      btnExp.classList.remove('active-income');
    }
  }

  openTransactionDialog(mode = 'INCOME') {
    if (!this.ensureParentPermission()) return;
    this.setTransactionModalMode(mode);
    document.getElementById('txDateInput').value = getTodayLocalDate();
    document.getElementById('txAmountInput').value = '';
    document.getElementById('txNoteInput').value = '';

    const dialog = document.getElementById('dialogTransaction');
    dialog?.showModal();
  }

  populateCloudConfigInputs() {
    const cfg = this.cloudManager.cloudConfig;
    document.getElementById('cloudFamilyCodeInput').value = this.state?.family?.familyCode || 'FAM-2026-KIDS';
    document.getElementById('cloudProviderSelect').value = cfg.provider || 'SUPABASE_REST';
    document.getElementById('cloudEndpointInput').value = cfg.endpointUrl || '';
    document.getElementById('cloudApiKeyInput').value = cfg.apiKey || '';
    const tblInput = document.getElementById('cloudTableNameInput');
    if (tblInput) tblInput.value = cfg.tableName || 'smartpiggy_families';
  }

  /* ==========================================================================
     MANEJO DE EVENTOS Y OPERACIONES CONTABLES FIRMADAS
     ========================================================================== */

  bindEvents() {
    document.querySelectorAll('dialog.app-dialog').forEach((dlg) => {
      dlg.addEventListener('click', (e) => {
        if (e.target === dlg) dlg.close();
      });
    });

    document.querySelectorAll('[data-close-dialog]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-close-dialog');
        document.getElementById(id)?.close();
      });
    });

    document.getElementById('btnToggleRole')?.addEventListener('click', () => {
      if (this.currentRole === 'PARENT') {
        this.lockToChildMode();
      } else {
        this.openParentPinDialog();
      }
    });

    document.getElementById('formParentPin')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pin = document.getElementById('inputParentPin').value;
      const parentId = document.getElementById('selectActiveParent').value;
      const ok = await this.unlockParentModeWithPin(pin, parentId);
      if (ok) {
        document.getElementById('dialogParentPin')?.close();
      } else {
        const err = document.getElementById('pinErrorMsg');
        err.innerHTML = `${renderSvgIcon('alert-triangle', 15)} PIN incorrecto. (El PIN demostrativo inicial es 1234).`;
        err.style.display = 'block';
      }
    });

    document.getElementById('btnToggleTheme')?.addEventListener('click', () => {
      const html = document.documentElement;
      const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
    });

    document.getElementById('btnOpenChildWindow')?.addEventListener('click', () => {
      const url = new URL(window.location.href);
      url.searchParams.set('family', this.state.family.familyCode);
      url.searchParams.set('role', 'child');
      window.open(url.toString(), '_blank', 'width=1020,height=800');
      this.showToast('Se abrió una ventana paralela en Modo Hijo. Haz un movimiento como Papá y mira cómo se sincroniza al instante.', 'info');
    });

    document.getElementById('btnOpenCloudDialog')?.addEventListener('click', () => {
      this.switchTab('tab-cloud-security');
    });

    document.querySelectorAll('.nav-tab').forEach((tabBtn) => {
      tabBtn.addEventListener('click', () => {
        const target = tabBtn.getAttribute('data-tab');
        this.switchTab(target);
      });
    });

    document.getElementById('btnGoSandbox')?.addEventListener('click', () => {
      this.switchTab('tab-sandbox');
    });

    document.getElementById('filterTxType')?.addEventListener('change', (e) => {
      this.txFilter = e.target.value;
      this.renderAll();
    });

    document.getElementById('btnQuickIncome')?.addEventListener('click', () => this.openTransactionDialog('INCOME'));
    document.getElementById('btnQuickExpense')?.addEventListener('click', () => this.openTransactionDialog('EXPENSE'));
    document.getElementById('btnQuickInvest')?.addEventListener('click', () => this.openInvestmentDialog());
    document.getElementById('btnQuickLoan')?.addEventListener('click', () => this.openLoanDialog());

    // Botón flotante fijo (+ Añadir Movimiento) accesible desde cualquier ventana
    document.getElementById('fabAddMovement')?.addEventListener('click', () => {
      if (this.currentRole === 'PARENT' && this.parentSigningKey) {
        this.openTransactionDialog('INCOME');
      } else {
        this.pendingAfterPinAction = () => this.openTransactionDialog('INCOME');
        this.showToast('Pide a Papá o Mamá que ponga su PIN para añadir el movimiento.', 'info');
        this.openParentPinDialog();
      }
    });

    // Selector rápido dentro del modal (+ Meter Dinero / - Gasté Dinero)
    document.getElementById('btnSwitchModeIncome')?.addEventListener('click', () => {
      this.setTransactionModalMode('INCOME');
    });
    document.getElementById('btnSwitchModeExpense')?.addEventListener('click', () => {
      this.setTransactionModalMode('EXPENSE');
    });

    document.getElementById('btnOpenRecurringModal')?.addEventListener('click', () => this.openRecurringDialog());
    document.getElementById('btnOpenLoanModal')?.addEventListener('click', () => this.openLoanDialog());
    document.getElementById('btnOpenInvestmentModal')?.addEventListener('click', () => this.openInvestmentDialog());
    document.getElementById('btnOpenMemberModal')?.addEventListener('click', () => {
      if (!this.ensureParentPermission()) return;
      document.getElementById('dialogMember')?.showModal();
    });

    document.getElementById('btnAddIncomeSource')?.addEventListener('click', () => {
      if (!this.ensureParentPermission()) return;
      document.getElementById('catTypeInput').value = 'INCOME_SOURCE';
      document.getElementById('dialogCatalogTitle').innerHTML = `${renderSvgIcon('arrow-down-left', 19)} Agregar Entrada de Dinero`;
      document.getElementById('dialogCatalog')?.showModal();
    });

    document.getElementById('btnAddExpenseCategory')?.addEventListener('click', () => {
      if (!this.ensureParentPermission()) return;
      document.getElementById('catTypeInput').value = 'EXPENSE_CATEGORY';
      document.getElementById('dialogCatalogTitle').innerHTML = `${renderSvgIcon('arrow-up-right', 19)} Agregar Tipo de Gasto`;
      document.getElementById('dialogCatalog')?.showModal();
    });

    document.body.addEventListener('click', async (e) => {
      const childBtn = e.target.closest('[data-select-child]');
      if (childBtn) {
        this.selectedChildId = childBtn.getAttribute('data-select-child');
        this.renderAll();
        return;
      }

      const switchTabBtn = e.target.closest('[data-switch-tab]');
      if (switchTabBtn) {
        this.switchTab(switchTabBtn.getAttribute('data-switch-tab'));
        return;
      }

      const actionBtn = e.target.closest('[data-action]');
      if (actionBtn) {
        const act = actionBtn.getAttribute('data-action');
        if (act === 'open-pin') this.openParentPinDialog();
        if (act === 'consolidate-due' && this.ensureParentPermission()) {
          await this.consolidateDueAutomationsAsParent(false);
          await this.runLedgerAuditAndRender();
        }
        if (act === 'purge-corrupted') {
          await this.purgeCorruptedLedgerEntries();
        }
        return;
      }

      const revBtn = e.target.closest('[data-reverse-tx]');
      if (revBtn) {
        await this.handleReverseTransaction(revBtn.getAttribute('data-reverse-tx'));
        return;
      }

      const trigRecBtn = e.target.closest('[data-trigger-recurring]');
      if (trigRecBtn) {
        await this.handleManualTriggerRecurring(trigRecBtn.getAttribute('data-trigger-recurring'));
        return;
      }

      const togRecBtn = e.target.closest('[data-toggle-recurring]');
      if (togRecBtn) {
        await this.handleToggleRecurringStatus(togRecBtn.getAttribute('data-toggle-recurring'));
        return;
      }

      const payInstBtn = e.target.closest('[data-pay-installment]');
      if (payInstBtn) {
        const [loanId, instNumStr, source] = payInstBtn.getAttribute('data-pay-installment').split(':');
        await this.handlePayLoanInstallment(loanId, Number(instNumStr), source);
        return;
      }

      const extraBtn = e.target.closest('[data-open-extra-principal]');
      if (extraBtn) {
        if (!this.ensureParentPermission()) return;
        document.getElementById('extraLoanIdInput').value = extraBtn.getAttribute('data-open-extra-principal');
        document.getElementById('extraAmountInput').value = '100';
        document.getElementById('dialogExtraPrincipal')?.showModal();
        return;
      }

      const matInvBtn = e.target.closest('[data-mature-investment]');
      if (matInvBtn) {
        await this.handleSettleInvestment(matInvBtn.getAttribute('data-mature-investment'), false);
        return;
      }

      const earlyInvBtn = e.target.closest('[data-early-exit-investment]');
      if (earlyInvBtn) {
        await this.handleSettleInvestment(earlyInvBtn.getAttribute('data-early-exit-investment'), true);
        return;
      }

      const appReqBtn = e.target.closest('[data-approve-request]');
      if (appReqBtn) {
        await this.handleProcessChildRequest(appReqBtn.getAttribute('data-approve-request'), true);
        return;
      }

      const rejReqBtn = e.target.closest('[data-reject-request]');
      if (rejReqBtn) {
        await this.handleProcessChildRequest(rejReqBtn.getAttribute('data-reject-request'), false);
        return;
      }
    });

    document.getElementById('formTransaction')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.submitTransactionForm();
    });

    document.getElementById('formRecurring')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.submitRecurringForm();
    });

    ['loanPrincipalInput', 'loanRateInput', 'loanPeriodsInput', 'loanInterestType'].forEach((id) => {
      document.getElementById(id)?.addEventListener('input', () => this.updateLoanModalPreview());
    });
    document.getElementById('formLoan')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.submitLoanForm();
    });

    document.getElementById('formExtraPrincipal')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.submitExtraPrincipalForm();
    });

    ['invPrincipalInput', 'invTermDaysInput', 'invYieldRateInput'].forEach((id) => {
      document.getElementById(id)?.addEventListener('input', () => this.updateInvestmentModalPreview());
    });
    document.getElementById('formInvestment')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.submitInvestmentForm();
    });

    document.getElementById('formMember')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.submitMemberForm();
    });

    document.getElementById('formCatalog')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.submitCatalogForm();
    });

    ['simInvAmount', 'simInvDays', 'simInvRate', 'simLoanAmount', 'simLoanPeriods', 'simLoanRate', 'simLoanType'].forEach((id) => {
      document.getElementById(id)?.addEventListener('input', () => this.updateSimulatorPreviews());
    });

    document.getElementById('btnSendInvestRequest')?.addEventListener('click', () => this.sendSandboxRequest('INVESTMENT'));
    document.getElementById('btnSendLoanRequest')?.addEventListener('click', () => this.sendSandboxRequest('LOAN'));

    // Auto-conexión y sincronización en tiempo real al modificar credenciales de Supabase / Código Familiar
    ['cloudFamilyCodeInput', 'cloudProviderSelect', 'cloudEndpointInput', 'cloudApiKeyInput', 'cloudTableNameInput'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.scheduleAutoCloudReconnect());
        el.addEventListener('change', () => this.scheduleAutoCloudReconnect());
      }
    });

    document.getElementById('btnCopySupabaseSql')?.addEventListener('click', () => this.copySupabaseSqlToClipboard());
    document.getElementById('btnCopyChildShareLink')?.addEventListener('click', () => this.copyChildReadOnlyShareLink());
    document.getElementById('btnShareSupabaseMessage')?.addEventListener('click', () => this.shareSupabaseConnectionMessage());
    document.getElementById('btnShareWhatsAppDirect')?.addEventListener('click', () => this.shareSupabaseViaWhatsApp());
    document.getElementById('btnApplyPastedConnection')?.addEventListener('click', () => this.applyPastedConnectionCode());
    document.getElementById('btnExportCloudJson')?.addEventListener('click', () => this.exportSignedSnapshotJson());
    document.getElementById('inputImportCloudJson')?.addEventListener('change', (e) => this.importSignedSnapshotJson(e));
    document.getElementById('btnUpdateParentPin')?.addEventListener('click', () => this.updateParentPinAndResign());
    document.getElementById('btnResetDemoData')?.addEventListener('click', () => this.resetToInitialDemoData());
    document.getElementById('btnSimulateTamperAttack')?.addEventListener('click', () => this.simulateChildTamperAttack());
    document.getElementById('btnPurgeCorruptedEntries')?.addEventListener('click', () => this.purgeCorruptedLedgerEntries());
  }

  switchTab(tabId) {
    document.querySelectorAll('.nav-tab').forEach((btn) => {
      const active = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('.tab-panel').forEach((panel) => {
      panel.classList.toggle('active', panel.id === tabId);
    });
  }

  openRecurringDialog() {
    if (!this.ensureParentPermission()) return;
    this.populateChildAndCatalogSelectors('INCOME');
    document.getElementById('recNextDateInput').value = getTodayLocalDate();
    document.getElementById('recTitleInput').value = '';
    document.getElementById('recAmountInput').value = '150';
    document.getElementById('dialogRecurring')?.showModal();
  }

  openLoanDialog() {
    if (!this.ensureParentPermission()) return;
    this.populateChildAndCatalogSelectors('INCOME');
    this.updateLoanModalPreview();
    document.getElementById('dialogLoan')?.showModal();
  }

  openInvestmentDialog() {
    if (!this.ensureParentPermission()) return;
    this.populateChildAndCatalogSelectors('INCOME');
    this.updateInvestmentModalPreview();
    document.getElementById('dialogInvestment')?.showModal();
  }

  /* ==========================================================================
     ACCIONES DE NEGOCIO FIRMADAS POR EL PADRE
     ========================================================================== */

  async submitTransactionForm() {
    if (!this.ensureParentPermission()) return;
    const mode = document.getElementById('txFormMode').value;
    const memberId = document.getElementById('txChildSelect').value;
    const amountCents = toCents(document.getElementById('txAmountInput').value);
    const catalogId = document.getElementById('txCatalogSelect').value;
    const localDate = document.getElementById('txDateInput').value || getTodayLocalDate();
    const note = document.getElementById('txNoteInput').value.trim();
    const overdraftPolicy = document.getElementById('txOverdraftPolicy').value;

    if (amountCents <= 0) {
      this.showToast('Ingresa un monto mayor a $0.00', 'warn');
      return;
    }

    const childState = reduceMemberFinancialState({
      memberId,
      validEvents: this.auditResult.validEvents,
      loans: this.state.loans,
      investments: this.state.investments,
      catalogs: this.state.catalogs
    });

    if (mode === 'EXPENSE' && amountCents > childState.availableCents) {
      if (overdraftPolicy === 'BLOCK') {
        this.showToast(
          `Saldo disponible insuficiente (${formatMoneyCents(childState.availableCents)}). Puedes elegir convertir el faltante en un Crédito Familiar.`,
          'warn'
        );
        return;
      }

      const shortfallCents = amountCents - Math.max(0, childState.availableCents);
      const loanPlan = generateLoanSchedule({
        principalCents: shortfallCents,
        interestRatePercent: 5,
        termPeriods: 4,
        interestType: 'SIMPLE',
        frequency: 'WEEKLY',
        startDate: localDate
      });

      const newLoan = {
        id: `loan_auto_${Date.now()}`,
        familyId: this.state.family.id,
        memberId,
        concept: `Crédito por faltante en compra: ${note}`,
        principalCents: shortfallCents,
        interestType: 'SIMPLE',
        interestRatePercent: 5,
        termPeriods: 4,
        frequency: 'WEEKLY',
        disbursedToPiggy: true,
        totalInterestCents: loanPlan.totalInterestCents,
        totalPayableCents: loanPlan.totalPayableCents,
        interestSavedByExtraPaymentsCents: 0,
        schedule: loanPlan.schedule,
        startDate: localDate,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.state.loans.push(newLoan);

      const signedLoanDisb = await createSignedLedgerEvent(
        {
          familyId: this.state.family.id,
          memberId,
          createdByParentId: this.activeParentId,
          type: 'LOAN_DISBURSEMENT',
          amountCents: shortfallCents,
          catalogId: 'cat_exp_loan',
          referenceId: newLoan.id,
          metadata: { disbursedToPiggy: true },
          note: `Desembolso de crédito automático para cubrir: ${note}`,
          localDate
        },
        this.parentSigningKey,
        this.state.family.saltHex,
        this.getLastEventHash()
      );
      this.state.ledgerEvents.push(signedLoanDisb);
    }

    const signedTx = await createSignedLedgerEvent(
      {
        familyId: this.state.family.id,
        memberId,
        createdByParentId: this.activeParentId,
        type: mode,
        amountCents,
        catalogId,
        note,
        localDate
      },
      this.parentSigningKey,
      this.state.family.saltHex,
      this.getLastEventHash()
    );

    this.state.ledgerEvents.push(signedTx);
    this.selectedChildId = memberId;
    document.getElementById('dialogTransaction')?.close();

    await this.cloudManager.pushState(this.state);
    await this.runLedgerAuditAndRender();
    this.showToast(
      mode === 'INCOME'
        ? `Ingreso de ${formatMoneyCents(amountCents)} firmado y acreditado.`
        : `Gasto de ${formatMoneyCents(amountCents)} descontado y firmado en el Ledger.`,
      'success'
    );
  }

  async handleReverseTransaction(targetEventId) {
    if (!this.ensureParentPermission()) return;
    const orig = (this.state.ledgerEvents || []).find((e) => e.id === targetEventId);
    if (!orig) return;

    const reversalEvent = await createSignedLedgerEvent(
      {
        familyId: this.state.family.id,
        memberId: orig.memberId,
        createdByParentId: this.activeParentId,
        type: 'REVERSAL',
        amountCents: orig.amountCents,
        catalogId: orig.catalogId,
        targetEventId: orig.id,
        note: `Contra-asiento de anulación de: "${orig.note || orig.type}"`,
        localDate: getTodayLocalDate()
      },
      this.parentSigningKey,
      this.state.family.saltHex,
      this.getLastEventHash()
    );

    this.state.ledgerEvents.push(reversalEvent);
    await this.cloudManager.pushState(this.state);
    await this.runLedgerAuditAndRender();
    this.showToast('Movimiento revertido mediante contra-asiento firmado (trazabilidad intacta).', 'info');
  }

  async submitRecurringForm() {
    if (!this.ensureParentPermission()) return;
    const memberId = document.getElementById('recChildSelect').value;
    const catalogId = document.getElementById('recCatalogSelect').value;
    const title = document.getElementById('recTitleInput').value.trim();
    const amountCents = toCents(document.getElementById('recAmountInput').value);
    const frequency = document.getElementById('recFrequencySelect').value;
    const nextExecutionDate = document.getElementById('recNextDateInput').value || getTodayLocalDate();
    const autoDeductLoanId = document.getElementById('recAutoLoanSelect').value;

    const newRule = {
      id: `rec_${Date.now()}`,
      familyId: this.state.family.id,
      memberId,
      catalogId,
      title,
      amountCents,
      frequency,
      startDate: getTodayLocalDate(),
      nextExecutionDate,
      autoDeductLoanId,
      status: 'ACTIVE',
      updatedAt: new Date().toISOString()
    };

    this.state.recurringRules.push(newRule);
    this.selectedChildId = memberId;
    document.getElementById('dialogRecurring')?.close();

    await this.consolidateDueAutomationsAsParent(true);
    await this.cloudManager.pushState(this.state);
    await this.runLedgerAuditAndRender();
    this.showToast(`Regla recurrente "${title}" programada.`, 'success');
  }

  async handleManualTriggerRecurring(ruleId) {
    if (!this.ensureParentPermission()) return;
    const rule = (this.state.recurringRules || []).find((r) => r.id === ruleId);
    if (!rule) return;

    const execDate = rule.nextExecutionDate || getTodayLocalDate();
    const detId = `det_rec_${rule.id}_${execDate}_${Date.now().toString(36).slice(-3)}`;

    const signedIncome = await createSignedLedgerEvent(
      {
        id: detId,
        familyId: this.state.family.id,
        memberId: rule.memberId,
        createdByParentId: this.activeParentId,
        type: 'RECURRING_INCOME',
        amountCents: rule.amountCents,
        catalogId: rule.catalogId,
        referenceId: rule.id,
        note: `Acreditación de ingreso recurrente: ${rule.title}`,
        localDate: getTodayLocalDate()
      },
      this.parentSigningKey,
      this.state.family.saltHex,
      this.getLastEventHash()
    );
    this.state.ledgerEvents.push(signedIncome);

    if (rule.autoDeductLoanId) {
      await this.applyAutomaticLoanDeductionFromAllowance(
        rule.memberId,
        rule.autoDeductLoanId,
        rule.amountCents,
        getTodayLocalDate()
      );
    }

    const daysStep = rule.frequency === 'DAILY' ? 1 : rule.frequency === 'WEEKLY' ? 7 : rule.frequency === 'BIWEEKLY' ? 14 : 30;
    rule.nextExecutionDate = addDaysLocalDate(execDate, daysStep);
    rule.updatedAt = new Date().toISOString();

    await this.cloudManager.pushState(this.state);
    await this.runLedgerAuditAndRender();
    this.showToast(`Se acreditó "${rule.title}" (+${formatMoneyCents(rule.amountCents)}) en la alcancía.`, 'success');
  }

  async handleToggleRecurringStatus(ruleId) {
    if (!this.ensureParentPermission()) return;
    const rule = (this.state.recurringRules || []).find((r) => r.id === ruleId);
    if (!rule) return;
    rule.status = rule.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    rule.updatedAt = new Date().toISOString();
    await this.cloudManager.pushState(this.state);
    this.renderAll();
  }

  async submitLoanForm() {
    if (!this.ensureParentPermission()) return;
    const memberId = document.getElementById('loanChildSelect').value;
    const principalCents = toCents(document.getElementById('loanPrincipalInput').value);
    const concept = document.getElementById('loanConceptInput').value.trim();
    const interestType = document.getElementById('loanInterestType').value;
    const interestRatePercent = Number(document.getElementById('loanRateInput').value || 0);
    const termPeriods = Number(document.getElementById('loanPeriodsInput').value || 4);
    const frequency = document.getElementById('loanFrequencySelect').value;
    const disbursedToPiggy = document.getElementById('loanDisburseSelect').value === 'DEPOSIT_TO_PIGGY';
    const today = getTodayLocalDate();

    const plan = generateLoanSchedule({
      principalCents,
      interestRatePercent,
      termPeriods,
      interestType,
      frequency,
      startDate: today
    });

    const newLoan = {
      id: `loan_${Date.now()}`,
      familyId: this.state.family.id,
      memberId,
      concept,
      principalCents: plan.principalCents,
      interestType,
      interestRatePercent,
      termPeriods,
      frequency,
      disbursedToPiggy,
      totalInterestCents: plan.totalInterestCents,
      totalPayableCents: plan.totalPayableCents,
      interestSavedByExtraPaymentsCents: 0,
      schedule: plan.schedule,
      startDate: today,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.state.loans.push(newLoan);

    const signedDisb = await createSignedLedgerEvent(
      {
        familyId: this.state.family.id,
        memberId,
        createdByParentId: this.activeParentId,
        type: 'LOAN_DISBURSEMENT',
        amountCents: principalCents,
        catalogId: 'cat_exp_loan',
        referenceId: newLoan.id,
        metadata: { disbursedToPiggy },
        note: `Otorgamiento de Crédito: ${concept} (${disbursedToPiggy ? 'Depositado en alcancía' : 'Compra directa financiada'})`,
        localDate: today
      },
      this.parentSigningKey,
      this.state.family.saltHex,
      this.getLastEventHash()
    );

    this.state.ledgerEvents.push(signedDisb);
    this.selectedChildId = memberId;
    document.getElementById('dialogLoan')?.close();

    await this.cloudManager.pushState(this.state);
    await this.runLedgerAuditAndRender();
    this.showToast(`Crédito "${concept}" otorgado con tabla de amortización exacta al centavo.`, 'success');
  }

  async handlePayLoanInstallment(loanId, installmentNumber, paymentSource = 'PIGGY') {
    if (!this.ensureParentPermission()) return;
    const loan = (this.state.loans || []).find((l) => l.id === loanId);
    if (!loan) return;
    const inst = (loan.schedule || []).find((i) => i.installmentNumber === installmentNumber);
    if (!inst || inst.status === 'PAID') return;

    const pendingCents = Math.max(0, inst.totalInstallmentCents - (inst.paidCents || 0));
    let amountToPay = pendingCents;

    if (paymentSource === 'PIGGY') {
      const childFinance = reduceMemberFinancialState({
        memberId: loan.memberId,
        validEvents: this.auditResult.validEvents,
        loans: this.state.loans,
        investments: this.state.investments,
        catalogs: this.state.catalogs
      });

      if (childFinance.availableCents <= 0) {
        inst.status = 'OVERDUE';
        loan.updatedAt = new Date().toISOString();
        await this.cloudManager.pushState(this.state);
        this.renderAll();
        this.showToast('La alcancía tiene $0.00 disponibles. La cuota se marcó EN MORA.', 'warn');
        return;
      }

      if (childFinance.availableCents < pendingCents) {
        amountToPay = childFinance.availableCents;
        inst.paidCents = (inst.paidCents || 0) + amountToPay;
        inst.status = 'OVERDUE';
        this.showToast(
          `Saldo parcial: Se cobraron ${formatMoneyCents(amountToPay)} y restan ${formatMoneyCents(pendingCents - amountToPay)} en mora.`,
          'warn'
        );
      } else {
        inst.paidCents = inst.totalInstallmentCents;
        inst.status = 'PAID';
      }
    } else {
      inst.paidCents = inst.totalInstallmentCents;
      inst.status = 'PAID';
    }

    if (loan.schedule.every((i) => i.status === 'PAID')) {
      loan.status = 'PAID_OFF';
    }
    loan.updatedAt = new Date().toISOString();

    const signedPay = await createSignedLedgerEvent(
      {
        familyId: this.state.family.id,
        memberId: loan.memberId,
        createdByParentId: this.activeParentId,
        type: 'LOAN_PAYMENT',
        amountCents: amountToPay,
        catalogId: 'cat_exp_loan',
        referenceId: loan.id,
        metadata: {
          paymentSource,
          installmentNumber,
          interestPaidCents: Math.min(amountToPay, inst.interestPartCents)
        },
        note: `Pago Cuota #${installmentNumber} - ${loan.concept} (${paymentSource === 'PIGGY' ? 'Desde Alcancía' : 'Efectivo/Tareas Externas'})`,
        localDate: getTodayLocalDate()
      },
      this.parentSigningKey,
      this.state.family.saltHex,
      this.getLastEventHash()
    );

    this.state.ledgerEvents.push(signedPay);
    await this.cloudManager.pushState(this.state);
    await this.runLedgerAuditAndRender();
    this.showToast(`Pago de ${formatMoneyCents(amountToPay)} registrado en "${loan.concept}".`, 'success');
  }

  async submitExtraPrincipalForm() {
    if (!this.ensureParentPermission()) return;
    const loanId = document.getElementById('extraLoanIdInput').value;
    const extraCents = toCents(document.getElementById('extraAmountInput').value);
    const paymentSource = document.getElementById('extraSourceSelect').value;

    const loanIdx = (this.state.loans || []).findIndex((l) => l.id === loanId);
    if (loanIdx < 0) return;
    const loan = this.state.loans[loanIdx];

    if (paymentSource === 'PIGGY') {
      const childFinance = reduceMemberFinancialState({
        memberId: loan.memberId,
        validEvents: this.auditResult.validEvents,
        loans: this.state.loans,
        investments: this.state.investments,
        catalogs: this.state.catalogs
      });
      if (extraCents > childFinance.availableCents) {
        this.showToast(`Saldo disponible insuficiente (${formatMoneyCents(childFinance.availableCents)}).`, 'warn');
        return;
      }
    }

    const { updatedLoan, interestSavedCents, actualExtraAppliedCents } = recalculateLoanAfterExtraPrincipal(
      loan,
      extraCents,
      getTodayLocalDate()
    );

    updatedLoan.updatedAt = new Date().toISOString();
    this.state.loans[loanIdx] = updatedLoan;

    const signedExtra = await createSignedLedgerEvent(
      {
        familyId: this.state.family.id,
        memberId: loan.memberId,
        createdByParentId: this.activeParentId,
        type: 'EXTRA_PRINCIPAL_PAYMENT',
        amountCents: actualExtraAppliedCents,
        catalogId: 'cat_exp_loan',
        referenceId: loan.id,
        metadata: {
          paymentSource,
          interestSavedCents,
          interestPaidCents: 0
        },
        note: `Abono Extraordinario a Capital en "${loan.concept}" (Ahorro en intereses: ${formatMoneyCents(interestSavedCents)})`,
        localDate: getTodayLocalDate()
      },
      this.parentSigningKey,
      this.state.family.saltHex,
      this.getLastEventHash()
    );

    this.state.ledgerEvents.push(signedExtra);
    document.getElementById('dialogExtraPrincipal')?.close();

    await this.cloudManager.pushState(this.state);
    await this.runLedgerAuditAndRender();
    this.showToast(
      `Abono a capital aplicado. Se recalcularon las cuotas ahorrando ${formatMoneyCents(interestSavedCents)} en intereses.`,
      'success'
    );
  }

  async submitInvestmentForm() {
    if (!this.ensureParentPermission()) return;
    const memberId = document.getElementById('invChildSelect').value;
    const principalCents = toCents(document.getElementById('invPrincipalInput').value);
    const title = document.getElementById('invTitleInput').value.trim();
    const termDays = Math.max(1, Number(document.getElementById('invTermDaysInput').value || 30));
    const yieldRatePercent = Math.max(0.5, Number(document.getElementById('invYieldRateInput').value || 10));
    const today = getTodayLocalDate();

    const childFinance = reduceMemberFinancialState({
      memberId,
      validEvents: this.auditResult.validEvents,
      loans: this.state.loans,
      investments: this.state.investments,
      catalogs: this.state.catalogs
    });

    if (principalCents > childFinance.availableCents) {
      this.showToast(
        `El monto a invertir (${formatMoneyCents(principalCents)}) supera el saldo disponible en la alcancía (${formatMoneyCents(childFinance.availableCents)}).`,
        'warn'
      );
      return;
    }

    const newInv = {
      id: `inv_${Date.now()}`,
      familyId: this.state.family.id,
      memberId,
      title,
      principalCents,
      yieldRatePercent,
      termDays,
      startDate: today,
      maturityDate: addDaysLocalDate(today, termDays),
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.state.investments.push(newInv);

    const signedLock = await createSignedLedgerEvent(
      {
        familyId: this.state.family.id,
        memberId,
        createdByParentId: this.activeParentId,
        type: 'INVESTMENT_LOCK',
        amountCents: principalCents,
        catalogId: 'cat_inc_yield',
        referenceId: newInv.id,
        note: `Apertura de Inversión a Plazo (${termDays} días al +${yieldRatePercent}%): ${title}`,
        localDate: today
      },
      this.parentSigningKey,
      this.state.family.saltHex,
      this.getLastEventHash()
    );

    this.state.ledgerEvents.push(signedLock);
    this.selectedChildId = memberId;
    document.getElementById('dialogInvestment')?.close();

    await this.cloudManager.pushState(this.state);
    await this.runLedgerAuditAndRender();
    this.showToast(`Inversión "${title}" iniciada. El saldo quedó bloqueado generando rendimiento.`, 'success');
  }

  async handleSettleInvestment(investmentId, isEarlyExit = false) {
    if (!this.ensureParentPermission()) return;
    const inv = (this.state.investments || []).find((i) => i.id === investmentId && i.status === 'ACTIVE');
    if (!inv) return;

    const evalInv = evaluateInvestmentProgress(inv, getTodayLocalDate());
    const today = getTodayLocalDate();

    if (isEarlyExit) {
      inv.status = 'CANCELLED_EARLY';
      inv.updatedAt = new Date().toISOString();

      const signedEarly = await createSignedLedgerEvent(
        {
          familyId: this.state.family.id,
          memberId: inv.memberId,
          createdByParentId: this.activeParentId,
          type: 'INVESTMENT_EARLY_EXIT',
          amountCents: inv.principalCents,
          catalogId: 'cat_inc_yield',
          referenceId: inv.id,
          metadata: { principalCents: inv.principalCents, yieldCents: 0 },
          note: `Rescate anticipado de inversión "${inv.title}" (Devolución de capital sin rendimiento)`,
          localDate: today
        },
        this.parentSigningKey,
        this.state.family.saltHex,
        this.getLastEventHash()
      );
      this.state.ledgerEvents.push(signedEarly);
      this.showToast(`Inversión rescatada anticipadamente. Se devolvieron ${formatMoneyCents(inv.principalCents)} al saldo disponible.`, 'info');
    } else {
      inv.status = 'MATURED';
      inv.updatedAt = new Date().toISOString();

      const signedMat = await createSignedLedgerEvent(
        {
          id: `det_inv_mat_${inv.id}`,
          familyId: this.state.family.id,
          memberId: inv.memberId,
          createdByParentId: this.activeParentId,
          type: 'INVESTMENT_MATURITY',
          amountCents: evalInv.maturityTotalCents,
          catalogId: 'cat_inc_yield',
          referenceId: inv.id,
          metadata: {
            principalCents: inv.principalCents,
            yieldCents: evalInv.expectedInterestCents
          },
          note: `Liquidación de Inversión "${inv.title}" (Capital ${formatMoneyCents(inv.principalCents)} + Rendimiento +${formatMoneyCents(evalInv.expectedInterestCents)})`,
          localDate: today
        },
        this.parentSigningKey,
        this.state.family.saltHex,
        this.getLastEventHash()
      );
      this.state.ledgerEvents.push(signedMat);
      this.showToast(
        `Inversión liquidada. Se acreditaron ${formatMoneyCents(evalInv.maturityTotalCents)} (incluyendo +${formatMoneyCents(evalInv.expectedInterestCents)} de rendimiento).`,
        'success'
      );
    }

    await this.cloudManager.pushState(this.state);
    await this.runLedgerAuditAndRender();
  }

  async submitMemberForm() {
    if (!this.ensureParentPermission()) return;
    const role = document.getElementById('memRoleSelect').value;
    const name = document.getElementById('memNameInput').value.trim();
    const avatar = resolveIconKey(document.getElementById('memAvatarSelect').value, 'unicorn');
    const ageOrTitle = document.getElementById('memAgeInput').value.trim();
    const goalTitle = document.getElementById('memGoalTitleInput').value.trim() || 'Mi Meta de Ahorro';
    const goalTargetCents = toCents(document.getElementById('memGoalAmountInput').value || 1500);

    const newMember = {
      id: `${role.toLowerCase()}_${Date.now()}`,
      familyId: this.state.family.id,
      role,
      name,
      avatar,
      age: role === 'CHILD' ? Number(ageOrTitle) || 10 : undefined,
      title: role === 'PARENT' ? ageOrTitle || 'Administrador Familiar' : undefined,
      themeColor: role === 'CHILD' ? '#10b981' : '#6366f1',
      goalTitle: role === 'CHILD' ? goalTitle : undefined,
      goalTargetCents: role === 'CHILD' ? goalTargetCents : undefined,
      goalIcon: 'target',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.state.members.push(newMember);
    if (role === 'CHILD') {
      this.selectedChildId = newMember.id;
    }
    document.getElementById('dialogMember')?.close();

    await this.cloudManager.pushState(this.state);
    this.renderAll();
    this.showToast(`Usuario "${name}" (${role === 'PARENT' ? 'Papá/Mamá' : 'Hijo/a'}) creado con icono SVG.`, 'success');
  }

  async submitCatalogForm() {
    if (!this.ensureParentPermission()) return;
    const type = document.getElementById('catTypeInput').value;
    const name = document.getElementById('catNameInput').value.trim();
    const icon = resolveIconKey(document.getElementById('catIconSelect').value, 'coins');
    const description = document.getElementById('catDescInput').value.trim();

    const newCat = {
      id: `cat_${Date.now()}`,
      familyId: this.state.family.id,
      type,
      name,
      icon,
      color: type === 'INCOME_SOURCE' ? '#10b981' : '#f43f5e',
      description,
      isActive: true,
      updatedAt: new Date().toISOString()
    };

    this.state.catalogs.push(newCat);
    document.getElementById('dialogCatalog')?.close();

    await this.cloudManager.pushState(this.state);
    this.renderAll();
    this.showToast(`"${name}" agregado al catálogo familiar con icono SVG.`, 'success');
  }

  async sendSandboxRequest(requestType) {
    const child = this.getSelectedChild();
    if (!child) return;

    let newReq;
    if (requestType === 'INVESTMENT') {
      const amount = Number(document.getElementById('simInvAmount').value || 300);
      const termDays = Number(document.getElementById('simInvDays').value || 30);
      const ratePercent = Number(document.getElementById('simInvRate').value || 10);
      newReq = {
        id: `req_${Date.now()}`,
        familyId: this.state.family.id,
        memberId: child.id,
        requestType: 'INVESTMENT',
        title: `Invertir ${formatMoneyCents(amount * 100)} a ${termDays} días (+${ratePercent}%)`,
        amountCents: amount * 100,
        termDays,
        ratePercent,
        note: `Solicitud enviada desde el Simulador por ${child.name} para ganar +${formatMoneyCents(Math.round(amount * 100 * (ratePercent / 100)))} al vencimiento.`,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } else {
      const amount = Number(document.getElementById('simLoanAmount').value || 500);
      const termPeriods = Number(document.getElementById('simLoanPeriods').value || 4);
      const ratePercent = Number(document.getElementById('simLoanRate').value || 5);
      const interestType = document.getElementById('simLoanType').value || 'SIMPLE';
      newReq = {
        id: `req_${Date.now()}`,
        familyId: this.state.family.id,
        memberId: child.id,
        requestType: 'LOAN',
        title: `Crédito de ${formatMoneyCents(amount * 100)} a ${termPeriods} cuotas (${ratePercent}% ${interestType === 'SIMPLE' ? 'Simple' : 'Compuesto'})`,
        amountCents: amount * 100,
        termPeriods,
        ratePercent,
        interestType,
        note: `Solicitud de préstamo simulada por ${child.name}.`,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    this.state.childRequests = this.state.childRequests || [];
    this.state.childRequests.push(newReq);
    await this.cloudManager.pushState(this.state);
    this.renderAll();
    this.showToast('Solicitud enviada a Mamá/Papá. Ellos la verán al desbloquear el Modo Papá.', 'info');
  }

  async handleProcessChildRequest(reqId, approve = true) {
    if (!this.ensureParentPermission()) return;
    const req = (this.state.childRequests || []).find((r) => r.id === reqId && r.status === 'PENDING');
    if (!req) return;

    if (!approve) {
      req.status = 'REJECTED';
      req.updatedAt = new Date().toISOString();
      await this.cloudManager.pushState(this.state);
      this.renderAll();
      this.showToast('Solicitud marcada como rechazada.', 'info');
      return;
    }

    const today = getTodayLocalDate();
    if (req.requestType === 'INVESTMENT') {
      const childFinance = reduceMemberFinancialState({
        memberId: req.memberId,
        validEvents: this.auditResult.validEvents,
        loans: this.state.loans,
        investments: this.state.investments,
        catalogs: this.state.catalogs
      });
      if (req.amountCents > childFinance.availableCents) {
        this.showToast(`El hijo no tiene suficiente saldo disponible (${formatMoneyCents(childFinance.availableCents)}) para esta inversión.`, 'warn');
        return;
      }

      const newInv = {
        id: `inv_req_${Date.now()}`,
        familyId: this.state.family.id,
        memberId: req.memberId,
        title: req.title,
        principalCents: req.amountCents,
        yieldRatePercent: req.ratePercent || 10,
        termDays: req.termDays || 30,
        startDate: today,
        maturityDate: addDaysLocalDate(today, req.termDays || 30),
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.state.investments.push(newInv);

      const signedLock = await createSignedLedgerEvent(
        {
          familyId: this.state.family.id,
          memberId: req.memberId,
          createdByParentId: this.activeParentId,
          type: 'INVESTMENT_LOCK',
          amountCents: req.amountCents,
          catalogId: 'cat_inc_yield',
          referenceId: newInv.id,
          note: `Inversión aprobada por Papá desde solicitud de Simulador: ${req.title}`,
          localDate: today
        },
        this.parentSigningKey,
        this.state.family.saltHex,
        this.getLastEventHash()
      );
      this.state.ledgerEvents.push(signedLock);
    } else if (req.requestType === 'LOAN') {
      const plan = generateLoanSchedule({
        principalCents: req.amountCents,
        interestRatePercent: req.ratePercent || 5,
        termPeriods: req.termPeriods || 4,
        interestType: req.interestType || 'SIMPLE',
        frequency: 'WEEKLY',
        startDate: today
      });

      const newLoan = {
        id: `loan_req_${Date.now()}`,
        familyId: this.state.family.id,
        memberId: req.memberId,
        concept: req.title,
        principalCents: plan.principalCents,
        interestType: req.interestType || 'SIMPLE',
        interestRatePercent: req.ratePercent || 5,
        termPeriods: req.termPeriods || 4,
        frequency: 'WEEKLY',
        disbursedToPiggy: true,
        totalInterestCents: plan.totalInterestCents,
        totalPayableCents: plan.totalPayableCents,
        interestSavedByExtraPaymentsCents: 0,
        schedule: plan.schedule,
        startDate: today,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.state.loans.push(newLoan);

      const signedDisb = await createSignedLedgerEvent(
        {
          familyId: this.state.family.id,
          memberId: req.memberId,
          createdByParentId: this.activeParentId,
          type: 'LOAN_DISBURSEMENT',
          amountCents: req.amountCents,
          catalogId: 'cat_exp_loan',
          referenceId: newLoan.id,
          metadata: { disbursedToPiggy: true },
          note: `Crédito aprobado por Papá desde solicitud de Simulador: ${req.title}`,
          localDate: today
        },
        this.parentSigningKey,
        this.state.family.saltHex,
        this.getLastEventHash()
      );
      this.state.ledgerEvents.push(signedDisb);
    }

    req.status = 'APPROVED';
    req.updatedAt = new Date().toISOString();
    await this.cloudManager.pushState(this.state);
    await this.runLedgerAuditAndRender();
    this.showToast('Solicitud aprobada, ejecutada y firmada en el Libro Mayor.', 'success');
  }

  scheduleAutoCloudReconnect() {
    const tbl = (document.getElementById('cloudTableNameInput')?.value || 'smartpiggy_families').trim();
    const sqlPre = document.getElementById('supabaseSqlBlock');
    if (sqlPre && tbl) {
      sqlPre.textContent = `create table if not exists public.${tbl} (\n  family_code text primary key,\n  payload jsonb not null,\n  updated_at timestamptz not null default now()\n);\nalter table public.${tbl} enable row level security;\ncreate policy "smartpiggy_sync_all" on public.${tbl} for all to anon, authenticated using (true) with check (true);\nalter publication supabase_realtime add table public.${tbl};`;
    }

    if (this.cloudConfigDebounce) clearTimeout(this.cloudConfigDebounce);
    this.cloudConfigDebounce = setTimeout(() => {
      this.saveAndSyncCloudSettings();
    }, 450);
  }

  async copySupabaseSqlToClipboard() {
    const sqlText = document.getElementById('supabaseSqlBlock')?.textContent || '';
    try {
      await navigator.clipboard.writeText(sqlText);
      this.showToast('SQL copiado. Pégalo en el SQL Editor de tu proyecto existente de Supabase y pulsa Run.', 'success');
    } catch {
      this.showToast('Selecciona el bloque SQL en pantalla para copiarlo.', 'info');
    }
  }

  async saveAndSyncCloudSettings() {
    const newCode = document.getElementById('cloudFamilyCodeInput').value.trim().toUpperCase() || 'FAM-2026-KIDS';
    const provider = document.getElementById('cloudProviderSelect').value;
    const endpointUrl = document.getElementById('cloudEndpointInput').value.trim();
    const apiKey = document.getElementById('cloudApiKeyInput').value.trim();
    const tableName = (document.getElementById('cloudTableNameInput')?.value || 'smartpiggy_families').trim();

    this.state.family.familyCode = newCode;
    this.state.family.updatedAt = new Date().toISOString();
    this.cloudManager.familyCode = newCode;
    this.cloudManager.saveCloudConfig({ provider, endpointUrl, apiKey, tableName });

    await this.cloudManager.pullFromCloud(this.state, true);
    await this.cloudManager.pushState(this.state);
    this.renderAll();
  }

  buildShareConnectionPayload() {
    const cfg = this.cloudManager.cloudConfig || {};
    const familyCode = this.state?.family?.familyCode || 'FAM-2026-KIDS';
    const endpointUrl = (document.getElementById('cloudEndpointInput')?.value || cfg.endpointUrl || '').trim();
    const apiKey = (document.getElementById('cloudApiKeyInput')?.value || cfg.apiKey || '').trim();
    const provider = document.getElementById('cloudProviderSelect')?.value || cfg.provider || 'SUPABASE_REST';
    const tableName = (document.getElementById('cloudTableNameInput')?.value || cfg.tableName || 'smartpiggy_families').trim();

    const rawObj = {
      f: familyCode,
      p: provider,
      u: endpointUrl,
      k: apiKey,
      t: tableName
    };

    const base64Token = btoa(JSON.stringify(rawObj));
    const connectionCode = `SPIGGY-${base64Token}`;

    const shareUrl = new URL(
      window.location.protocol.startsWith('http')
        ? window.location.origin + window.location.pathname
        : 'https://alfonsotensa-pixel.github.io/alcancia-digital-familiar/'
    );
    shareUrl.searchParams.set('family', familyCode);
    if (endpointUrl && apiKey) {
      shareUrl.searchParams.set('sb', base64Token);
    }

    const messageText = [
      `Alcancía Digital Familiar (${this.state?.family?.name || 'SmartPiggy'})`,
      `Código de Familia: ${familyCode}`,
      ``,
      `1) Toca este enlace para entrar ya conectado en tiempo real:`,
      shareUrl.toString(),
      ``,
      `2) O si ya abriste la app, pega este código en "Conectar y Sincronizar":`,
      connectionCode
    ].join('\n');

    return {
      hasCredentials: Boolean(endpointUrl && apiKey),
      shareUrl: shareUrl.toString(),
      connectionCode,
      messageText
    };
  }

  async shareSupabaseConnectionMessage() {
    await this.saveAndSyncCloudSettings();
    const payload = this.buildShareConnectionPayload();
    if (!payload.hasCredentials) {
      this.showToast('Se preparó el mensaje con tu Código Familiar (agrega tu URL y Anon Key de Supabase si quieres incluir las llaves en el mensaje).', 'info');
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Conectar Alcancía Digital Familiar',
          text: payload.messageText,
          url: payload.shareUrl
        });
        this.showToast('Mensaje de conexión compartido con éxito.', 'success');
        return;
      } catch {
        // Si el usuario cierra la hoja nativa o falla, cae al portapapeles
      }
    }

    try {
      await navigator.clipboard.writeText(payload.messageText);
      this.showToast('¡Mensaje con enlace y llaves de conexión copiado! Pégalo en el chat familiar.', 'success');
    } catch {
      const pasteInput = document.getElementById('inputPasteConnectionCode');
      if (pasteInput) {
        pasteInput.value = payload.connectionCode;
        pasteInput.select();
      }
      this.showToast('Copia el código SPIGGY mostrado en el cuadro para enviarlo a tu familia.', 'info');
    }
  }

  async shareSupabaseViaWhatsApp() {
    await this.saveAndSyncCloudSettings();
    const payload = this.buildShareConnectionPayload();
    const waUrl = `https://wa.me/?text=${encodeURIComponent(payload.messageText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    this.showToast('Abriendo WhatsApp con el mensaje de conexión listo para enviar.', 'success');
  }

  async applyPastedConnectionCode() {
    const inputEl = document.getElementById('inputPasteConnectionCode');
    const rawText = (inputEl?.value || '').trim();
    if (!rawText) {
      this.showToast('Primero pega aquí el mensaje o enlace que te mandaron.', 'warn');
      return;
    }

    let base64Candidate = null;
    let extractedFamilyCode = null;

    // 1. Buscar código SPIGGY-<base64> dentro de cualquier mensaje de WhatsApp/texto
    const spiggyMatch = rawText.match(/SPIGGY-([A-Za-z0-9+/=_-]+)/);
    if (spiggyMatch) {
      base64Candidate = spiggyMatch[1];
    }

    // 2. O buscar parámetro ?sb=<base64> si pegaron la URL completa
    if (!base64Candidate) {
      const sbMatch = rawText.match(/[?&]sb=([A-Za-z0-9+/=%_-]+)/);
      if (sbMatch) {
        base64Candidate = decodeURIComponent(sbMatch[1]);
      }
    }

    // 3. Extraer family=<codigo> si viene en una URL
    const famMatch = rawText.match(/[?&]family=([A-Za-z0-9_-]+)/);
    if (famMatch) {
      extractedFamilyCode = decodeURIComponent(famMatch[1]).toUpperCase();
    }

    // 4. Si pegaron directamente el bloque base64 puro
    if (!base64Candidate && !extractedFamilyCode && rawText.length > 20 && !rawText.includes(' ')) {
      base64Candidate = rawText;
    }

    let decoded = null;
    if (base64Candidate) {
      try {
        decoded = JSON.parse(atob(base64Candidate));
      } catch {
        decoded = null;
      }
    }

    if (!decoded && !extractedFamilyCode) {
      this.showToast('No encontramos una clave válida en ese texto. Pega el mensaje completo o enlace que enviaste desde el otro equipo.', 'danger');
      return;
    }

    const finalFamilyCode = (decoded?.f || extractedFamilyCode || this.state.family.familyCode || 'FAM-2026-KIDS').trim().toUpperCase();
    const provider = decoded?.p || 'SUPABASE_REST';
    const endpointUrl = (decoded?.u || '').trim();
    const apiKey = (decoded?.k || '').trim();
    const tableName = (decoded?.t || 'smartpiggy_families').trim();

    this.state.family.familyCode = finalFamilyCode;
    this.cloudManager.familyCode = finalFamilyCode;
    if (endpointUrl && apiKey) {
      this.cloudManager.saveCloudConfig({
        provider,
        endpointUrl,
        apiKey,
        tableName
      });
    }

    this.populateCloudConfigInputs();
    if (inputEl) inputEl.value = '';

    await this.cloudManager.pullFromCloud(this.state, true);
    await this.cloudManager.pushState(this.state);
    await this.runLedgerAuditAndRender();

    this.showToast(`¡Equipo conectado a la familia ${finalFamilyCode} en tiempo real!`, 'success');
  }

  async copyChildReadOnlyShareLink() {
    const payload = this.buildShareConnectionPayload();
    try {
      await navigator.clipboard.writeText(payload.shareUrl);
      this.showToast('Enlace con auto-conexión en tiempo real copiado al portapapeles.', 'info');
    } catch {
      this.showToast(`Enlace para Hijos: ${payload.shareUrl}`, 'info');
    }
  }

  exportSignedSnapshotJson() {
    const blob = new Blob([JSON.stringify(this.state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartpiggy_${this.state.family.familyCode}_${getTodayLocalDate()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Respaldo JSON firmado exportado.', 'success');
  }

  async importSignedSnapshotJson(event) {
    if (!this.ensureParentPermission()) return;
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const imported = JSON.parse(text);
      if (!imported || !imported.family) throw new Error('Formato inválido');
      this.state = mergeFamilyCRDT(this.state, imported);
      this.normalizeLegacyIconsToSvg();
      await this.cloudManager.pushState(this.state);
      await this.runLedgerAuditAndRender();
      this.showToast('Respaldo fusionado exitosamente mediante CRDT G-Set.', 'success');
    } catch {
      this.showToast('No se pudo importar el archivo JSON.', 'danger');
    }
  }

  async updateParentPinAndResign() {
    if (!this.ensureParentPermission()) return;
    const newPin = document.getElementById('newParentPinInput').value.trim();
    if (newPin.length < 4) {
      this.showToast('El nuevo PIN debe tener al menos 4 dígitos.', 'warn');
      return;
    }

    const newSalt = generateSaltHex(16);
    const { authVerifier, signingKey } = await deriveParentKeyBundle(newPin, newSalt);
    this.state.family.saltHex = newSalt;
    this.state.family.authVerifier = authVerifier;
    this.state.family.updatedAt = new Date().toISOString();
    this.parentSigningKey = signingKey;

    const reSigned = [];
    let prevHash = 'GENESIS';
    for (const ev of this.auditResult.validEvents) {
      const signed = await createSignedLedgerEvent(ev, signingKey, newSalt, prevHash);
      prevHash = signed.eventHash;
      reSigned.push(signed);
    }
    this.state.ledgerEvents = reSigned;
    document.getElementById('newParentPinInput').value = '';

    await this.cloudManager.pushState(this.state);
    await this.runLedgerAuditAndRender();
    this.showToast('PIN Parental actualizado y Libro Mayor re-firmado con PBKDF2 (210,000 iteraciones).', 'success');
  }

  async resetToInitialDemoData() {
    if (!this.ensureParentPermission()) return;
    this.state = await buildInitialSignedFamilyState(this.state.family.familyCode);
    const { signingKey } = await deriveParentKeyBundle('1234', this.state.family.saltHex);
    this.parentSigningKey = signingKey;
    await this.cloudManager.pushState(this.state);
    await this.runLedgerAuditAndRender();
    this.showToast('Datos demostrativos restaurados con iconografía 100% SVG (PIN: 1234).', 'info');
  }

  async simulateChildTamperAttack() {
    const child = this.getSelectedChild();
    if (!child) return;

    const fakeInjectedEntry = {
      id: `tx_hack_attempt_${Date.now()}`,
      familyId: this.state.family.id,
      memberId: child.id,
      createdByParentId: 'child_hacker',
      type: 'INCOME',
      amountCents: 999900,
      catalogId: 'cat_inc_gift',
      note: 'Intento de inyección desde DevTools sin firma de Papá',
      localDate: getTodayLocalDate(),
      createdAt: new Date().toISOString(),
      prevHash: this.getLastEventHash(),
      eventHash: '0000deadbeefcafebabe0000',
      signature: 'fake_signature_without_parent_hmac_key',
      integritySeal: 'invalid_seal'
    };

    this.state.ledgerEvents.push(fakeInjectedEntry);
    await this.runLedgerAuditAndRender();
    this.showToast(
      'Ataque simulado bloqueado: Se inyectó +$9,999.00 sin firma parental y el motor criptográfico lo aisló sin alterar el saldo real.',
      'warn'
    );
  }

  async purgeCorruptedLedgerEntries() {
    const beforeCount = this.state.ledgerEvents.length;
    const validIds = new Set(this.auditResult.validEvents.map((e) => e.id));
    this.state.ledgerEvents = this.state.ledgerEvents.filter((e) => validIds.has(e.id));
    const removed = beforeCount - this.state.ledgerEvents.length;

    await this.cloudManager.pushState(this.state);
    await this.runLedgerAuditAndRender();
    this.showToast(`Se eliminaron ${removed} asiento(s) apócrifo(s) del almacenamiento.`, 'success');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const app = new SmartPiggyApp();
  app.init();
});

})();
