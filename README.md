# 🐷 SmartPiggy Cloud — Alcancías Digitales para Niños y Jóvenes

Aplicación Web Progresiva (PWA) para el control de alcancías digitales familiares con educación financiera práctica, sincronización en la nube multi-dispositivo (**CRDT G-Set**) y dos niveles estrictos de acceso (**Papás con escritura firmada** vs. **Hijos con acceso exclusivo de solo lectura**).

---

## 🚀 Cómo Abrir y Usar la Aplicación

1. **Vía Servidor Cloud Local Activo (Recomendado para sincronización REST + Multi-Dispositivo):**
   - Abre en tu navegador: **`http://localhost:8090`**
   - Para iniciar el servidor manualmente en cualquier momento:
     ```powershell
     powershell -ExecutionPolicy Bypass -File .\server.ps1 -Port 8090
     ```
2. **Apertura Directa del Archivo HTML:**
   - También puedes abrir directamente [`index.html`](./index.html) en cualquier navegador moderno gracias al paquete integrado [`js/smartpiggy-bundle.js`](./js/smartpiggy-bundle.js).

---

## 🔐 Niveles de Usuario y Seguridad Criptográfica

- **👁️ Vista Hijo (Modo por defecto al abrir — Solo Lectura):**
  - Permite consultar saldos disponibles, dinero invertido a plazo fijo, estado de créditos, historial de movimientos, fuentes de ingreso y categorías de gasto.
  - Incluye el **🧪 Laboratorio Financiero (Simulador Sandbox)** donde el hijo puede simular inversiones o préstamos sin alterar datos reales y enviar una **Solicitud a Papá/Mamá**.
- **🔐 Modo Papá (Administración Protegida por PIN):**
  - **PIN demostrativo inicial:** `1234` (configurable en la pestaña *Nube y Auditoría*).
  - Deriva en memoria RAM una llave criptográfica con `PBKDF2-SHA256` (**210,000 iteraciones**) y firma cada movimiento del Libro Mayor con `HMAC-SHA256`.
  - Si alguien intenta alterar el saldo desde las herramientas del navegador, el motor de auditoría lo detecta como `CORRUPTED_UNSIGNED_ENTRY` y protege el saldo real.

---

## 📂 Estructura de Archivos

- [`index.html`](./index.html): Interfaz principal con modales nativos `<dialog>`, KPIs patrimoniales y 7 secciones funcionales.
- [`styles.css`](./styles.css): Diseño adaptable (modo oscuro y claro) con diferenciación visual entre Modo Hijo, Modo Papá y Simulador Sandbox.
- [`js/crypto-ledger.js`](./js/crypto-ledger.js): Derivación `PBKDF2` (210,000 iteraciones), encadenamiento `SHA-256` y firma `HMAC-SHA256` del Libro Mayor.
- [`js/financial-engine.js`](./js/financial-engine.js): Motor financiero en centavos enteros (`reduceMemberFinancialState`), tablas de amortización Simple y Compuesta Francesa con ajuste exacto de centavos en la cuota final $N$, abonos extraordinarios a capital e inversiones a plazo fijo.
- [`js/cloud-sync.js`](./js/cloud-sync.js): Sincronización multi-dispositivo mediante `CRDT G-Set` compatible con servidor Cloud Zero-Config (`/api/cloud/:familyCode`), `BroadcastChannel`, **Firebase Realtime Database** y **Supabase REST**.
- [`js/seed-data.js`](./js/seed-data.js): Datos iniciales demostrativos firmados criptográficamente.
- [`js/app.js`](./js/app.js) y [`js/smartpiggy-bundle.js`](./js/smartpiggy-bundle.js): Controlador integral de la aplicación.
- [`server.ps1`](./server.ps1) / [`server.py`](./server.py): Servidores de sincronización Cloud REST.
