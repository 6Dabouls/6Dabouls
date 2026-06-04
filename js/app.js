'use strict';

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
function currentUserEmail() {
  const sess = DB.getSession();
  return sess ? sess.email : null;
}

function xaf(n) {
  return Number(n).toLocaleString('fr-FR') + ' XAF';
}

function shortDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

/* ═══════════════════════════════════════════
   UI UPDATES
═══════════════════════════════════════════ */
function updateUI() {
  const user = DB.getSession();
  if (!user) return;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

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

  renderPortfolio();
  renderTeamStats();
}

/* ═══════════════════════════════════════════
   PAGE NAVIGATION
═══════════════════════════════════════════ */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const page = document.getElementById('page-' + name);
  const nav  = document.getElementById('nav-' + name);
  if (page) { page.classList.add('active'); page.scrollTop = 0; }
  if (nav)  nav.classList.add('active');
}

/* ═══════════════════════════════════════════
   PROJECT TAB SWITCHER
═══════════════════════════════════════════ */
function switchProjectTab(name) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const btn   = document.getElementById('tab-' + name);
  const panel = document.getElementById('panel-' + name);
  if (btn)   btn.classList.add('active');
  if (panel) panel.classList.add('active');
}

/* ═══════════════════════════════════════════
   MODALS
═══════════════════════════════════════════ */
function openModal(type) {
  const modal = document.getElementById('modal-' + type);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (type === 'retrait')      updateRetaitBalance();
  if (type === 'transfer')     updateTransferBalance();
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

function updateRetaitBalance() {
  const user = DB.getSession();
  const el   = document.getElementById('ui-retrait-balance');
  if (el && user) el.textContent = xaf(user.balance);
}

function updateTransferBalance() {
  const user = DB.getSession();
  const el   = document.getElementById('ui-transfer-balance');
  if (el && user) el.textContent = xaf(user.balance);
}

/* ── Close on Escape ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-bg.open').forEach(m => m.classList.remove('open'));
    document.body.style.overflow = '';
  }
});

/* ── Swipe down to close ── */
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

/* ═══════════════════════════════════════════
   FORM HELPERS
═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   SUCCESS OVERLAY
═══════════════════════════════════════════ */
function showSuccess(title, sub) {
  const overlay = document.getElementById('success-overlay');
  const msg     = document.getElementById('success-msg');
  const subEl   = document.getElementById('success-sub');
  if (!overlay) return;
  if (msg)   msg.textContent   = title;
  if (subEl) subEl.textContent = sub || '';
  overlay.style.display = 'flex';
  setTimeout(() => { overlay.style.display = 'none'; }, 2200);
}

/* ═══════════════════════════════════════════
   TOAST
═══════════════════════════════════════════ */
function showToast(msg, ms) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), ms || 2800);
}

/* ═══════════════════════════════════════════
   RECHARGE
═══════════════════════════════════════════ */
function handleRecharge() {
  clearErrors();
  const email = currentUserEmail();
  if (!email) return;

  const amountEl = document.getElementById('f-recharge-amount');
  const phoneEl  = document.getElementById('f-recharge-phone');
  const method   = document.getElementById('f-recharge-method')?.value || 'mtn';

  const amount = parseFloat(amountEl?.value);
  const phone  = phoneEl?.value.trim();

  let valid = true;
  if (!amount || amount < 1000) {
    fieldError('f-recharge-amount', 'err-recharge-amount', 'Montant minimum: 1 000 XAF');
    valid = false;
  }
  if (!phone || phone.length < 8) {
    fieldError('f-recharge-phone', 'err-recharge-phone', 'Numéro invalide (8-9 chiffres)');
    valid = false;
  }
  if (!valid) return;

  setLoadingBtn('btn-recharge', true);
  setTimeout(() => {
    const result = DB.recharge(email, amount, method, phone);
    setLoadingBtn('btn-recharge', false);
    if (result.error) { showToast(result.error); return; }
    updateUI();
    closeModal('recharge');
    if (amountEl) amountEl.value = '';
    if (phoneEl)  phoneEl.value  = '';
    showSuccess('Recharge réussie !', xaf(amount) + ' ajouté à votre solde');
  }, 2200);
}

/* ═══════════════════════════════════════════
   RETRAIT
═══════════════════════════════════════════ */
function handleRetrait() {
  clearErrors();
  const email = currentUserEmail();
  if (!email) return;

  const amountEl = document.getElementById('f-retrait-amount');
  const phoneEl  = document.getElementById('f-retrait-phone');
  const method   = document.getElementById('f-retrait-method')?.value || 'mtn';

  const amount = parseFloat(amountEl?.value);
  const phone  = phoneEl?.value.trim();

  let valid = true;
  if (!amount || amount < 1000) {
    fieldError('f-retrait-amount', 'err-retrait-amount', 'Montant minimum: 1 000 XAF');
    valid = false;
  }
  if (!phone || phone.length < 8) {
    fieldError('f-retrait-phone', 'err-retrait-phone', 'Numéro invalide (8-9 chiffres)');
    valid = false;
  }
  if (!valid) return;

  setLoadingBtn('btn-retrait', true);
  setTimeout(() => {
    const result = DB.retrait(email, amount, method, phone);
    setLoadingBtn('btn-retrait', false);
    if (result.error) {
      fieldError('f-retrait-amount', 'err-retrait-amount', result.error);
      return;
    }
    updateUI();
    closeModal('retrait');
    if (amountEl) amountEl.value = '';
    if (phoneEl)  phoneEl.value  = '';
    showSuccess('Retrait en cours !', xaf(amount) + ' en route vers +237 ' + phone);
  }, 2500);
}

/* ═══════════════════════════════════════════
   BUY PLAN
═══════════════════════════════════════════ */
let _buyData = { po: '', price: 0, profit: 0 };

function openBuyModal(po, price, profit) {
  const user = DB.getSession();
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

function handleBuy() {
  const errEl = document.getElementById('err-buy');
  if (errEl) errEl.textContent = '';

  const email = currentUserEmail();
  if (!email) return;

  const qty = parseInt(document.getElementById('f-buy-qty')?.value) || 1;

  setLoadingBtn('btn-buy', true);
  setTimeout(() => {
    const result = DB.buyPlan(email, _buyData.po, _buyData.price, _buyData.profit, qty);
    setLoadingBtn('btn-buy', false);
    if (result.error) {
      if (errEl) errEl.textContent = result.error;
      return;
    }
    updateUI();
    closeModal('buy');
    showPage('project');
    switchProjectTab('achat');
    showSuccess('Achat confirmé !', _buyData.po + ' — ' + xaf(_buyData.profit * qty) + ' / jour');
  }, 2000);
}

/* ═══════════════════════════════════════════
   TRANSFER
═══════════════════════════════════════════ */
function handleTransfer() {
  clearErrors();
  const fromEmail = currentUserEmail();
  if (!fromEmail) return;

  const emailEl  = document.getElementById('f-transfer-email');
  const amountEl = document.getElementById('f-transfer-amount');

  const toEmail = emailEl?.value.trim();
  const amount  = parseFloat(amountEl?.value);

  let valid = true;
  if (!toEmail || !toEmail.includes('@')) {
    fieldError('f-transfer-email', 'err-transfer-email', 'Adresse email invalide');
    valid = false;
  }
  if (!amount || amount < 1000) {
    fieldError('f-transfer-amount', 'err-transfer-amount', 'Montant minimum: 1 000 XAF');
    valid = false;
  }
  if (!valid) return;

  setLoadingBtn('btn-transfer', true);
  setTimeout(() => {
    const result = DB.transfer(fromEmail, toEmail, amount);
    setLoadingBtn('btn-transfer', false);
    if (result.error) {
      fieldError('f-transfer-email', 'err-transfer-email', result.error);
      return;
    }
    updateUI();
    closeModal('transfer');
    if (emailEl)  emailEl.value  = '';
    if (amountEl) amountEl.value = '';
    showSuccess('Transfert envoyé !', xaf(amount) + ' → ' + toEmail);
  }, 2000);
}

/* ═══════════════════════════════════════════
   PASSWORD
═══════════════════════════════════════════ */
function handlePassword() {
  const email = currentUserEmail();
  if (!email) return;

  const cur   = document.getElementById('f-pwd-current')?.value;
  const next  = document.getElementById('f-pwd-new')?.value;
  const conf  = document.getElementById('f-pwd-confirm')?.value;
  const errEl = document.getElementById('err-pwd');

  if (!cur || cur.length < 4)   { if (errEl) errEl.textContent = 'Mot de passe actuel requis'; return; }
  if (!next || next.length < 6) { if (errEl) errEl.textContent = 'Minimum 6 caractères'; return; }
  if (next !== conf)             { if (errEl) errEl.textContent = 'Les mots de passe ne correspondent pas'; return; }

  setLoadingBtn('btn-pwd', true);
  setTimeout(() => {
    const result = DB.updatePassword(email, cur, next);
    setLoadingBtn('btn-pwd', false);
    if (result.error) { if (errEl) errEl.textContent = result.error; return; }
    closeModal('password');
    showSuccess('Mot de passe modifié !', 'Votre sécurité est renforcée');
  }, 1500);
}

/* ═══════════════════════════════════════════
   TRANSACTIONS RENDERING
═══════════════════════════════════════════ */
let _currentFilter = 'all';

function filterTx(filter, btn) {
  _currentFilter = filter;
  document.querySelectorAll('.tx-filter').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderTransactions(filter);
}

function renderTransactions(filter) {
  const email     = currentUserEmail();
  const container = document.getElementById('transactions-list');
  if (!container) return;

  const all  = email ? DB.getTransactions(email) : [];
  const list = filter === 'all' ? all : all.filter(t => t.type === filter);

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
        <span class="tx-status ${tx.status}">${tx.status === 'success' ? 'Succès' : 'Echec'}</span>
      </div>
    </div>
  `).join('');
}

/* ═══════════════════════════════════════════
   PORTFOLIO RENDERING
═══════════════════════════════════════════ */
const thumbs = ['mine-thumb-1', 'mine-thumb-2', 'mine-thumb-3', 'mine-thumb-4'];
const poIdx  = { 'PO No.1': 0, 'PO No.2': 1, 'PO No.3': 2, 'PO No.4': 3 };

function renderPortfolio() {
  const email = currentUserEmail();
  const list  = document.getElementById('portfolio-list');
  const empty = document.getElementById('portfolio-empty');
  if (!list) return;

  const portfolio = email ? DB.getPortfolio(email) : [];

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
          <div class="port-row">
            <span>Bénéfice / jour</span>
            <strong class="gold-text">${xaf(item.dailyProfit)}</strong>
          </div>
          <div class="port-row">
            <span>Investi</span>
            <strong>${xaf(item.totalPaid)}</strong>
          </div>
          <div class="port-row">
            <span>Jours restants</span>
            <strong>${item.daysLeft} / 365</strong>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar" style="width:${pct}%"></div>
          </div>
          <div class="port-date">Acheté le ${shortDate(item.purchaseDate)}</div>
        </div>
      </div>
    `;
  }).join('');
}

/* ═══════════════════════════════════════════
   TEAM STATS RENDERING
═══════════════════════════════════════════ */
function renderTeamStats() {
  const email = currentUserEmail();
  if (!email) return;
  const stats = DB.getTeamStats(email);
  const set   = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('team-size',      stats.size);
  set('team-recharge',  xaf(stats.totalRecharge));
  set('team-new',       stats.newThisMonth);
  set('team-first-rec', stats.firstRecharge);
}

/* ═══════════════════════════════════════════
   INVITE / COPY CODE
═══════════════════════════════════════════ */
function copyMyCode() {
  const user = DB.getSession();
  const code = user?.inviteCode || '';
  if (!code) return;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(code)
      .then(() => showToast('✓ Code copié : ' + code))
      .catch(() => showToast(code));
  } else {
    showToast(code);
  }
}

function copyInviteLink() {
  const input = document.getElementById('invite-link-input');
  if (!input) return;
  const val = input.value || '';
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(val)
      .then(() => showToast('✓ Code copié dans le presse-papiers !'))
      .catch(() => legacyCopy(input));
  } else {
    legacyCopy(input);
  }
}

function legacyCopy(input) {
  input.select();
  input.setSelectionRange(0, 99999);
  try { document.execCommand('copy'); showToast('✓ Copié !'); }
  catch (_) { showToast('Copiez manuellement le code.'); }
}

/* ═══════════════════════════════════════════
   LOGOUT
═══════════════════════════════════════════ */
function logout() {
  DB.clearSession();
  window.location.href = 'auth.html';
}

/* ═══════════════════════════════════════════
   LANG TOGGLE (demo)
═══════════════════════════════════════════ */
const LANGS = [
  { flag: '🇫🇷', label: 'Français' },
  { flag: '🇬🇧', label: 'English' }
];
let _langIdx = 0;
function toggleLang() {
  _langIdx = (_langIdx + 1) % LANGS.length;
  const fl = document.getElementById('flag-icon');
  const lb = document.getElementById('lang-label');
  if (fl) fl.textContent = LANGS[_langIdx].flag;
  if (lb) lb.textContent = LANGS[_langIdx].label;
}

/* ═══════════════════════════════════════════
   INIT
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const sess = DB.getSession();
  if (!sess) { window.location.href = 'auth.html'; return; }
  updateUI();
  showPage('home');
});
