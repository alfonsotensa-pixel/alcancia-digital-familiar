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

import { renderSvgIcon, resolveIconKey } from './icons.js';

import {
  deriveParentKeyBundle,
  createSignedLedgerEvent,
  auditLedgerEvents,
  generateSaltHex
} from './crypto-ledger.js';

import {
  getTodayLocalDate,
  addDaysLocalDate,
  toCents,
  formatMoneyCents,
  generateLoanSchedule,
  recalculateLoanAfterExtraPrincipal,
  evaluateInvestmentProgress,
  reduceMemberFinancialState,
  findDueDeterministicAutomations
} from './financial-engine.js';

import { CloudSyncManager, mergeFamilyCRDT } from './cloud-sync.js';
import { buildInitialSignedFamilyState } from './seed-data.js';

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

    // Si el enlace compartido incluye configuración de conexión en tiempo real (ideal para GitHub Pages)
    const sbParam = params.get('sb');
    if (sbParam) {
      try {
        const decoded = JSON.parse(atob(sbParam));
        if (decoded && decoded.u && decoded.k) {
          this.cloudManager.saveCloudConfig({
            provider: decoded.p || 'SUPABASE_REST',
            endpointUrl: decoded.u,
            apiKey: decoded.k,
            tableName: decoded.t || 'smartpiggy_families'
          });
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
      this.showToast('Acción protegida: Desbloquea el Modo Papá con tu PIN para modificar datos.', 'warn');
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
        this.lockToChildMode('Sesión de Modo Papá cerrada automáticamente por inactividad (3 min).');
      }, 3 * 60 * 1000);
    }
  }

  lockToChildMode(reasonMsg = 'Modo Hijo (Solo Lectura) activado. Llave de firma eliminada de la memoria.') {
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
        .map((p) => `<option value="${p.id}" ${p.id === this.activeParentId ? 'selected' : ''}>${p.name} (${p.title || 'Administrador'})</option>`)
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
    this.showToast('Modo Papá desbloqueado. Firma criptográfica HMAC-SHA256 activa.', 'success');
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
        <span><strong>MODO PAPÁ ACTIVO (${parentObj.name}):</strong> Tienes control total para registrar ingresos, descontar gastos, otorgar créditos, crear inversiones y administrar catálogos.</span>
      `;
      btnToggleRole.innerHTML = `${renderSvgIcon('eye', 16)} Cambiar a Vista Hijo (Bloquear Edición)`;
    } else {
      roleStatusText.innerHTML = `
        ${renderSvgIcon('eye', 18)}
        <span><strong>VISTA HIJO (SOLO LECTURA PROTEGIDA):</strong> Explora tu alcancía, inversiones y créditos o usa el Laboratorio Financiero. Solo Papá/Mamá pueden modificar datos con su PIN.</span>
      `;
      btnToggleRole.innerHTML = `${renderSvgIcon('lock', 16)} Entrar a Modo Papá (PIN)`;
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
              <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-income);">${formatMoneyCents(cState.availableCents, currency)} disp.</div>
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
    document.getElementById('kpiAvailableSub').textContent = `Ingresos totales: ${formatMoneyCents(childFinance.totalIncomeCents, currency)} · Gastos: ${formatMoneyCents(childFinance.totalExpenseCents, currency)}`;

    document.getElementById('kpiInvested').textContent = formatMoneyCents(childFinance.investedCents, currency);
    document.getElementById('kpiInvestCountBadge').textContent = `${childFinance.activeInvestments.length} activo(s)`;
    document.getElementById('kpiAccruedYield').textContent = formatMoneyCents(childFinance.accruedYieldCents, currency, true);

    document.getElementById('kpiDebt').textContent = formatMoneyCents(childFinance.debtCents, currency);
    document.getElementById('kpiLoanCountBadge').textContent = `${childFinance.activeLoans.length} activo(s)`;
    const nextLoan = childFinance.activeLoans.find((l) => l.nextInstallment);
    document.getElementById('kpiNextLoanDue').textContent = nextLoan
      ? `Próxima cuota: ${formatMoneyCents(nextLoan.nextInstallment.totalInstallmentCents - (nextLoan.nextInstallment.paidCents || 0), currency)} (${nextLoan.nextInstallment.dueDate})`
      : 'Libre de deudas pendientes';

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
            Meta de Ahorro de ${child.name}: <span style="color: var(--color-income);">${child.goalTitle || 'Mi Gran Meta'}</span>
          </span>
          <span style="font-family: var(--font-mono); font-weight: 800; font-size: 0.9rem;">
            ${formatMoneyCents(currentProgressCents, currency)} / ${formatMoneyCents(targetCents, currency)} (${pct}%)
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
            <span><strong>ALERTA DE SEGURIDAD CRIPTOGRÁFICA (${this.auditResult.corruptedEvents.length} asiento apócrifo bloqueado):</strong>
            Se detectó un movimiento en almacenamiento local sin firma HMAC-SHA256 válida de Papá/Mamá. El motor lo marcó como <code>CORRUPTED_UNSIGNED_ENTRY</code> y protegió el saldo real.</span>
          </div>
          <button type="button" class="btn btn-sm btn-expense" data-action="purge-corrupted">
            ${renderSvgIcon('trash', 15)} Eliminar Asiento Corrupto
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
              <span><strong>Tienes ${due.totalDueCount} acreditación(es) programada(s) lista(s) para hoy:</strong>
              En cuanto Mamá o Papá desbloquee el Modo Papá, tu mesada o vencimiento de inversión se firmará y sumará automáticamente a tu saldo disponible.</span>
            </div>
            <button type="button" class="btn btn-sm btn-primary" data-action="open-pin">
              ${renderSvgIcon('lock', 15)} Firmar como Papá
            </button>
          </div>
        `);
      } else {
        banners.push(`
          <div class="notice-banner info">
            <div class="inline-icon-text">
              ${renderSvgIcon('zap', 20)}
              <span><strong>Hay ${due.totalDueCount} evento(s) programado(s) vencido(s) hoy</strong> listos para consolidarse en el Ledger.</span>
            </div>
            <button type="button" class="btn btn-sm btn-income" data-action="consolidate-due">
              ${renderSvgIcon('check', 15)} Firmar y Acreditar Ahora
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
            <span><strong>Tienes ${pendingReqs.length} solicitud(es) enviada(s) por tus hijos desde el Simulador Financiero:</strong>
            "${pendingReqs[0].title}"</span>
          </div>
          <button type="button" class="btn btn-sm btn-warn" data-switch-tab="tab-sandbox">
            ${renderSvgIcon('check', 15)} Revisar y Aprobar en 1 Clic
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
      listEl.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 1.5rem;">No hay movimientos registrados para este filtro.</p>`;
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
            typeBadge = ev.type === 'RECURRING_INCOME' ? 'Mesada Recurrente' : ev.type === 'INVESTMENT_MATURITY' ? 'Vencimiento Inversión' : 'Ingreso';
          } else if (ev.type === 'EXPENSE' || ev.type === 'LOAN_PAYMENT' || ev.type === 'EXTRA_PRINCIPAL_PAYMENT') {
            signClass = 'negative';
            prefix = '-';
            fallbackIcon = 'shopping-bag';
            typeBadge = ev.type === 'EXPENSE' ? 'Gasto' : ev.type === 'EXTRA_PRINCIPAL_PAYMENT' ? 'Abono a Capital' : 'Pago Crédito';
          } else if (ev.type === 'INVESTMENT_LOCK') {
            signClass = 'neutral';
            prefix = '';
            fallbackIcon = 'lock';
            typeBadge = 'Plazo Fijo';
          } else if (ev.type === 'REVERSAL') {
            signClass = 'neutral';
            prefix = '';
            fallbackIcon = 'undo';
            typeBadge = 'Contra-Asiento Auditoría';
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
                    ${ev.isReversed ? `<span class="badge badge-danger">${renderSvgIcon('ban', 12)} ANULADO POR REVERSO</span>` : ''}
                  </p>
                  <p class="tx-sub inline-icon-text" style="flex-wrap: wrap;">
                    ${renderSvgIcon('calendar', 13)} <span>${ev.localDate}</span> ·
                    <span class="badge badge-info">${cat?.name || typeBadge}</span> ·
                    <span>Firmado por ${parentAuthor ? parentAuthor.name : 'Papá/Mamá'}</span> ·
                    <span>Hash: <code>${(ev.eventHash || '').slice(0, 8)}…</code></span>
                  </p>
                </div>
              </div>
              <div class="tx-right">
                <div>
                  <div class="tx-amount ${signClass}">
                    ${prefix}${formatMoneyCents(ev.amountCents, currency)}
                  </div>
                  <div style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">
                    Saldo disp: ${formatMoneyCents(ev.runningAvailableCents, currency)}
                  </div>
                </div>
                ${
                  canReverse
                    ? `<button type="button" class="btn btn-ghost btn-sm parent-only" data-reverse-tx="${ev.id}" title="Crear contra-asiento contable (REVERSAL) para anular este movimiento">
                        ${renderSvgIcon('undo', 14)} Revertir
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
      incContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.84rem;">Sin ingresos registrados aún.</p>`;
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
      expContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.84rem;">Sin gastos descontados aún.</p>`;
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
      DAILY: 'Diario',
      WEEKLY: 'Semanal (Cada 7 días)',
      BIWEEKLY: 'Quincenal (Cada 14 días)',
      MONTHLY: 'Mensual'
    };

    if (rules.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted);">No hay ingresos recurrentes programados para ${child.name}.</p>`;
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
                ${rule.status === 'ACTIVE' ? `${renderSvgIcon('check', 13)} Programación Activa` : `${renderSvgIcon('pause', 13)} Pausado`}
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
              <span class="inline-icon-text">${renderSvgIcon('calendar', 14)} <strong>Próxima fecha:</strong> ${rule.nextExecutionDate}</span>
              <span class="inline-icon-text">${renderSvgIcon('arrow-down-left', 14)} <strong>Fuente:</strong> ${cat?.name || 'Mesada'}</span>
              <span class="inline-icon-text">
                ${
                  linkedLoan
                    ? `${renderSvgIcon('credit-card', 14)} <strong>Retención automática:</strong> Abona cuota a "${linkedLoan.concept}"`
                    : `${renderSvgIcon('unlock', 14)} <strong>Sin retención:</strong> 100% libre a la alcancía`
                }
              </span>
            </div>
            <div class="parent-only" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-income btn-sm" data-trigger-recurring="${rule.id}">
                ${renderSvgIcon('zap', 14)} Acreditar Periodo Ahora
              </button>
              <button type="button" class="btn btn-ghost btn-sm" data-toggle-recurring="${rule.id}">
                ${rule.status === 'ACTIVE' ? `${renderSvgIcon('pause', 14)} Pausar` : `${renderSvgIcon('play', 14)} Reactivar`}
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
      container.innerHTML = `<p style="color: var(--text-muted);">No hay créditos registrados para esta alcancía.</p>`;
      return;
    }

    container.innerHTML = loans
      .map((loan) => {
        const typeLabel = loan.interestType === 'COMPOUND_FRENCH' ? 'Interés Compuesto (Francés)' : 'Interés Simple';
        const statusBadge =
          loan.status === 'PAID_OFF'
            ? `<span class="badge badge-success">${renderSvgIcon('check', 13)} Liquidado</span>`
            : loan.hasOverdue
              ? `<span class="badge badge-danger">${renderSvgIcon('alert-triangle', 13)} Con Cuota en Mora</span>`
              : `<span class="badge badge-purple">${renderSvgIcon('credit-card', 13)} Crédito Activo</span>`;

        const rowsHtml = (loan.schedule || [])
          .map((inst) => {
            const stBadge =
              inst.status === 'PAID'
                ? `<span class="badge badge-success">${inst.isExtraPrincipalPayment ? `${renderSvgIcon('zap', 12)} Abono Capital` : `${renderSvgIcon('check', 12)} Pagada`}</span>`
                : inst.status === 'OVERDUE'
                  ? `<span class="badge badge-danger">${renderSvgIcon('alert-triangle', 12)} En Mora (Parcial)</span>`
                  : `<span class="badge badge-warn">${renderSvgIcon('clock', 12)} Pendiente</span>`;

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
                        <button type="button" class="btn btn-loan btn-sm" data-pay-installment="${loan.id}:${inst.installmentNumber}:PIGGY" title="Descontar ${formatMoneyCents(pendingInstCents, currency)} del saldo disponible de la alcancía">
                          ${renderSvgIcon('piggy', 14)} Cobrar de Alcancía
                        </button>
                        <button type="button" class="btn btn-ghost btn-sm" data-pay-installment="${loan.id}:${inst.installmentNumber}:EXTERNAL" title="Registrar pago con efectivo externo o tareas sin restar de la alcancía">
                          ${renderSvgIcon('dollar', 14)} Pago Externo
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
                  <span class="badge badge-info">${typeLabel} · ${loan.interestRatePercent}% por periodo</span>
                </div>
                <p style="margin: 0.3rem 0 0 0; font-size: 0.82rem; color: var(--text-secondary);">
                  Capital Prestado: <strong>${formatMoneyCents(loan.principalCents, currency)}</strong> ·
                  Intereses Totales: <strong style="color: var(--color-expense);">${formatMoneyCents(loan.totalInterestCents, currency)}</strong> ·
                  Saldo Insoluto por Pagar: <strong style="color: var(--color-loan);">${formatMoneyCents(loan.remainingDebtCents, currency)}</strong>
                  ${
                    loan.interestSavedByExtraPaymentsCents > 0
                      ? ` · <strong style="color: var(--color-income);">Intereses ahorrados por abonos a capital: ${formatMoneyCents(loan.interestSavedByExtraPaymentsCents, currency)}</strong>`
                      : ''
                  }
                </p>
              </div>
              <div class="parent-only" style="display: flex; gap: 0.5rem;">
                ${
                  loan.status === 'ACTIVE' && loan.remainingDebtCents > 0
                    ? `<button type="button" class="btn btn-primary btn-sm" data-open-extra-principal="${loan.id}">
                        ${renderSvgIcon('zap', 14)} Abono Extraordinario a Capital
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
                    <th>Cuota</th>
                    <th>Vencimiento</th>
                    <th>Abono Capital</th>
                    <th>Interés</th>
                    <th>Cuota Total</th>
                    <th>Pagado</th>
                    <th>Estado</th>
                    <th class="parent-only">Acción Parental</th>
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
      container.innerHTML = `<p style="color: var(--text-muted);">No hay inversiones a plazo fijo registradas para esta alcancía.</p>`;
      return;
    }

    container.innerHTML = investments
      .map((inv) => {
        const stBadge =
          inv.status === 'MATURED'
            ? `<span class="badge badge-success">${renderSvgIcon('check', 13)} Vencida y Acreditada</span>`
            : inv.status === 'CANCELLED_EARLY'
              ? `<span class="badge badge-warn">${renderSvgIcon('stop', 13)} Rescate Anticipado (Sin interés)</span>`
              : `<span class="badge badge-info">${renderSvgIcon('lock', 13)} En Plazo Activo (${inv.progressPercent}%)</span>`;

        return `
          <div class="panel-card" style="margin-bottom: 0; background: var(--bg-elevated);">
            <div class="panel-header" style="margin-bottom: 0.5rem;">
              ${stBadge}
              <span class="badge badge-success">+${inv.yieldRatePercent}% garantizado (${inv.termDays} días)</span>
            </div>
            <h3 class="inline-icon-text" style="margin: 0 0 0.4rem 0; font-size: 1.06rem;">
              ${renderSvgIcon('trending-up', 19)}
              <span>${inv.title}</span>
            </h3>

            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.6rem; flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Capital Invertido</div>
                <div style="font-family: var(--font-mono); font-size: 1.35rem; font-weight: 800;">${formatMoneyCents(inv.principalCents, currency)}</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Devengado Hoy</div>
                <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 700; color: var(--color-income);">+${formatMoneyCents(inv.accruedInterestTodayCents, currency)}</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Total al Vencer</div>
                <div style="font-family: var(--font-mono); font-size: 1.15rem; font-weight: 800; color: var(--color-invest);">${formatMoneyCents(inv.maturityTotalCents, currency)}</div>
              </div>
            </div>

            <div class="progress-track" style="margin-bottom: 0.55rem;">
              <div class="progress-fill" style="width: ${inv.progressPercent}%;"></div>
            </div>

            <p class="inline-icon-text" style="font-size: 0.8rem; color: var(--text-secondary); margin: 0 0 0.85rem 0; flex-wrap: wrap;">
              ${renderSvgIcon('calendar', 14)}
              <span>Inicio: <strong>${inv.startDate}</strong> · Vencimiento: <strong>${inv.maturityDate}</strong> (${inv.status === 'ACTIVE' ? `Faltan ${inv.remainingDays} días` : 'Plazo concluido'})</span>
            </p>

            ${
              inv.status === 'ACTIVE'
                ? `
                  <div class="parent-only" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button type="button" class="btn btn-income btn-sm" data-mature-investment="${inv.id}" title="Liquidar inversión pagando capital + rendimiento completo a la alcancía">
                      ${renderSvgIcon('check', 14)} Liquidar con Rendimiento (+${formatMoneyCents(inv.expectedInterestCents, currency)})
                    </button>
                    <button type="button" class="btn btn-ghost btn-sm" data-early-exit-investment="${inv.id}" title="Retirar antes de plazo devolviendo solo el capital sin intereses">
                      ${renderSvgIcon('stop', 14)} Rescate Anticipado (0% interés)
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
                    ${isParent ? `${renderSvgIcon('lock', 12)} Nivel PAPÁ/MAMÁ (Lectura y Escritura)` : `${renderSvgIcon('eye', 12)} Nivel HIJO/A (Solo Lectura · ${m.age || 10} años)`}
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
                    <span>Meta configurada: <strong>${m.goalTitle || 'Ahorro General'}</strong> (${formatMoneyCents(m.goalTargetCents || 100000, currency)})</span>
                  </p>`
                : `<p class="inline-icon-text" style="margin: 0.65rem 0 0 0; font-size: 0.8rem; color: var(--text-secondary);">
                    ${renderSvgIcon('shield-check', 15)}
                    <span>Autorizado para firmar asientos contables en el Libro Mayor con PIN Parental.</span>
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
              <p class="tx-sub">${c.description || 'Fuente de ingreso familiar'}</p>
            </div>
          </div>
          <span class="badge badge-success">Fuente de Ingreso</span>
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
              <p class="tx-sub">${c.description || 'Categoría de gasto'}</p>
            </div>
          </div>
          <span class="badge badge-danger">Categoría de Gasto</span>
        </div>
      `
      )
      .join('');
  }

  renderChildRequests() {
    const container = document.getElementById('childRequestsListContainer');
    const reqs = (this.state.childRequests || []).slice().reverse();

    if (reqs.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.86rem;">Aún no hay solicitudes enviadas desde el Simulador.</p>`;
      return;
    }

    container.innerHTML = reqs
      .map((r) => {
        const child = this.getChildren().find((c) => c.id === r.memberId) || { name: 'Hijo/a', avatar: 'piggy' };
        const stBadge =
          r.status === 'APPROVED'
            ? `<span class="badge badge-success">${renderSvgIcon('check', 13)} Aprobada y Firmada por Papá</span>`
            : r.status === 'REJECTED'
              ? `<span class="badge badge-danger">${renderSvgIcon('x', 13)} Rechazada</span>`
              : `<span class="badge badge-warn">${renderSvgIcon('clock', 13)} Pendiente de Revisión Parental</span>`;

        return `
          <div class="tx-item" style="margin-bottom: 0.55rem;">
            <div class="tx-left">
              <div class="tx-icon" style="color: var(--color-invest);">${renderSvgIcon(child.avatar || 'piggy', 20)}</div>
              <div>
                <p class="tx-title">${child.name} solicita: ${r.title}</p>
                <p class="tx-sub">${r.note || ''}</p>
              </div>
            </div>
            <div class="tx-right">
              ${stBadge}
              ${
                r.status === 'PENDING' && this.currentRole === 'PARENT'
                  ? `
                    <button type="button" class="btn btn-income btn-sm parent-only" data-approve-request="${r.id}">
                      ${renderSvgIcon('check', 14)} Aprobar y Ejecutar
                    </button>
                    <button type="button" class="btn btn-ghost btn-sm parent-only" data-reject-request="${r.id}">
                      ${renderSvgIcon('x', 14)} Rechazar
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
      badge.innerHTML = `${renderSvgIcon('shield-check', 13)} ${this.auditResult.validEvents.length} Asientos Verificados`;
    } else {
      badge.className = 'badge badge-danger';
      badge.innerHTML = `${renderSvgIcon('shield-alert', 13)} ${this.auditResult.corruptedEvents.length} Asiento Corrupto Rechazado`;
    }

    const lastEv = this.auditResult.validEvents[this.auditResult.validEvents.length - 1];

    box.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
        <div>
          <strong>Algoritmo de Derivación:</strong><br/>
          <code>PBKDF2-SHA256 (210,000 iter)</code>
        </div>
        <div>
          <strong>Firma del Libro Mayor:</strong><br/>
          <code>HMAC-SHA256 + Cadena SHA-256</code>
        </div>
        <div>
          <strong>Asientos Válidos / Rechazados:</strong><br/>
          <span style="color: var(--color-income); font-weight: 700;">${this.auditResult.validEvents.length} válidos</span> /
          <span style="color: var(--color-expense); font-weight: 700;">${this.auditResult.corruptedEvents.length} apócrifos</span>
        </div>
        <div>
          <strong>Último Hash Verificado:</strong><br/>
          <code>${lastEv ? lastEv.eventHash.slice(0, 20) + '…' : 'GENESIS'}</code>
        </div>
      </div>
      ${
        this.auditResult.corruptedEvents.length > 0
          ? `<div class="inline-icon-text" style="margin-top: 0.75rem; padding: 0.65rem; background: var(--color-expense-bg); border-radius: 8px; color: var(--color-expense);">
              ${renderSvgIcon('shield-alert', 18)}
              <span><strong>Detalle de bloqueo:</strong> El asiento <code>${this.auditResult.corruptedEvents[0].id}</code> por ${formatMoneyCents(this.auditResult.corruptedEvents[0].amountCents, currency)} fue ignorado en el cálculo de saldos: <em>${this.auditResult.corruptedEvents[0].corruptionReason}</em></span>
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

  openTransactionDialog(mode = 'INCOME') {
    if (!this.ensureParentPermission()) return;
    this.populateChildAndCatalogSelectors(mode);
    document.getElementById('txFormMode').value = mode;
    document.getElementById('dialogTxTitle').innerHTML =
      mode === 'INCOME'
        ? `${renderSvgIcon('plus', 19)} Registrar Ingreso en Alcancía`
        : `${renderSvgIcon('minus', 19)} Descontar Gasto de Alcancía`;
    document.getElementById('txCatalogLabel').textContent =
      mode === 'INCOME' ? 'Fuente de Ingreso' : 'Categoría de Gasto';
    document.getElementById('txOverdraftModeGroup').style.display = mode === 'EXPENSE' ? 'flex' : 'none';
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
      document.getElementById('dialogCatalogTitle').innerHTML = `${renderSvgIcon('arrow-down-left', 19)} Definir Nueva Fuente de Ingreso`;
      document.getElementById('dialogCatalog')?.showModal();
    });

    document.getElementById('btnAddExpenseCategory')?.addEventListener('click', () => {
      if (!this.ensureParentPermission()) return;
      document.getElementById('catTypeInput').value = 'EXPENSE_CATEGORY';
      document.getElementById('dialogCatalogTitle').innerHTML = `${renderSvgIcon('arrow-up-right', 19)} Definir Nueva Categoría de Gasto`;
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

  async copyChildReadOnlyShareLink() {
    const url = new URL(window.location.href);
    url.searchParams.set('family', this.state.family.familyCode);
    url.searchParams.set('role', 'child');

    // Si hay credenciales de Supabase configuradas, empaquetarlas en el enlace para que el dispositivo del hijo
    // se conecte automáticamente en tiempo real al abrir la URL de GitHub Pages
    const cfg = this.cloudManager.cloudConfig;
    if (cfg && cfg.endpointUrl && cfg.apiKey) {
      try {
        const encoded = btoa(
          JSON.stringify({
            p: cfg.provider || 'SUPABASE_REST',
            u: cfg.endpointUrl,
            k: cfg.apiKey,
            t: cfg.tableName || 'smartpiggy_families'
          })
        );
        url.searchParams.set('sb', encoded);
      } catch {
        // ignore
      }
    }

    try {
      await navigator.clipboard.writeText(url.toString());
      this.showToast('Enlace de Solo-Lectura con auto-conexión en tiempo real copiado al portapapeles.', 'info');
    } catch {
      this.showToast(`Enlace para Hijos: ${url.toString()}`, 'info');
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
