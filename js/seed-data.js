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
    tasks: buildDefaultTasks(family.id, nowIso),
    taskClaims: [],
    taskReviews: [],
    finePresets: buildDefaultFinePresets(family.id, nowIso),
    ledgerEvents: [],
    lastSyncedAt: nowIso
  };
}

/* ==========================================================================
   TAREAS, MULTAS Y PLANES DE AHORRO (Montos parejos sin distinción por edad)
   Montos en centavos MXN. A igual tarea, misma recompensa; a misma regla,
   misma consecuencia; a mismo plazo de ahorro, misma tasa de interés.
   ========================================================================== */

export const AGE_BANDS = ['9_12', '13_17'];

/** Plantillas de tareas (EXTRA = con pago parejo; RESPONSIBILITY = responsabilidad sin pago). */
export const TASK_TEMPLATES = [
  { id: 'tpl_car', kind: 'EXTRA', title: 'Lavar el coche', description: 'Por dentro y por fuera, sin dejar manchas.', iconKey: 'car', unit: 'ONCE', rewardCents: 5000, rewardByBand: { '9_12': 5000, '13_17': 5000 } },
  { id: 'tpl_laundry', kind: 'EXTRA', title: 'Lavar y doblar la ropa de la familia', description: 'Separar colores, lavar, doblar y guardar.', iconKey: 'shirt', unit: 'ONCE', rewardCents: 3000, rewardByBand: { '9_12': 3000, '13_17': 3000 } },
  { id: 'tpl_cook', kind: 'EXTRA', title: 'Ayudar a cocinar la comida del domingo', description: 'Ayudar a preparar y a dejar la cocina limpia.', iconKey: 'food', unit: 'ONCE', rewardCents: 3500, rewardByBand: { '9_12': 3500, '13_17': 3500 } },
  { id: 'tpl_closet', kind: 'EXTRA', title: 'Organizar clóset o bodega', description: 'Ordenar, separar lo que ya no se usa y limpiar.', iconKey: 'broom', unit: 'ONCE', rewardCents: 4000, rewardByBand: { '9_12': 4000, '13_17': 4000 } },
  { id: 'tpl_yard', kind: 'EXTRA', title: 'Limpiar patio o ventanas', description: 'Barrer, regar plantas o limpiar vidrios.', iconKey: 'plant', unit: 'ONCE', rewardCents: 4500, rewardByBand: { '9_12': 4500, '13_17': 4500 } },
  { id: 'tpl_grocery', kind: 'EXTRA', title: 'Reto: lista del súper con presupuesto', description: 'Arma la lista de la semana sin pasarte del presupuesto que te demos.', iconKey: 'cart', unit: 'ONCE', rewardCents: 3500, rewardByBand: { '9_12': 3500, '13_17': 3500 } },
  { id: 'tpl_book', kind: 'EXTRA', title: 'Reto: leer un libro y contarlo', description: 'Lee un libro completo y cuéntanos de qué trató.', iconKey: 'book', unit: 'ONCE', rewardCents: 5000, rewardByBand: { '9_12': 5000, '13_17': 5000 } },
  { id: 'tpl_noscreens', kind: 'EXTRA', title: 'Reto: fin de semana sin pantallas', description: 'Sábado y domingo sin videojuegos ni redes sociales.', iconKey: 'phone', unit: 'WEEK', rewardCents: 4000, rewardByBand: { '9_12': 4000, '13_17': 4000 } },
  { id: 'tpl_babysit', kind: 'EXTRA', title: 'Cuidar a un hermano menor 2 horas', description: 'Cuidarlo con atención, jugando y sin pantallas.', iconKey: 'users', unit: 'ONCE', rewardCents: 5000, rewardByBand: { '9_12': 5000, '13_17': 5000 } },
  { id: 'tpl_bed', kind: 'RESPONSIBILITY', title: 'Tender tu cama', description: 'Responsabilidad diaria. No se paga: es parte de vivir en familia.', iconKey: 'bed', unit: 'WEEK', rewardCents: 0, rewardByBand: { '9_12': 0, '13_17': 0 } },
  { id: 'tpl_room', kind: 'RESPONSIBILITY', title: 'Recoger tu cuarto', description: 'Responsabilidad. No se paga.', iconKey: 'broom', unit: 'WEEK', rewardCents: 0, rewardByBand: { '9_12': 0, '13_17': 0 } },
  { id: 'tpl_dishes', kind: 'RESPONSIBILITY', title: 'Lavar tus trastes', description: 'Responsabilidad. No se paga.', iconKey: 'dish', unit: 'WEEK', rewardCents: 0, rewardByBand: { '9_12': 0, '13_17': 0 } },
  { id: 'tpl_trash', kind: 'RESPONSIBILITY', title: 'Tu turno de sacar la basura', description: 'Responsabilidad. No se paga.', iconKey: 'trash', unit: 'WEEK', rewardCents: 0, rewardByBand: { '9_12': 0, '13_17': 0 } },
  { id: 'tpl_homework', kind: 'RESPONSIBILITY', title: 'Hacer la tarea de la escuela', description: 'Responsabilidad. No se paga.', iconKey: 'book', unit: 'WEEK', rewardCents: 0, rewardByBand: { '9_12': 0, '13_17': 0 } }
];

export function buildDefaultTasks(familyId = 'fam_smartpiggy_01', nowIso = new Date().toISOString()) {
  return TASK_TEMPLATES.map((tpl) => ({
    id: `task_default_${tpl.id}`,
    familyId,
    kind: tpl.kind,
    title: tpl.title,
    description: tpl.description,
    iconKey: tpl.iconKey,
    maxAssignees: tpl.kind === 'RESPONSIBILITY' ? null : 1,
    eligibleMemberIds: [],
    unit: tpl.unit || 'ONCE',
    rewardCents: tpl.rewardCents,
    rewardByBand: { '9_12': tpl.rewardCents, '13_17': tpl.rewardCents },
    dueDate: null,
    status: 'OPEN',
    createdBy: 'parent_admin',
    createdAt: nowIso,
    updatedAt: nowIso
  }));
}

/** Límites de validación de multas por nivel (centavos, parejos para todos). */
export const FINE_LEVEL_LIMITS = {
  LEVE: [500, 2000],
  MEDIA: [1500, 6000],
  GRAVE: [100, 20000]
};

export function buildDefaultFinePresets(familyId = 'fam_smartpiggy_01', nowIso = new Date().toISOString()) {
  const base = { familyId, active: true, version: 2, updatedAt: nowIso };
  return [
    { ...base, id: 'fine_lights', kind: 'FIXED', level: 'LEVE', title: 'Dejar luces o TV prendidas sin nadie', description: 'Cuidamos la energía y el dinero de la luz.', iconKey: 'bulb', amountCents: 1000, amountByBand: { '9_12': 1000, '13_17': 1000 } },
    { ...base, id: 'fine_mess', kind: 'FIXED', level: 'LEVE', title: 'No recoger tus cosas después de 2 avisos', description: 'Se avisa dos veces antes de aplicar la multa.', iconKey: 'broom', amountCents: 1500, amountByBand: { '9_12': 1500, '13_17': 1500 } },
    { ...base, id: 'fine_food', kind: 'FIXED', level: 'LEVE', title: 'Desperdiciar comida a propósito', description: 'Servirte solo lo que te vas a comer.', iconKey: 'food', amountCents: 1000, amountByBand: { '9_12': 1000, '13_17': 1000 } },
    { ...base, id: 'fine_phone', kind: 'FIXED', level: 'MEDIA', title: 'Usar el celular en horario no permitido', description: 'Durante la comida, en la noche o en horas de escuela.', iconKey: 'phone', amountCents: 3000, amountByBand: { '9_12': 3000, '13_17': 3000 } },
    { ...base, id: 'fine_respect', kind: 'FIXED', level: 'MEDIA', title: 'Groserías o faltas de respeto', description: 'Hablar con respeto a todos en casa.', iconKey: 'alert-triangle', amountCents: 4000, amountByBand: { '9_12': 4000, '13_17': 4000 } },
    { ...base, id: 'fine_screentime', kind: 'FIXED', level: 'MEDIA', title: 'Pasarte del tiempo de pantallas acordado', description: 'Respetar el tiempo de videojuegos y redes que acordamos.', iconKey: 'clock', amountCents: 2000, amountByBand: { '9_12': 2000, '13_17': 2000 } },
    { ...base, id: 'fine_broken', kind: 'REPAIR', level: 'GRAVE', title: 'Romper algo por descuido (reparación)', description: 'Pagas el 50% del costo hasta un tope. Si lo confiesas tú solo, pagas la mitad.', iconKey: 'broken', amountCents: 12000, amountByBand: { '9_12': 12000, '13_17': 12000 } },
    { ...base, id: 'fine_damage', kind: 'REPAIR', level: 'GRAVE', title: 'Dañar algo ajeno (escuela, vecino)', description: 'Ayudas a reparar con el 50% del costo hasta un tope. Si lo confiesas, pagas la mitad.', iconKey: 'broken', amountCents: 12000, amountByBand: { '9_12': 12000, '13_17': 12000 } }
  ];
}

export function buildDefaultInvestmentPlans(nowIso = new Date().toISOString()) {
  return [
    { id: 'SHORT', label: 'Corto plazo (1 mes)', termDays: 30, yieldBps: 200, yieldBpsByBand: { '9_12': 200, '13_17': 200 }, minPrincipalCents: 5000, earlyExit: 'PRINCIPAL_ONLY', version: 2, updatedAt: nowIso },
    { id: 'MEDIUM', label: 'Mediano plazo (6 meses)', termDays: 182, yieldBps: 1250, yieldBpsByBand: { '9_12': 1250, '13_17': 1250 }, minPrincipalCents: 10000, earlyExit: 'HALF_ACCRUED', version: 2, updatedAt: nowIso },
    { id: 'LONG', label: 'Largo plazo (1 año)', termDays: 365, yieldBps: 2600, yieldBpsByBand: { '9_12': 2600, '13_17': 2600 }, minPrincipalCents: 20000, earlyExit: 'HALF_ACCRUED', version: 2, updatedAt: nowIso }
  ];
}

export function buildDefaultRulesConfig(nowIso = new Date().toISOString()) {
  return {
    taskMonthlyCapCents: 50000,
    taskMonthlyCapByBand: { '9_12': 50000, '13_17': 50000 },
    fineMonthlyCapCents: 15000,
    fineMonthlyCapByBand: { '9_12': 15000, '13_17': 15000 },
    fineMinCapCents: 1000,
    fineMinCapByBand: { '9_12': 1000, '13_17': 1000 },
    fineIncomePct: 25,
    investCapCents: 250000,
    investCapByBand: { '9_12': 250000, '13_17': 250000 },
    version: 2,
    updatedAt: nowIso
  };
}

/**
 * Agrega a un estado existente las colecciones y configuraciones nuevas,
 * unificando montos sin distinción de edad y actualizando los planes de ahorro al doble de interés.
 */
export function ensureFeatureDefaults(state) {
  if (!state || !state.family) return state;
  const deleted = state.family.deletedIds || {};
  const fallbackIso = '2026-01-01T00:00:00.000Z';

  state.tasks = Array.isArray(state.tasks) ? state.tasks : [];
  if (state.tasks.length === 0) {
    state.tasks = buildDefaultTasks(state.family.id, fallbackIso).filter((t) => !deleted[t.id]);
  } else {
    state.tasks.forEach((t) => {
      const b = t.rewardByBand || {};
      const unified = Number.isFinite(Number(t.rewardCents))
        ? Math.round(Number(t.rewardCents))
        : Math.max(Number(b['9_12'] || 0), Number(b['13_17'] || 0));
      t.rewardCents = unified;
      t.rewardByBand = { '9_12': unified, '13_17': unified };
    });
  }

  state.taskClaims = Array.isArray(state.taskClaims) ? state.taskClaims : [];
  state.taskReviews = Array.isArray(state.taskReviews) ? state.taskReviews : [];

  if (!Array.isArray(state.finePresets) || state.finePresets.length === 0) {
    state.finePresets = buildDefaultFinePresets(state.family.id, fallbackIso).filter((p) => !deleted[p.id]);
  } else {
    const defaultsById = new Map(buildDefaultFinePresets(state.family.id, fallbackIso).map((p) => [p.id, p]));
    state.finePresets.forEach((p) => {
      const def = defaultsById.get(p.id);
      const b = p.amountByBand || {};
      if (def && (!p.version || p.version < 2) && b['9_12'] !== b['13_17']) {
        p.amountCents = def.amountCents;
        p.amountByBand = { '9_12': def.amountCents, '13_17': def.amountCents };
        p.version = 2;
      } else {
        const unified = Number.isFinite(Number(p.amountCents))
          ? Math.round(Number(p.amountCents))
          : Math.max(Number(b['9_12'] || 0), Number(b['13_17'] || 0));
        p.amountCents = unified;
        p.amountByBand = { '9_12': unified, '13_17': unified };
      }
    });
  }

  if (!Array.isArray(state.family.investmentPlans) || state.family.investmentPlans.length !== 3) {
    state.family.investmentPlans = buildDefaultInvestmentPlans(fallbackIso);
  } else {
    const defPlans = new Map(buildDefaultInvestmentPlans(fallbackIso).map((p) => [p.id, p]));
    state.family.investmentPlans.forEach((p) => {
      const def = defPlans.get(p.id);
      if (def && (!p.version || p.version < 2)) {
        p.yieldBps = def.yieldBps;
        p.yieldBpsByBand = { '9_12': def.yieldBps, '13_17': def.yieldBps };
        p.version = 2;
      } else {
        const b = p.yieldBpsByBand || {};
        const unified = Number.isFinite(Number(p.yieldBps))
          ? Math.round(Number(p.yieldBps))
          : Math.max(Number(b['9_12'] || 0), Number(b['13_17'] || 0));
        p.yieldBps = unified;
        p.yieldBpsByBand = { '9_12': unified, '13_17': unified };
      }
    });
  }

  if (!state.family.rulesConfig || typeof state.family.rulesConfig !== 'object' || !state.family.rulesConfig.version || state.family.rulesConfig.version < 2) {
    state.family.rulesConfig = buildDefaultRulesConfig(fallbackIso);
  } else {
    const rc = state.family.rulesConfig;
    const taskCap = Number(rc.taskMonthlyCapCents ?? rc.taskMonthlyCapByBand?.['13_17'] ?? 50000);
    const fineCap = Number(rc.fineMonthlyCapCents ?? rc.fineMonthlyCapByBand?.['13_17'] ?? 15000);
    const fineMin = Number(rc.fineMinCapCents ?? rc.fineMinCapByBand?.['13_17'] ?? 1000);
    const invCap = Number(rc.investCapCents ?? rc.investCapByBand?.['13_17'] ?? 250000);
    rc.taskMonthlyCapCents = taskCap;
    rc.taskMonthlyCapByBand = { '9_12': taskCap, '13_17': taskCap };
    rc.fineMonthlyCapCents = fineCap;
    rc.fineMonthlyCapByBand = { '9_12': fineCap, '13_17': fineCap };
    rc.fineMinCapCents = fineMin;
    rc.fineMinCapByBand = { '9_12': fineMin, '13_17': fineMin };
    rc.investCapCents = invCap;
    rc.investCapByBand = { '9_12': invCap, '13_17': invCap };
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
      updatedAt: fallbackIso
    });
  }
  return state;
}
