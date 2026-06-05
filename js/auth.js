'use strict';

/* ─── Tab switcher ─── */
function showTab(tab) {
  const loginSection = document.getElementById('section-login');
  const regSection   = document.getElementById('section-register');
  const tabLogin     = document.getElementById('tab-login');
  const tabReg       = document.getElementById('tab-register');
  if (tab === 'login') {
    loginSection.classList.add('active');   regSection.classList.remove('active');
    tabLogin.classList.add('active');       tabReg.classList.remove('active');
  } else {
    regSection.classList.add('active');     loginSection.classList.remove('active');
    tabReg.classList.add('active');         tabLogin.classList.remove('active');
  }
  clearAuthErrors();
}

/* ─── Error helpers ─── */
function setAuthError(fieldId, errId, msg) {
  const f = document.getElementById(fieldId);
  const e = document.getElementById(errId);
  if (f) f.classList.add('is-error');
  if (e) e.textContent = msg;
}
function clearAuthError(fieldId, errId) {
  const f = document.getElementById(fieldId);
  const e = document.getElementById(errId);
  if (f) f.classList.remove('is-error');
  if (e) e.textContent = '';
}
function clearAuthErrors() {
  document.querySelectorAll('.field-input').forEach(f => f.classList.remove('is-error'));
  document.querySelectorAll('.field-error').forEach(e => { e.textContent = ''; });
  const ge = document.getElementById('global-error');
  if (ge) { ge.textContent = ''; ge.style.display = 'none'; }
}
function showGlobalError(msg) {
  const ge = document.getElementById('global-error');
  if (ge) { ge.textContent = msg; ge.style.display = 'block'; }
}

/* ─── Loading state ─── */
function setAuthLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    btn.dataset.orig = btn.innerHTML;
    btn.innerHTML = '<i class="fa fa-circle-notch fa-spin"></i> Traitement…';
    btn.classList.add('loading');
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.orig || btn.innerHTML;
    btn.classList.remove('loading');
  }
}

/* ─── Eye toggle ─── */
function toggleEye(inputId, btnEl) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btnEl.innerHTML = '<i class="fa fa-eye-slash"></i>';
  } else {
    input.type = 'password';
    btnEl.innerHTML = '<i class="fa fa-eye"></i>';
  }
}

/* ─── Login ─── */
async function handleLogin() {
  clearAuthErrors();
  const emailEl = document.getElementById('f-login-email');
  const pwdEl   = document.getElementById('f-login-password');
  const email   = emailEl?.value.trim();
  const pwd     = pwdEl?.value;

  let valid = true;
  if (!email || !email.includes('@')) { setAuthError('f-login-email',    'err-login-email', 'Email invalide.'); valid = false; }
  if (!pwd   || pwd.length < 1)       { setAuthError('f-login-password', 'err-login-pwd',   'Mot de passe requis.'); valid = false; }
  if (!valid) return;

  setAuthLoading('btn-login', true);
  const result = await API.login(email, pwd);
  setAuthLoading('btn-login', false);

  if (result.error) { showGlobalError(result.error); return; }
  window.location.href = 'index.html';
}

/* ─── Register ─── */
async function handleRegister() {
  clearAuthErrors();
  const name       = document.getElementById('f-reg-name')?.value.trim();
  const email      = document.getElementById('f-reg-email')?.value.trim();
  const phone      = document.getElementById('f-reg-phone')?.value.trim();
  const password   = document.getElementById('f-reg-password')?.value;
  const confirm    = document.getElementById('f-reg-confirm')?.value;
  const inviteCode = document.getElementById('f-reg-code')?.value.trim().toUpperCase();

  let valid = true;
  if (!name || name.length < 2)                       { setAuthError('f-reg-name',     'err-reg-name',    'Prénom et nom requis (min. 2 caractères).'); valid = false; }
  if (!email || !email.includes('@'))                 { setAuthError('f-reg-email',    'err-reg-email',   'Email invalide.'); valid = false; }
  if (!phone || phone.replace(/\D/g,'').length < 8)  { setAuthError('f-reg-phone',    'err-reg-phone',   'Numéro invalide (8-9 chiffres).'); valid = false; }
  if (!password || password.length < 6)               { setAuthError('f-reg-password', 'err-reg-pwd',     'Minimum 6 caractères.'); valid = false; }
  if (password !== confirm)                           { setAuthError('f-reg-confirm',  'err-reg-confirm', 'Les mots de passe ne correspondent pas.'); valid = false; }
  if (!inviteCode || inviteCode.length < 5)           { setAuthError('f-reg-code',     'err-reg-code',    "Code d'invitation requis."); valid = false; }
  if (!valid) return;

  setAuthLoading('btn-register', true);
  const result = await API.register({ name, email, password, inviteCode, phone });
  setAuthLoading('btn-register', false);

  if (result.error) { showGlobalError(result.error); return; }
  window.location.href = 'index.html';
}

/* ─── Real-time validation ─── */
document.addEventListener('DOMContentLoaded', () => {
  if (API.isLoggedIn()) {
    API.getUser().then(r => { if (r.success) window.location.href = 'index.html'; });
  }

  document.getElementById('f-login-email')?.addEventListener('input', function () {
    if (this.value.includes('@')) clearAuthError('f-login-email', 'err-login-email');
  });
  document.getElementById('f-reg-confirm')?.addEventListener('input', function () {
    const pwd = document.getElementById('f-reg-password')?.value;
    if (this.value === pwd) clearAuthError('f-reg-confirm', 'err-reg-confirm');
  });
  document.getElementById('f-reg-code')?.addEventListener('input', function () {
    const pos = this.selectionStart;
    this.value = this.value.toUpperCase();
    this.setSelectionRange(pos, pos);
    clearAuthError('f-reg-code', 'err-reg-code');
  });
  document.getElementById('f-login-password')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin();
  });
  document.getElementById('f-reg-confirm')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleRegister();
  });
});
