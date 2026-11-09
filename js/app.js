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
  findDueDeterministicAutomations,
  resolveSignedInvestment,
  getAgeBand
} from './financial-engine.js';

import { CloudSyncManager, mergeFamilyCRDT, stripLegacyDemoData } from './cloud-sync.js';
import { buildInitialSignedFamilyState, ensureFeatureDefaults } from './seed-data.js';
import { installRulesFeatures } from './rules-features.js';

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
    // 1. Registrar Service Worker para habilitar instalación PWA y actualizar caché inmediatamente
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker
        .register('./sw.js?v=8')
        .then((reg) => {
          reg.update().catch(() => {});
        })
        .catch(() => {});
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
    const plans = this.getInvestmentPlans();
    for (const selId of ['simInvPlan', 'invPlanSelect']) {
      const sel = document.getElementById(selId);
      if (sel) {
        const currentVal = sel.value || 'SHORT';
        sel.innerHTML = plans
          .map((p) => {
            const bps = this.getPlanYieldBps(p);
            return `<option value="${p.id}" ${p.id === currentVal ? 'selected' : ''}>${p.label} (+${(bps / 100).toFixed(2)}%)</option>`;
          })
          .join('');
        sel.value = currentVal;
      }
    }

    const invAmount = Number(document.getElementById('simInvAmount')?.value || 300);
    const planId = document.getElementById('simInvPlan')?.value || 'SHORT';
    const planObj = this.getPlan(planId) || { id: 'SHORT', label: 'Corto plazo (1 mes)', termDays: 30, yieldBps: 200, yieldBpsByBand: { '9_12': 200, '13_17': 200 }, minPrincipalCents: 5000 };
    const invDays = Number(planObj.termDays || 30);
    const invBps = this.getPlanYieldBps(planObj) || 200;
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
    const principal = toCents(document.getElementById('invPrincipalInput')?.value || 250);
    const planId = document.getElementById('invPlanSelect')?.value || 'SHORT';
    const planObj = this.getPlan(planId) || { id: 'SHORT', label: 'Corto plazo (1 mes)', termDays: 30, yieldBps: 200, yieldBpsByBand: { '9_12': 200, '13_17': 200 }, minPrincipalCents: 5000 };
    const days = Number(planObj.termDays || 30);
    const bps = this.getPlanYieldBps(planObj) || 200;
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
      this.switchTab('tab-cloud-security', { scroll: true });
    });

    document.querySelectorAll('.nav-tab').forEach((tabBtn) => {
      tabBtn.addEventListener('click', () => {
        const target = tabBtn.getAttribute('data-tab');
        this.switchTab(target, { scroll: false });
      });
    });

    document.getElementById('btnGoSandbox')?.addEventListener('click', () => {
      this.switchTab('tab-sandbox', { scroll: true });
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
        const targetTab = switchTabBtn.getAttribute('data-switch-tab');
        this.switchTab(targetTab, { scroll: true });
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

  switchTab(tabId, { scroll = false } = {}) {
    document.querySelectorAll('.nav-tab').forEach((btn) => {
      const active = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('.tab-panel').forEach((panel) => {
      panel.classList.toggle('active', panel.id === tabId);
    });
    if (this.auditResult && this.state) {
      this.renderAll();
    }
    if (scroll) {
      const targetPanel = document.getElementById(tabId);
      const navTabs = document.querySelector('.nav-tabs');
      (navTabs || targetPanel)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
