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
    family,
    members,
    catalogs,
    recurringRules: [],
    loans: [],
    investments: [],
    childRequests: [],
    ledgerEvents: [],
    lastSyncedAt: nowIso
  };
}
