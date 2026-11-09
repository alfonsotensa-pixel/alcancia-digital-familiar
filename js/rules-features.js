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

import { renderSvgIcon } from './icons.js';
import { createSignedLedgerEvent } from './crypto-ledger.js';
import {
  getTodayLocalDate,
  addDaysLocalDate,
  toCents,
  formatMoneyCents,
  reduceMemberFinancialState,
  getAgeBand,
  deriveTaskBoard
} from './financial-engine.js';
import { TASK_TEMPLATES, FINE_LEVEL_LIMITS, buildDefaultInvestmentPlans, buildDefaultRulesConfig } from './seed-data.js';

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

export function installRulesFeatures(AppClass) {
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
