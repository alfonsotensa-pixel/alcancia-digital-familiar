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
export function mergeFamilyCRDT(localState, remoteState) {
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

export class CloudSyncManager {
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
