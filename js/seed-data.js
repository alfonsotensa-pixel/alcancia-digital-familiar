/**
 * SmartPiggy Cloud - Generador de Estado Inicial Semilla Criptográficamente Firmado
 * Crea una familia de demostración completa con todas las entidades firmadas con HMAC-SHA256
 * y claves de iconografía 100% SVG vectorial.
 */

import { deriveParentKeyBundle, createSignedLedgerEvent, generateSaltHex } from './crypto-ledger.js';
import {
  getTodayLocalDate,
  addDaysLocalDate,
  generateLoanSchedule
} from './financial-engine.js';

export const DEFAULT_DEMO_PIN = '1234';

export async function buildInitialSignedFamilyState(customFamilyCode = 'FAM-2026-KIDS', initialPin = DEFAULT_DEMO_PIN) {
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
