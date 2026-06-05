'use strict';

/* ─── Helpers ─── */
function xaf(n) { return Number(n).toLocaleString('fr-FR') + ' XAF'; }
function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
function esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function methodLabel(m) {
  return ({ mtn: 'MTN MoMo', orange: 'Orange Money', bank: 'Banque', admin: 'Admin', transfer: 'Transfert' })[m] || (m || '—');
}

function showToast(msg) {
  const t = document.getElementById('admin-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

/* ─── Section switcher ─── */
function showSection(name) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.snav-item[id]').forEach(b => b.classList.remove('active'));
  const sec = document.getElementById('section-' + name);
  const nav = document.getElementById('snav-' + name);
  if (sec) sec.classList.add('active');
  if (nav) nav.classList.add('active');
  if (name === 'dashboard')    refreshDashboard();
  if (name === 'users')        refreshUsers();
  if (name === 'transactions') refreshTransactions();
  if (name === 'codes')        refreshCodes();
}

/* ─── Dashboard ─── */
async function refreshDashboard() {
  const r = await API.admin.stats();
  if (!r.success) return;
  const s   = r.stats;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('stat-users',     s.userCount);
  set('stat-balance',   Number(s.totalBalance).toLocaleString('fr-FR'));
  set('stat-recharged', Number(s.totalRecharged).toLocaleString('fr-FR'));
  set('stat-withdrawn', Number(s.totalWithdrawn).toLocaleString('fr-FR'));
  set('stat-txcount',   s.txCount);

  const txR = await API.admin.transactions('all');
  const txs  = (txR.transactions || []).slice(0, 15);
  document.getElementById('dash-tx-list').innerHTML = renderTxTable(txs, true);
}

/* ─── Users ─── */
async function refreshUsers() {
  const r = await API.admin.users();
  const wrap = document.getElementById('users-table-wrap');
  const users = r.users || [];

  if (users.length === 0) {
    wrap.innerHTML = '<div class="empty-table"><i class="fa fa-users"></i>Aucun utilisateur</div>';
    return;
  }

  wrap.innerHTML = `
    <table>
      <thead><tr>
        <th>Nom</th><th>Email</th><th>Téléphone</th><th>Solde</th>
        <th>Rechargé</th><th>Code</th><th>Filleuls</th><th>Inscrit le</th><th>Action</th>
      </tr></thead>
      <tbody>
        ${users.map(u => `
          <tr>
            <td><strong>${esc(u.name)}${u.is_admin ? ' <span class="badge badge-gold">Admin</span>' : ''}</strong></td>
            <td class="td-email">${esc(u.email)}</td>
            <td class="td-email">${esc(u.phone || '—')}</td>
            <td class="td-amount gold">${Number(u.balance||0).toLocaleString('fr-FR')}</td>
            <td class="td-amount green">${Number(u.total_recharged||0).toLocaleString('fr-FR')}</td>
            <td><code style="font-size:11px;background:#f8f8f8;padding:2px 6px;border-radius:4px">${esc(u.invite_code)}</code></td>
            <td><span class="badge badge-gray">${u.referrals||0}</span></td>
            <td class="td-email">${fmtDate(u.created_at)}</td>
            <td><button class="table-action-btn fill-email" onclick="fillAdjEmail('${esc(u.email)}')"><i class="fa fa-pen"></i> Ajuster</button></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function fillAdjEmail(email) {
  const el = document.getElementById('adj-email');
  if (el) { el.value = email; }
  document.querySelector('.admin-card')?.scrollIntoView({ behavior: 'smooth' });
}

async function handleAdminCredit() {
  const email  = document.getElementById('adj-email')?.value.trim();
  const amount = document.getElementById('adj-amount')?.value;
  const note   = document.getElementById('adj-note')?.value.trim();
  const msg    = document.getElementById('adj-msg');

  const result = await API.admin.credit(email, parseFloat(amount), note);
  if (msg) {
    msg.className = 'adj-msg ' + (result.error ? 'error' : 'success');
    msg.textContent = result.error || '✓ Solde crédité avec succès.';
  }
  if (result.success) {
    document.getElementById('adj-amount').value = '';
    document.getElementById('adj-note').value   = '';
    showToast('Crédit appliqué !');
    refreshUsers();
  }
}

async function handleAdminDebit() {
  const email  = document.getElementById('adj-email')?.value.trim();
  const amount = document.getElementById('adj-amount')?.value;
  const note   = document.getElementById('adj-note')?.value.trim();
  const msg    = document.getElementById('adj-msg');

  const result = await API.admin.debit(email, parseFloat(amount), note);
  if (msg) {
    msg.className = 'adj-msg ' + (result.error ? 'error' : 'success');
    msg.textContent = result.error || '✓ Solde débité avec succès.';
  }
  if (result.success) {
    document.getElementById('adj-amount').value = '';
    document.getElementById('adj-note').value   = '';
    showToast('Débit appliqué !');
    refreshUsers();
  }
}

/* ─── Transactions ─── */
async function refreshTransactions() {
  const type = document.getElementById('tx-type-filter')?.value || 'all';
  const r    = await API.admin.transactions(type);
  document.getElementById('tx-table-wrap').innerHTML = renderTxTable(r.transactions || [], true);
}

function renderTxTable(txs, showUser) {
  if (!txs.length) return '<div class="empty-table"><i class="fa fa-inbox"></i>Aucune transaction</div>';
  const icons  = { recharge: 'fa-plus-circle', retrait: 'fa-circle-down', achat: 'fa-gem' };
  const colors = { recharge: 'green', retrait: 'red', achat: 'gold' };
  const signs  = { recharge: '+', retrait: '−', achat: '−' };
  const labels = { recharge: 'Recharge', retrait: 'Retrait', achat: 'Achat' };
  return `
    <table>
      <thead><tr>
        <th>Type</th>${showUser ? '<th>Utilisateur</th>' : ''}
        <th>Montant</th><th>Méthode</th><th>Téléphone</th><th>Note</th><th>Date</th><th>Statut</th>
      </tr></thead>
      <tbody>
        ${txs.map(tx => `
          <tr>
            <td><span class="badge badge-${colors[tx.type]||'gray'}">
              <i class="fa ${icons[tx.type]||'fa-circle'}" style="margin-right:4px"></i>${labels[tx.type]||tx.type}
            </span></td>
            ${showUser ? `<td class="td-email">${esc(tx.user_email||'')}</td>` : ''}
            <td class="td-amount ${colors[tx.type]||''}">${signs[tx.type]||''}${Number(tx.amount).toLocaleString('fr-FR')} XAF</td>
            <td class="td-email">${methodLabel(tx.method)}</td>
            <td class="td-email">${tx.phone ? '+237 '+esc(tx.phone) : '—'}</td>
            <td class="td-email">${esc(tx.label||'—')}</td>
            <td class="td-email" style="white-space:nowrap">${fmtDate(tx.date)}</td>
            <td><span class="badge ${tx.status==='success'?'badge-green':tx.status==='pending'?'badge-gold':'badge-red'}">
              ${tx.status==='success'?'Succès':tx.status==='pending'?'En cours':'Échec'}
            </span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/* ─── Codes ─── */
async function refreshCodes() {
  const r     = await API.admin.codes();
  const codes = r.codes || [];
  const wrap  = document.getElementById('codes-table-wrap');

  if (!codes.length) {
    wrap.innerHTML = '<div class="empty-table"><i class="fa fa-ticket"></i>Aucun code</div>';
    return;
  }

  wrap.innerHTML = `
    <table>
      <thead><tr><th>Code</th><th>Statut</th><th>Utilisé par</th><th>Créé le</th></tr></thead>
      <tbody>
        ${codes.map(c => `
          <tr>
            <td><code style="font-size:13px;font-weight:800;background:#f8f8f8;padding:3px 8px;border-radius:4px;letter-spacing:1px">${esc(c.code)}</code></td>
            <td><span class="badge ${c.used_by?'badge-green':'badge-gray'}">${c.used_by?'Utilisé':'Disponible'}</span></td>
            <td class="td-email">${c.used_by?esc(c.used_by):'—'}</td>
            <td class="td-email">${fmtDate(c.created_at)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

async function handleGenerateCode() {
  const result = await API.admin.generateCode();
  if (result.error) { showToast(result.error); return; }

  const box = document.getElementById('gen-code-result');
  box.style.display = 'flex';
  box.innerHTML = `
    <i class="fa fa-ticket" style="color:#f59e0b;font-size:20px"></i>
    <span>Nouveau code :</span>
    <span class="code-val">${result.code}</span>
    <button class="copy-gen-btn" onclick="copyCode('${result.code}')">
      <i class="fa fa-copy"></i> Copier
    </button>
  `;
  showToast('Code généré : ' + result.code);
  refreshCodes();
}

function copyCode(code) {
  navigator.clipboard?.writeText(code).then(() => showToast('✓ Code copié !'));
}

function adminLogout() { API.logout(); }

/* ─── Init ─── */
document.addEventListener('DOMContentLoaded', async () => {
  if (!API.isLoggedIn()) { window.location.href = 'auth.html'; return; }
  const r = await API.getUser();
  if (!r.success || !r.user.isAdmin) { window.location.href = 'index.html'; return; }
  showSection('dashboard');
});
