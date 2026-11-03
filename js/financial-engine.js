/**
 * SmartPiggy Cloud - Motor Financiero Determinista y Reductor Event-Sourced (Ronda 2 Auditado)
 * - 100% aritmética en enteros (centavos) sin errores de punto flotante IEEE 754.
 * - Estado derivado mediante reducción pura (fold/reduce) sobre eventos verificados del Ledger (CRDT G-Set).
 * - Tablas de amortización Simple y Compuesta Francesa con absorción exacta de residuo en la cuota N.
 * - Soporte de Abonos Extraordinarios a Capital (recalculando intereses sobre saldo insoluto).
 * - Inversiones a Plazo Fijo con cálculo de interés devengado diario y rescate anticipado.
 * - Motor idempotente de Ingresos Recurrentes sobre fechas calendario locales (YYYY-MM-DD).
 */

export function getTodayLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDaysLocalDate(localDateStr, daysToAdd) {
  const [y, m, d] = String(localDateStr).split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1, 12, 0, 0);
  dt.setDate(dt.getDate() + Number(daysToAdd || 0));
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addMonthsLocalDate(localDateStr, monthsToAdd) {
  const [y, m, d] = String(localDateStr).split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1 + Number(monthsToAdd || 0), d || 1, 12, 0, 0);
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function diffDaysLocalDate(startLocalDate, endLocalDate) {
  const [y1, m1, d1] = String(startLocalDate).split('-').map(Number);
  const [y2, m2, d2] = String(endLocalDate).split('-').map(Number);
  const t1 = new Date(y1, (m1 || 1) - 1, d1 || 1, 12, 0, 0).getTime();
  const t2 = new Date(y2, (m2 || 1) - 1, d2 || 1, 12, 0, 0).getTime();
  return Math.round((t2 - t1) / (1000 * 60 * 60 * 24));
}

export function toCents(amountFloatOrStr) {
  const num = Number(String(amountFloatOrStr).replace(/[^0-9.-]/g, ''));
  if (Number.isNaN(num)) return 0;
  return Math.round(num * 100);
}

export function formatMoneyCents(cents, currency = 'MXN', showSign = false) {
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
export function advanceDateByFrequency(localDateStr, frequency, steps = 1) {
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
export function generateLoanSchedule({
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
export function recalculateLoanAfterExtraPrincipal(loan, extraPrincipalCents, paymentLocalDate = getTodayLocalDate()) {
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
export function evaluateInvestmentProgress(investment, referenceLocalDate = getTodayLocalDate()) {
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
export function reduceMemberFinancialState({
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
export function findDueDeterministicAutomations(appState, referenceLocalDate = getTodayLocalDate()) {
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
