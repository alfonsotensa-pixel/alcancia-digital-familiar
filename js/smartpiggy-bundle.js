/**
 * SmartPiggy Cloud - Bundle Unificado v6
 */
(function () {
  'use strict';

  /* === icons.js === */
/**
 * SmartPiggy Cloud - Sistema Integral de Iconografía SVG Vectorial
 * Reemplaza todos los iconos por gráficos vectoriales SVG escalables (<svg viewBox="0 0 24 24">),
 * incluyendo mapeo automático de compatibilidad para datos existentes en almacenamiento local.
 */
const SVG_ICON_PATHS = {
  // Tareas, Retos, Reglas de la Casa y Planes de Ahorro (set fijo SVG)
  broom: `<path d="m13 11 9-9"/><path d="M14.6 12.6c.8.8.9 2.1.2 3L10 21l-7-7 5.4-4.8c.9-.7 2.2-.6 3 .2Z"/><path d="m6.8 10.4 6.8 6.8"/><path d="m5 17 1.5 1.5"/>`,
  dish: `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/>`,
  bed: `<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>`,
  car: `<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2.7-3.6A2 2 0 0 0 13.7 6H8.3a2 2 0 0 0-1.6.8L4 10l-2.5 1.1C.7 11.3 0 12.1 0 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M9 17h6"/>`,
  shirt: `<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>`,
  cart: `<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>`,
  plant: `<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>`,
  pet: `<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>`,
  phone: `<rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>`,
  bulb: `<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>`,
  food: `<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>`,
  broken: `<path d="M3 12h3l2-4 3 8 2-4h3"/><path d="M18 12h3"/><path d="M5 5l14 14"/>`,
  star: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
  seed: `<path d="M12 22v-8"/><path d="M12 14c-4 0-6-3-6-7 4 0 6 3 6 7Z"/>`,
  sprout: `<path d="M7 20h10"/><path d="M12 20v-8"/><path d="M12 12c0-3-2-5-6-5 0 3 2 5 6 5Z"/><path d="M12 12c0-4 2-7 7-7 0 4-2 7-7 7Z"/>`,
  tree: `<path d="M12 22v-6"/><path d="M8 16h8l-4-6 3 0-3-5-3 5 3 0-4 6Z"/><path d="M5 16h14l-3-4"/>`,
  checklist: `<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>`,
  scale: `<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>`,
  'hand-raise': `<path d="M18 11V6a2 2 0 0 0-4 0v5"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>`,
  flag: `<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>`,
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
  edit: `<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>`,
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


  /* === crypto-ledger.js === */
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
 * Serialización JSON estable (claves ordenadas) para firmar metadatos de forma determinista.
 */
function stableStringify(value) {
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
  if (Number(event.sigVersion || 1) >= 2) {
    payload.sigVersion = 2;
    payload.meta = stableStringify(event.metadata || {});
    return stableStringify(payload);
  }
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


  /* === financial-engine.js === */
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
 * Banda de edad usada por tareas, multas y planes de ahorro.
 */
function getAgeBand(age) {
  return Number(age || 10) <= 12 ? '9_12' : '13_17';
}

/**
 * Devuelve la inversión con los parámetros tomados del asiento FIRMADO de apertura (`INVESTMENT_LOCK` v2),
 * para que la ganancia nunca dependa de datos sin firma (Ajuste B de la revisión).
 */
function resolveSignedInvestment(investment, events = []) {
  if (!investment) return investment;
  const lock = (events || []).find((e) => e.type === 'INVESTMENT_LOCK' && e.referenceId === investment.id);
  if (lock && Number(lock.sigVersion || 1) >= 2 && lock.metadata && lock.metadata.yieldBps !== undefined) {
    const termDays = Math.max(1, Math.round(Number(lock.metadata.termDays || investment.termDays || 30)));
    const startDate = lock.localDate || investment.startDate;
    return {
      ...investment,
      principalCents: Math.round(Number(lock.amountCents || 0)),
      planId: lock.metadata.planId || investment.planId || null,
      planVersion: lock.metadata.planVersion || investment.planVersion || 1,
      ageBand: lock.metadata.ageBand || investment.ageBand,
      yieldBpsSnapshot: Math.round(Number(lock.metadata.yieldBps || 0)),
      termDays,
      startDate,
      maturityDate: addDaysLocalDate(startDate, termDays)
    };
  }
  return investment;
}

/**
 * Calcula los indicadores de una Inversión a Plazo Fijo (rendimiento garantizado, progreso y devengo al día).
 * - Planes nuevos (CORTO/MEDIANO/LARGO): ganancia = floor(capital × yieldBps / 10000), interés simple del plazo.
 * - Inversiones anteriores (legado, planId = null): ganancia = capital × yieldRatePercent / 100.
 */
function evaluateInvestmentProgress(investment, referenceLocalDate = getTodayLocalDate()) {
  const P = Math.round(Number(investment.principalCents || 0));
  const usesPlan = Boolean(investment.planId) && investment.yieldBpsSnapshot !== undefined && investment.yieldBpsSnapshot !== null;
  const ratePct = usesPlan ? Number(investment.yieldBpsSnapshot) / 100 : Number(investment.yieldRatePercent || 0);
  const termDays = Math.max(1, Math.round(Number(investment.termDays || 30)));
  const expectedInterestCents = usesPlan
    ? Math.floor((P * Number(investment.yieldBpsSnapshot)) / 10000)
    : Math.round(P * (ratePct / 100));
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
        : Math.floor(expectedInterestCents * progressRatio);

  const isMatureReady = investment.status === 'ACTIVE' && referenceLocalDate >= investment.maturityDate;

  // Retiro anticipado: CORTO (o legado) solo devuelve el capital; MEDIANO/LARGO desde el día 30
  // devuelven capital + 50% de la ganancia acumulada. El capital nunca se pierde.
  const halfAccruedPolicy = usesPlan && (investment.planId === 'MEDIUM' || investment.planId === 'LONG');
  const earlyExitYieldCents =
    halfAccruedPolicy && elapsedDays >= 30 ? Math.floor(expectedInterestCents * (elapsedDays / termDays) * 0.5) : 0;

  return {
    ...investment,
    yieldRatePercent: usesPlan ? ratePct : investment.yieldRatePercent,
    expectedInterestCents,
    maturityTotalCents,
    elapsedDays,
    remainingDays,
    progressPercent: Math.round(progressRatio * 100),
    accruedInterestTodayCents,
    dailyYieldCents: expectedInterestCents / termDays,
    earlyExitYieldCents,
    earlyExitPayoutCents: P + earlyExitYieldCents,
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
  // 1. Identificar eventos anulados por contra-asiento (`REVERSAL`) total o parcial
  const reversedEventIds = new Set();
  const reversalMap = new Map();
  const partialRefunds = new Map(); // targetEventId -> centavos devueltos (solo multas, REVERSAL v2 con metadata.partial)

  const memberEvents = validEvents.filter((ev) => ev.memberId === memberId);
  for (const ev of memberEvents) {
    if (ev.type === 'REVERSAL' && ev.targetEventId) {
      const isPartial = Number(ev.sigVersion || 1) >= 2 && ev.metadata?.partial === true;
      if (isPartial) {
        partialRefunds.set(ev.targetEventId, (partialRefunds.get(ev.targetEventId) || 0) + Math.round(Number(ev.amountCents || 0)));
      } else {
        reversedEventIds.add(ev.targetEventId);
      }
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
  let totalFinesCents = 0;
  let totalTaskRewardsCents = 0;
  const incomeLog = []; // { date, cents } ingresos que cuentan para el tope de multas (mesada, depósitos, tareas, ganancias)
  const fineLog = []; // { date, cents } multas cobradas realmente

  const sumWindow = (log, endDate) => {
    const startExclusive = addDaysLocalDate(endDate, -30);
    return log.reduce((s, x) => (x.date > startExclusive && x.date <= endDate ? s + x.cents : s), 0);
  };

  for (const ev of orderedEvents) {
    const isReversed = reversedEventIds.has(ev.id);
    const amount = Math.round(Number(ev.amountCents || 0));
    let extra = {};

    if (!isReversed && ev.type !== 'REVERSAL') {
      switch (ev.type) {
        case 'INCOME':
        case 'RECURRING_INCOME': {
          availableCents += amount;
          totalIncomeCents += amount;
          const catKey = ev.catalogId || 'uncategorized_income';
          incomeBySource[catKey] = (incomeBySource[catKey] || 0) + amount;
          incomeLog.push({ date: ev.localDate, cents: amount });
          break;
        }
        case 'TASK_REWARD': {
          availableCents += amount;
          totalIncomeCents += amount;
          totalTaskRewardsCents += amount;
          const catKey = ev.catalogId || 'cat_inc_chores';
          incomeBySource[catKey] = (incomeBySource[catKey] || 0) + amount;
          incomeLog.push({ date: ev.localDate, cents: amount });
          break;
        }
        case 'FINE': {
          // El cargo real se calcula al reproducir el libro: nunca deja saldo negativo ni genera deuda.
          // Todos los parámetros (tope fijo, mínimo, % de ingresos) vienen firmados dentro del evento (sigVersion 2).
          const meta = Number(ev.sigVersion || 1) >= 2 ? ev.metadata || {} : {};
          const fixedCap = meta.monthlyCapCents !== undefined ? Number(meta.monthlyCapCents) : Infinity;
          const minCap = Number(meta.minCapCents || 0);
          const pct = meta.incomePct !== undefined ? Number(meta.incomePct) : 100;
          const income30 = sumWindow(incomeLog, ev.localDate);
          const charged30 = sumWindow(fineLog, ev.localDate);
          const monthlyCap = Math.min(fixedCap, Math.max(minCap, Math.floor((income30 * pct) / 100)));
          const capRemaining = Math.max(0, monthlyCap - charged30);
          const grossCharge = Math.max(0, Math.min(amount, Math.max(0, availableCents), capRemaining));
          const refundedCents = Math.min(grossCharge, partialRefunds.get(ev.id) || 0);
          const chargedCents = grossCharge - refundedCents;
          availableCents -= chargedCents;
          totalFinesCents += chargedCents;
          fineLog.push({ date: ev.localDate, cents: chargedCents });
          if (chargedCents > 0) {
            const catKey = ev.catalogId || 'cat_exp_fines';
            expenseByCategory[catKey] = (expenseByCategory[catKey] || 0) + chargedCents;
          }
          extra = {
            chargedCents,
            refundedCents,
            forgivenCents: Math.max(0, amount - grossCharge),
            monthlyCapCents: monthlyCap,
            capRemainingCents: capRemaining
          };
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
          incomeLog.push({ date: ev.localDate, cents: yieldCents });
          break;
        }
        case 'INVESTMENT_EARLY_EXIT': {
          // Devuelve el capital (+ 50% de lo ganado si es plan MEDIANO/LARGO con 30 días o más)
          availableCents += amount;
          const yieldCents = Number(ev.sigVersion || 1) >= 2 ? Math.round(Number(ev.metadata?.yieldCents || 0)) : 0;
          if (yieldCents > 0) {
            totalYieldEarnedCents += yieldCents;
            totalIncomeCents += yieldCents;
            const catKey = ev.catalogId || 'cat_inc_yield';
            incomeBySource[catKey] = (incomeBySource[catKey] || 0) + yieldCents;
            incomeLog.push({ date: ev.localDate, cents: yieldCents });
          }
          break;
        }
        default:
          break;
      }
    }

    enrichedTimeline.push({
      ...ev,
      ...extra,
      isReversed,
      reversedByEvent: reversalMap.get(ev.id) || null,
      runningAvailableCents: availableCents
    });
  }

  // 3. Calcular estado de Inversiones Activas y Rendimiento Devengado (con parámetros firmados)
  const memberInvestments = investments
    .filter((inv) => inv.memberId === memberId)
    .map((inv) => evaluateInvestmentProgress(resolveSignedInvestment(inv, validEvents), referenceLocalDate));

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
    totalFinesCents,
    totalTaskRewardsCents,
    income30Cents: sumWindow(incomeLog, referenceLocalDate),
    fines30Cents: sumWindow(fineLog, referenceLocalDate),
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

  for (const rawInv of appState.investments || []) {
    if (rawInv.status !== 'ACTIVE') continue;
    const inv = resolveSignedInvestment(rawInv, appState.ledgerEvents || []);
    if (inv.maturityDate <= referenceLocalDate) {
      const deterministicTxId = `det_inv_mat_${inv.id}`;
      if (!existingEventIds.has(deterministicTxId) && !existingEventIds.has(`det_inv_exit_${inv.id}`)) {
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

/**
 * Tablero de Tareas y Retos (función pura, sin escrituras).
 * Deriva el estado de cada hijo en cada tarea a partir de:
 * - taskClaims (sin firma, los crea el hijo): { id, taskId, memberId, stage: ACCEPTED|SUBMITTED|WITHDRAWN, attempt, createdAt }
 * - taskReviews (los crea el papá con PIN): { taskId, memberId, attempt, decision: APPROVED|REJECTED }
 * - ledgerEvents TASK_REWARD firmados (id determinista det_task_{taskId}_{memberId}).
 * Reglas: cupos por orden de llegada (createdAt, memberId); una asignación entregada/revisada/pagada queda
 * "congelada" aunque después sincronice un claim más antiguo (Ajuste A). Máximo 2 intentos.
 */
function deriveTaskBoard({ tasks = [], taskClaims = [], taskReviews = [], validEvents = [], referenceLocalDate = getTodayLocalDate() }) {
  const reversed = new Set(
    validEvents.filter((e) => e.type === 'REVERSAL' && !(Number(e.sigVersion || 1) >= 2 && e.metadata?.partial)).map((e) => e.targetEventId)
  );
  const rewardById = new Map(
    validEvents.filter((e) => e.type === 'TASK_REWARD' && !reversed.has(e.id)).map((e) => [e.id, e])
  );

  const board = [];
  for (const task of tasks) {
    const claims = taskClaims
      .filter((c) => c.taskId === task.id)
      .sort((a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || '')) || String(a.memberId).localeCompare(String(b.memberId)));
    const reviewsFor = (memberId) =>
      taskReviews.filter((r) => r.taskId === task.id && r.memberId === memberId).sort((a, b) => Number(a.attempt) - Number(b.attempt));

    const enriched = claims.map((claim) => {
      const reviews = reviewsFor(claim.memberId);
      const rewardEvent = rewardById.get(`det_task_${task.id}_${claim.memberId}`) || null;
      const approvedReview = reviews.find((r) => r.decision === 'APPROVED') || null;
      const rejections = reviews.filter((r) => r.decision === 'REJECTED');
      const attempt = Math.max(1, Number(claim.attempt || 1));
      const currentRejected = rejections.some((r) => Number(r.attempt) === attempt);
      const frozen = claim.stage === 'SUBMITTED' || reviews.length > 0 || Boolean(rewardEvent);
      return { claim, reviews, rewardEvent, approvedReview, rejections, attempt, currentRejected, frozen };
    });

    const active = enriched.filter((x) => x.claim.stage !== 'WITHDRAWN');
    const unlimited = task.maxAssignees === null || task.maxAssignees === undefined || Number(task.maxAssignees) <= 0;
    const slots = unlimited ? Infinity : Number(task.maxAssignees);
    const winners = new Set();
    active.filter((x) => x.frozen).forEach((x) => winners.add(x.claim.id));
    for (const x of active) {
      if (winners.size >= slots) break;
      if (!winners.has(x.claim.id) && String(x.claim.createdAt || '').slice(0, 10) <= String(task.dueDate || '9999-12-31')) {
        winners.add(x.claim.id);
      }
    }

    const assignments = enriched.map((x) => {
      let status;
      if (x.rewardEvent || x.approvedReview) status = 'APPROVED';
      else if (x.claim.stage === 'WITHDRAWN') status = 'WITHDRAWN';
      else if (!winners.has(x.claim.id)) status = 'BUMPED';
      else if (x.rejections.length >= 2) status = 'REJECTED';
      else if (x.claim.stage === 'SUBMITTED' && !x.currentRejected) status = 'SUBMITTED';
      else if (referenceLocalDate > String(task.dueDate || '9999-12-31')) status = 'EXPIRED';
      else status = x.currentRejected ? 'NEEDS_FIX' : 'ACCEPTED';
      return {
        claimId: x.claim.id,
        taskId: task.id,
        memberId: x.claim.memberId,
        status,
        attempt: x.attempt,
        claimedAt: x.claim.createdAt,
        submittedAt: x.claim.submittedAt || null,
        submissionNote: x.claim.note || '',
        lastReview: x.reviews[x.reviews.length - 1] || null,
        rewardEvent: x.rewardEvent
      };
    });

    const occupying = assignments.filter((a) => ['ACCEPTED', 'NEEDS_FIX', 'SUBMITTED', 'APPROVED'].includes(a.status)).length;
    board.push({
      task,
      assignments,
      slotsTotal: slots,
      slotsUsed: occupying,
      slotsLeft: unlimited ? Infinity : Math.max(0, slots - occupying),
      isOpen: task.status !== 'CLOSED' && referenceLocalDate <= String(task.dueDate || '9999-12-31')
    });
  }
  return board;
}


  /* === cloud-sync.js === */
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

const STORAGE_KEY_PREFIX = 'smartpiggy_cloud_state_v3_';
const CLOUD_CONFIG_KEY = 'smartpiggy_cloud_provider_config_v2';

const LEGACY_DEMO_IDS = new Set([
  'child_sofia',
  'child_mateo',
  'parent_carlos',
  'parent_elena',
  'loan_sofia_artset',
  'loan_mateo_headphones',
  'inv_sofia_30d',
  'inv_mateo_60d',
  'rec_sofia_weekly',
  'rec_mateo_biweekly',
  'req_sofia_inv_01'
]);

function isLegacyDemoId(id = '') {
  const s = String(id || '');
  return (
    LEGACY_DEMO_IDS.has(s) ||
    s.startsWith('tx_seed_') ||
    s.startsWith('det_rec_rec_sofia_') ||
    s.startsWith('det_rec_rec_mateo_')
  );
}

/**
 * Elimina cualquier registro demostrativo antiguo que haya quedado en localStorage o en Supabase
 * y garantiza que exista al menos un perfil Padre y un perfil Hijo limpio ($0.00).
 */
function stripLegacyDemoData(state) {
  if (!state || !state.family) return state;

  const nowIso = new Date().toISOString();
  state.family.deletedIds = state.family.deletedIds || {};
  if (state.family.name === 'Familia García-Mendoza') {
    state.family.name = 'Mi Familia';
  }

  const filterDemo = (arr = []) =>
    (arr || []).filter(
      (item) =>
        item &&
        item.id &&
        !isLegacyDemoId(item.id) &&
        !isLegacyDemoId(item.memberId) &&
        !state.family.deletedIds[item.id]
    );

  state.members = filterDemo(state.members);
  state.catalogs = (state.catalogs || []).filter((c) => c && c.id && !state.family.deletedIds[c.id]);
  state.recurringRules = filterDemo(state.recurringRules);
  state.loans = filterDemo(state.loans);
  state.investments = filterDemo(state.investments);
  state.childRequests = filterDemo(state.childRequests);
  state.ledgerEvents = filterDemo(state.ledgerEvents);
  state.tasks = (state.tasks || []).filter((t) => t && t.id && !state.family.deletedIds[t.id]);
  state.taskClaims = filterDemo(state.taskClaims);
  state.taskReviews = filterDemo(state.taskReviews);
  if (Array.isArray(state.finePresets)) {
    state.finePresets = state.finePresets.filter((p) => p && p.id && !state.family.deletedIds[p.id]);
  }

  if (!state.members.some((m) => m.role === 'PARENT')) {
    state.members.unshift({
      id: 'parent_admin',
      familyId: state.family.id,
      role: 'PARENT',
      name: 'Papá / Mamá',
      title: 'Administrador Familiar',
      avatar: 'parent-male',
      themeColor: '#6366f1',
      createdAt: nowIso,
      updatedAt: nowIso
    });
  }

  if (!state.members.some((m) => m.role === 'CHILD')) {
    state.members.push({
      id: 'child_principal',
      familyId: state.family.id,
      role: 'CHILD',
      name: 'Mi Alcancía',
      age: 10,
      avatar: 'piggy',
      themeColor: '#10b981',
      goalTitle: 'Mi Meta de Ahorro',
      goalTargetCents: 100000,
      goalIcon: 'target',
      createdAt: nowIso,
      updatedAt: nowIso
    });
  }

  return state;
}

function mergeEntityCollection(localArr = [], remoteArr = [], deletedIdsMap = {}) {
  const map = new Map();

  for (const item of localArr) {
    if (item && item.id && !deletedIdsMap[item.id] && !isLegacyDemoId(item.id) && !isLegacyDemoId(item.memberId)) {
      map.set(item.id, item);
    }
  }

  for (const rItem of remoteArr) {
    if (!rItem || !rItem.id || deletedIdsMap[rItem.id] || isLegacyDemoId(rItem.id) || isLegacyDemoId(rItem.memberId)) {
      continue;
    }
    const existing = map.get(rItem.id);
    if (!existing) {
      map.set(rItem.id, rItem);
    } else {
      const localTime = String(existing.updatedAt || existing.createdAt || '');
      const remoteTime = String(rItem.updatedAt || rItem.createdAt || '');
      if (remoteTime > localTime) {
        map.set(rItem.id, rItem);
      } else if (remoteTime === localTime) {
        // Desempate determinista (p.ej. dos papás firmando el mismo evento con ID determinista al mismo tiempo):
        // gana el hash/huella menor para que todos los dispositivos converjan al mismo registro.
        const lKey = String(existing.eventHash || JSON.stringify(existing));
        const rKey = String(rItem.eventHash || JSON.stringify(rItem));
        if (rKey < lKey) map.set(rItem.id, rItem);
      }
    }
  }

  return Array.from(map.values());
}

/**
 * Fusión CRDT determinista con soporte para Tombstones (`deletedIds`), `resetEpoch` y limpieza de datos de prueba.
 */
function mergeFamilyCRDT(localState, remoteState) {
  if (!remoteState || !remoteState.family) return stripLegacyDemoData(localState);
  if (!localState || !localState.family) return stripLegacyDemoData(remoteState);

  const cleanLocal = stripLegacyDemoData(localState);
  const cleanRemote = stripLegacyDemoData(remoteState);

  const localEpoch = Number(cleanLocal.family.resetEpoch || 0);
  const remoteEpoch = Number(cleanRemote.family.resetEpoch || 0);
  if (localEpoch > remoteEpoch && remoteEpoch > 0) {
    return cleanLocal;
  }
  if (remoteEpoch > localEpoch && localEpoch > 0) {
    return cleanRemote;
  }

  const mergedDeletedIds = {
    ...(cleanLocal.family.deletedIds || {}),
    ...(cleanRemote.family.deletedIds || {})
  };

  const localFamUpdated = String(cleanLocal.family.updatedAt || '');
  const remoteFamUpdated = String(cleanRemote.family.updatedAt || '');
  const mergedFamily =
    remoteFamUpdated >= localFamUpdated
      ? { ...cleanLocal.family, ...cleanRemote.family, deletedIds: mergedDeletedIds, resetEpoch: Math.max(localEpoch, remoteEpoch) }
      : { ...cleanRemote.family, ...cleanLocal.family, deletedIds: mergedDeletedIds, resetEpoch: Math.max(localEpoch, remoteEpoch) };

  return stripLegacyDemoData({
    family: mergedFamily,
    members: mergeEntityCollection(cleanLocal.members, cleanRemote.members, mergedDeletedIds),
    catalogs: mergeEntityCollection(cleanLocal.catalogs, cleanRemote.catalogs, mergedDeletedIds),
    recurringRules: mergeEntityCollection(cleanLocal.recurringRules, cleanRemote.recurringRules, mergedDeletedIds),
    loans: mergeEntityCollection(cleanLocal.loans, cleanRemote.loans, mergedDeletedIds),
    investments: mergeEntityCollection(cleanLocal.investments, cleanRemote.investments, mergedDeletedIds),
    childRequests: mergeEntityCollection(cleanLocal.childRequests, cleanRemote.childRequests, mergedDeletedIds),
    ledgerEvents: mergeEntityCollection(cleanLocal.ledgerEvents, cleanRemote.ledgerEvents, mergedDeletedIds),
    tasks: mergeEntityCollection(cleanLocal.tasks, cleanRemote.tasks, mergedDeletedIds),
    taskClaims: mergeEntityCollection(cleanLocal.taskClaims, cleanRemote.taskClaims, mergedDeletedIds),
    taskReviews: mergeEntityCollection(cleanLocal.taskReviews, cleanRemote.taskReviews, mergedDeletedIds),
    finePresets: mergeEntityCollection(cleanLocal.finePresets, cleanRemote.finePresets, mergedDeletedIds),
    lastSyncedAt: new Date().toISOString()
  });
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
      // Limpiar versiones previas que contenían datos de prueba
      localStorage.removeItem(`smartpiggy_cloud_state_v2_${this.familyCode}`);
      const raw = localStorage.getItem(this.getStorageKey(this.familyCode));
      if (raw) {
        return stripLegacyDemoData(JSON.parse(raw));
      }
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


  /* === seed-data.js === */
/**
 * SmartPiggy Cloud - Estado Inicial Limpio (Sin datos de prueba)
 * Crea la estructura base de la familia con saldo $0.00, sin movimientos ni préstamos de prueba,
 * lista para registrar integrantes y movimientos reales con iconografía 100% SVG.
 */
const DEFAULT_DEMO_PIN = '1234';
async function buildInitialSignedFamilyState(customFamilyCode = 'FAM-2026-KIDS', initialPin = DEFAULT_DEMO_PIN) {
  const nowIso = new Date().toISOString();
  const saltHex = generateSaltHex(16);
  const { authVerifier } = await deriveParentKeyBundle(initialPin, saltHex);

  const family = {
    id: 'fam_smartpiggy_01',
    familyCode: customFamilyCode,
    name: 'Mi Familia',
    currency: 'MXN',
    saltHex,
    authVerifier,
    resetEpoch: Date.now(),
    deletedIds: {},
    createdAt: nowIso,
    updatedAt: nowIso
  };

  const members = [
    {
      id: 'parent_admin',
      familyId: family.id,
      role: 'PARENT',
      name: 'Papá / Mamá',
      title: 'Administrador Familiar',
      avatar: 'parent-male',
      themeColor: '#6366f1',
      createdAt: nowIso,
      updatedAt: nowIso
    },
    {
      id: 'child_principal',
      familyId: family.id,
      role: 'CHILD',
      name: 'Mi Alcancía',
      age: 10,
      avatar: 'piggy',
      themeColor: '#10b981',
      goalTitle: 'Mi Meta de Ahorro',
      goalTargetCents: 100000, // $1,000.00
      goalIcon: 'target',
      createdAt: nowIso,
      updatedAt: nowIso
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
      description: 'Mesada periódica entregada por Papá o Mamá',
      isActive: true,
      updatedAt: nowIso
    },
    {
      id: 'cat_inc_chores',
      familyId: family.id,
      type: 'INCOME_SOURCE',
      name: 'Tareas Extra en Casa',
      icon: 'sparkles',
      color: '#06b6d4',
      description: 'Ayudar en casa, jardín o lavar el auto',
      isActive: true,
      updatedAt: nowIso
    },
    {
      id: 'cat_inc_grades',
      familyId: family.id,
      type: 'INCOME_SOURCE',
      name: 'Buenas Calificaciones',
      icon: 'trophy',
      color: '#f59e0b',
      description: 'Premio por esfuerzo escolar y lectura',
      isActive: true,
      updatedAt: nowIso
    },
    {
      id: 'cat_inc_gift',
      familyId: family.id,
      type: 'INCOME_SOURCE',
      name: 'Regalo / Cumpleaños',
      icon: 'gift',
      color: '#8b5cf6',
      description: 'Regalos de familiares o fechas especiales',
      isActive: true,
      updatedAt: nowIso
    },
    {
      id: 'cat_inc_yield',
      familyId: family.id,
      type: 'INCOME_SOURCE',
      name: 'Ganancia por Guardar a Plazo',
      icon: 'trending-up',
      color: '#14b8a6',
      description: 'Premio ganado por ahorrar a plazo fijo',
      isActive: true,
      updatedAt: nowIso
    },

    // Categorías de Gastos (Iconos SVG)
    {
      id: 'cat_exp_snacks',
      familyId: family.id,
      type: 'EXPENSE_CATEGORY',
      name: 'Dulces, Helados y Snacks',
      icon: 'icecream',
      color: '#ec4899',
      description: 'Antojos, postres y salidas',
      isActive: true,
      updatedAt: nowIso
    },
    {
      id: 'cat_exp_toys',
      familyId: family.id,
      type: 'EXPENSE_CATEGORY',
      name: 'Juguetes y Juegos',
      icon: 'puzzle',
      color: '#f43f5e',
      description: 'Juegos de mesa, figuras o pasatiempos',
      isActive: true,
      updatedAt: nowIso
    },
    {
      id: 'cat_exp_games',
      familyId: family.id,
      type: 'EXPENSE_CATEGORY',
      name: 'Videojuegos y Apps',
      icon: 'gamepad',
      color: '#6366f1',
      description: 'Juegos digitales y accesorios',
      isActive: true,
      updatedAt: nowIso
    },
    {
      id: 'cat_exp_books',
      familyId: family.id,
      type: 'EXPENSE_CATEGORY',
      name: 'Libros, Arte y Deporte',
      icon: 'palette',
      color: '#0ea5e9',
      description: 'Libros, dibujo y equipo deportivo',
      isActive: true,
      updatedAt: nowIso
    },
    {
      id: 'cat_exp_outings',
      familyId: family.id,
      type: 'EXPENSE_CATEGORY',
      name: 'Salidas con Amigos',
      icon: 'popcorn',
      color: '#f97316',
      description: 'Cine, paseos y convivios',
      isActive: true,
      updatedAt: nowIso
    },
    {
      id: 'cat_exp_loan',
      familyId: family.id,
      type: 'EXPENSE_CATEGORY',
      name: 'Pago de Préstamo',
      icon: 'credit-card',
      color: '#a855f7',
      description: 'Pagos a préstamos de Papá o Mamá',
      isActive: true,
      updatedAt: nowIso
    }
  ];

  return {
    family: {
      ...family,
      investmentPlans: buildDefaultInvestmentPlans(nowIso),
      rulesConfig: buildDefaultRulesConfig(nowIso)
    },
    members,
    catalogs,
    recurringRules: [],
    loans: [],
    investments: [],
    childRequests: [],
    tasks: [],
    taskClaims: [],
    taskReviews: [],
    finePresets: buildDefaultFinePresets(family.id, nowIso),
    ledgerEvents: [],
    lastSyncedAt: nowIso
  };
}

/* ==========================================================================
   TAREAS, MULTAS Y PLANES DE AHORRO (Propuesta final tras 2 rondas de revisión)
   Montos en centavos MXN. Bandas de edad: '9_12' y '13_17'.
   ========================================================================== */
const AGE_BANDS = ['9_12', '13_17'];

/** Plantillas de tareas (EXTRA = con pago; RESPONSIBILITY = responsabilidad sin pago). */
const TASK_TEMPLATES = [
  { id: 'tpl_car', kind: 'EXTRA', title: 'Lavar el coche', description: 'Por dentro y por fuera, sin dejar manchas.', iconKey: 'car', unit: 'ONCE', rewardByBand: { '9_12': 4000, '13_17': 7000 } },
  { id: 'tpl_laundry', kind: 'EXTRA', title: 'Lavar y doblar la ropa de la familia', description: 'Separar colores, lavar, doblar y guardar.', iconKey: 'shirt', unit: 'ONCE', rewardByBand: { '9_12': 2000, '13_17': 3500 } },
  { id: 'tpl_cook', kind: 'EXTRA', title: 'Ayudar a cocinar la comida del domingo', description: 'Ayudar a preparar y a dejar la cocina limpia.', iconKey: 'food', unit: 'ONCE', rewardByBand: { '9_12': 2500, '13_17': 4000 } },
  { id: 'tpl_closet', kind: 'EXTRA', title: 'Organizar clóset o bodega', description: 'Ordenar, separar lo que ya no se usa y limpiar.', iconKey: 'broom', unit: 'ONCE', rewardByBand: { '9_12': 3000, '13_17': 5000 } },
  { id: 'tpl_yard', kind: 'EXTRA', title: 'Limpiar patio o ventanas', description: 'Barrer, regar plantas o limpiar vidrios.', iconKey: 'plant', unit: 'ONCE', rewardByBand: { '9_12': 3500, '13_17': 6000 } },
  { id: 'tpl_grocery', kind: 'EXTRA', title: 'Reto: lista del súper con presupuesto', description: 'Arma la lista de la semana sin pasarte del presupuesto que te demos.', iconKey: 'cart', unit: 'ONCE', rewardByBand: { '9_12': 2500, '13_17': 4000 } },
  { id: 'tpl_book', kind: 'EXTRA', title: 'Reto: leer un libro y contarlo', description: 'Lee un libro completo y cuéntanos de qué trató.', iconKey: 'book', unit: 'ONCE', rewardByBand: { '9_12': 4000, '13_17': 6000 } },
  { id: 'tpl_noscreens', kind: 'EXTRA', title: 'Reto: fin de semana sin pantallas', description: 'Sábado y domingo sin videojuegos ni redes sociales.', iconKey: 'phone', unit: 'WEEK', rewardByBand: { '9_12': 3000, '13_17': 5000 } },
  { id: 'tpl_babysit', kind: 'EXTRA', title: 'Cuidar a un hermano menor 2 horas', description: 'Solo para 13 a 17 años. Cuidarlo con atención y sin pantallas.', iconKey: 'users', unit: 'ONCE', rewardByBand: { '9_12': 0, '13_17': 6000 } },
  { id: 'tpl_bed', kind: 'RESPONSIBILITY', title: 'Tender tu cama', description: 'Responsabilidad diaria. No se paga: es parte de vivir en familia.', iconKey: 'bed', unit: 'WEEK', rewardByBand: { '9_12': 0, '13_17': 0 } },
  { id: 'tpl_room', kind: 'RESPONSIBILITY', title: 'Recoger tu cuarto', description: 'Responsabilidad. No se paga.', iconKey: 'broom', unit: 'WEEK', rewardByBand: { '9_12': 0, '13_17': 0 } },
  { id: 'tpl_dishes', kind: 'RESPONSIBILITY', title: 'Lavar tus trastes', description: 'Responsabilidad. No se paga.', iconKey: 'dish', unit: 'WEEK', rewardByBand: { '9_12': 0, '13_17': 0 } },
  { id: 'tpl_trash', kind: 'RESPONSIBILITY', title: 'Tu turno de sacar la basura', description: 'Responsabilidad. No se paga.', iconKey: 'trash', unit: 'WEEK', rewardByBand: { '9_12': 0, '13_17': 0 } },
  { id: 'tpl_homework', kind: 'RESPONSIBILITY', title: 'Hacer la tarea de la escuela', description: 'Responsabilidad. No se paga.', iconKey: 'book', unit: 'WEEK', rewardByBand: { '9_12': 0, '13_17': 0 } }
];

/** Límites de validación de multas por nivel (centavos) por banda de edad. */
const FINE_LEVEL_LIMITS = {
  LEVE: { '9_12': [500, 1000], '13_17': [1000, 2000] },
  MEDIA: { '9_12': [1500, 3000], '13_17': [2500, 6000] },
  GRAVE: { '9_12': [100, 8000], '13_17': [100, 15000] }
};
function buildDefaultFinePresets(familyId = 'fam_smartpiggy_01', nowIso = new Date().toISOString()) {
  const base = { familyId, active: true, updatedAt: nowIso };
  return [
    { ...base, id: 'fine_lights', kind: 'FIXED', level: 'LEVE', title: 'Dejar luces o TV prendidas sin nadie', description: 'Cuidamos la energía y el dinero de la luz.', iconKey: 'bulb', amountByBand: { '9_12': 500, '13_17': 1000 } },
    { ...base, id: 'fine_mess', kind: 'FIXED', level: 'LEVE', title: 'No recoger tus cosas después de 2 avisos', description: 'Se avisa dos veces antes de aplicar la multa.', iconKey: 'broom', amountByBand: { '9_12': 1000, '13_17': 1500 } },
    { ...base, id: 'fine_food', kind: 'FIXED', level: 'LEVE', title: 'Desperdiciar comida a propósito', description: 'Servirte solo lo que te vas a comer.', iconKey: 'food', amountByBand: { '9_12': 500, '13_17': 1000 } },
    { ...base, id: 'fine_phone', kind: 'FIXED', level: 'MEDIA', title: 'Usar el celular en horario no permitido', description: 'Durante la comida, en la noche o en horas de escuela.', iconKey: 'phone', amountByBand: { '9_12': 2000, '13_17': 4000 } },
    { ...base, id: 'fine_respect', kind: 'FIXED', level: 'MEDIA', title: 'Groserías o faltas de respeto', description: 'Hablar con respeto a todos en casa.', iconKey: 'alert-triangle', amountByBand: { '9_12': 2500, '13_17': 5000 } },
    { ...base, id: 'fine_screentime', kind: 'FIXED', level: 'MEDIA', title: 'Pasarte del tiempo de pantallas acordado', description: 'Respetar el tiempo de videojuegos y redes que acordamos.', iconKey: 'clock', amountByBand: { '9_12': 1500, '13_17': 2500 } },
    { ...base, id: 'fine_broken', kind: 'REPAIR', level: 'GRAVE', title: 'Romper algo por descuido (reparación)', description: 'Pagas el 50% del costo hasta un tope. Si lo confiesas tú solo, pagas la mitad.', iconKey: 'broken', amountByBand: { '9_12': 8000, '13_17': 15000 } },
    { ...base, id: 'fine_damage', kind: 'REPAIR', level: 'GRAVE', title: 'Dañar algo ajeno (escuela, vecino)', description: 'Ayudas a reparar con el 50% del costo hasta un tope. Si lo confiesas, pagas la mitad.', iconKey: 'broken', amountByBand: { '9_12': 8000, '13_17': 15000 } }
  ];
}
function buildDefaultInvestmentPlans(nowIso = new Date().toISOString()) {
  return [
    { id: 'SHORT', label: 'Corto plazo (1 mes)', termDays: 30, yieldBpsByBand: { '9_12': 100, '13_17': 75 }, minPrincipalCents: 5000, earlyExit: 'PRINCIPAL_ONLY', version: 1, updatedAt: nowIso },
    { id: 'MEDIUM', label: 'Mediano plazo (6 meses)', termDays: 182, yieldBpsByBand: { '9_12': 620, '13_17': 500 }, minPrincipalCents: 10000, earlyExit: 'HALF_ACCRUED', version: 1, updatedAt: nowIso },
    { id: 'LONG', label: 'Largo plazo (1 año)', termDays: 365, yieldBpsByBand: { '9_12': 1300, '13_17': 1200 }, minPrincipalCents: 20000, earlyExit: 'HALF_ACCRUED', version: 1, updatedAt: nowIso }
  ];
}
function buildDefaultRulesConfig(nowIso = new Date().toISOString()) {
  return {
    taskMonthlyCapByBand: { '9_12': 30000, '13_17': 60000 },
    fineMonthlyCapByBand: { '9_12': 10000, '13_17': 20000 },
    fineMinCapByBand: { '9_12': 500, '13_17': 1000 },
    fineIncomePct: 25,
    investCapByBand: { '9_12': 150000, '13_17': 300000 },
    updatedAt: nowIso
  };
}

/**
 * Agrega a un estado existente (creado antes de esta versión) las colecciones y configuraciones nuevas
 * sin tocar los datos del usuario.
 */
function ensureFeatureDefaults(state) {
  if (!state || !state.family) return state;
  state.tasks = Array.isArray(state.tasks) ? state.tasks : [];
  state.taskClaims = Array.isArray(state.taskClaims) ? state.taskClaims : [];
  state.taskReviews = Array.isArray(state.taskReviews) ? state.taskReviews : [];
  if (!Array.isArray(state.finePresets)) {
    const deleted = state.family.deletedIds || {};
    state.finePresets = buildDefaultFinePresets(state.family.id, '2026-01-01T00:00:00.000Z').filter((p) => !deleted[p.id]);
  }
  if (!Array.isArray(state.family.investmentPlans) || state.family.investmentPlans.length !== 3) {
    state.family.investmentPlans = buildDefaultInvestmentPlans('2026-01-01T00:00:00.000Z');
  }
  if (!state.family.rulesConfig || typeof state.family.rulesConfig !== 'object') {
    state.family.rulesConfig = buildDefaultRulesConfig('2026-01-01T00:00:00.000Z');
  }
  if (!state.catalogs?.some((c) => c.id === 'cat_exp_fines')) {
    state.catalogs = state.catalogs || [];
    state.catalogs.push({
      id: 'cat_exp_fines',
      familyId: state.family.id,
      type: 'EXPENSE_CATEGORY',
      name: 'Multas y Reparaciones',
      icon: 'scale',
      color: '#ef4444',
      description: 'Multas de las reglas de la casa',
      isActive: true,
      updatedAt: '2026-01-01T00:00:00.000Z'
    });
  }
  return state;
}


  /* === rules-features.js === */
/**
 * SmartPiggy Cloud - Tareas y Retos, Reglas de la Casa (Multas) y Planes de Ahorro preestablecidos.
 * Especificación final v1 tras 2 rondas de revisión (Agente de Propuesta vs. Agente de Controversia):
 * - Tareas EXTRA (con pago) vs RESPONSABILIDADES (sin pago); cupo único, N cupos o "para todos".
 *   El hijo solo crea "claims" sin firma; el dinero solo se mueve con TASK_REWARD firmado por Papá/Mamá
 *   (ID determinista det_task_{taskId}_{memberId}) y el monto se recalcula desde la tarea vigente al aprobar.
 * - Multas LEVE / MEDIA / GRAVE (reparación 50% del costo con tope). El cargo real se calcula al reproducir
 *   el libro: min(monto, dinero libre, tope mensual) => nunca saldo negativo ni deuda. Apelación 72 h.
 * - Planes de ahorro CORTO (1 mes), MEDIANO (6 meses) y LARGO (1 año) con tasas por banda de edad fijadas
 *   por los papás; cada inversión congela su tasa en el asiento firmado (sigVersion 2).
 */




const TASK_ICON_KEYS = ['broom', 'dish', 'trash', 'bed', 'car', 'shirt', 'book', 'cart', 'plant', 'pet', 'phone', 'bulb', 'food', 'star', 'sparkles', 'users', 'trophy', 'flag', 'clock', 'target'];
const FINE_ICON_KEYS = ['bulb', 'broom', 'food', 'phone', 'alert-triangle', 'clock', 'broken', 'scale', 'flag', 'x'];
const LEVEL_META = {
  LEVE: { label: 'Leve', color: '#eab308', bg: 'rgba(234,179,8,0.14)' },
  MEDIA: { label: 'Media', color: '#f97316', bg: 'rgba(249,115,22,0.14)' },
  GRAVE: { label: 'Grave', color: '#ef4444', bg: 'rgba(239,68,68,0.14)' }
};
const PLAN_ICONS = { SHORT: 'seed', MEDIUM: 'sprout', LONG: 'tree' };
const BAND_LABEL = { '9_12': '9 a 12 años', '13_17': '13 a 17 años' };
const MAX_ACTIVE_TASKS = 5;
const APPEAL_WINDOW_HOURS = 72;

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function shortId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function annualizedPct(bps, termDays) {
  return (Number(bps) / 100) * (365 / Math.max(1, Number(termDays)));
}
function installRulesFeatures(AppClass) {
  const methods = {
    /* ----------------------------------------------------------------------
       Utilidades de configuración
       ---------------------------------------------------------------------- */
    getMemberBand(member) {
      return getAgeBand(member?.age);
    },

    getRulesConfig() {
      return { ...buildDefaultRulesConfig(), ...(this.state?.family?.rulesConfig || {}) };
    },

    getInvestmentPlans() {
      const plans = this.state?.family?.investmentPlans;
      return Array.isArray(plans) && plans.length === 3 ? plans : buildDefaultInvestmentPlans();
    },

    getPlan(planId) {
      return this.getInvestmentPlans().find((p) => p.id === planId) || null;
    },

    getTaskBoard() {
      return deriveTaskBoard({
        tasks: this.state.tasks || [],
        taskClaims: this.state.taskClaims || [],
        taskReviews: this.state.taskReviews || [],
        validEvents: this.auditResult.validEvents,
        referenceLocalDate: getTodayLocalDate()
      });
    },

    isTaskEligible(task, member) {
      if (!member || member.role !== 'CHILD') return false;
      if (Array.isArray(task.eligibleMemberIds) && task.eligibleMemberIds.length > 0 && !task.eligibleMemberIds.includes(member.id)) {
        return false;
      }
      if (task.kind === 'EXTRA' && Number(task.rewardByBand?.[this.getMemberBand(member)] || 0) <= 0) return false;
      return true;
    },

    getFinance(memberId, extraEvents = []) {
      return reduceMemberFinancialState({
        memberId,
        validEvents: [...this.auditResult.validEvents, ...extraEvents],
        loans: this.state.loans,
        investments: this.state.investments,
        catalogs: this.state.catalogs,
        referenceLocalDate: getTodayLocalDate()
      });
    },

    /** "¿Quién eres?" — en dispositivos compartidos el hijo confirma su identidad antes de actuar. */
    pickChild(titleText = '¿Quién eres?') {
      const children = this.getChildren();
      if (children.length <= 1) return Promise.resolve(children[0]?.id || null);
      if (this.currentRole === 'PARENT') return Promise.resolve(this.selectedChildId);
      return new Promise((resolve) => {
        const dlg = document.getElementById('dialogWhoAreYou');
        const list = document.getElementById('whoAreYouList');
        const title = document.getElementById('whoAreYouTitle');
        if (!dlg || !list) {
          resolve(this.selectedChildId);
          return;
        }
        title.innerHTML = `${renderSvgIcon('user', 19)} ${esc(titleText)}`;
        list.innerHTML = children
          .map(
            (c) => `
            <button type="button" class="child-chip" data-who-member="${c.id}" style="--chip-color: ${c.themeColor || '#10b981'}; width: 100%; justify-content: flex-start;">
              <span class="child-avatar" style="color: ${c.themeColor || '#10b981'}; display: flex;">${renderSvgIcon(c.avatar || 'piggy', 26)}</span>
              <span style="font-weight: 800;">${esc(c.name)}</span>
            </button>`
          )
          .join('');
        let settled = false;
        const finish = (val) => {
          if (settled) return;
          settled = true;
          list.removeEventListener('click', onClick);
          dlg.removeEventListener('close', onClose);
          if (dlg.open) dlg.close();
          resolve(val);
        };
        const onClick = (e) => {
          const btn = e.target.closest('[data-who-member]');
          if (btn) finish(btn.getAttribute('data-who-member'));
        };
        const onClose = () => finish(null);
        list.addEventListener('click', onClick);
        dlg.addEventListener('close', onClose);
        dlg.showModal();
      });
    },

    /* ----------------------------------------------------------------------
       RENDER: TAREAS Y RETOS
       ---------------------------------------------------------------------- */
    renderTasksSection(child, currency) {
      const container = document.getElementById('tasksBoardContainer');
      const reviewEl = document.getElementById('tasksReviewContainer');
      const doneEl = document.getElementById('tasksDoneContainer');
      if (!container || !reviewEl || !doneEl) return;

      const board = this.getTaskBoard();
      const memberById = new Map((this.state.members || []).map((m) => [m.id, m]));
      const statusLabel = {
        ACCEPTED: ['badge-info', 'clock', 'La está haciendo'],
        NEEDS_FIX: ['badge-warn', 'alert-triangle', 'Falta algo, inténtalo otra vez'],
        SUBMITTED: ['badge-purple', 'inbox', 'Esperando a papá/mamá'],
        APPROVED: ['badge-success', 'check', '¡Aprobada!'],
        REJECTED: ['badge-danger', 'x', 'No aprobada'],
        WITHDRAWN: ['badge-info', 'undo', 'Ya no pudo'],
        EXPIRED: ['badge-danger', 'clock', 'Se acabó el tiempo'],
        BUMPED: ['badge-warn', 'users', 'Alguien la tomó primero']
      };

      // 1) Bandeja "Por revisar"
      const toReview = [];
      board.forEach((b) => b.assignments.filter((a) => a.status === 'SUBMITTED').forEach((a) => toReview.push({ b, a })));
      const btnApproveAll = document.getElementById('btnApproveAllTasks');
      if (btnApproveAll) {
        btnApproveAll.style.display = toReview.length > 1 ? '' : 'none';
        btnApproveAll.innerHTML = `${renderSvgIcon('check', 15)} Aprobar todo (${toReview.length})`;
      }
      reviewEl.innerHTML =
        toReview.length === 0
          ? `<p style="color: var(--text-muted); font-size: 0.86rem; margin: 0;">No hay tareas esperando revisión.</p>`
          : toReview
              .map(({ b, a }) => {
                const m = memberById.get(a.memberId) || { name: 'Hijo/a' };
                const amount = b.task.kind === 'EXTRA' ? Number(b.task.rewardByBand?.[this.getMemberBand(m)] || 0) : 0;
                return `
                <div class="tx-item">
                  <div class="tx-left">
                    <div class="tx-icon" style="color: var(--color-invest);">${renderSvgIcon(b.task.iconKey || 'checklist', 20)}</div>
                    <div>
                      <p class="tx-title">${esc(m.name)} terminó: ${esc(b.task.title)}</p>
                      <p class="tx-sub">Intento ${a.attempt} de 2 · ${b.task.kind === 'EXTRA' ? `Pago: <strong>${formatMoneyCents(amount, currency)}</strong>` : 'Responsabilidad (sin pago)'}</p>
                    </div>
                  </div>
                  <div class="tx-right" style="flex-wrap: wrap; gap: 0.35rem; justify-content: flex-end;">
                    <button type="button" class="btn btn-income btn-sm" data-task-approve="${b.task.id}:${a.memberId}">
                      ${renderSvgIcon('check', 14)} ${b.task.kind === 'EXTRA' ? 'Aprobar y pagar' : 'Aprobar'}
                    </button>
                    <button type="button" class="btn btn-ghost btn-sm" data-task-reject="${b.task.id}:${a.memberId}">
                      ${renderSvgIcon('alert-triangle', 14)} Falta algo
                    </button>
                  </div>
                </div>`;
              })
              .join('');

      // 2) Tareas abiertas
      const open = board.filter((b) => b.isOpen);
      const closed = board.filter((b) => !b.isOpen);
      const band = this.getMemberBand(child);

      container.innerHTML =
        open.length === 0
          ? `<p style="color: var(--text-muted);">No hay tareas ni retos abiertos. Papá o Mamá pueden crear uno con <strong>Crear tarea</strong>.</p>`
          : open
              .map((b) => {
                const t = b.task;
                const reward = Number(t.rewardByBand?.[band] || 0);
                const eligible = this.isTaskEligible(t, child);
                const mine = b.assignments.find((a) => a.memberId === child.id);
                const slotsText = b.slotsTotal === Infinity ? 'Para todos' : `Quedan ${b.slotsLeft} de ${b.slotsTotal}`;
                const chips = b.assignments
                  .map((a) => {
                    const m = memberById.get(a.memberId) || { name: 'Hijo/a' };
                    const [cls, icon, label] = statusLabel[a.status] || ['badge-info', 'clock', a.status];
                    return `<span class="badge ${cls}">${renderSvgIcon(icon, 12)} ${esc(m.name)}: ${label}</span>`;
                  })
                  .join(' ');

                let childAction = '';
                if (!mine || mine.status === 'WITHDRAWN') {
                  if (!eligible) {
                    childAction = `<span class="badge badge-info">No disponible para ${esc(child.name)}</span>`;
                  } else if (b.slotsLeft > 0) {
                    childAction = `<button type="button" class="btn btn-income btn-sm" data-task-claim="${t.id}">${renderSvgIcon('hand-raise', 14)} ¡Yo la hago!</button>`;
                  } else {
                    childAction = `<span class="badge badge-warn">${renderSvgIcon('users', 12)} Cupos llenos</span>`;
                  }
                } else if (mine.status === 'ACCEPTED' || mine.status === 'NEEDS_FIX') {
                  childAction = `
                    <button type="button" class="btn btn-income btn-sm" data-task-submit="${t.id}:${child.id}">${renderSvgIcon('check', 14)} ¡Ya terminé!</button>
                    <button type="button" class="btn btn-ghost btn-sm" data-task-withdraw="${t.id}:${child.id}">${renderSvgIcon('undo', 14)} Ya no puedo</button>`;
                }

                return `
                <div class="panel-card" style="margin-bottom: 0; background: var(--bg-elevated);">
                  <div class="panel-header" style="margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.35rem;">
                    <span class="badge ${t.kind === 'EXTRA' ? 'badge-success' : 'badge-info'}">
                      ${t.kind === 'EXTRA' ? `${renderSvgIcon('coins', 12)} Extra con pago` : `${renderSvgIcon('shield-check', 12)} Responsabilidad`}
                    </span>
                    <span class="badge badge-purple">${renderSvgIcon('users', 12)} ${slotsText}</span>
                  </div>
                  <h3 class="inline-icon-text" style="margin: 0 0 0.3rem 0; font-size: 1.04rem;">
                    ${renderSvgIcon(t.iconKey || 'checklist', 19)} <span>${esc(t.title)}</span>
                  </h3>
                  <p style="margin: 0 0 0.5rem 0; font-size: 0.82rem; color: var(--text-secondary);">${esc(t.description || '')}</p>
                  <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.5rem;">
                    <div style="font-family: var(--font-mono); font-size: 1.3rem; font-weight: 800; color: ${t.kind === 'EXTRA' ? 'var(--color-income)' : 'var(--text-muted)'};">
                      ${t.kind === 'EXTRA' ? (reward > 0 ? `+${formatMoneyCents(reward, currency)}` : '—') : 'Sin pago'}
                    </div>
                    <span class="inline-icon-text" style="font-size: 0.8rem; color: var(--text-secondary);">
                      ${renderSvgIcon('calendar', 13)} Hasta el ${esc(t.dueDate)} · ${t.unit === 'WEEK' ? 'por semana' : 'una vez'}
                    </span>
                  </div>
                  ${t.kind === 'EXTRA' ? `<p style="margin: 0 0 0.5rem 0; font-size: 0.75rem; color: var(--text-muted);">Pago 9–12: ${formatMoneyCents(t.rewardByBand?.['9_12'] || 0, currency)} · 13–17: ${formatMoneyCents(t.rewardByBand?.['13_17'] || 0, currency)}</p>` : ''}
                  <div style="display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.65rem;">${chips}</div>
                  <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                    ${childAction}
                    <button type="button" class="btn btn-ghost btn-sm" data-task-edit="${t.id}">${renderSvgIcon('edit', 14)} Editar</button>
                    <button type="button" class="btn btn-ghost btn-sm" data-task-repeat="${t.id}">${renderSvgIcon('repeat', 14)} Repetir la próxima semana</button>
                    <button type="button" class="btn btn-ghost btn-sm" data-task-close="${t.id}">${renderSvgIcon('stop', 14)} Cerrar</button>
                    <button type="button" class="btn btn-ghost btn-sm" data-task-delete="${t.id}" style="color: var(--color-expense);">${renderSvgIcon('trash', 14)} Borrar</button>
                  </div>
                </div>`;
              })
              .join('');

      // 3) Terminadas o cerradas
      doneEl.innerHTML =
        closed.length === 0
          ? `<p style="color: var(--text-muted); font-size: 0.86rem; margin: 0;">Aún no hay tareas terminadas.</p>`
          : closed
              .slice(-15)
              .reverse()
              .map((b) => {
                const t = b.task;
                const approved = b.assignments.filter((a) => a.status === 'APPROVED');
                const names = approved.map((a) => esc(memberById.get(a.memberId)?.name || 'Hijo/a')).join(', ');
                return `
                <div class="tx-item">
                  <div class="tx-left">
                    <div class="tx-icon">${renderSvgIcon(t.iconKey || 'checklist', 20)}</div>
                    <div>
                      <p class="tx-title">${esc(t.title)}</p>
                      <p class="tx-sub">Cerró el ${esc(t.dueDate)} · ${approved.length > 0 ? `La hicieron: ${names}` : 'Nadie la terminó'}</p>
                    </div>
                  </div>
                  <div class="tx-right" style="gap: 0.35rem; flex-wrap: wrap;">
                    ${b.assignments.some((a) => a.status === 'SUBMITTED') ? `<span class="badge badge-purple">Por revisar</span>` : ''}
                    <button type="button" class="btn btn-ghost btn-sm" data-task-repeat="${t.id}">${renderSvgIcon('repeat', 14)} Repetir</button>
                    <button type="button" class="btn btn-ghost btn-sm" data-task-delete="${t.id}" style="color: var(--color-expense);">${renderSvgIcon('trash', 14)} Borrar</button>
                  </div>
                </div>`;
              })
              .join('');
    },

    /* ----------------------------------------------------------------------
       RENDER: REGLAS DE LA CASA (MULTAS)
       ---------------------------------------------------------------------- */
    renderRulesSection(child, childFinance, currency) {
      const presetsEl = document.getElementById('finePresetsContainer');
      const finesEl = document.getElementById('childFinesContainer');
      const capEl = document.getElementById('fineCapInfoBox');
      if (!presetsEl || !finesEl) return;

      const band = this.getMemberBand(child);
      const cfg = this.getRulesConfig();

      if (capEl) {
        const fixedCap = Number(cfg.fineMonthlyCapByBand?.[band] || 0);
        const minCap = Number(cfg.fineMinCapByBand?.[band] || 0);
        const pctCap = Math.floor((childFinance.income30Cents * Number(cfg.fineIncomePct || 25)) / 100);
        const cap = Math.min(fixedCap, Math.max(minCap, pctCap));
        capEl.innerHTML = `
          ${renderSvgIcon('shield-check', 18)}
          <span><strong>Protección para ${esc(child.name)} (${BAND_LABEL[band]}):</strong>
          en 30 días las multas no pueden pasar de <strong>${formatMoneyCents(cap, currency)}</strong>
          (el menor entre ${formatMoneyCents(fixedCap, currency)} y el ${cfg.fineIncomePct}% de lo que recibió: ${formatMoneyCents(childFinance.income30Cents, currency)}).
          Ya usado: <strong>${formatMoneyCents(childFinance.fines30Cents, currency)}</strong>. Una multa nunca deja tu alcancía en negativo.</span>`;
      }

      const presets = (this.state.finePresets || []).filter((p) => p.active !== false);
      presetsEl.innerHTML = ['LEVE', 'MEDIA', 'GRAVE']
        .map((level) => {
          const meta = LEVEL_META[level];
          const items = presets.filter((p) => p.level === level);
          if (items.length === 0) return '';
          return `
          <div style="margin-bottom: 1rem;">
            <h4 class="inline-icon-text" style="margin: 0 0 0.5rem 0; color: ${meta.color};">
              <span class="badge" style="background: ${meta.bg}; color: ${meta.color}; border: 1px solid ${meta.color};">${renderSvgIcon('flag', 12)} ${meta.label}</span>
            </h4>
            <div class="tx-list">
              ${items
                .map(
                  (p) => `
                <div class="tx-item">
                  <div class="tx-left">
                    <div class="tx-icon" style="color: ${meta.color};">${renderSvgIcon(p.iconKey || 'scale', 20)}</div>
                    <div>
                      <p class="tx-title">${esc(p.title)}</p>
                      <p class="tx-sub">${esc(p.description || '')}</p>
                      <p class="tx-sub" style="font-family: var(--font-mono);">
                        ${p.kind === 'REPAIR' ? 'Reparación: 50% del costo · tope ' : ''}9–12: ${formatMoneyCents(p.amountByBand?.['9_12'] || 0, currency)} · 13–17: ${formatMoneyCents(p.amountByBand?.['13_17'] || 0, currency)}
                      </p>
                    </div>
                  </div>
                  <div class="tx-right" style="gap: 0.35rem; flex-wrap: wrap;">
                    <button type="button" class="btn btn-ghost btn-sm" data-fine-apply="${p.id}">${renderSvgIcon('scale', 14)} Aplicar</button>
                    <button type="button" class="btn btn-ghost btn-sm" data-fine-preset-edit="${p.id}">${renderSvgIcon('edit', 14)} Editar</button>
                    <button type="button" class="btn btn-ghost btn-sm" data-fine-preset-delete="${p.id}" style="color: var(--color-expense);">${renderSvgIcon('trash', 14)} Borrar</button>
                  </div>
                </div>`
                )
                .join('')}
            </div>
          </div>`;
        })
        .join('');

      // Multas del hijo seleccionado
      const fines = childFinance.timeline.filter((ev) => ev.type === 'FINE');
      const appeals = (this.state.childRequests || []).filter((r) => r.requestType === 'FINE_APPEAL');
      finesEl.innerHTML =
        fines.length === 0
          ? `<p style="color: var(--text-muted); font-size: 0.86rem; margin: 0;">${esc(child.name)} no tiene multas. ¡Muy bien!</p>`
          : fines
              .map((ev) => {
                const meta = LEVEL_META[ev.metadata?.level] || LEVEL_META.LEVE;
                const appeal = appeals.find((r) => r.refId === ev.id);
                const partialRev = ev.refundedCents > 0;
                const hoursSince = (Date.now() - new Date(ev.createdAt).getTime()) / 3600000;
                let statusBadge = `<span class="badge badge-danger">Aplicada</span>`;
                if (ev.isReversed) statusBadge = `<span class="badge badge-success">${renderSvgIcon('check', 12)} Quitada</span>`;
                else if (appeal && appeal.status === 'PENDING') statusBadge = `<span class="badge badge-warn">${renderSvgIcon('clock', 12)} En revisión</span>`;
                else if (partialRev) statusBadge = `<span class="badge badge-info">Bajada a la mitad</span>`;
                else if (appeal && appeal.status === 'REJECTED') statusBadge = `<span class="badge badge-danger">Se mantuvo</span>`;

                const canAppeal = !ev.isReversed && !appeal && hoursSince <= APPEAL_WINDOW_HOURS;
                const pendingAppeal = appeal && appeal.status === 'PENDING';
                return `
                <div class="tx-item ${ev.isReversed ? 'reversed' : ''}">
                  <div class="tx-left">
                    <div class="tx-icon" style="color: ${meta.color};">${renderSvgIcon(ev.metadata?.iconKey || 'scale', 20)}</div>
                    <div>
                      <p class="tx-title">${esc(ev.metadata?.titleSnapshot || ev.note || 'Multa')} ${statusBadge}</p>
                      <p class="tx-sub">${esc(ev.localDate)} · Nivel ${meta.label}${ev.metadata?.confessed ? ' · Lo confesó solo (mitad)' : ''} · Motivo: ${esc(ev.metadata?.reason || '')}</p>
                      <p class="tx-sub" style="font-family: var(--font-mono);">
                        Multa: ${formatMoneyCents(ev.amountCents, currency)} · Se cobró: <strong style="color: var(--color-expense);">${formatMoneyCents(ev.isReversed ? 0 : ev.chargedCents || 0, currency)}</strong>
                        ${!ev.isReversed && ev.forgivenCents > 0 ? ` · Perdonado: <strong style="color: var(--color-income);">${formatMoneyCents(ev.forgivenCents, currency)}</strong>` : ''}
                        ${partialRev ? ` · Devuelto: ${formatMoneyCents(ev.refundedCents, currency)}` : ''}
                      </p>
                    </div>
                  </div>
                  <div class="tx-right" style="gap: 0.35rem; flex-wrap: wrap; justify-content: flex-end;">
                    ${canAppeal ? `<button type="button" class="btn btn-ghost btn-sm" data-fine-appeal="${ev.id}">${renderSvgIcon('hand-raise', 14)} No estoy de acuerdo</button>` : ''}
                    ${
                      pendingAppeal
                        ? `<button type="button" class="btn btn-ghost btn-sm" data-fine-resolve="${ev.id}:KEEP">Mantener</button>
                           <button type="button" class="btn btn-income btn-sm" data-fine-resolve="${ev.id}:REMOVE">Quitar multa</button>
                           <button type="button" class="btn btn-ghost btn-sm" data-fine-resolve="${ev.id}:HALF">Bajar a la mitad</button>`
                        : !ev.isReversed && !partialRev
                          ? `<button type="button" class="btn btn-ghost btn-sm" data-fine-resolve="${ev.id}:REMOVE">${renderSvgIcon('undo', 14)} Quitar multa</button>`
                          : ''
                    }
                  </div>
                </div>`;
              })
              .join('');
    },

    /* ----------------------------------------------------------------------
       RENDER: PLANES DE AHORRO (CORTO / MEDIANO / LARGO)
       ---------------------------------------------------------------------- */
    renderInvestmentPlansPanel(child, currency) {
      const el = document.getElementById('investmentPlansContainer');
      if (!el) return;
      const band = this.getMemberBand(child);
      const cfg = this.getRulesConfig();
      const cap = Number(cfg.investCapByBand?.[band] || 0);
      el.innerHTML = this.getInvestmentPlans()
        .map((p) => {
          const bps = Number(p.yieldBpsByBand?.[band] || 0);
          const example = 10000;
          const exampleGain = Math.floor((example * bps) / 10000);
          const capGain = Math.floor((cap * bps) / 10000);
          const exitText =
            p.id === 'SHORT'
              ? 'Si lo sacas antes: recuperas lo que pusiste, sin ganancia.'
              : 'Si lo sacas antes (después de 30 días): recuperas lo que pusiste + la mitad de lo ganado.';
          return `
          <div class="panel-card" style="margin-bottom: 0; background: var(--bg-elevated); border-top: 3px solid var(--color-invest);">
            <h3 class="inline-icon-text" style="margin: 0 0 0.3rem 0; font-size: 1.05rem;">
              <span style="color: var(--color-income); display: flex;">${renderSvgIcon(PLAN_ICONS[p.id] || 'trending-up', 22)}</span>
              <span>${esc(p.label)}</span>
            </h3>
            <p style="margin: 0 0 0.4rem 0; font-size: 0.82rem; color: var(--text-secondary);">${p.termDays} días · mínimo ${formatMoneyCents(p.minPrincipalCents, currency)}</p>
            <div style="font-size: 1.02rem; font-weight: 800; margin-bottom: 0.35rem;">
              Si guardas ${formatMoneyCents(example, currency)}, recibes <span style="color: var(--color-income);">${formatMoneyCents(example + exampleGain, currency)}</span>
            </div>
            <p style="margin: 0 0 0.35rem 0; font-size: 0.8rem; color: var(--text-secondary);">
              Con el máximo (${formatMoneyCents(cap, currency)}) ganarías <strong style="color: var(--color-income);">+${formatMoneyCents(capGain, currency)}</strong>.
            </p>
            <p style="margin: 0 0 0.7rem 0; font-size: 0.76rem; color: var(--text-muted);">${exitText}</p>
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-invest btn-sm" data-plan-invest="${p.id}">${renderSvgIcon('lock', 14)} Invertir</button>
              <button type="button" class="btn btn-ghost btn-sm" data-plan-request="${p.id}">${renderSvgIcon('send', 14)} Pedir esta inversión</button>
            </div>
          </div>`;
        })
        .join('');

      const note = document.getElementById('investmentPlansNote');
      if (note) {
        note.textContent = `Tasas para ${child.name} (${BAND_LABEL[band]}). Tope total guardado a plazo: ${formatMoneyCents(cap, currency)}. Las tasas las fijan Papá y Mamá; cada ahorro conserva la tasa del día en que se creó.`;
      }
    },

    /* ----------------------------------------------------------------------
       TAREAS: Papá/Mamá
       ---------------------------------------------------------------------- */
    openTaskDialog(editTaskId = null) {
      this.runAsParent(() => {
        const task = editTaskId ? (this.state.tasks || []).find((t) => t.id === editTaskId) : null;
        const tplSelect = document.getElementById('taskTemplateSelect');
        tplSelect.innerHTML =
          `<option value="">— Elegir una plantilla (opcional) —</option>` +
          ['EXTRA', 'RESPONSIBILITY']
            .map(
              (kind) =>
                `<optgroup label="${kind === 'EXTRA' ? 'Extras con pago' : 'Responsabilidades (sin pago)'}">` +
                TASK_TEMPLATES.filter((t) => t.kind === kind)
                  .map((t) => `<option value="${t.id}">${esc(t.title)}</option>`)
                  .join('') +
                `</optgroup>`
            )
            .join('');
        document.getElementById('taskIconSelect').innerHTML = TASK_ICON_KEYS.map((k) => `<option value="${k}">${k}</option>`).join('');
        document.getElementById('taskEligibleBox').innerHTML = this.getChildren()
          .map(
            (c) => `
            <label class="inline-icon-text" style="font-size: 0.86rem; gap: 0.35rem;">
              <input type="checkbox" value="${c.id}" class="task-eligible-check" ${!task || !task.eligibleMemberIds?.length || task.eligibleMemberIds.includes(c.id) ? 'checked' : ''} />
              ${esc(c.name)} (${c.age || 10})
            </label>`
          )
          .join('');

        document.getElementById('taskEditIdInput').value = task ? task.id : '';
        document.getElementById('dialogTaskTitle').innerHTML = task
          ? `${renderSvgIcon('edit', 19)} Modificar Tarea o Reto`
          : `${renderSvgIcon('checklist', 19)} Crear Tarea o Reto`;
        tplSelect.parentElement.style.display = task ? 'none' : '';
        this.fillTaskForm(
          task || {
            kind: 'EXTRA',
            title: '',
            description: '',
            iconKey: 'star',
            unit: 'ONCE',
            rewardByBand: { '9_12': 2000, '13_17': 3000 },
            maxAssignees: 1,
            dueDate: addDaysLocalDate(getTodayLocalDate(), 7)
          }
        );
        document.getElementById('dialogTask')?.showModal();
      });
    },

    fillTaskForm(t) {
      document.getElementById('taskKindSelect').value = t.kind || 'EXTRA';
      document.getElementById('taskTitleInput').value = t.title || '';
      document.getElementById('taskDescInput').value = t.description || '';
      document.getElementById('taskIconSelect').value = TASK_ICON_KEYS.includes(t.iconKey) ? t.iconKey : 'star';
      document.getElementById('taskUnitSelect').value = t.unit || 'ONCE';
      document.getElementById('taskReward912Input').value = ((t.rewardByBand?.['9_12'] || 0) / 100).toFixed(0);
      document.getElementById('taskReward1317Input').value = ((t.rewardByBand?.['13_17'] || 0) / 100).toFixed(0);
      const slots = t.maxAssignees === null || t.maxAssignees === undefined ? 'ALL' : String(t.maxAssignees);
      document.getElementById('taskSlotsSelect').value = ['1', '2', '3', 'ALL'].includes(slots) ? slots : '1';
      if (t.dueDate) document.getElementById('taskDueDateInput').value = t.dueDate;
      this.syncTaskKindUi();
    },

    syncTaskKindUi() {
      const isExtra = document.getElementById('taskKindSelect').value === 'EXTRA';
      document.getElementById('taskRewardGroup912').style.display = isExtra ? '' : 'none';
      document.getElementById('taskRewardGroup1317').style.display = isExtra ? '' : 'none';
      document.getElementById('taskKindHint').textContent = isExtra
        ? 'Extra con pago: algo adicional a las responsabilidades de casa.'
        : 'Responsabilidad: parte de vivir en familia. Se registra y se aprueba, pero no se paga.';
    },

    async submitTaskForm() {
      await this.runAsParent(async () => {
        const editId = document.getElementById('taskEditIdInput').value.trim();
        const kind = document.getElementById('taskKindSelect').value;
        const title = document.getElementById('taskTitleInput').value.trim();
        const r912 = kind === 'EXTRA' ? toCents(document.getElementById('taskReward912Input').value || 0) : 0;
        const r1317 = kind === 'EXTRA' ? toCents(document.getElementById('taskReward1317Input').value || 0) : 0;
        const slotsVal = document.getElementById('taskSlotsSelect').value;
        const dueDate = document.getElementById('taskDueDateInput').value || addDaysLocalDate(getTodayLocalDate(), 7);
        const eligibleMemberIds = Array.from(document.querySelectorAll('.task-eligible-check'))
          .filter((c) => c.checked)
          .map((c) => c.value);

        if (!title) {
          this.showToast('Escribe el nombre de la tarea.', 'warn');
          return;
        }
        if (kind === 'EXTRA') {
          const bad = [r912, r1317].some((v) => v !== 0 && (v < 100 || v > 50000));
          if (bad || (r912 === 0 && r1317 === 0)) {
            this.showToast('El pago de una tarea extra debe ser de $1 a $500 (pon $0 en una edad si no aplica).', 'warn');
            return;
          }
        }
        if (dueDate > addDaysLocalDate(getTodayLocalDate(), 90)) {
          this.showToast('La fecha límite debe ser dentro de los próximos 90 días.', 'warn');
          return;
        }
        if (eligibleMemberIds.length === 0) {
          this.showToast('Elige al menos un hijo/a que pueda hacer la tarea.', 'warn');
          return;
        }

        const allChildren = this.getChildren().map((c) => c.id);
        const data = {
          kind,
          title,
          description: document.getElementById('taskDescInput').value.trim(),
          iconKey: document.getElementById('taskIconSelect').value,
          unit: document.getElementById('taskUnitSelect').value,
          rewardByBand: { '9_12': r912, '13_17': r1317 },
          maxAssignees: slotsVal === 'ALL' ? null : Number(slotsVal),
          eligibleMemberIds: eligibleMemberIds.length === allChildren.length ? [] : eligibleMemberIds,
          dueDate,
          updatedAt: new Date().toISOString()
        };

        if (editId) {
          const existing = (this.state.tasks || []).find((t) => t.id === editId);
          if (existing) Object.assign(existing, data);
        } else {
          this.state.tasks.push({
            id: `task_${shortId()}`,
            familyId: this.state.family.id,
            status: 'OPEN',
            clonedFrom: null,
            createdBy: this.activeParentId,
            createdAt: new Date().toISOString(),
            ...data
          });
        }
        document.getElementById('dialogTask')?.close();
        await this.cloudManager.pushState(this.state);
        this.renderAll();
        this.showToast(editId ? 'Tarea actualizada.' : `Tarea "${title}" publicada para tus hijos.`, 'success');
      });
    },

    async handleRepeatTask(taskId) {
      await this.runAsParent(async () => {
        const t = (this.state.tasks || []).find((x) => x.id === taskId);
        if (!t) return;
        const today = getTodayLocalDate();
        const base = t.dueDate && t.dueDate > today ? t.dueDate : today;
        const clone = {
          ...t,
          id: `task_${shortId()}`,
          status: 'OPEN',
          clonedFrom: t.id,
          dueDate: addDaysLocalDate(base, 7),
          createdBy: this.activeParentId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.state.tasks.push(clone);
        await this.cloudManager.pushState(this.state);
        this.renderAll();
        this.showToast(`"${t.title}" se repetirá hasta el ${clone.dueDate}.`, 'success');
      });
    },

    async handleCloseTask(taskId) {
      await this.runAsParent(async () => {
        const t = (this.state.tasks || []).find((x) => x.id === taskId);
        if (!t) return;
        t.status = 'CLOSED';
        t.updatedAt = new Date().toISOString();
        await this.cloudManager.pushState(this.state);
        this.renderAll();
        this.showToast('Tarea cerrada. Ya no se puede tomar.', 'info');
      });
    },

    async handleDeleteTask(taskId) {
      await this.runAsParent(async () => {
        if (!window.confirm('¿Borrar esta tarea? Los pagos ya hechos se quedan en el historial.')) return;
        this.markDeletedId(taskId);
        (this.state.taskClaims || []).filter((c) => c.taskId === taskId).forEach((c) => this.markDeletedId(c.id));
        (this.state.taskReviews || []).filter((r) => r.taskId === taskId).forEach((r) => this.markDeletedId(r.id));
        this.state.tasks = (this.state.tasks || []).filter((t) => t.id !== taskId);
        this.state.taskClaims = (this.state.taskClaims || []).filter((c) => c.taskId !== taskId);
        this.state.taskReviews = (this.state.taskReviews || []).filter((r) => r.taskId !== taskId);
        await this.cloudManager.pushState(this.state);
        this.renderAll();
        this.showToast('Tarea borrada.', 'info');
      });
    },

    /** Calcula el pago (recalculado desde la tarea vigente, nunca desde el claim) y el estado del tope mensual. */
    computeTaskPayment(task, member) {
      const band = this.getMemberBand(member);
      const amount = task.kind === 'EXTRA' ? Number(task.rewardByBand?.[band] || 0) : 0;
      const cap = Number(this.getRulesConfig().taskMonthlyCapByBand?.[band] || 0);
      const today = getTodayLocalDate();
      const windowStart = addDaysLocalDate(today, -30);
      const reversed = new Set(this.auditResult.validEvents.filter((e) => e.type === 'REVERSAL').map((e) => e.targetEventId));
      const paid30 = this.auditResult.validEvents
        .filter((e) => e.type === 'TASK_REWARD' && e.memberId === member.id && !reversed.has(e.id) && e.localDate > windowStart && e.localDate <= today)
        .reduce((s, e) => s + Number(e.amountCents || 0), 0);
      return { band, amount, cap, paid30, remaining: Math.max(0, cap - paid30) };
    },

    async payTaskReward(task, member, amountCents, overCapReason = '') {
      const today = getTodayLocalDate();
      const signed = await createSignedLedgerEvent(
        {
          id: `det_task_${task.id}_${member.id}`,
          familyId: this.state.family.id,
          memberId: member.id,
          createdByParentId: this.activeParentId,
          type: 'TASK_REWARD',
          amountCents,
          catalogId: 'cat_inc_chores',
          referenceId: task.id,
          note: `Tarea aprobada: ${task.title}`,
          metadata: {
            taskId: task.id,
            ageBand: this.getMemberBand(member),
            titleSnapshot: task.title,
            overCap: Boolean(overCapReason),
            overCapReason
          },
          localDate: today
        },
        this.parentSigningKey,
        this.state.family.saltHex,
        this.getLastEventHash()
      );
      this.state.ledgerEvents = (this.state.ledgerEvents || []).filter((e) => e.id !== signed.id);
      this.state.ledgerEvents.push(signed);
    },

    async approveTaskAssignment(taskId, memberId, { bulk = false } = {}) {
      const task = (this.state.tasks || []).find((t) => t.id === taskId);
      const member = (this.state.members || []).find((m) => m.id === memberId);
      if (!task || !member) return false;
      const assignment = this.getTaskBoard()
        .find((b) => b.task.id === taskId)
        ?.assignments.find((a) => a.memberId === memberId);
      if (!assignment || assignment.status !== 'SUBMITTED') return false;

      if (task.kind === 'EXTRA') {
        const pay = this.computeTaskPayment(task, member);
        if (pay.amount < 100 || pay.amount > 50000) {
          this.showToast(`El pago de "${task.title}" (${formatMoneyCents(pay.amount)}) está fuera del rango permitido ($1–$500). Edita la tarea.`, 'warn');
          return false;
        }
        let amount = pay.amount;
        let reason = '';
        if (pay.paid30 + amount > pay.cap) {
          if (bulk) {
            reason = 'Excedente autorizado al aprobar todo';
          } else if (pay.remaining > 0) {
            const full = window.confirm(
              `${member.name} llegaría a su límite mensual por tareas (${formatMoneyCents(pay.cap)}; ya recibió ${formatMoneyCents(pay.paid30)}).\n\n` +
                `ACEPTAR = pagar completo ${formatMoneyCents(amount)} (excedente autorizado).\nCANCELAR = pagar solo ${formatMoneyCents(pay.remaining)} (hasta el límite).`
            );
            if (full) reason = 'Excedente autorizado por Papá/Mamá';
            else amount = pay.remaining;
          } else {
            const full = window.confirm(
              `${member.name} ya llegó a su límite mensual por tareas (${formatMoneyCents(pay.cap)}).\n\n¿Pagar de todos modos ${formatMoneyCents(amount)}? (Se registra como excedente autorizado.)`
            );
            if (!full) return false;
            reason = 'Excedente autorizado por Papá/Mamá';
          }
        }
        await this.payTaskReward(task, member, amount, reason);
      }

      const review = {
        id: `rev_${task.id}_${member.id}_${assignment.attempt}`,
        familyId: this.state.family.id,
        taskId: task.id,
        memberId: member.id,
        attempt: assignment.attempt,
        decision: 'APPROVED',
        note: '',
        reviewedBy: this.activeParentId,
        updatedAt: new Date().toISOString()
      };
      this.state.taskReviews = (this.state.taskReviews || []).filter((r) => r.id !== review.id);
      this.state.taskReviews.push(review);
      return true;
    },

    async handleApproveTask(taskId, memberId) {
      await this.runAsParent(async () => {
        const ok = await this.approveTaskAssignment(taskId, memberId);
        if (!ok) return;
        await this.cloudManager.pushState(this.state);
        await this.runLedgerAuditAndRender();
        this.showToast('¡Tarea aprobada! El pago ya está en la alcancía.', 'success');
      });
    },

    async handleApproveAllTasks() {
      const pending = [];
      this.getTaskBoard().forEach((b) =>
        b.assignments.filter((a) => a.status === 'SUBMITTED').forEach((a) => pending.push({ task: b.task, a }))
      );
      if (pending.length === 0) {
        this.showToast('No hay tareas por revisar.', 'info');
        return;
      }
      await this.runAsParent(async () => {
        let total = 0;
        let overCap = false;
        const lines = pending.map(({ task, a }) => {
          const m = (this.state.members || []).find((x) => x.id === a.memberId);
          const pay = this.computeTaskPayment(task, m);
          total += pay.amount;
          if (task.kind === 'EXTRA' && pay.paid30 + pay.amount > pay.cap) overCap = true;
          return `• ${m?.name}: ${task.title} → ${task.kind === 'EXTRA' ? formatMoneyCents(pay.amount) : 'sin pago'}`;
        });
        const ok = window.confirm(
          `Vas a aprobar ${pending.length} tarea(s):\n\n${lines.join('\n')}\n\nTotal a pagar: ${formatMoneyCents(total)}${overCap ? '\n(Incluye pagos por encima del límite mensual; quedarán registrados como excedente autorizado.)' : ''}\n\n¿Aprobar todo?`
        );
        if (!ok) return;
        let done = 0;
        for (const { task, a } of pending) {
          if (await this.approveTaskAssignment(task.id, a.memberId, { bulk: true })) done++;
        }
        await this.cloudManager.pushState(this.state);
        await this.runLedgerAuditAndRender();
        this.showToast(`Se aprobaron ${done} tarea(s).`, 'success');
      });
    },

    async handleRejectTask(taskId, memberId) {
      await this.runAsParent(async () => {
        const assignment = this.getTaskBoard()
          .find((b) => b.task.id === taskId)
          ?.assignments.find((a) => a.memberId === memberId);
        if (!assignment || assignment.status !== 'SUBMITTED') return;
        const note = window.prompt('¿Qué le falta? (se lo mostraremos a tu hijo/a)', 'Le falta terminar bien una parte.') || '';
        const review = {
          id: `rev_${taskId}_${memberId}_${assignment.attempt}`,
          familyId: this.state.family.id,
          taskId,
          memberId,
          attempt: assignment.attempt,
          decision: 'REJECTED',
          note: note.trim(),
          reviewedBy: this.activeParentId,
          updatedAt: new Date().toISOString()
        };
        this.state.taskReviews = (this.state.taskReviews || []).filter((r) => r.id !== review.id);
        this.state.taskReviews.push(review);
        await this.cloudManager.pushState(this.state);
        this.renderAll();
        this.showToast(assignment.attempt >= 2 ? 'Segundo intento no aprobado: la tarea queda cerrada para este hijo/a.' : 'Se avisó que falta algo. Puede intentarlo una vez más.', 'info');
      });
    },

    /* ----------------------------------------------------------------------
       TAREAS: Hijos (sin PIN, solo "claims")
       ---------------------------------------------------------------------- */
    async handleClaimTask(taskId) {
      const memberId = await this.pickChild('¿Quién va a hacer esta tarea?');
      if (!memberId) return;
      const member = (this.state.members || []).find((m) => m.id === memberId);
      const board = this.getTaskBoard();
      const entry = board.find((b) => b.task.id === taskId);
      if (!entry || !member) return;
      if (!entry.isOpen) {
        this.showToast('Esta tarea ya cerró.', 'warn');
        return;
      }
      if (!this.isTaskEligible(entry.task, member)) {
        this.showToast(`Esta tarea no está disponible para ${member.name}.`, 'warn');
        return;
      }
      const current = entry.assignments.find((a) => a.memberId === memberId);
      if (current && current.status !== 'WITHDRAWN') {
        this.showToast('Ya tomaste esta tarea.', 'info');
        return;
      }
      if (entry.slotsLeft <= 0) {
        this.showToast('Alguien la tomó primero. ¡Busca otra!', 'warn');
        return;
      }
      const activeCount = board.reduce(
        (n, b) => n + b.assignments.filter((a) => a.memberId === memberId && ['ACCEPTED', 'NEEDS_FIX', 'SUBMITTED'].includes(a.status)).length,
        0
      );
      if (activeCount >= MAX_ACTIVE_TASKS) {
        this.showToast(`Ya tienes ${MAX_ACTIVE_TASKS} tareas activas. Termina una antes de tomar otra.`, 'warn');
        return;
      }
      const nowIso = new Date().toISOString();
      const claim = {
        id: `claim_${taskId}_${memberId}`,
        familyId: this.state.family.id,
        taskId,
        memberId,
        stage: 'ACCEPTED',
        attempt: 1,
        createdAt: nowIso,
        submittedAt: null,
        note: '',
        updatedAt: nowIso
      };
      this.state.taskClaims = (this.state.taskClaims || []).filter((c) => c.id !== claim.id);
      this.state.taskClaims.push(claim);
      this.selectedChildId = memberId;
      await this.cloudManager.pushState(this.state);
      this.renderAll();
      this.showToast(`¡Listo, ${member.name}! La tarea es tuya. Cuando termines toca "¡Ya terminé!".`, 'success');
    },

    async updateOwnClaim(taskId, memberId, mutateFn, confirmTitle) {
      const who = await this.pickChild(confirmTitle);
      if (!who) return false;
      if (who !== memberId) {
        const m = (this.state.members || []).find((x) => x.id === memberId);
        this.showToast(`Solo ${m?.name || 'quien tomó la tarea'} puede cambiar su tarea.`, 'warn');
        return false;
      }
      const claim = (this.state.taskClaims || []).find((c) => c.taskId === taskId && c.memberId === memberId);
      if (!claim) return false;
      mutateFn(claim);
      claim.updatedAt = new Date().toISOString();
      await this.cloudManager.pushState(this.state);
      this.renderAll();
      return true;
    },

    async handleSubmitTask(taskId, memberId) {
      const assignment = this.getTaskBoard()
        .find((b) => b.task.id === taskId)
        ?.assignments.find((a) => a.memberId === memberId);
      if (!assignment || !['ACCEPTED', 'NEEDS_FIX'].includes(assignment.status)) return;
      const ok = await this.updateOwnClaim(
        taskId,
        memberId,
        (claim) => {
          claim.attempt = assignment.status === 'NEEDS_FIX' ? Math.min(2, assignment.attempt + 1) : assignment.attempt;
          claim.stage = 'SUBMITTED';
          claim.submittedAt = new Date().toISOString();
        },
        '¿Quién terminó la tarea?'
      );
      if (ok) this.showToast('¡Bien hecho! Papá o Mamá la revisará pronto.', 'success');
    },

    async handleWithdrawTask(taskId, memberId) {
      const ok = await this.updateOwnClaim(
        taskId,
        memberId,
        (claim) => {
          claim.stage = 'WITHDRAWN';
        },
        '¿Quién ya no puede hacer la tarea?'
      );
      if (ok) this.showToast('Está bien. Liberaste el lugar para alguien más.', 'info');
    },

    /* ----------------------------------------------------------------------
       MULTAS
       ---------------------------------------------------------------------- */
    openFineDialog(presetId = null) {
      this.runAsParent(() => {
        const sel = document.getElementById('finePresetSelect');
        const presets = (this.state.finePresets || []).filter((p) => p.active !== false);
        sel.innerHTML = ['LEVE', 'MEDIA', 'GRAVE']
          .map(
            (lvl) =>
              `<optgroup label="${LEVEL_META[lvl].label}">` +
              presets
                .filter((p) => p.level === lvl)
                .map((p) => `<option value="${p.id}">${esc(p.title)}</option>`)
                .join('') +
              `</optgroup>`
          )
          .join('');
        if (presetId) sel.value = presetId;
        document.getElementById('fineChildSelect').innerHTML = this.getChildren()
          .map((c) => `<option value="${c.id}" ${c.id === this.selectedChildId ? 'selected' : ''}>${esc(c.name)} (${c.age || 10} años)</option>`)
          .join('');
        document.getElementById('fineReasonInput').value = '';
        document.getElementById('fineRepairCostInput').value = '';
        document.getElementById('fineConfessedCheck').checked = false;
        this.updateFinePreview();
        document.getElementById('dialogFine')?.showModal();
      });
    },

    buildFineDraft() {
      const preset = (this.state.finePresets || []).find((p) => p.id === document.getElementById('finePresetSelect').value);
      const member = (this.state.members || []).find((m) => m.id === document.getElementById('fineChildSelect').value);
      if (!preset || !member) return null;
      const band = this.getMemberBand(member);
      const cfg = this.getRulesConfig();
      const confessed = document.getElementById('fineConfessedCheck').checked;
      let nominal = Number(preset.amountByBand?.[band] || 0);
      let repairCostCents = 0;
      if (preset.kind === 'REPAIR') {
        repairCostCents = toCents(document.getElementById('fineRepairCostInput').value || 0);
        nominal = Math.min(Math.floor(repairCostCents * 0.5), nominal);
      }
      if (confessed) nominal = Math.floor(nominal / 2);
      const limits = FINE_LEVEL_LIMITS[preset.level]?.[band] || [0, 50000];
      nominal = Math.min(nominal, limits[1]);
      return {
        preset,
        member,
        band,
        nominal,
        confessed,
        repairCostCents,
        metadata: {
          level: preset.level,
          kind: preset.kind,
          presetId: preset.id,
          iconKey: preset.iconKey || 'scale',
          ageBand: band,
          monthlyCapCents: Number(cfg.fineMonthlyCapByBand?.[band] || 0),
          minCapCents: Number(cfg.fineMinCapByBand?.[band] || 0),
          incomePct: Number(cfg.fineIncomePct || 25),
          confessed,
          repairCostCents,
          titleSnapshot: preset.title,
          reason: document.getElementById('fineReasonInput').value.trim()
        }
      };
    },

    updateFinePreview() {
      const box = document.getElementById('finePreviewBox');
      const repairGroup = document.getElementById('fineRepairGroup');
      const draft = this.buildFineDraft();
      if (!draft || !box) return;
      repairGroup.style.display = draft.preset.kind === 'REPAIR' ? '' : 'none';
      const fake = {
        id: 'zz_preview_fine',
        type: 'FINE',
        memberId: draft.member.id,
        amountCents: draft.nominal,
        localDate: getTodayLocalDate(),
        createdAt: new Date().toISOString(),
        sigVersion: 2,
        metadata: draft.metadata
      };
      const after = this.getFinance(draft.member.id, [fake]);
      const before = this.getFinance(draft.member.id);
      const entry = after.timeline.find((e) => e.id === 'zz_preview_fine') || { chargedCents: 0, forgivenCents: draft.nominal };
      const currency = this.state.family.currency || 'MXN';
      box.innerHTML = `
        <div><strong>Multa:</strong> ${formatMoneyCents(draft.nominal, currency)} ${draft.confessed ? '(mitad por confesar)' : ''}${draft.preset.kind === 'REPAIR' ? ` · 50% de ${formatMoneyCents(draft.repairCostCents, currency)} con tope` : ''}</div>
        <div style="margin-top: 0.3rem;">Se descontarán <strong style="color: var(--color-expense);">${formatMoneyCents(entry.chargedCents, currency)}</strong>.
        Te quedarán <strong>${formatMoneyCents(before.availableCents - entry.chargedCents, currency)}</strong>.</div>
        ${entry.forgivenCents > 0 ? `<div style="margin-top: 0.3rem; color: var(--color-income);">Solo se pueden cobrar ${formatMoneyCents(entry.chargedCents, currency)}; se perdonan ${formatMoneyCents(entry.forgivenCents, currency)} (por el dinero libre o el tope del mes).</div>` : ''}`;
    },

    async submitFineForm() {
      await this.runAsParent(async () => {
        const draft = this.buildFineDraft();
        if (!draft) return;
        if (!draft.metadata.reason) {
          this.showToast('Escribe el motivo de la multa (es obligatorio).', 'warn');
          return;
        }
        if (draft.preset.kind === 'REPAIR' && draft.repairCostCents <= 0) {
          this.showToast('Escribe cuánto cuesta reparar o reponer lo dañado.', 'warn');
          return;
        }
        if (draft.nominal <= 0) {
          this.showToast('El monto de la multa queda en $0.00.', 'warn');
          return;
        }
        const signed = await createSignedLedgerEvent(
          {
            id: `det_fine_${shortId()}`,
            familyId: this.state.family.id,
            memberId: draft.member.id,
            createdByParentId: this.activeParentId,
            type: 'FINE',
            amountCents: draft.nominal,
            catalogId: 'cat_exp_fines',
            referenceId: draft.preset.id,
            note: `Multa: ${draft.preset.title}`,
            metadata: draft.metadata,
            localDate: getTodayLocalDate()
          },
          this.parentSigningKey,
          this.state.family.saltHex,
          this.getLastEventHash()
        );
        this.state.ledgerEvents.push(signed);
        this.selectedChildId = draft.member.id;
        document.getElementById('dialogFine')?.close();
        await this.cloudManager.pushState(this.state);
        await this.runLedgerAuditAndRender();
        this.showToast(`Multa aplicada a ${draft.member.name}. Tiene 72 horas para decir "No estoy de acuerdo".`, 'info');
      });
    },

    async handleFineAppeal(eventId) {
      const ev = this.auditResult.validEvents.find((e) => e.id === eventId && e.type === 'FINE');
      if (!ev) return;
      const who = await this.pickChild('¿Quién no está de acuerdo con la multa?');
      if (!who) return;
      if (who !== ev.memberId) {
        this.showToast('Solo quien recibió la multa puede pedir que se revise.', 'warn');
        return;
      }
      const hours = (Date.now() - new Date(ev.createdAt).getTime()) / 3600000;
      if (hours > APPEAL_WINDOW_HOURS) {
        this.showToast('Pasaron más de 72 horas; ya no se puede pedir revisión.', 'warn');
        return;
      }
      const reqId = `req_app_${eventId}`;
      if ((this.state.childRequests || []).some((r) => r.id === reqId)) {
        this.showToast('Ya pediste revisar esta multa.', 'info');
        return;
      }
      const why = window.prompt('Cuéntale a Papá o Mamá por qué no estás de acuerdo:', '') || '';
      const child = (this.state.members || []).find((m) => m.id === ev.memberId);
      const nowIso = new Date().toISOString();
      this.state.childRequests = this.state.childRequests || [];
      this.state.childRequests.push({
        id: reqId,
        familyId: this.state.family.id,
        memberId: ev.memberId,
        requestType: 'FINE_APPEAL',
        refId: eventId,
        title: `Revisar multa: ${ev.metadata?.titleSnapshot || ev.note}`,
        amountCents: ev.amountCents,
        note: why.trim() ? `${child?.name || 'Hijo/a'} dice: "${why.trim()}"` : `${child?.name || 'Hijo/a'} pide revisar la multa.`,
        status: 'PENDING',
        createdAt: nowIso,
        updatedAt: nowIso
      });
      await this.cloudManager.pushState(this.state);
      this.renderAll();
      this.showToast('Listo. Papá o Mamá revisará tu multa.', 'success');
    },

    /** Resolución: KEEP (mantener), REMOVE (REVERSAL total) o HALF (REVERSAL parcial de la mitad de lo cobrado). */
    async resolveFine(eventId, action) {
      await this.runAsParent(async () => {
        const ev = this.auditResult.validEvents.find((e) => e.id === eventId && e.type === 'FINE');
        if (!ev) return;
        const appeal = (this.state.childRequests || []).find((r) => r.id === `req_app_${eventId}`);
        const nowIso = new Date().toISOString();

        if (action !== 'KEEP') {
          if (this.state.ledgerEvents.some((e) => e.id === `det_rev_${eventId}`)) {
            this.showToast('Esta multa ya fue ajustada.', 'info');
            return;
          }
          const entry = this.getFinance(ev.memberId).timeline.find((t) => t.id === eventId) || {};
          const charged = Number(entry.chargedCents || 0);
          const partial = action === 'HALF';
          const refund = partial ? Math.floor(charged / 2) : ev.amountCents;
          const signedRev = await createSignedLedgerEvent(
            {
              id: `det_rev_${eventId}`,
              familyId: this.state.family.id,
              memberId: ev.memberId,
              createdByParentId: this.activeParentId,
              type: 'REVERSAL',
              amountCents: refund,
              catalogId: 'cat_exp_fines',
              targetEventId: eventId,
              note: partial ? `Multa bajada a la mitad: ${ev.metadata?.titleSnapshot || ''}` : `Multa quitada: ${ev.metadata?.titleSnapshot || ''}`,
              metadata: { partial },
              localDate: getTodayLocalDate()
            },
            this.parentSigningKey,
            this.state.family.saltHex,
            this.getLastEventHash()
          );
          this.state.ledgerEvents.push(signedRev);
        }

        if (appeal && appeal.status === 'PENDING') {
          appeal.status = action === 'KEEP' ? 'REJECTED' : 'APPROVED';
          appeal.resolution = action;
          appeal.updatedAt = nowIso;
        }
        await this.cloudManager.pushState(this.state);
        await this.runLedgerAuditAndRender();
        this.showToast(
          action === 'KEEP' ? 'La multa se mantiene.' : action === 'HALF' ? 'Multa bajada a la mitad; se devolvió el dinero.' : 'Multa quitada; se devolvió el dinero.',
          action === 'KEEP' ? 'info' : 'success'
        );
      });
    },

    openFinePresetDialog(presetId = null) {
      this.runAsParent(() => {
        const p = presetId ? (this.state.finePresets || []).find((x) => x.id === presetId) : null;
        document.getElementById('fpEditIdInput').value = p ? p.id : '';
        document.getElementById('dialogFinePresetTitle').innerHTML = p
          ? `${renderSvgIcon('edit', 19)} Modificar Regla / Multa`
          : `${renderSvgIcon('scale', 19)} Nueva Regla con Multa`;
        document.getElementById('fpIconSelect').innerHTML = FINE_ICON_KEYS.map((k) => `<option value="${k}">${k}</option>`).join('');
        document.getElementById('fpLevelSelect').value = p?.level || 'LEVE';
        document.getElementById('fpKindSelect').value = p?.kind || 'FIXED';
        document.getElementById('fpTitleInput').value = p?.title || '';
        document.getElementById('fpDescInput').value = p?.description || '';
        document.getElementById('fpAmount912Input').value = ((p?.amountByBand?.['9_12'] || 500) / 100).toFixed(0);
        document.getElementById('fpAmount1317Input').value = ((p?.amountByBand?.['13_17'] || 1000) / 100).toFixed(0);
        document.getElementById('fpIconSelect').value = FINE_ICON_KEYS.includes(p?.iconKey) ? p.iconKey : 'scale';
        this.syncFinePresetHint();
        document.getElementById('dialogFinePreset')?.showModal();
      });
    },

    syncFinePresetHint() {
      const level = document.getElementById('fpLevelSelect').value;
      const kind = document.getElementById('fpKindSelect').value;
      const l = FINE_LEVEL_LIMITS[level];
      document.getElementById('fpLimitsHint').textContent =
        kind === 'REPAIR'
          ? `Reparación: se cobra el 50% del costo hasta el tope que pongas (máximo 9–12: ${formatMoneyCents(l['9_12'][1])}, 13–17: ${formatMoneyCents(l['13_17'][1])}).`
          : `Rango permitido ${LEVEL_META[level].label}: 9–12 de ${formatMoneyCents(l['9_12'][0])} a ${formatMoneyCents(l['9_12'][1])} · 13–17 de ${formatMoneyCents(l['13_17'][0])} a ${formatMoneyCents(l['13_17'][1])}.`;
    },

    async submitFinePresetForm() {
      await this.runAsParent(async () => {
        const editId = document.getElementById('fpEditIdInput').value.trim();
        const level = document.getElementById('fpLevelSelect').value;
        const kind = document.getElementById('fpKindSelect').value;
        const title = document.getElementById('fpTitleInput').value.trim();
        const a912 = toCents(document.getElementById('fpAmount912Input').value || 0);
        const a1317 = toCents(document.getElementById('fpAmount1317Input').value || 0);
        const l = FINE_LEVEL_LIMITS[level];
        const minA = kind === 'REPAIR' ? 100 : null;
        const ok912 = a912 >= (minA ?? l['9_12'][0]) && a912 <= l['9_12'][1];
        const ok1317 = a1317 >= (minA ?? l['13_17'][0]) && a1317 <= l['13_17'][1];
        if (!title) {
          this.showToast('Escribe el nombre de la regla.', 'warn');
          return;
        }
        if (!ok912 || !ok1317) {
          this.showToast('Los montos están fuera del rango permitido para ese nivel.', 'warn');
          return;
        }
        const data = {
          level,
          kind,
          title,
          description: document.getElementById('fpDescInput').value.trim(),
          iconKey: document.getElementById('fpIconSelect').value,
          amountByBand: { '9_12': a912, '13_17': a1317 },
          active: true,
          updatedAt: new Date().toISOString()
        };
        if (editId) {
          const existing = (this.state.finePresets || []).find((p) => p.id === editId);
          if (existing) Object.assign(existing, data);
        } else {
          this.state.finePresets.push({ id: `fine_${shortId()}`, familyId: this.state.family.id, ...data });
        }
        document.getElementById('dialogFinePreset')?.close();
        await this.cloudManager.pushState(this.state);
        this.renderAll();
        this.showToast('Reglas de la casa actualizadas.', 'success');
      });
    },

    async handleDeleteFinePreset(presetId) {
      await this.runAsParent(async () => {
        if (!window.confirm('¿Borrar esta regla? Las multas ya aplicadas se quedan en el historial.')) return;
        this.markDeletedId(presetId);
        this.state.finePresets = (this.state.finePresets || []).filter((p) => p.id !== presetId);
        await this.cloudManager.pushState(this.state);
        this.renderAll();
        this.showToast('Regla borrada.', 'info');
      });
    },

    /* ----------------------------------------------------------------------
       PLANES DE AHORRO Y LÍMITES (Ajustes de Papá/Mamá)
       ---------------------------------------------------------------------- */
    openPlansDialog() {
      this.runAsParent(() => {
        const plans = this.getInvestmentPlans();
        const cfg = this.getRulesConfig();
        document.getElementById('plansEditorBody').innerHTML = plans
          .map(
            (p) => `
            <tr>
              <td><strong>${esc(p.label)}</strong><br/><span style="font-size: 0.75rem; color: var(--text-muted);">${p.termDays} días</span></td>
              <td><input type="number" class="form-input" id="planRate_${p.id}_9_12" min="0" max="25" step="0.05" value="${(Number(p.yieldBpsByBand?.['9_12'] || 0) / 100).toFixed(2)}" /></td>
              <td><input type="number" class="form-input" id="planRate_${p.id}_13_17" min="0" max="25" step="0.05" value="${(Number(p.yieldBpsByBand?.['13_17'] || 0) / 100).toFixed(2)}" /></td>
              <td><input type="number" class="form-input" id="planMin_${p.id}" min="1" step="1" value="${(Number(p.minPrincipalCents || 0) / 100).toFixed(0)}" /></td>
            </tr>`
          )
          .join('');
        const setVal = (id, cents) => {
          const el = document.getElementById(id);
          if (el) el.value = (Number(cents || 0) / 100).toFixed(0);
        };
        setVal('cfgInvestCap912', cfg.investCapByBand['9_12']);
        setVal('cfgInvestCap1317', cfg.investCapByBand['13_17']);
        setVal('cfgTaskCap912', cfg.taskMonthlyCapByBand['9_12']);
        setVal('cfgTaskCap1317', cfg.taskMonthlyCapByBand['13_17']);
        setVal('cfgFineCap912', cfg.fineMonthlyCapByBand['9_12']);
        setVal('cfgFineCap1317', cfg.fineMonthlyCapByBand['13_17']);
        this.updatePlansCostPreview();
        document.getElementById('dialogPlans')?.showModal();
      });
    },

    readPlansForm() {
      const plans = this.getInvestmentPlans().map((p) => ({
        ...p,
        yieldBpsByBand: {
          '9_12': Math.round(Number(document.getElementById(`planRate_${p.id}_9_12`)?.value || 0) * 100),
          '13_17': Math.round(Number(document.getElementById(`planRate_${p.id}_13_17`)?.value || 0) * 100)
        },
        minPrincipalCents: toCents(document.getElementById(`planMin_${p.id}`)?.value || 0)
      }));
      const caps = {
        investCapByBand: { '9_12': toCents(document.getElementById('cfgInvestCap912').value || 0), '13_17': toCents(document.getElementById('cfgInvestCap1317').value || 0) },
        taskMonthlyCapByBand: { '9_12': toCents(document.getElementById('cfgTaskCap912').value || 0), '13_17': toCents(document.getElementById('cfgTaskCap1317').value || 0) },
        fineMonthlyCapByBand: { '9_12': toCents(document.getElementById('cfgFineCap912').value || 0), '13_17': toCents(document.getElementById('cfgFineCap1317').value || 0) }
      };
      return { plans, caps };
    },

    validatePlans(plans, caps) {
      for (const band of ['9_12', '13_17']) {
        const ann = plans.map((p) => annualizedPct(p.yieldBpsByBand[band], p.termDays));
        if (ann.some((a) => a < 0 || a > 25)) return 'Ninguna tasa puede equivaler a más de 25% al año.';
        const [s, m, l] = ann;
        if (!(l >= m && m >= s)) return `Para ${BAND_LABEL[band]}: el plazo LARGO debe pagar igual o más que el MEDIANO, y el MEDIANO igual o más que el CORTO (comparando al año).`;
        if (plans.some((p) => p.minPrincipalCents > caps.investCapByBand[band])) return 'El mínimo de un plan no puede ser mayor que el tope total guardado.';
      }
      return null;
    },

    updatePlansCostPreview() {
      const box = document.getElementById('plansCostPreview');
      if (!box) return;
      const { plans, caps } = this.readPlansForm();
      const err = this.validatePlans(plans, caps);
      const long = plans.find((p) => p.id === 'LONG');
      const rows = ['9_12', '13_17'].map((band) => {
        const ann = plans.map((p) => `${p.id === 'SHORT' ? 'Corto' : p.id === 'MEDIUM' ? 'Mediano' : 'Largo'} ≈ ${annualizedPct(p.yieldBpsByBand[band], p.termDays).toFixed(1)}%`).join(' · ');
        const maxCost = Math.floor((caps.investCapByBand[band] * long.yieldBpsByBand[band]) / 10000);
        return `<div><strong>${BAND_LABEL[band]}:</strong> equivalente al año: ${ann}. Costo máximo para ustedes: <strong>${formatMoneyCents(maxCost)}</strong> al año por hijo.</div>`;
      });
      box.innerHTML = `${rows.join('')}${err ? `<div style="color: var(--color-expense); margin-top: 0.35rem;"><strong>${esc(err)}</strong></div>` : ''}<div style="margin-top: 0.35rem; color: var(--text-muted);">Referencia: CETES a 28 días ≈ 6.5% anual. Los ahorros activos conservan su tasa original.</div>`;
    },

    async submitPlansForm() {
      await this.runAsParent(async () => {
        const { plans, caps } = this.readPlansForm();
        const err = this.validatePlans(plans, caps);
        if (err) {
          this.showToast(err, 'warn');
          return;
        }
        const nowIso = new Date().toISOString();
        const prev = this.getInvestmentPlans();
        this.state.family.investmentPlans = plans.map((p) => {
          const old = prev.find((x) => x.id === p.id) || {};
          const changed =
            old.minPrincipalCents !== p.minPrincipalCents ||
            old.yieldBpsByBand?.['9_12'] !== p.yieldBpsByBand['9_12'] ||
            old.yieldBpsByBand?.['13_17'] !== p.yieldBpsByBand['13_17'];
          return { ...p, version: changed ? Number(old.version || 1) + 1 : Number(old.version || 1), updatedAt: changed ? nowIso : old.updatedAt || nowIso };
        });
        this.state.family.rulesConfig = { ...this.getRulesConfig(), ...caps, updatedAt: nowIso };
        this.state.family.updatedAt = nowIso;
        document.getElementById('dialogPlans')?.close();
        await this.cloudManager.pushState(this.state);
        this.renderAll();
        this.showToast('Tasas y límites guardados. Los ahorros activos conservan su tasa original.', 'success');
      });
    },

    /* ----------------------------------------------------------------------
       INVERSIÓN CON PLAN (usada por el formulario y por la aprobación de pedidos)
       ---------------------------------------------------------------------- */
    validatePlanInvestment(member, planId, principalCents, excludeInvestmentId = null) {
      const plan = this.getPlan(planId);
      if (!plan) return { error: 'Elige un plan de ahorro.' };
      const band = this.getMemberBand(member);
      const cap = Number(this.getRulesConfig().investCapByBand?.[band] || 0);
      if (principalCents < Number(plan.minPrincipalCents || 0)) {
        return { error: `El mínimo para ${plan.label} es ${formatMoneyCents(plan.minPrincipalCents)}.` };
      }
      const fin = this.getFinance(member.id);
      const investedOther = fin.activeInvestments.filter((i) => i.id !== excludeInvestmentId).reduce((s, i) => s + i.principalCents, 0);
      if (investedOther + principalCents > cap) {
        return { error: `Con esto pasarías el tope de ahorro a plazo (${formatMoneyCents(cap)}). Ya tienes ${formatMoneyCents(investedOther)} guardado.` };
      }
      const bps = Number(plan.yieldBpsByBand?.[band] || 0);
      return { plan, band, bps, expectedYieldCents: Math.floor((principalCents * bps) / 10000), fin };
    },

    async createPlanInvestmentSigned({ member, planId, principalCents, title, note }) {
      const v = this.validatePlanInvestment(member, planId, principalCents);
      if (v.error) return v;
      const today = getTodayLocalDate();
      const inv = {
        id: `inv_${shortId()}`,
        familyId: this.state.family.id,
        memberId: member.id,
        title: title || `${v.plan.label}`,
        principalCents,
        planId: v.plan.id,
        planVersion: v.plan.version || 1,
        ageBand: v.band,
        yieldBpsSnapshot: v.bps,
        yieldRatePercent: v.bps / 100,
        expectedYieldCents: v.expectedYieldCents,
        termDays: v.plan.termDays,
        startDate: today,
        maturityDate: addDaysLocalDate(today, v.plan.termDays),
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.state.investments.push(inv);
      const signedLock = await createSignedLedgerEvent(
        {
          familyId: this.state.family.id,
          memberId: member.id,
          createdByParentId: this.activeParentId,
          type: 'INVESTMENT_LOCK',
          amountCents: principalCents,
          catalogId: 'cat_inc_yield',
          referenceId: inv.id,
          note: note || `Ahorro ${v.plan.label}: ${inv.title}`,
          metadata: {
            planId: v.plan.id,
            planVersion: v.plan.version || 1,
            ageBand: v.band,
            yieldBps: v.bps,
            termDays: v.plan.termDays,
            expectedYieldCents: v.expectedYieldCents
          },
          localDate: today
        },
        this.parentSigningKey,
        this.state.family.saltHex,
        this.getLastEventHash()
      );
      this.state.ledgerEvents.push(signedLock);
      return { ok: true, inv, ...v };
    },

    /* ----------------------------------------------------------------------
       EVENTOS DE LAS NUEVAS SECCIONES
       ---------------------------------------------------------------------- */
    bindRulesEvents() {
      document.getElementById('btnCreateTask')?.addEventListener('click', () => this.openTaskDialog());
      document.getElementById('btnApproveAllTasks')?.addEventListener('click', () => this.handleApproveAllTasks());
      document.getElementById('btnApplyFine')?.addEventListener('click', () => this.openFineDialog());
      document.getElementById('btnAddFinePreset')?.addEventListener('click', () => this.openFinePresetDialog());
      document.getElementById('btnEditPlans')?.addEventListener('click', () => this.openPlansDialog());

      document.getElementById('taskTemplateSelect')?.addEventListener('change', (e) => {
        const tpl = TASK_TEMPLATES.find((t) => t.id === e.target.value);
        if (tpl) this.fillTaskForm({ ...tpl, maxAssignees: tpl.kind === 'RESPONSIBILITY' ? null : 1, dueDate: document.getElementById('taskDueDateInput').value });
      });
      document.getElementById('taskKindSelect')?.addEventListener('change', () => this.syncTaskKindUi());
      document.getElementById('formTask')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.submitTaskForm();
      });

      ['finePresetSelect', 'fineChildSelect', 'fineRepairCostInput', 'fineConfessedCheck'].forEach((id) => {
        document.getElementById(id)?.addEventListener('input', () => this.updateFinePreview());
        document.getElementById(id)?.addEventListener('change', () => this.updateFinePreview());
      });
      document.getElementById('formFine')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.submitFineForm();
      });

      ['fpLevelSelect', 'fpKindSelect'].forEach((id) => document.getElementById(id)?.addEventListener('change', () => this.syncFinePresetHint()));
      document.getElementById('formFinePreset')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.submitFinePresetForm();
      });

      document.getElementById('dialogPlans')?.addEventListener('input', () => this.updatePlansCostPreview());
      document.getElementById('formPlans')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.submitPlansForm();
      });

      document.body.addEventListener('click', async (e) => {
        const pick = (attr) => e.target.closest(`[${attr}]`)?.getAttribute(attr);
        let v;
        if ((v = pick('data-task-claim'))) return this.handleClaimTask(v);
        if ((v = pick('data-task-submit'))) return this.handleSubmitTask(...v.split(':'));
        if ((v = pick('data-task-withdraw'))) return this.handleWithdrawTask(...v.split(':'));
        if ((v = pick('data-task-approve'))) return this.handleApproveTask(...v.split(':'));
        if ((v = pick('data-task-reject'))) return this.handleRejectTask(...v.split(':'));
        if ((v = pick('data-task-edit'))) return this.openTaskDialog(v);
        if ((v = pick('data-task-repeat'))) return this.handleRepeatTask(v);
        if ((v = pick('data-task-close'))) return this.handleCloseTask(v);
        if ((v = pick('data-task-delete'))) return this.handleDeleteTask(v);
        if ((v = pick('data-fine-apply'))) return this.openFineDialog(v);
        if ((v = pick('data-fine-preset-edit'))) return this.openFinePresetDialog(v);
        if ((v = pick('data-fine-preset-delete'))) return this.handleDeleteFinePreset(v);
        if ((v = pick('data-fine-appeal'))) return this.handleFineAppeal(v);
        if ((v = pick('data-fine-resolve'))) {
          const [evId, action] = v.split(':');
          return this.resolveFine(evId, action);
        }
        if ((v = pick('data-plan-invest'))) return this.openInvestmentDialog(null, v);
        if ((v = pick('data-plan-request'))) {
          const sel = document.getElementById('simInvPlan');
          if (sel) sel.value = v;
          this.updateSimulatorPreviews();
          this.switchTab('tab-sandbox');
          this.showToast('Elige cuánto quieres guardar y toca "Pedir este Ahorro a mis Papás".', 'info');
        }
        return undefined;
      });
    }
  };

  Object.assign(AppClass.prototype, methods);
}


  /* === app.js === */
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
    this.selectedChildId = 'child_principal';
    this.currentRole = 'CHILD'; // 'CHILD' (Solo lectura por defecto) | 'PARENT' (Administración firmada)
    this.activeParentId = 'parent_admin';
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
    }
    this.state = ensureFeatureDefaults(stripLegacyDemoData(loaded));
    this.cloudManager.saveLocalState(this.state);

    // Normalizar cualquier clave de icono previa al estándar SVG
    this.normalizeLegacyIconsToSvg();

    const children = this.getChildren();
    if (children.length > 0 && !children.some((c) => c.id === this.selectedChildId)) {
      this.selectedChildId = children[0].id;
    }
    const parents = this.getParents();
    if (parents.length > 0 && !parents.some((p) => p.id === this.activeParentId)) {
      this.activeParentId = parents[0].id;
    }

    this.bindEvents();
    this.bindRulesEvents();
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
    this.state = ensureFeatureDefaults(mergeFamilyCRDT(this.state, remoteState));
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

  ensureParentPermission(afterUnlockCallback = null) {
    if (this.currentRole !== 'PARENT' || !this.parentSigningKey) {
      if (typeof afterUnlockCallback === 'function') {
        this.pendingAfterPinAction = afterUnlockCallback;
      }
      this.showToast('Escribe el PIN de Papá o Mamá para continuar (PIN inicial: 1234).', 'info');
      this.openParentPinDialog();
      return false;
    }
    this.resetParentInactivityTimer();
    return true;
  }

  async runAsParent(actionFn) {
    if (!this.ensureParentPermission(actionFn)) return;
    await actionFn();
  }

  markDeletedId(id) {
    if (!id || !this.state?.family) return;
    this.state.family.deletedIds = this.state.family.deletedIds || {};
    this.state.family.deletedIds[id] = new Date().toISOString();
    this.state.family.updatedAt = new Date().toISOString();
  }

  async reSignLedgerChain() {
    if (!this.parentSigningKey || !this.state) return;
    const reSigned = [];
    let prevHash = 'GENESIS';
    const nowIso = new Date().toISOString();
    for (const ev of this.state.ledgerEvents || []) {
      const signed = await createSignedLedgerEvent(
        {
          ...ev,
          updatedAt: nowIso
        },
        this.parentSigningKey,
        this.state.family.saltHex,
        prevHash
      );
      signed.updatedAt = nowIso;
      prevHash = signed.eventHash;
      reSigned.push(signed);
    }
    this.state.ledgerEvents = reSigned;
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
    this.activeParentId = selectedParentId || this.getParents()[0]?.id || 'parent_admin';
    document.body.setAttribute('data-role', 'PARENT');
    this.resetParentInactivityTimer();

    await this.consolidateDueAutomationsAsParent(true);
    await this.runLedgerAuditAndRender();
    this.showToast('¡Modo Papá activado! Ya puedes añadir, modificar, borrar o aprobar pedidos.', 'success');

    if (typeof this.pendingAfterPinAction === 'function') {
      const nextFn = this.pendingAfterPinAction;
      this.pendingAfterPinAction = null;
      setTimeout(() => nextFn(), 60);
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
    this.renderTasksSection(child, currency);
    this.renderRulesSection(child, childFinance, currency);
    this.renderInvestmentPlansPanel(child, currency);
    this.renderRecurringRules(child, currency);
    this.renderLoansSection(childFinance, currency);
    this.renderInvestmentsSection(childFinance, currency);
    this.renderUsersAndCatalogs(currency);
    this.renderChildRequests(currency);
    this.renderCryptoAuditPanel(currency);
    this.updateSimulatorPreviews();
  }

  renderGoalBanner(child, childFinance, currency) {
    const goalEl = document.getElementById('goalBannerSection');
    const targetCents = Math.max(100, Number(child.goalTargetCents || 100000));
    const currentProgressCents = Math.max(0, childFinance.availableCents + childFinance.investedCents);
    const pct = Math.min(100, Math.round((currentProgressCents / targetCents) * 100));

    goalEl.innerHTML = `
      <div style="flex: 1; min-width: 260px;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.45rem;">
          <span class="inline-icon-text" style="font-weight: 800; font-size: 0.95rem;">
            <span style="color: var(--color-income); display: flex;">${renderSvgIcon(child.goalIcon || 'target', 20)}</span>
            Meta de ${child.name}: <span style="color: var(--color-income);">${child.goalTitle || 'Mi Primera Meta de Ahorro'}</span>
          </span>
          <div style="display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap;">
            <span style="font-family: var(--font-mono); font-weight: 800; font-size: 0.9rem;">
              ${formatMoneyCents(currentProgressCents, currency)} de ${formatMoneyCents(targetCents, currency)} (${pct}%)
            </span>
            <button type="button" class="btn btn-ghost btn-sm" data-edit-member="${child.id}" title="Cambiar nombre o meta de ${child.name}">
              ${renderSvgIcon('edit', 14)} Editar Perfil / Meta
            </button>
          </div>
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

    const submittedTasks = [];
    this.getTaskBoard().forEach((b) =>
      b.assignments
        .filter((a) => a.status === 'SUBMITTED')
        .forEach((a) => submittedTasks.push({ b, a }))
    );
    if (submittedTasks.length > 0) {
      const firstSub = submittedTasks[0];
      const childMember = (this.state.members || []).find((m) => m.id === firstSub.a.memberId);
      banners.push(`
        <div class="notice-banner info">
          <div class="inline-icon-text">
            ${renderSvgIcon('checklist', 20)}
            <span><strong>Tarea terminada por revisar (${submittedTasks.length}):</strong>
            ${childMember ? childMember.name : 'Hijo/a'} entregó "${firstSub.b.task.title}"</span>
          </div>
          <div style="display: flex; gap: 0.45rem; flex-wrap: wrap;">
            <button type="button" class="btn btn-sm btn-income" data-task-approve="${firstSub.b.task.id}:${firstSub.a.memberId}">
              ${renderSvgIcon('check', 15)} ${firstSub.b.task.kind === 'EXTRA' ? 'Aprobar y pagar' : 'Aprobar'}
            </button>
            <button type="button" class="btn btn-sm btn-ghost" data-switch-tab="tab-tasks">
              Ver Tareas
            </button>
          </div>
        </div>
      `);
    }

    const pendingReqs = (this.state.childRequests || []).filter((r) => r.status === 'PENDING');
    if (pendingReqs.length > 0) {
      const firstReq = pendingReqs[0];
      const isAppeal = firstReq.requestType === 'FINE_APPEAL';
      banners.push(`
        <div class="notice-banner warning">
          <div class="inline-icon-text">
            ${renderSvgIcon(isAppeal ? 'hand-raise' : 'inbox', 20)}
            <span><strong>${isAppeal ? 'Revisión de multa' : 'Pedido pendiente'} (${pendingReqs.length}):</strong>
            "${firstReq.title}"</span>
          </div>
          <div style="display: flex; gap: 0.45rem; flex-wrap: wrap;">
            ${
              isAppeal
                ? `<button type="button" class="btn btn-sm btn-income" data-fine-resolve="${firstReq.refId}:REMOVE">
                     ${renderSvgIcon('undo', 15)} Quitar multa
                   </button>
                   <button type="button" class="btn btn-sm btn-ghost" data-fine-resolve="${firstReq.refId}:HALF">
                     Bajar a la mitad
                   </button>
                   <button type="button" class="btn btn-sm btn-ghost" data-switch-tab="tab-rules">
                     Ver en Reglas
                   </button>`
                : `<button type="button" class="btn btn-sm btn-income" data-approve-request="${firstReq.id}">
                     ${renderSvgIcon('check', 15)} Aprobar Pedido Ahora
                   </button>
                   <button type="button" class="btn btn-sm btn-ghost" data-reject-request="${firstReq.id}">
                     ${renderSvgIcon('x', 15)} Rechazar
                   </button>
                   <button type="button" class="btn btn-sm btn-ghost" data-switch-tab="tab-sandbox">
                     Ver en Calculadora
                   </button>`
            }
          </div>
        </div>
      `);
    }

    container.innerHTML = banners.join('');
  }

  renderMovementsAndCharts(childFinance, currency) {
    const listEl = document.getElementById('transactionsListContainer');
    const filtered = childFinance.timeline.filter((ev) => {
      if (this.txFilter === 'ALL') return true;
      if (this.txFilter === 'INCOME') return ev.type === 'INCOME' || ev.type === 'RECURRING_INCOME' || ev.type === 'INVESTMENT_MATURITY' || ev.type === 'TASK_REWARD';
      if (this.txFilter === 'EXPENSE') return ev.type === 'EXPENSE' || ev.type === 'FINE';
      if (this.txFilter === 'TASK') return ev.type === 'TASK_REWARD';
      if (this.txFilter === 'FINE') return ev.type === 'FINE';
      if (this.txFilter === 'LOAN') return ev.type === 'LOAN_DISBURSEMENT' || ev.type === 'LOAN_PAYMENT' || ev.type === 'EXTRA_PRINCIPAL_PAYMENT';
      if (this.txFilter === 'INVESTMENT') return ev.type === 'INVESTMENT_LOCK' || ev.type === 'INVESTMENT_MATURITY' || ev.type === 'INVESTMENT_EARLY_EXIT';
      return true;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 1.5rem;">Aún no hay movimientos aquí. Usa el botón <strong>+ Añadir Movimiento</strong> para empezar.</p>`;
    } else {
      listEl.innerHTML = filtered
        .map((ev) => {
          const cat = this.getCatalogById(ev.catalogId);
          const parentAuthor = this.getParents().find((p) => p.id === ev.createdByParentId);
          let signClass = 'neutral';
          let prefix = '';
          let typeBadge = '';
          let fallbackIcon = 'list';
          let displayAmountCents = ev.amountCents;

          if (ev.type === 'INCOME' || ev.type === 'RECURRING_INCOME' || ev.type === 'INVESTMENT_MATURITY' || ev.type === 'INVESTMENT_EARLY_EXIT' || ev.type === 'TASK_REWARD') {
            signClass = 'positive';
            prefix = '+';
            fallbackIcon = ev.type === 'TASK_REWARD' ? 'trophy' : 'coins';
            typeBadge =
              ev.type === 'RECURRING_INCOME'
                ? 'Mesada'
                : ev.type === 'INVESTMENT_MATURITY'
                  ? 'Ahorro Ganado'
                  : ev.type === 'TASK_REWARD'
                    ? 'Tarea / Reto'
                    : 'Dinero que entró';
          } else if (ev.type === 'EXPENSE' || ev.type === 'FINE' || ev.type === 'LOAN_PAYMENT' || ev.type === 'EXTRA_PRINCIPAL_PAYMENT') {
            signClass = 'negative';
            prefix = '-';
            fallbackIcon = ev.type === 'FINE' ? 'scale' : 'shopping-bag';
            typeBadge =
              ev.type === 'FINE'
                ? 'Multa'
                : ev.type === 'EXPENSE'
                  ? 'Gasto'
                  : ev.type === 'EXTRA_PRINCIPAL_PAYMENT'
                    ? 'Pago adelantado'
                    : 'Pago de préstamo';
            if (ev.type === 'FINE') {
              displayAmountCents = Number(ev.chargedCents ?? ev.amountCents);
            }
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

          const iconSvg = renderSvgIcon(cat?.icon || fallbackIcon, 20);
          const fineExtraNote =
            ev.type === 'FINE' && (ev.forgivenCents > 0 || ev.refundedCents > 0)
              ? `<span class="badge badge-success">Multa ${formatMoneyCents(ev.amountCents, currency)}${ev.forgivenCents > 0 ? ` · Perdonado ${formatMoneyCents(ev.forgivenCents, currency)}` : ''}${ev.refundedCents > 0 ? ` · Devuelto ${formatMoneyCents(ev.refundedCents, currency)}` : ''}</span>`
              : '';

          return `
            <div class="tx-item ${ev.isReversed ? 'reversed' : ''}">
              <div class="tx-left">
                <div class="tx-icon" style="color: ${cat?.color || 'var(--text-primary)'};">${iconSvg}</div>
                <div>
                  <p class="tx-title">
                    ${ev.note || cat?.name || typeBadge}
                    ${ev.isReversed ? `<span class="badge badge-danger">${renderSvgIcon('ban', 12)} CANCELADO</span>` : ''}
                    ${fineExtraNote}
                  </p>
                  <p class="tx-sub inline-icon-text" style="flex-wrap: wrap;">
                    ${renderSvgIcon('calendar', 13)} <span>${ev.localDate}</span> ·
                    <span class="badge badge-info">${cat?.name || typeBadge}</span> ·
                    <span>Autorizó: ${parentAuthor ? parentAuthor.name : 'Papá/Mamá'}</span>
                  </p>
                </div>
              </div>
              <div class="tx-right" style="flex-wrap: wrap; justify-content: flex-end;">
                <div>
                  <div class="tx-amount ${signClass}">
                    ${prefix}${formatMoneyCents(displayAmountCents, currency)}
                  </div>
                  <div style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">
                    Quedó: ${formatMoneyCents(ev.runningAvailableCents, currency)}
                  </div>
                </div>
                <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
                  <button type="button" class="btn btn-ghost btn-sm" data-edit-tx="${ev.id}" title="Modificar este movimiento">
                    ${renderSvgIcon('edit', 14)} Editar
                  </button>
                  <button type="button" class="btn btn-ghost btn-sm" data-delete-tx="${ev.id}" title="Borrar este movimiento" style="color: var(--color-expense);">
                    ${renderSvgIcon('trash', 14)} Borrar
                  </button>
                </div>
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
            <div style="display: flex; gap: 0.45rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-income btn-sm" data-trigger-recurring="${rule.id}">
                ${renderSvgIcon('zap', 14)} Depositar Hoy
              </button>
              <button type="button" class="btn btn-ghost btn-sm" data-toggle-recurring="${rule.id}">
                ${rule.status === 'ACTIVE' ? `${renderSvgIcon('pause', 14)} Pausar` : `${renderSvgIcon('play', 14)} Activar`}
              </button>
              <button type="button" class="btn btn-ghost btn-sm" data-edit-recurring="${rule.id}">
                ${renderSvgIcon('edit', 14)} Editar
              </button>
              <button type="button" class="btn btn-ghost btn-sm" data-delete-recurring="${rule.id}" style="color: var(--color-expense);">
                ${renderSvgIcon('trash', 14)} Borrar
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
                <td>
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
              <div style="display: flex; gap: 0.45rem; flex-wrap: wrap;">
                ${
                  loan.status === 'ACTIVE' && loan.remainingDebtCents > 0
                    ? `<button type="button" class="btn btn-primary btn-sm" data-open-extra-principal="${loan.id}">
                        ${renderSvgIcon('zap', 14)} Adelantar Pago
                      </button>`
                    : ''
                }
                <button type="button" class="btn btn-ghost btn-sm" data-edit-loan="${loan.id}">
                  ${renderSvgIcon('edit', 14)} Editar
                </button>
                <button type="button" class="btn btn-ghost btn-sm" data-delete-loan="${loan.id}" style="color: var(--color-expense);">
                  ${renderSvgIcon('trash', 14)} Borrar
                </button>
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
                    <th>Pagar (Papá/Mamá)</th>
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
      container.innerHTML = `<p style="color: var(--text-muted);">Aún no tienes ahorros guardados a plazo. Elige arriba un plan de Corto (1 mes), Mediano (6 meses) o Largo plazo (1 año).</p>`;
      return;
    }

    const planNames = { SHORT: 'Corto plazo (1 mes)', MEDIUM: 'Mediano plazo (6 meses)', LONG: 'Largo plazo (1 año)' };

    container.innerHTML = investments
      .map((inv) => {
        const stBadge =
          inv.status === 'MATURED'
            ? `<span class="badge badge-success">${renderSvgIcon('check', 13)} ¡Terminado y Cobrado!</span>`
            : inv.status === 'CANCELLED_EARLY'
              ? `<span class="badge badge-warn">${renderSvgIcon('stop', 13)} Sacado Antes</span>`
              : `<span class="badge badge-info">${renderSvgIcon('lock', 13)} Creciendo (${inv.progressPercent}%)</span>`;

        const planBadge = inv.planId && planNames[inv.planId] ? `<span class="badge badge-purple">${planNames[inv.planId]}</span>` : '';
        const milestone = inv.progressPercent >= 100 ? '100%' : inv.progressPercent >= 75 ? '75%' : inv.progressPercent >= 50 ? '50%' : inv.progressPercent >= 25 ? '25%' : 'Inicio';
        const showDaily = Number(inv.dailyYieldCents || 0) >= 10;

        return `
          <div class="panel-card" style="margin-bottom: 0; background: var(--bg-elevated);">
            <div class="panel-header" style="margin-bottom: 0.5rem; gap: 0.35rem; flex-wrap: wrap;">
              ${stBadge}
              ${planBadge}
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
                <div style="font-size: 0.75rem; color: var(--text-muted);">${showDaily ? 'Ganado hasta hoy' : `Ganancia al terminar (Hito: ${milestone})`}</div>
                <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 700; color: var(--color-income);">+${formatMoneyCents(showDaily ? inv.accruedInterestTodayCents : inv.expectedInterestCents, currency)}</div>
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

            <div style="display: flex; gap: 0.45rem; flex-wrap: wrap;">
              ${
                inv.status === 'ACTIVE'
                  ? `
                    <button type="button" class="btn btn-income btn-sm" data-mature-investment="${inv.id}" title="Entregar el dinero guardado más su ganancia completa a la alcancía">
                      ${renderSvgIcon('check', 14)} Entregar + Ganancia (+${formatMoneyCents(inv.expectedInterestCents, currency)})
                    </button>
                    <button type="button" class="btn btn-ghost btn-sm" data-early-exit-investment="${inv.id}" title="Sacar el dinero antes de tiempo">
                      ${renderSvgIcon('stop', 14)} Sacar Antes (${inv.earlyExitYieldCents > 0 ? `+${formatMoneyCents(inv.earlyExitYieldCents, currency)}` : 'Solo capital'})
                    </button>
                  `
                  : ''
              }
              <button type="button" class="btn btn-ghost btn-sm" data-edit-investment="${inv.id}">
                ${renderSvgIcon('edit', 14)} Editar
              </button>
              <button type="button" class="btn btn-ghost btn-sm" data-delete-investment="${inv.id}" style="color: var(--color-expense);">
                ${renderSvgIcon('trash', 14)} Borrar
              </button>
            </div>
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
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.6rem; flex-wrap: wrap;">
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
              <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
                ${
                  !isParent
                    ? `<button type="button" class="btn btn-ghost btn-sm" data-select-child="${m.id}">Ver Alcancía</button>`
                    : ''
                }
                <button type="button" class="btn btn-ghost btn-sm" data-edit-member="${m.id}" title="Modificar integrante">
                  ${renderSvgIcon('edit', 14)} Editar
                </button>
                <button type="button" class="btn btn-ghost btn-sm" data-delete-member="${m.id}" title="Borrar integrante" style="color: var(--color-expense);">
                  ${renderSvgIcon('trash', 14)} Borrar
                </button>
              </div>
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
          <div class="tx-right" style="gap: 0.35rem; flex-wrap: wrap;">
            <button type="button" class="btn btn-ghost btn-sm" data-edit-catalog="${c.id}">
              ${renderSvgIcon('edit', 14)} Editar
            </button>
            <button type="button" class="btn btn-ghost btn-sm" data-delete-catalog="${c.id}" style="color: var(--color-expense);">
              ${renderSvgIcon('trash', 14)} Borrar
            </button>
          </div>
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
          <div class="tx-right" style="gap: 0.35rem; flex-wrap: wrap;">
            <button type="button" class="btn btn-ghost btn-sm" data-edit-catalog="${c.id}">
              ${renderSvgIcon('edit', 14)} Editar
            </button>
            <button type="button" class="btn btn-ghost btn-sm" data-delete-catalog="${c.id}" style="color: var(--color-expense);">
              ${renderSvgIcon('trash', 14)} Borrar
            </button>
          </div>
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
            <div class="tx-right" style="flex-wrap: wrap; justify-content: flex-end; gap: 0.4rem;">
              ${stBadge}
              ${
                r.status === 'PENDING'
                  ? `
                    <button type="button" class="btn btn-income btn-sm" data-approve-request="${r.id}">
                      ${renderSvgIcon('check', 14)} Aprobar Pedido
                    </button>
                    <button type="button" class="btn btn-ghost btn-sm" data-reject-request="${r.id}">
                      ${renderSvgIcon('x', 14)} No por ahora
                    </button>
                  `
                  : ''
              }
              <button type="button" class="btn btn-ghost btn-sm" data-delete-request="${r.id}" style="color: var(--color-expense);" title="Borrar este pedido">
                ${renderSvgIcon('trash', 14)} Borrar
              </button>
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
    const child = this.getSelectedChild();
    const band = this.getMemberBand(child);

    const invAmount = Number(document.getElementById('simInvAmount')?.value || 300);
    const planId = document.getElementById('simInvPlan')?.value || 'SHORT';
    const planObj = this.getPlan(planId) || { id: 'SHORT', label: 'Corto plazo (1 mes)', termDays: 30, yieldBpsByBand: { '9_12': 100, '13_17': 75 }, minPrincipalCents: 5000 };
    const invDays = Number(planObj.termDays || 30);
    const invBps = Number(planObj.yieldBpsByBand?.[band] || 100);
    const invRate = (invBps / 100).toFixed(2);
    const amountLabel = document.getElementById('simInvAmountLabel');
    if (amountLabel) amountLabel.textContent = formatMoneyCents(invAmount * 100, currency);

    const invYieldCents = Math.floor((invAmount * 100 * invBps) / 10000);
    const invTotalCents = invAmount * 100 + invYieldCents;
    const minWarning =
      invAmount * 100 < Number(planObj.minPrincipalCents || 0)
        ? `<div style="margin-top: 0.35rem; font-size: 0.78rem; color: var(--color-expense);">El mínimo para ${planObj.label} es ${formatMoneyCents(planObj.minPrincipalCents, currency)}.</div>`
        : '';
    const resBox = document.getElementById('simInvResultBox');
    if (resBox) {
      resBox.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
          <span>Plan elegido (${planObj.label} · ${invDays} días):</span>
          <strong style="font-family: var(--font-mono);">${formatMoneyCents(invAmount * 100, currency)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
          <span>Ganancia fijada por Papá/Mamá (+${invRate}%):</span>
          <strong style="font-family: var(--font-mono); color: var(--color-income);">+${formatMoneyCents(invYieldCents, currency)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 1rem; border-top: 1px solid var(--border-subtle); padding-top: 0.4rem;">
          <strong>Recibirás al terminar el plazo:</strong>
          <strong style="font-family: var(--font-mono); color: var(--color-invest);">${formatMoneyCents(invTotalCents, currency)}</strong>
        </div>
        ${minWarning}
      `;
    }

    const loanAmount = Number(document.getElementById('simLoanAmount')?.value || 500);
    const loanPeriods = Number(document.getElementById('simLoanPeriods')?.value || 4);
    const loanRate = Number(document.getElementById('simLoanRate')?.value || 5);
    const loanType = document.getElementById('simLoanType')?.value || 'SIMPLE';
    const loanLabel = document.getElementById('simLoanAmountLabel');
    if (loanLabel) loanLabel.textContent = formatMoneyCents(loanAmount * 100, currency);

    const plan = generateLoanSchedule({
      principalCents: loanAmount * 100,
      interestRatePercent: loanRate,
      termPeriods: loanPeriods,
      interestType: loanType,
      frequency: 'WEEKLY'
    });

    const firstInst = plan.schedule[0]?.totalInstallmentCents || 0;
    const loanBox = document.getElementById('simLoanResultBox');
    if (loanBox) {
      loanBox.innerHTML = `
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
    const memberId = document.getElementById('invChildSelect')?.value || this.selectedChildId;
    const member = (this.state?.members || []).find((m) => m.id === memberId) || this.getSelectedChild();
    const band = this.getMemberBand(member);
    const principal = toCents(document.getElementById('invPrincipalInput')?.value || 250);
    const planId = document.getElementById('invPlanSelect')?.value || 'SHORT';
    const planObj = this.getPlan(planId) || { id: 'SHORT', label: 'Corto plazo (1 mes)', termDays: 30, yieldBpsByBand: { '9_12': 100, '13_17': 75 }, minPrincipalCents: 5000 };
    const days = Number(planObj.termDays || 30);
    const bps = Number(planObj.yieldBpsByBand?.[band] || 100);
    const rate = (bps / 100).toFixed(2);
    const maturityDate = addDaysLocalDate(getTodayLocalDate(), days);
    const yieldCents = Math.floor((principal * bps) / 10000);
    const editId = (document.getElementById('invEditIdInput')?.value || '').trim() || null;
    const valCheck = member ? this.validatePlanInvestment(member, planId, principal, editId) : {};

    const box = document.getElementById('invPreviewBox');
    if (box) {
      box.innerHTML = `
        <span class="inline-icon-text" style="flex-wrap: wrap;">
          ${renderSvgIcon('trending-up', 16)}
          <span><strong>${planObj.label} (${days} días · Tasa preestablecida +${rate}%):</strong> Se guardarán <strong>${formatMoneyCents(principal, currency)}</strong> hasta el <strong>${maturityDate}</strong>.
          Ganancia garantizada: <strong style="color: var(--color-income);">+${formatMoneyCents(yieldCents, currency)}</strong> ·
          Recibirás al final: <strong>${formatMoneyCents(principal + yieldCents, currency)}</strong>.
          ${valCheck.error ? `<br/><strong style="color: var(--color-expense);">${valCheck.error}</strong>` : ''}</span>
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

  openTransactionDialog(mode = 'INCOME', editTx = null) {
    this.runAsParent(() => {
      this.setTransactionModalMode(mode);
      const editInput = document.getElementById('txEditIdInput');
      if (editTx) {
        if (editInput) editInput.value = editTx.id;
        document.getElementById('dialogTxTitle').innerHTML = `${renderSvgIcon('edit', 19)} Modificar Movimiento`;
        document.getElementById('txChildSelect').value = editTx.memberId;
        document.getElementById('txDateInput').value = editTx.localDate || getTodayLocalDate();
        document.getElementById('txAmountInput').value = (Number(editTx.amountCents || 0) / 100).toFixed(2);
        if (editTx.catalogId) document.getElementById('txCatalogSelect').value = editTx.catalogId;
        document.getElementById('txNoteInput').value = editTx.note || '';
      } else {
        if (editInput) editInput.value = '';
        document.getElementById('txDateInput').value = getTodayLocalDate();
        document.getElementById('txAmountInput').value = '';
        document.getElementById('txNoteInput').value = '';
      }

      const dialog = document.getElementById('dialogTransaction');
      dialog?.showModal();
    });
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
        err.innerHTML = `${renderSvgIcon('alert-triangle', 15)} PIN incorrecto. (El PIN inicial es 1234).`;
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
      this.openTransactionDialog('INCOME');
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
    document.getElementById('btnOpenMemberModal')?.addEventListener('click', () => this.openMemberDialog());

    document.getElementById('btnAddIncomeSource')?.addEventListener('click', () => this.openCatalogDialog('INCOME_SOURCE'));
    document.getElementById('btnAddExpenseCategory')?.addEventListener('click', () => this.openCatalogDialog('EXPENSE_CATEGORY'));

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
        if (act === 'consolidate-due') {
          await this.runAsParent(async () => {
            await this.consolidateDueAutomationsAsParent(false);
            await this.runLedgerAuditAndRender();
          });
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

      const editTxBtn = e.target.closest('[data-edit-tx]');
      if (editTxBtn) {
        this.openEditTransaction(editTxBtn.getAttribute('data-edit-tx'));
        return;
      }

      const delTxBtn = e.target.closest('[data-delete-tx]');
      if (delTxBtn) {
        await this.handleDeleteTransaction(delTxBtn.getAttribute('data-delete-tx'));
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

      const editRecBtn = e.target.closest('[data-edit-recurring]');
      if (editRecBtn) {
        this.openRecurringDialog(editRecBtn.getAttribute('data-edit-recurring'));
        return;
      }

      const delRecBtn = e.target.closest('[data-delete-recurring]');
      if (delRecBtn) {
        await this.handleDeleteRecurring(delRecBtn.getAttribute('data-delete-recurring'));
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
        const loanId = extraBtn.getAttribute('data-open-extra-principal');
        this.runAsParent(() => {
          document.getElementById('extraLoanIdInput').value = loanId;
          document.getElementById('extraAmountInput').value = '100';
          document.getElementById('dialogExtraPrincipal')?.showModal();
        });
        return;
      }

      const editLoanBtn = e.target.closest('[data-edit-loan]');
      if (editLoanBtn) {
        this.openLoanDialog(editLoanBtn.getAttribute('data-edit-loan'));
        return;
      }

      const delLoanBtn = e.target.closest('[data-delete-loan]');
      if (delLoanBtn) {
        await this.handleDeleteLoan(delLoanBtn.getAttribute('data-delete-loan'));
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

      const editInvBtn = e.target.closest('[data-edit-investment]');
      if (editInvBtn) {
        this.openInvestmentDialog(editInvBtn.getAttribute('data-edit-investment'));
        return;
      }

      const delInvBtn = e.target.closest('[data-delete-investment]');
      if (delInvBtn) {
        await this.handleDeleteInvestment(delInvBtn.getAttribute('data-delete-investment'));
        return;
      }

      const editMemBtn = e.target.closest('[data-edit-member]');
      if (editMemBtn) {
        this.openMemberDialog(editMemBtn.getAttribute('data-edit-member'));
        return;
      }

      const delMemBtn = e.target.closest('[data-delete-member]');
      if (delMemBtn) {
        await this.handleDeleteMember(delMemBtn.getAttribute('data-delete-member'));
        return;
      }

      const editCatBtn = e.target.closest('[data-edit-catalog]');
      if (editCatBtn) {
        this.openCatalogDialog(null, editCatBtn.getAttribute('data-edit-catalog'));
        return;
      }

      const delCatBtn = e.target.closest('[data-delete-catalog]');
      if (delCatBtn) {
        await this.handleDeleteCatalog(delCatBtn.getAttribute('data-delete-catalog'));
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

      const delReqBtn = e.target.closest('[data-delete-request]');
      if (delReqBtn) {
        await this.handleDeleteChildRequest(delReqBtn.getAttribute('data-delete-request'));
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

    ['invPrincipalInput', 'invPlanSelect', 'invChildSelect'].forEach((id) => {
      document.getElementById(id)?.addEventListener('input', () => this.updateInvestmentModalPreview());
      document.getElementById(id)?.addEventListener('change', () => this.updateInvestmentModalPreview());
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

    ['simInvAmount', 'simInvPlan', 'simLoanAmount', 'simLoanPeriods', 'simLoanRate', 'simLoanType'].forEach((id) => {
      document.getElementById(id)?.addEventListener('input', () => this.updateSimulatorPreviews());
      document.getElementById(id)?.addEventListener('change', () => this.updateSimulatorPreviews());
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

  openEditTransaction(txId) {
    const ev = (this.state.ledgerEvents || []).find((e) => e.id === txId);
    if (!ev) return;
    const mode = ev.type === 'EXPENSE' || ev.type === 'LOAN_PAYMENT' || ev.type === 'EXTRA_PRINCIPAL_PAYMENT' ? 'EXPENSE' : 'INCOME';
    this.openTransactionDialog(mode, ev);
  }

  openRecurringDialog(editRuleId = null) {
    this.runAsParent(() => {
      this.populateChildAndCatalogSelectors('INCOME');
      const editInput = document.getElementById('recEditIdInput');
      const rule = editRuleId ? (this.state.recurringRules || []).find((r) => r.id === editRuleId) : null;
      if (rule) {
        if (editInput) editInput.value = rule.id;
        document.getElementById('dialogRecurringTitle').innerHTML = `${renderSvgIcon('edit', 19)} Modificar Mesada Programada`;
        document.getElementById('recChildSelect').value = rule.memberId;
        document.getElementById('recCatalogSelect').value = rule.catalogId;
        document.getElementById('recTitleInput').value = rule.title || '';
        document.getElementById('recAmountInput').value = (Number(rule.amountCents || 0) / 100).toFixed(2);
        document.getElementById('recFrequencySelect').value = rule.frequency || 'WEEKLY';
        document.getElementById('recNextDateInput').value = rule.nextExecutionDate || getTodayLocalDate();
        document.getElementById('recAutoLoanSelect').value = rule.autoDeductLoanId || '';
      } else {
        if (editInput) editInput.value = '';
        document.getElementById('dialogRecurringTitle').innerHTML = `${renderSvgIcon('calendar', 19)} Programar Mesada Automática`;
        document.getElementById('recNextDateInput').value = getTodayLocalDate();
        document.getElementById('recTitleInput').value = '';
        document.getElementById('recAmountInput').value = '150';
      }
      document.getElementById('dialogRecurring')?.showModal();
    });
  }

  openLoanDialog(editLoanId = null) {
    this.runAsParent(() => {
      this.populateChildAndCatalogSelectors('INCOME');
      const editInput = document.getElementById('loanEditIdInput');
      const loan = editLoanId ? (this.state.loans || []).find((l) => l.id === editLoanId) : null;
      if (loan) {
        if (editInput) editInput.value = loan.id;
        document.getElementById('dialogLoanTitle').innerHTML = `${renderSvgIcon('edit', 19)} Modificar Préstamo`;
        document.getElementById('loanChildSelect').value = loan.memberId;
        document.getElementById('loanPrincipalInput').value = (Number(loan.principalCents || 0) / 100).toFixed(2);
        document.getElementById('loanConceptInput').value = loan.concept || '';
        document.getElementById('loanInterestType').value = loan.interestType || 'SIMPLE';
        document.getElementById('loanRateInput').value = String(loan.interestRatePercent ?? 5);
        document.getElementById('loanPeriodsInput').value = String(loan.termPeriods || 4);
        document.getElementById('loanFrequencySelect').value = loan.frequency || 'WEEKLY';
        document.getElementById('loanDisburseSelect').value = loan.disbursedToPiggy ? 'DEPOSIT_TO_PIGGY' : 'DIRECT_PURCHASE';
      } else {
        if (editInput) editInput.value = '';
        document.getElementById('dialogLoanTitle').innerHTML = `${renderSvgIcon('credit-card', 19)} Nuevo Préstamo de Mamá/Papá`;
        document.getElementById('loanPrincipalInput').value = '400';
        document.getElementById('loanConceptInput').value = '';
      }
      this.updateLoanModalPreview();
      document.getElementById('dialogLoan')?.showModal();
    });
  }

  openInvestmentDialog(editInvId = null, preselectPlanId = null) {
    this.runAsParent(() => {
      this.populateChildAndCatalogSelectors('INCOME');
      const editInput = document.getElementById('invEditIdInput');
      const planSelect = document.getElementById('invPlanSelect');
      const inv = editInvId ? (this.state.investments || []).find((i) => i.id === editInvId) : null;
      if (inv) {
        if (editInput) editInput.value = inv.id;
        document.getElementById('dialogInvestmentTitle').innerHTML = `${renderSvgIcon('edit', 19)} Modificar Ahorro a Plazo`;
        document.getElementById('invChildSelect').value = inv.memberId;
        document.getElementById('invPrincipalInput').value = (Number(inv.principalCents || 0) / 100).toFixed(2);
        document.getElementById('invTitleInput').value = inv.title || '';
        if (planSelect) {
          planSelect.value = inv.planId || (inv.termDays >= 300 ? 'LONG' : inv.termDays >= 120 ? 'MEDIUM' : 'SHORT');
        }
      } else {
        if (editInput) editInput.value = '';
        document.getElementById('dialogInvestmentTitle').innerHTML = `${renderSvgIcon('trending-up', 19)} Guardar Dinero a Plazo para Ganar Más`;
        const chosenPlan = this.getPlan(preselectPlanId || 'SHORT');
        if (planSelect && chosenPlan) planSelect.value = chosenPlan.id;
        const minDollars = Math.max(100, Math.round(Number(chosenPlan?.minPrincipalCents || 10000) / 100));
        document.getElementById('invPrincipalInput').value = String(minDollars);
        document.getElementById('invTitleInput').value = '';
      }
      this.updateInvestmentModalPreview();
      document.getElementById('dialogInvestment')?.showModal();
    });
  }

  openMemberDialog(editMemberId = null) {
    this.runAsParent(() => {
      const editInput = document.getElementById('memEditIdInput');
      const mem = editMemberId ? (this.state.members || []).find((m) => m.id === editMemberId) : null;
      if (mem) {
        if (editInput) editInput.value = mem.id;
        document.getElementById('dialogMemberTitle').innerHTML = `${renderSvgIcon('edit', 19)} Modificar Integrante`;
        document.getElementById('memRoleSelect').value = mem.role || 'CHILD';
        document.getElementById('memNameInput').value = mem.name || '';
        document.getElementById('memAvatarSelect').value = mem.avatar || 'piggy';
        document.getElementById('memAgeInput').value = mem.role === 'CHILD' ? String(mem.age || 12) : (mem.title || 'Administrador Familiar');
        document.getElementById('memGoalTitleInput').value = mem.goalTitle || '';
        document.getElementById('memGoalAmountInput').value = ((mem.goalTargetCents || 100000) / 100).toFixed(2);
      } else {
        if (editInput) editInput.value = '';
        document.getElementById('dialogMemberTitle').innerHTML = `${renderSvgIcon('users', 19)} Agregar Persona a la Familia`;
        document.getElementById('memRoleSelect').value = 'CHILD';
        document.getElementById('memNameInput').value = '';
        document.getElementById('memAgeInput').value = '12';
        document.getElementById('memGoalTitleInput').value = '';
        document.getElementById('memGoalAmountInput').value = '1500';
      }
      document.getElementById('dialogMember')?.showModal();
    });
  }

  openCatalogDialog(defaultType = 'INCOME_SOURCE', editCatId = null) {
    this.runAsParent(() => {
      const editInput = document.getElementById('catEditIdInput');
      const cat = editCatId ? (this.state.catalogs || []).find((c) => c.id === editCatId) : null;
      if (cat) {
        if (editInput) editInput.value = cat.id;
        document.getElementById('catTypeInput').value = cat.type;
        document.getElementById('dialogCatalogTitle').innerHTML = `${renderSvgIcon('edit', 19)} Modificar Categoría`;
        document.getElementById('catNameInput').value = cat.name || '';
        document.getElementById('catIconSelect').value = cat.icon || 'coins';
        document.getElementById('catDescInput').value = cat.description || '';
      } else {
        if (editInput) editInput.value = '';
        document.getElementById('catTypeInput').value = defaultType;
        document.getElementById('dialogCatalogTitle').innerHTML =
          defaultType === 'INCOME_SOURCE'
            ? `${renderSvgIcon('arrow-down-left', 19)} Agregar Entrada de Dinero`
            : `${renderSvgIcon('arrow-up-right', 19)} Agregar Tipo de Gasto`;
        document.getElementById('catNameInput').value = '';
        document.getElementById('catDescInput').value = '';
      }
      document.getElementById('dialogCatalog')?.showModal();
    });
  }

  /* ==========================================================================
     ACCIONES DE NEGOCIO FIRMADAS POR EL PADRE
     ========================================================================== */

  async submitTransactionForm() {
    await this.runAsParent(async () => {
      const editId = (document.getElementById('txEditIdInput')?.value || '').trim();
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

      if (editId) {
        const ev = (this.state.ledgerEvents || []).find((e) => e.id === editId);
        if (ev) {
          ev.memberId = memberId;
          ev.amountCents = amountCents;
          ev.catalogId = catalogId;
          ev.localDate = localDate;
          ev.note = note;
          if (ev.type === 'INCOME' || ev.type === 'EXPENSE') {
            ev.type = mode;
          }
          ev.updatedAt = new Date().toISOString();
          await this.reSignLedgerChain();
          this.selectedChildId = memberId;
          document.getElementById('dialogTransaction')?.close();
          await this.cloudManager.pushState(this.state);
          await this.runLedgerAuditAndRender();
          this.showToast('Movimiento modificado y firmado nuevamente.', 'success');
          return;
        }
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
            `Saldo disponible insuficiente (${formatMoneyCents(childState.availableCents)}). Puedes elegir convertir el faltante en un Préstamo Familiar.`,
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
          concept: `Préstamo por faltante en compra: ${note}`,
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
            note: `Préstamo automático para completar: ${note}`,
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
          ? `¡Listo! Se guardaron ${formatMoneyCents(amountCents)} en la alcancía.`
          : `¡Listo! Se descontó el gasto de ${formatMoneyCents(amountCents)}.`,
        'success'
      );
    });
  }

  async handleDeleteTransaction(txId) {
    await this.runAsParent(async () => {
      const ev = (this.state.ledgerEvents || []).find((e) => e.id === txId);
      if (!ev) return;
      this.markDeletedId(txId);
      this.state.ledgerEvents = (this.state.ledgerEvents || []).filter(
        (e) => e.id !== txId && e.targetEventId !== txId
      );
      await this.reSignLedgerChain();
      await this.cloudManager.pushState(this.state);
      await this.runLedgerAuditAndRender();
      this.showToast('Movimiento borrado de la alcancía.', 'info');
    });
  }

  async handleReverseTransaction(targetEventId) {
    await this.runAsParent(async () => {
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
          note: `Cancelación de: "${orig.note || orig.type}"`,
          localDate: getTodayLocalDate()
        },
        this.parentSigningKey,
        this.state.family.saltHex,
        this.getLastEventHash()
      );

      this.state.ledgerEvents.push(reversalEvent);
      await this.cloudManager.pushState(this.state);
      await this.runLedgerAuditAndRender();
      this.showToast('Movimiento cancelado y saldo devuelto.', 'info');
    });
  }

  async submitRecurringForm() {
    await this.runAsParent(async () => {
      const editId = (document.getElementById('recEditIdInput')?.value || '').trim();
      const memberId = document.getElementById('recChildSelect').value;
      const catalogId = document.getElementById('recCatalogSelect').value;
      const title = document.getElementById('recTitleInput').value.trim();
      const amountCents = toCents(document.getElementById('recAmountInput').value);
      const frequency = document.getElementById('recFrequencySelect').value;
      const nextExecutionDate = document.getElementById('recNextDateInput').value || getTodayLocalDate();
      const autoDeductLoanId = document.getElementById('recAutoLoanSelect').value;

      if (editId) {
        const existing = (this.state.recurringRules || []).find((r) => r.id === editId);
        if (existing) {
          existing.memberId = memberId;
          existing.catalogId = catalogId;
          existing.title = title;
          existing.amountCents = amountCents;
          existing.frequency = frequency;
          existing.nextExecutionDate = nextExecutionDate;
          existing.autoDeductLoanId = autoDeductLoanId;
          existing.updatedAt = new Date().toISOString();
          this.selectedChildId = memberId;
          document.getElementById('dialogRecurring')?.close();
          await this.cloudManager.pushState(this.state);
          this.renderAll();
          this.showToast(`Mesada "${title}" actualizada.`, 'success');
          return;
        }
      }

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
      this.showToast(`Mesada "${title}" programada.`, 'success');
    });
  }

  async handleDeleteRecurring(ruleId) {
    await this.runAsParent(async () => {
      this.markDeletedId(ruleId);
      this.state.recurringRules = (this.state.recurringRules || []).filter((r) => r.id !== ruleId);
      await this.cloudManager.pushState(this.state);
      this.renderAll();
      this.showToast('Mesada programada borrada.', 'info');
    });
  }

  async handleManualTriggerRecurring(ruleId) {
    await this.runAsParent(async () => {
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
          note: `Mesada depositada: ${rule.title}`,
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
      this.showToast(`Se depositó "${rule.title}" (+${formatMoneyCents(rule.amountCents)}) en la alcancía.`, 'success');
    });
  }

  async handleToggleRecurringStatus(ruleId) {
    await this.runAsParent(async () => {
      const rule = (this.state.recurringRules || []).find((r) => r.id === ruleId);
      if (!rule) return;
      rule.status = rule.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
      rule.updatedAt = new Date().toISOString();
      await this.cloudManager.pushState(this.state);
      this.renderAll();
    });
  }

  async submitLoanForm() {
    await this.runAsParent(async () => {
      const editId = (document.getElementById('loanEditIdInput')?.value || '').trim();
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

      if (editId) {
        const existing = (this.state.loans || []).find((l) => l.id === editId);
        if (existing) {
          existing.memberId = memberId;
          existing.concept = concept;
          existing.principalCents = plan.principalCents;
          existing.interestType = interestType;
          existing.interestRatePercent = interestRatePercent;
          existing.termPeriods = termPeriods;
          existing.frequency = frequency;
          existing.disbursedToPiggy = disbursedToPiggy;
          existing.totalInterestCents = plan.totalInterestCents;
          existing.totalPayableCents = plan.totalPayableCents;
          existing.schedule = plan.schedule;
          existing.updatedAt = new Date().toISOString();

          const disbEv = (this.state.ledgerEvents || []).find(
            (e) => e.referenceId === existing.id && e.type === 'LOAN_DISBURSEMENT'
          );
          if (disbEv) {
            disbEv.memberId = memberId;
            disbEv.amountCents = principalCents;
            disbEv.metadata = { disbursedToPiggy };
            disbEv.note = `Préstamo: ${concept} (${disbursedToPiggy ? 'Depositado en alcancía' : 'Compra directa'})`;
            disbEv.updatedAt = new Date().toISOString();
            await this.reSignLedgerChain();
          }

          this.selectedChildId = memberId;
          document.getElementById('dialogLoan')?.close();
          await this.cloudManager.pushState(this.state);
          await this.runLedgerAuditAndRender();
          this.showToast(`Préstamo "${concept}" modificado.`, 'success');
          return;
        }
      }

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
          note: `Préstamo: ${concept} (${disbursedToPiggy ? 'Depositado en alcancía' : 'Compra directa'})`,
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
      this.showToast(`Préstamo "${concept}" creado.`, 'success');
    });
  }

  async handleDeleteLoan(loanId) {
    await this.runAsParent(async () => {
      this.markDeletedId(loanId);
      const relatedEvents = (this.state.ledgerEvents || []).filter((e) => e.referenceId === loanId);
      relatedEvents.forEach((e) => this.markDeletedId(e.id));
      this.state.ledgerEvents = (this.state.ledgerEvents || []).filter((e) => e.referenceId !== loanId);
      this.state.loans = (this.state.loans || []).filter((l) => l.id !== loanId);
      await this.reSignLedgerChain();
      await this.cloudManager.pushState(this.state);
      await this.runLedgerAuditAndRender();
      this.showToast('Préstamo y sus movimientos asociados fueron borrados.', 'info');
    });
  }

  async handlePayLoanInstallment(loanId, installmentNumber, paymentSource = 'PIGGY') {
    await this.runAsParent(async () => {
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
          this.showToast('La alcancía tiene $0.00 disponibles. Usa "Pagó en Efectivo" o deposita dinero primero.', 'warn');
          return;
        }

        if (childFinance.availableCents < pendingCents) {
          amountToPay = childFinance.availableCents;
          inst.paidCents = (inst.paidCents || 0) + amountToPay;
          inst.status = 'OVERDUE';
          this.showToast(
            `Pago parcial: Se tomaron ${formatMoneyCents(amountToPay)} y faltan ${formatMoneyCents(pendingCents - amountToPay)}.`,
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
          note: `Pago #${installmentNumber} - ${loan.concept} (${paymentSource === 'PIGGY' ? 'Desde Alcancía' : 'Efectivo/Tareas'})`,
          localDate: getTodayLocalDate()
        },
        this.parentSigningKey,
        this.state.family.saltHex,
        this.getLastEventHash()
      );

      this.state.ledgerEvents.push(signedPay);
      await this.cloudManager.pushState(this.state);
      await this.runLedgerAuditAndRender();
      this.showToast(`Pago de ${formatMoneyCents(amountToPay)} anotado en "${loan.concept}".`, 'success');
    });
  }

  async submitExtraPrincipalForm() {
    await this.runAsParent(async () => {
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
          note: `Pago adelantado en "${loan.concept}" (Ahorro en intereses: ${formatMoneyCents(interestSavedCents)})`,
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
        `¡Súper! Pago adelantado aplicado. Te ahorraste ${formatMoneyCents(interestSavedCents)} en intereses.`,
        'success'
      );
    });
  }

  async submitInvestmentForm() {
    await this.runAsParent(async () => {
      const editId = (document.getElementById('invEditIdInput')?.value || '').trim();
      const memberId = document.getElementById('invChildSelect').value;
      const member = (this.state.members || []).find((m) => m.id === memberId) || this.getSelectedChild();
      const principalCents = toCents(document.getElementById('invPrincipalInput').value);
      const title = document.getElementById('invTitleInput').value.trim();
      const planId = document.getElementById('invPlanSelect')?.value || 'SHORT';
      const today = getTodayLocalDate();

      if (!member) return;
      const val = this.validatePlanInvestment(member, planId, principalCents, editId || null);
      if (val.error) {
        this.showToast(val.error, 'warn');
        return;
      }

      if (editId) {
        const existing = (this.state.investments || []).find((i) => i.id === editId);
        if (existing) {
          existing.memberId = memberId;
          existing.title = title || val.plan.label;
          existing.principalCents = principalCents;
          existing.planId = val.plan.id;
          existing.planVersion = val.plan.version || 1;
          existing.ageBand = val.band;
          existing.yieldBpsSnapshot = val.bps;
          existing.yieldRatePercent = val.bps / 100;
          existing.expectedYieldCents = val.expectedYieldCents;
          existing.termDays = val.plan.termDays;
          existing.maturityDate = addDaysLocalDate(existing.startDate || today, val.plan.termDays);
          existing.updatedAt = new Date().toISOString();

          const lockEv = (this.state.ledgerEvents || []).find(
            (e) => e.referenceId === existing.id && e.type === 'INVESTMENT_LOCK'
          );
          if (lockEv) {
            lockEv.memberId = memberId;
            lockEv.amountCents = principalCents;
            lockEv.note = `Ahorro ${val.plan.label}: ${existing.title}`;
            lockEv.metadata = {
              planId: val.plan.id,
              planVersion: val.plan.version || 1,
              ageBand: val.band,
              yieldBps: val.bps,
              termDays: val.plan.termDays,
              expectedYieldCents: val.expectedYieldCents
            };
            lockEv.updatedAt = new Date().toISOString();
            await this.reSignLedgerChain();
          }

          this.selectedChildId = memberId;
          document.getElementById('dialogInvestment')?.close();
          await this.cloudManager.pushState(this.state);
          await this.runLedgerAuditAndRender();
          this.showToast(`Ahorro a plazo "${existing.title}" modificado.`, 'success');
          return;
        }
      }

      if (principalCents > val.fin.availableCents) {
        this.showToast(
          `El monto a guardar (${formatMoneyCents(principalCents)}) supera el dinero libre en la alcancía (${formatMoneyCents(val.fin.availableCents)}). Primero mete dinero en la alcancía.`,
          'warn'
        );
        return;
      }

      const created = await this.createPlanInvestmentSigned({
        member,
        planId,
        principalCents,
        title: title || val.plan.label
      });
      if (created.error) {
        this.showToast(created.error, 'warn');
        return;
      }

      this.selectedChildId = memberId;
      document.getElementById('dialogInvestment')?.close();

      await this.cloudManager.pushState(this.state);
      await this.runLedgerAuditAndRender();
      this.showToast(`Ahorro a plazo "${created.inv.title}" iniciado.`, 'success');
    });
  }

  async handleDeleteInvestment(invId) {
    await this.runAsParent(async () => {
      this.markDeletedId(invId);
      const relatedEvents = (this.state.ledgerEvents || []).filter((e) => e.referenceId === invId);
      relatedEvents.forEach((e) => this.markDeletedId(e.id));
      this.state.ledgerEvents = (this.state.ledgerEvents || []).filter((e) => e.referenceId !== invId);
      this.state.investments = (this.state.investments || []).filter((i) => i.id !== invId);
      await this.reSignLedgerChain();
      await this.cloudManager.pushState(this.state);
      await this.runLedgerAuditAndRender();
      this.showToast('Ahorro a plazo borrado.', 'info');
    });
  }

  async handleSettleInvestment(investmentId, isEarlyExit = false) {
    await this.runAsParent(async () => {
      const inv = (this.state.investments || []).find((i) => i.id === investmentId && i.status === 'ACTIVE');
      if (!inv) return;

      const resolved = resolveSignedInvestment(inv, this.auditResult.validEvents);
      const evalInv = evaluateInvestmentProgress(resolved || inv, getTodayLocalDate());
      const today = getTodayLocalDate();

      if (isEarlyExit) {
        inv.status = 'CANCELLED_EARLY';
        inv.updatedAt = new Date().toISOString();

        const payoutCents = Number(evalInv.earlyExitPayoutCents || inv.principalCents);
        const earlyYieldCents = Number(evalInv.earlyExitYieldCents || 0);

        const signedEarly = await createSignedLedgerEvent(
          {
            id: `det_inv_exit_${inv.id}`,
            familyId: this.state.family.id,
            memberId: inv.memberId,
            createdByParentId: this.activeParentId,
            type: 'INVESTMENT_EARLY_EXIT',
            amountCents: payoutCents,
            catalogId: 'cat_inc_yield',
            referenceId: inv.id,
            metadata: { principalCents: inv.principalCents, yieldCents: earlyYieldCents },
            note:
              earlyYieldCents > 0
                ? `Retiro antes de tiempo de "${inv.title}" (+${formatMoneyCents(earlyYieldCents)} mitad de ganancia)`
                : `Retiro antes de tiempo de "${inv.title}" (Solo capital)`,
            localDate: today
          },
          this.parentSigningKey,
          this.state.family.saltHex,
          this.getLastEventHash()
        );
        this.state.ledgerEvents.push(signedEarly);
        this.showToast(
          earlyYieldCents > 0
            ? `Se devolvieron ${formatMoneyCents(payoutCents)} (incluye +${formatMoneyCents(earlyYieldCents)} de ganancia parcial).`
            : `Se devolvieron ${formatMoneyCents(inv.principalCents)} al dinero libre.`,
          'info'
        );
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
            note: `Premio de Ahorro "${inv.title}" (${formatMoneyCents(inv.principalCents)} + Ganancia +${formatMoneyCents(evalInv.expectedInterestCents)})`,
            localDate: today
          },
          this.parentSigningKey,
          this.state.family.saltHex,
          this.getLastEventHash()
        );
        this.state.ledgerEvents.push(signedMat);
        this.showToast(
          `¡Felicidades! Se entregaron ${formatMoneyCents(evalInv.maturityTotalCents)} (incluyendo +${formatMoneyCents(evalInv.expectedInterestCents)} de ganancia).`,
          'success'
        );
      }

      await this.cloudManager.pushState(this.state);
      await this.runLedgerAuditAndRender();
    });
  }

  async submitMemberForm() {
    await this.runAsParent(async () => {
      const editId = (document.getElementById('memEditIdInput')?.value || '').trim();
      const role = document.getElementById('memRoleSelect').value;
      const name = document.getElementById('memNameInput').value.trim();
      const avatar = resolveIconKey(document.getElementById('memAvatarSelect').value, 'piggy');
      const ageOrTitle = document.getElementById('memAgeInput').value.trim();
      const goalTitle = document.getElementById('memGoalTitleInput').value.trim() || 'Mi Meta de Ahorro';
      const goalTargetCents = toCents(document.getElementById('memGoalAmountInput').value || 1000);

      if (editId) {
        const existing = (this.state.members || []).find((m) => m.id === editId);
        if (existing) {
          existing.role = role;
          existing.name = name;
          existing.avatar = avatar;
          if (role === 'CHILD') {
            existing.age = Number(ageOrTitle) || 10;
            existing.goalTitle = goalTitle;
            existing.goalTargetCents = goalTargetCents;
          } else {
            existing.title = ageOrTitle || 'Administrador Familiar';
          }
          existing.updatedAt = new Date().toISOString();
          document.getElementById('dialogMember')?.close();
          await this.cloudManager.pushState(this.state);
          this.renderAll();
          this.showToast(`Perfil de "${name}" actualizado.`, 'success');
          return;
        }
      }

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
      this.showToast(`Integrante "${name}" agregado a la familia.`, 'success');
    });
  }

  async handleDeleteMember(memberId) {
    await this.runAsParent(async () => {
      const mem = (this.state.members || []).find((m) => m.id === memberId);
      if (!mem) return;
      const children = this.getChildren();
      if (mem.role === 'CHILD' && children.length <= 1) {
        this.showToast('Debe quedar al menos 1 alcancía de Hijo/a. Puedes usar "Editar" para cambiarle el nombre.', 'warn');
        return;
      }
      const parents = this.getParents();
      if (mem.role === 'PARENT' && parents.length <= 1) {
        this.showToast('Debe quedar al menos 1 cuenta de Papá/Mamá. Puedes usar "Editar" para cambiarle el nombre.', 'warn');
        return;
      }

      this.markDeletedId(memberId);
      this.state.members = (this.state.members || []).filter((m) => m.id !== memberId);
      if (this.selectedChildId === memberId) {
        this.selectedChildId = this.getChildren()[0]?.id || null;
      }
      await this.cloudManager.pushState(this.state);
      await this.runLedgerAuditAndRender();
      this.showToast(`Integrante "${mem.name}" borrado.`, 'info');
    });
  }

  async submitCatalogForm() {
    await this.runAsParent(async () => {
      const editId = (document.getElementById('catEditIdInput')?.value || '').trim();
      const type = document.getElementById('catTypeInput').value;
      const name = document.getElementById('catNameInput').value.trim();
      const icon = resolveIconKey(document.getElementById('catIconSelect').value, 'coins');
      const description = document.getElementById('catDescInput').value.trim();

      if (editId) {
        const existing = (this.state.catalogs || []).find((c) => c.id === editId);
        if (existing) {
          existing.name = name;
          existing.icon = icon;
          existing.description = description;
          existing.updatedAt = new Date().toISOString();
          document.getElementById('dialogCatalog')?.close();
          await this.cloudManager.pushState(this.state);
          this.renderAll();
          this.showToast(`Categoría "${name}" modificada.`, 'success');
          return;
        }
      }

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
      this.showToast(`"${name}" agregado al catálogo.`, 'success');
    });
  }

  async handleDeleteCatalog(catId) {
    await this.runAsParent(async () => {
      this.markDeletedId(catId);
      this.state.catalogs = (this.state.catalogs || []).filter((c) => c.id !== catId);
      await this.cloudManager.pushState(this.state);
      this.renderAll();
      this.showToast('Categoría borrada.', 'info');
    });
  }

  async sendSandboxRequest(requestType) {
    const child = this.getSelectedChild();
    if (!child) return;

    let newReq;
    if (requestType === 'INVESTMENT') {
      const amount = Number(document.getElementById('simInvAmount').value || 300);
      const planId = document.getElementById('simInvPlan')?.value || 'SHORT';
      const val = this.validatePlanInvestment(child, planId, amount * 100);
      if (val.error) {
        this.showToast(val.error, 'warn');
        return;
      }
      const termDays = val.plan.termDays;
      const ratePercent = Number((val.bps / 100).toFixed(2));
      newReq = {
        id: `req_${Date.now()}`,
        familyId: this.state.family.id,
        memberId: child.id,
        requestType: 'INVESTMENT',
        planId: val.plan.id,
        title: `${val.plan.label}: Guardar ${formatMoneyCents(amount * 100)} (+${ratePercent}%)`,
        amountCents: amount * 100,
        termDays,
        ratePercent,
        note: `Pedido enviado por ${child.name} en el plan ${val.plan.label} (${termDays} días) para ganar +${formatMoneyCents(val.expectedYieldCents)} al terminar el plazo.`,
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
        title: `Préstamo de ${formatMoneyCents(amount * 100)} en ${termPeriods} pagos (${ratePercent}% ${interestType === 'SIMPLE' ? 'Simple' : 'Compuesto'})`,
        amountCents: amount * 100,
        termPeriods,
        ratePercent,
        interestType,
        note: `Pedido de préstamo enviado por ${child.name}.`,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    this.state.childRequests = this.state.childRequests || [];
    this.state.childRequests.push(newReq);
    await this.cloudManager.pushState(this.state);
    this.renderAll();
    this.showToast('¡Pedido enviado! Papá o Mamá puede tocar "Aprobar Pedido" aquí abajo o en el aviso superior.', 'success');
  }

  async handleDeleteChildRequest(reqId) {
    await this.runAsParent(async () => {
      this.markDeletedId(reqId);
      this.state.childRequests = (this.state.childRequests || []).filter((r) => r.id !== reqId);
      await this.cloudManager.pushState(this.state);
      this.renderAll();
      this.showToast('Pedido borrado.', 'info');
    });
  }

  async handleProcessChildRequest(reqId, approve = true) {
    const preReq = (this.state.childRequests || []).find((r) => r.id === reqId && r.status === 'PENDING');
    if (preReq && preReq.requestType === 'FINE_APPEAL') {
      await this.resolveFine(preReq.refId, approve ? 'REMOVE' : 'KEEP');
      return;
    }

    await this.runAsParent(async () => {
      const req = (this.state.childRequests || []).find((r) => r.id === reqId && r.status === 'PENDING');
      if (!req) {
        this.showToast('Este pedido ya fue procesado.', 'info');
        return;
      }

      if (!approve) {
        req.status = 'REJECTED';
        req.updatedAt = new Date().toISOString();
        await this.cloudManager.pushState(this.state);
        this.renderAll();
        this.showToast('Pedido rechazado.', 'info');
        return;
      }

      const today = getTodayLocalDate();
      if (req.requestType === 'INVESTMENT') {
        const member = (this.state.members || []).find((m) => m.id === req.memberId) || this.getSelectedChild();
        const planId = req.planId || (req.termDays >= 300 ? 'LONG' : req.termDays >= 120 ? 'MEDIUM' : 'SHORT');
        const val = this.validatePlanInvestment(member, planId, req.amountCents);
        if (val.error) {
          this.showToast(val.error, 'warn');
          return;
        }

        // Si la alcancía no tiene saldo suficiente para cubrir el ahorro a plazo pedido,
        // acreditamos automáticamente el faltante como depósito autorizado por Papá/Mamá
        // para que el botón "Aprobar Pedido" siempre funcione de inmediato.
        if (req.amountCents > val.fin.availableCents) {
          const shortfallCents = req.amountCents - Math.max(0, val.fin.availableCents);
          const signedFunding = await createSignedLedgerEvent(
            {
              familyId: this.state.family.id,
              memberId: req.memberId,
              createdByParentId: this.activeParentId,
              type: 'INCOME',
              amountCents: shortfallCents,
              catalogId: 'cat_inc_allowance',
              note: `Depósito de Papá/Mamá para completar el ahorro a plazo: ${req.title}`,
              localDate: today
            },
            this.parentSigningKey,
            this.state.family.saltHex,
            this.getLastEventHash()
          );
          this.state.ledgerEvents.push(signedFunding);
          this.auditResult.validEvents.push(signedFunding);
        }

        await this.createPlanInvestmentSigned({
          member,
          planId,
          principalCents: req.amountCents,
          title: req.title,
          note: `Ahorro a Plazo aprobado desde Calculadora: ${req.title}`
        });
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
            note: `Préstamo aprobado desde Calculadora: ${req.title}`,
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
      this.selectedChildId = req.memberId;
      await this.cloudManager.pushState(this.state);
      await this.runLedgerAuditAndRender();
      this.showToast('¡Pedido aprobado y aplicado en la alcancía!', 'success');
    });
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
    await this.runAsParent(async () => {
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

      await this.reSignLedgerChain();
      document.getElementById('newParentPinInput').value = '';

      await this.cloudManager.pushState(this.state);
      await this.runLedgerAuditAndRender();
      this.showToast('PIN de Papá/Mamá actualizado y movimientos protegidos.', 'success');
    });
  }

  async resetToInitialDemoData() {
    await this.runAsParent(async () => {
      const prevSalt = this.state?.family?.saltHex;
      const prevVerifier = this.state?.family?.authVerifier;
      const prevFamilyCode = this.state?.family?.familyCode || 'FAM-2026-KIDS';

      // deletedIds es un mapa { id: fechaISO } (tombstones del CRDT)
      const prevDeleted = this.state?.family?.deletedIds;
      const allOldIds = prevDeleted && typeof prevDeleted === 'object' && !Array.isArray(prevDeleted) ? { ...prevDeleted } : {};
      const tombstoneIso = new Date().toISOString();
      for (const col of ['ledgerEvents', 'loans', 'investments', 'recurringRules', 'childRequests', 'tasks', 'taskClaims', 'taskReviews']) {
        (this.state?.[col] || []).forEach((item) => {
          if (item?.id) allOldIds[item.id] = tombstoneIso;
        });
      }

      const cleanState = await buildInitialSignedFamilyState(prevFamilyCode);
      if (prevSalt && prevVerifier) {
        cleanState.family.saltHex = prevSalt;
        cleanState.family.authVerifier = prevVerifier;
      }
      cleanState.family.resetEpoch = Date.now();
      cleanState.family.deletedIds = allOldIds;
      cleanState.family.updatedAt = new Date().toISOString();

      this.state = cleanState;
      this.selectedChildId = 'child_principal';

      await this.cloudManager.pushState(this.state);
      await this.runLedgerAuditAndRender();
      this.showToast('¡Todos los datos fueron borrados! Tu alcancía empieza limpia en $0.00.', 'success');
    });
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
  installRulesFeatures(SmartPiggyApp);
  const app = new SmartPiggyApp();
  app.init();
});

})();
