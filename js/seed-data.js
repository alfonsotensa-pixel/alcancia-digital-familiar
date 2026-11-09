/**
 * SmartPiggy Cloud - Estado Inicial Limpio (Sin datos de prueba)
 * Crea la estructura base de la familia con saldo $0.00, sin movimientos ni préstamos de prueba,
 * lista para registrar integrantes y movimientos reales con iconografía 100% SVG.
 */

import { deriveParentKeyBundle, generateSaltHex } from './crypto-ledger.js';

export const DEFAULT_DEMO_PIN = '1234';

export async function buildInitialSignedFamilyState(customFamilyCode = 'FAM-2026-KIDS', initialPin = DEFAULT_DEMO_PIN) {
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

export const AGE_BANDS = ['9_12', '13_17'];

/** Plantillas de tareas (EXTRA = con pago; RESPONSIBILITY = responsabilidad sin pago). */
export const TASK_TEMPLATES = [
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
export const FINE_LEVEL_LIMITS = {
  LEVE: { '9_12': [500, 1000], '13_17': [1000, 2000] },
  MEDIA: { '9_12': [1500, 3000], '13_17': [2500, 6000] },
  GRAVE: { '9_12': [100, 8000], '13_17': [100, 15000] }
};

export function buildDefaultFinePresets(familyId = 'fam_smartpiggy_01', nowIso = new Date().toISOString()) {
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

export function buildDefaultInvestmentPlans(nowIso = new Date().toISOString()) {
  return [
    { id: 'SHORT', label: 'Corto plazo (1 mes)', termDays: 30, yieldBpsByBand: { '9_12': 100, '13_17': 75 }, minPrincipalCents: 5000, earlyExit: 'PRINCIPAL_ONLY', version: 1, updatedAt: nowIso },
    { id: 'MEDIUM', label: 'Mediano plazo (6 meses)', termDays: 182, yieldBpsByBand: { '9_12': 620, '13_17': 500 }, minPrincipalCents: 10000, earlyExit: 'HALF_ACCRUED', version: 1, updatedAt: nowIso },
    { id: 'LONG', label: 'Largo plazo (1 año)', termDays: 365, yieldBpsByBand: { '9_12': 1300, '13_17': 1200 }, minPrincipalCents: 20000, earlyExit: 'HALF_ACCRUED', version: 1, updatedAt: nowIso }
  ];
}

export function buildDefaultRulesConfig(nowIso = new Date().toISOString()) {
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
export function ensureFeatureDefaults(state) {
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
