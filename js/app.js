'use strict';

/* ─── Formatting ─── */
function xaf(n) { return Number(n).toLocaleString('fr-FR') + ' XAF'; }
function shortDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

/* ─── UI update (reads from cached user) ─── */
async function updateUI() {
  const r = await API.getUser();
  if (!r.success) return;
  const user = r.user;

  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('ui-balance',   Number(user.balance).toLocaleString('fr-FR'));
  set('ui-recharged', Number(user.totalRecharged).toLocaleString('fr-FR'));
  set('home-balance',   xaf(user.balance));
  set('home-recharged', xaf(user.totalRecharged));
  set('ui-retrait-balance',  xaf(user.balance));
  set('ui-transfer-balance', xaf(user.balance));
  set('buy-modal-balance',   xaf(user.balance));
  set('profile-name-display',  user.name  || '');
  set('profile-email-display', user.email || '');
  set('my-invite-code',        user.inviteCode || '—');

  const invInput = document.getElementById('invite-link-input');
  if (invInput) invInput.value = user.inviteCode || '';

  const adminLink = document.getElementById('menu-admin-link');
  if (adminLink) adminLink.style.display = user.isAdmin ? 'flex' : 'none';

  renderPortfolio();
  renderTeamStats();
}

function updateBalanceInUI(newBalance) {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('ui-balance',          Number(newBalance).toLocaleString('fr-FR'));
  set('home-balance',        xaf(newBalance));
  set('ui-retrait-balance',  xaf(newBalance));
  set('ui-transfer-balance', xaf(newBalance));
  set('buy-modal-balance',   xaf(newBalance));
}

/* ─── Navigation ─── */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const page = document.getElementById('page-' + name);
  const nav  = document.getElementById('nav-' + name);
  if (page) { page.classList.add('active'); page.scrollTop = 0; }
  if (nav)  nav.classList.add('active');
}

function switchProjectTab(name) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const btn   = document.getElementById('tab-' + name);
  const panel = document.getElementById('panel-' + name);
  if (btn)   btn.classList.add('active');
  if (panel) panel.classList.add('active');
}

/* ─── Modals ─── */
function openModal(type) {
  const modal = document.getElementById('modal-' + type);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (type === 'transactions') renderTransactions('all');
}

function closeModal(type) {
  const modal = document.getElementById('modal-' + type);
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
  clearErrors();
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(e => { e.textContent = ''; });
  document.querySelectorAll('.field-input').forEach(f => f.classList.remove('is-error'));
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-bg.open').forEach(m => m.classList.remove('open'));
    document.body.style.overflow = '';
  }
});

(function () {
  let startY = 0;
  document.addEventListener('touchstart', e => {
    if (e.target.closest('.modal-sheet')) startY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    const sheet = e.target.closest('.modal-sheet');
    if (!sheet) return;
    if (e.changedTouches[0].clientY - startY > 90) {
      const bg = sheet.closest('.modal-bg');
      if (bg) { bg.classList.remove('open'); document.body.style.overflow = ''; }
    }
  }, { passive: true });
})();

/* ─── Form helpers ─── */
function fieldError(fieldId, errId, msg) {
  const f = document.getElementById(fieldId);
  const e = document.getElementById(errId);
  if (f) f.classList.add('is-error');
  if (e) e.textContent = msg;
}
function clearField(fieldId, errId) {
  const f = document.getElementById(fieldId);
  const e = document.getElementById(errId);
  if (f) f.classList.remove('is-error');
  if (e) e.textContent = '';
}
function setPreset(type, amount) {
  const el = document.getElementById('f-' + type + '-amount');
  if (el) { el.value = amount; clearField('f-' + type + '-amount', 'err-' + type + '-amount'); }
}

function setLoadingBtn(id, loading) {
  const btn = document.getElementById(id);
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    btn.dataset.orig = btn.innerHTML;
    btn.innerHTML = '<i class="fa fa-circle-notch fa-spin"></i> Traitement en cours…';
    btn.classList.add('loading');
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.orig || btn.innerHTML;
    btn.classList.remove('loading');
  }
}

function showSuccess(title, sub) {
  const overlay = document.getElementById('success-overlay');
  const msg     = document.getElementById('success-msg');
  const subEl   = document.getElementById('success-sub');
  if (!overlay) return;
  if (msg)   msg.textContent   = title;
  if (subEl) subEl.textContent = sub || '';
  overlay.style.display = 'flex';
  setTimeout(() => { overlay.style.display = 'none'; }, 2500);
}

function showToast(msg, ms) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), ms || 2800);
}

/* ═══════════════════════════════════════
   RECHARGE — Mobile Money flow
═══════════════════════════════════════ */
let _pollInterval = null;

function updatePaymentInstructions() {
  const method = document.getElementById('f-recharge-method')?.value || 'mtn';
  const txt    = document.getElementById('payment-instructions-text');
  if (!txt) return;
  const map = {
    mtn:    'Une notification USSD sera envoyée sur votre téléphone MTN. Composez votre code PIN pour approuver.',
    orange: 'Une notification sera envoyée sur votre téléphone Orange. Approuvez avec votre code PIN Orange Money.',
    bank:   'Virement manuel — notre équipe créditera votre compte sous 1-2 jours ouvrables.'
  };
  txt.textContent = map[method] || map.mtn;
}

function resetRechargeStep() {
  clearInterval(_pollInterval);
  document.getElementById('recharge-step-1').style.display = '';
  document.getElementById('recharge-step-2').style.display = 'none';
  document.getElementById('recharge-modal-title').textContent = 'Recharger mon compte';
}

async function handleRecharge() {
  clearErrors();
  const amountEl = document.getElementById('f-recharge-amount');
  const phoneEl  = document.getElementById('f-recharge-phone');
  const method   = document.getElementById('f-recharge-method')?.value || 'mtn';
  const amount   = parseFloat(amountEl?.value);
  const phone    = phoneEl?.value.trim();

  let valid = true;
  if (!amount || amount < 500) { fieldError('f-recharge-amount', 'err-recharge-amount', 'Montant minimum: 500 XAF'); valid = false; }
  if (!phone || phone.length < 8) { fieldError('f-recharge-phone', 'err-recharge-phone', 'Numéro invalide (8-9 chiffres)'); valid = false; }
  if (!valid) return;

  setLoadingBtn('btn-recharge', true);

  const result = await API.initRecharge(amount, method, phone);
  setLoadingBtn('btn-recharge', false);

  if (result.error) { showToast(result.error); return; }

  /* ── Afficher l'étape 2 ── */
  const providerNames = { mtn: 'MTN Mobile Money', orange: 'Orange Money', bank: 'Virement bancaire' };
  const providerIcons = { mtn: '📱', orange: '🟠', bank: '🏦' };
  const waitDescs = {
    mtn:    'Approuvez la demande MTN MoMo sur votre téléphone en composant votre code PIN.',
    orange: 'Approuvez la demande Orange Money sur votre téléphone.',
    bank:   'Effectuez le virement et notre équipe créditera votre compte sous 24h.'
  };

  document.getElementById('recharge-step-1').style.display = 'none';
  document.getElementById('recharge-step-2').style.display = '';
  document.getElementById('recharge-modal-title').textContent = providerNames[method] || 'Paiement';

  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('mm-provider-icon', providerIcons[method] || '📱');
  set('mm-waiting-title', 'Demande envoyée !');
  set('mm-waiting-desc',  waitDescs[method] || waitDescs.mtn);
  set('mm-display-amount', xaf(amount));
  set('mm-display-phone',  '+237 ' + phone);

  if (result.ussd_code) {
    const ussd = document.getElementById('mm-ussd-hint');
    if (ussd) { ussd.textContent = 'Code USSD : ' + result.ussd_code; ussd.style.display = 'block'; }
  }

  /* ── Countdown 30s ── */
  let remaining = 30;
  const fillEl = document.getElementById('mm-countdown-fill');
  const secEl  = document.getElementById('mm-countdown');
  if (fillEl) fillEl.style.width = '100%';

  /* ── Polling statut Campay toutes les 3s ── */
  const reference = result.reference;
  let attempts    = 0;

  clearInterval(_pollInterval);
  _pollInterval = setInterval(async () => {
    remaining = Math.max(0, remaining - 1);
    if (secEl)  secEl.textContent = remaining;
    if (fillEl) fillEl.style.width = (remaining / 30 * 100) + '%';

    attempts++;
    if (attempts % 3 === 0 || remaining === 0) {
      const status = await API.checkPaymentStatus(reference);
      if (status.status === 'SUCCESSFUL') {
        clearInterval(_pollInterval);
        updateBalanceInUI(status.balance);
        closeModal('recharge');
        resetRechargeStep();
        if (amountEl) amountEl.value = '';
        if (phoneEl)  phoneEl.value  = '';
        showSuccess('Paiement confirmé ! 🎉', xaf(amount) + ' ajouté à votre solde');
      } else if (status.status === 'FAILED' || remaining === 0) {
        clearInterval(_pollInterval);
        resetRechargeStep();
        showToast(status.status === 'FAILED' ? 'Paiement refusé ou annulé.' : 'Délai dépassé. Réessayez.');
      }
    }
  }, 1000);
}

/* ═══════════════════════════════════════
   RETRAIT
═══════════════════════════════════════ */
async function handleRetrait() {
  clearErrors();
  const amountEl = document.getElementById('f-retrait-amount');
  const phoneEl  = document.getElementById('f-retrait-phone');
  const method   = document.getElementById('f-retrait-method')?.value || 'mtn';
  const amount   = parseFloat(amountEl?.value);
  const phone    = phoneEl?.value.trim();

  let valid = true;
  if (!amount || amount < 500)    { fieldError('f-retrait-amount', 'err-retrait-amount', 'Montant minimum: 500 XAF'); valid = false; }
  if (!phone || phone.length < 8) { fieldError('f-retrait-phone',  'err-retrait-phone',  'Numéro invalide (8-9 chiffres)'); valid = false; }
  if (!valid) return;

  setLoadingBtn('btn-retrait', true);
  const result = await API.retrait(amount, method, phone);
  setLoadingBtn('btn-retrait', false);

  if (result.error) { fieldError('f-retrait-amount', 'err-retrait-amount', result.error); return; }

  updateBalanceInUI(result.balance);
  closeModal('retrait');
  if (amountEl) amountEl.value = '';
  if (phoneEl)  phoneEl.value  = '';
  showSuccess('Retrait en cours !', xaf(amount) + ' en route vers +237 ' + phone);
}

/* ═══════════════════════════════════════
   BUY PLAN
═══════════════════════════════════════ */
let _buyData = { po: '', price: 0, profit: 0 };

function openBuyModal(po, price, profit) {
  const user = API.getCachedUser();
  _buyData = { po, price, profit };
  document.getElementById('buy-modal-title').textContent  = po + ' — ' + po.replace('PO No.', 'Plan ');
  document.getElementById('buy-modal-price').textContent  = xaf(price);
  document.getElementById('buy-modal-profit').textContent = xaf(profit) + ' / jour';
  document.getElementById('buy-modal-balance').textContent = xaf(user ? user.balance : 0);
  document.getElementById('f-buy-qty').value = 1;
  document.getElementById('err-buy').textContent = '';
  updateBuyTotal();
  openModal('buy');
}

function changeQty(delta) {
  const el = document.getElementById('f-buy-qty');
  if (!el) return;
  el.value = Math.max(1, (parseInt(el.value) || 1) + delta);
  updateBuyTotal();
}
function updateBuyTotal() {
  const qty   = parseInt(document.getElementById('f-buy-qty')?.value) || 1;
  const total = qty * _buyData.price;
  const el    = document.getElementById('buy-total-display');
  if (el) el.textContent = xaf(total);
}

async function handleBuy() {
  const errEl = document.getElementById('err-buy');
  if (errEl) errEl.textContent = '';

  const qty = parseInt(document.getElementById('f-buy-qty')?.value) || 1;

  setLoadingBtn('btn-buy', true);
  const result = await API.buyPlan(_buyData.po, _buyData.price, _buyData.profit, qty);
  setLoadingBtn('btn-buy', false);

  if (result.error) { if (errEl) errEl.textContent = result.error; return; }

  updateBalanceInUI(result.balance);
  closeModal('buy');
  showPage('project');
  switchProjectTab('achat');
  renderPortfolio();
  showSuccess('Achat confirmé !', _buyData.po + ' — ' + xaf(_buyData.profit * qty) + ' / jour');
}

/* ═══════════════════════════════════════
   TRANSFER
═══════════════════════════════════════ */
async function handleTransfer() {
  clearErrors();
  const emailEl  = document.getElementById('f-transfer-email');
  const amountEl = document.getElementById('f-transfer-amount');
  const toEmail  = emailEl?.value.trim();
  const amount   = parseFloat(amountEl?.value);

  let valid = true;
  if (!toEmail || !toEmail.includes('@')) { fieldError('f-transfer-email',  'err-transfer-email',  'Adresse email invalide'); valid = false; }
  if (!amount || amount < 500)            { fieldError('f-transfer-amount', 'err-transfer-amount', 'Montant minimum: 500 XAF'); valid = false; }
  if (!valid) return;

  setLoadingBtn('btn-transfer', true);
  const result = await API.transfer(toEmail, amount);
  setLoadingBtn('btn-transfer', false);

  if (result.error) { fieldError('f-transfer-email', 'err-transfer-email', result.error); return; }

  updateBalanceInUI(result.balance);
  closeModal('transfer');
  if (emailEl)  emailEl.value  = '';
  if (amountEl) amountEl.value = '';
  showSuccess('Transfert envoyé !', xaf(amount) + ' → ' + toEmail);
}

/* ═══════════════════════════════════════
   PASSWORD
═══════════════════════════════════════ */
async function handlePassword() {
  const cur   = document.getElementById('f-pwd-current')?.value;
  const next  = document.getElementById('f-pwd-new')?.value;
  const conf  = document.getElementById('f-pwd-confirm')?.value;
  const errEl = document.getElementById('err-pwd');

  if (!cur || cur.length < 4)   { if (errEl) errEl.textContent = 'Mot de passe actuel requis'; return; }
  if (!next || next.length < 6) { if (errEl) errEl.textContent = 'Minimum 6 caractères'; return; }
  if (next !== conf)             { if (errEl) errEl.textContent = 'Les mots de passe ne correspondent pas'; return; }

  setLoadingBtn('btn-pwd', true);
  const result = await API.updatePassword(cur, next);
  setLoadingBtn('btn-pwd', false);

  if (result.error) { if (errEl) errEl.textContent = result.error; return; }
  closeModal('password');
  showSuccess('Mot de passe modifié !', 'Votre sécurité est renforcée');
}

/* ═══════════════════════════════════════
   TRANSACTIONS
═══════════════════════════════════════ */
let _currentFilter = 'all';
let _allTx         = [];

function filterTx(filter, btn) {
  _currentFilter = filter;
  document.querySelectorAll('.tx-filter').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderTxList(filter);
}

function renderTxList(filter) {
  const container = document.getElementById('transactions-list');
  if (!container) return;
  const list = filter === 'all' ? _allTx : _allTx.filter(t => t.type === filter);
  if (list.length === 0) {
    container.innerHTML = '<div class="tx-empty"><i class="fa fa-inbox"></i><p>Aucune transaction</p></div>';
    return;
  }
  const icons  = { recharge: 'fa-plus-circle', retrait: 'fa-circle-down', achat: 'fa-gem' };
  const colors = { recharge: 'tx-green', retrait: 'tx-red', achat: 'tx-gold' };
  const labels = { recharge: 'Recharge', retrait: 'Retrait', achat: 'Achat' };
  const signs  = { recharge: '+', retrait: '−', achat: '−' };
  container.innerHTML = list.map(tx => `
    <div class="tx-item">
      <div class="tx-icon-wrap ${colors[tx.type] || ''}">
        <i class="fa ${icons[tx.type] || 'fa-circle'}"></i>
      </div>
      <div class="tx-info">
        <span class="tx-label">${tx.label || labels[tx.type] || tx.type}</span>
        <span class="tx-date">${shortDate(tx.date)}</span>
      </div>
      <div class="tx-right">
        <span class="tx-amount ${colors[tx.type] || ''}">${signs[tx.type]}${xaf(tx.amount)}</span>
        <span class="tx-status ${tx.status}">${tx.status === 'success' ? 'Succès' : tx.status === 'pending' ? 'En cours' : 'Échec'}</span>
      </div>
    </div>
  `).join('');
}

async function renderTransactions(filter) {
  const r = await API.getTransactions();
  _allTx  = r.transactions || [];
  renderTxList(filter || _currentFilter);
}

/* ═══════════════════════════════════════
   PORTFOLIO
═══════════════════════════════════════ */
const thumbs = ['mine-thumb-1', 'mine-thumb-2', 'mine-thumb-3', 'mine-thumb-4'];
const poIdx  = { 'PO No.1': 0, 'PO No.2': 1, 'PO No.3': 2, 'PO No.4': 3 };

async function renderPortfolio() {
  const list  = document.getElementById('portfolio-list');
  const empty = document.getElementById('portfolio-empty');
  if (!list) return;

  const r = await API.getPortfolio();
  const portfolio = r.portfolio || [];

  if (portfolio.length === 0) {
    list.innerHTML = '';
    if (empty) empty.style.display = 'flex';
    return;
  }
  if (empty) empty.style.display = 'none';

  list.innerHTML = portfolio.map(item => {
    const thumb = thumbs[poIdx[item.po] ?? 0];
    const pct   = Math.round(((365 - item.daysLeft) / 365) * 100);
    return `
      <div class="portfolio-card">
        <div class="port-thumb ${thumb}">
          <span class="po-hero-badge">${item.po}${item.qty > 1 ? ' ×' + item.qty : ''}</span>
        </div>
        <div class="port-body">
          <div class="port-row"><span>Bénéfice / jour</span><strong class="gold-text">${xaf(item.dailyProfit)}</strong></div>
          <div class="port-row"><span>Investi</span><strong>${xaf(item.totalPaid)}</strong></div>
          <div class="port-row"><span>Jours restants</span><strong>${item.daysLeft} / 365</strong></div>
          <div class="progress-bar-wrap"><div class="progress-bar" style="width:${pct}%"></div></div>
          <div class="port-date">Acheté le ${shortDate(item.purchaseDate)}</div>
        </div>
      </div>
    `;
  }).join('');
}

/* ═══════════════════════════════════════
   TEAM STATS
═══════════════════════════════════════ */
async function renderTeamStats() {
  const r = await API.getTeam();
  if (!r.success) return;
  const s   = r.team;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('team-size',      s.size);
  set('team-recharge',  xaf(s.totalRecharge));
  set('team-new',       s.newThisMonth);
  set('team-first-rec', s.firstRecharge);
}

/* ═══════════════════════════════════════
   INVITE / COPY CODE
═══════════════════════════════════════ */
function copyMyCode() {
  const user = API.getCachedUser();
  const code = user?.inviteCode || '';
  if (!code) return;
  navigator.clipboard?.writeText(code)
    .then(() => showToast('✓ Code copié : ' + code))
    .catch(() => showToast(code));
}

function copyInviteLink() {
  const input = document.getElementById('invite-link-input');
  if (!input) return;
  const val = input.value || '';
  navigator.clipboard?.writeText(val)
    .then(() => showToast('✓ Code copié !'))
    .catch(() => {
      input.select(); input.setSelectionRange(0, 99999);
      try { document.execCommand('copy'); showToast('✓ Copié !'); } catch (_) {}
    });
}

/* ═══════════════════════════════════════
   LOGOUT
═══════════════════════════════════════ */
function logout() {
  API.logout();
}

/* ═══════════════════════════════════════
   LANG TOGGLE (demo)
═══════════════════════════════════════ */
const LANGS = [{ flag: '🇫🇷', label: 'Français' }, { flag: '🇬🇧', label: 'English' }];
let _langIdx = 0;
function toggleLang() {
  _langIdx = (_langIdx + 1) % LANGS.length;
  const fl = document.getElementById('flag-icon');
  const lb = document.getElementById('lang-label');
  if (fl) fl.textContent = LANGS[_langIdx].flag;
  if (lb) lb.textContent = LANGS[_langIdx].label;
}

/* ═══════════════════════════════════════
   INIT
═══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  if (!API.isLoggedIn()) { window.location.href = 'auth.html'; return; }

  const r = await API.getUser();
  if (!r.success) { API.logout(); return; }

  await updateUI();
  showPage('home');
});
