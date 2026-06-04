'use strict';

/* ── Page Navigation ── */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const page = document.getElementById('page-' + name);
  const nav  = document.getElementById('nav-' + name);

  if (page) {
    page.classList.add('active');
    page.scrollTop = 0;
  }
  if (nav) nav.classList.add('active');
}

/* ── Project Tab Switcher ── */
function switchProjectTab(name) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

  const btn   = document.getElementById('tab-' + name);
  const panel = document.getElementById('panel-' + name);

  if (btn)   btn.classList.add('active');
  if (panel) panel.classList.add('active');
}

/* ── Modals ── */
function openModal(type, poName, poPrice) {
  if (type === 'buy') {
    const titleEl = document.getElementById('buy-modal-title');
    const priceEl = document.getElementById('buy-modal-price');
    if (titleEl) titleEl.textContent = 'Acheter — ' + (poName || '');
    if (priceEl) priceEl.textContent = (poPrice || '—') + ' XAF';
  }

  const modal = document.getElementById('modal-' + type);
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(type) {
  const modal = document.getElementById('modal-' + type);
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Invite Link Copy ── */
function copyInviteLink() {
  const input = document.getElementById('invite-link-input');
  if (!input) return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(input.value)
      .then(() => showToast('Lien copié !'))
      .catch(() => fallbackCopy(input));
  } else {
    fallbackCopy(input);
  }
}

function fallbackCopy(input) {
  input.select();
  input.setSelectionRange(0, 99999);
  try {
    document.execCommand('copy');
    showToast('Lien copié !');
  } catch {
    showToast('Copiez manuellement le lien.');
  }
}

/* ── Toast Notification ── */
function showToast(msg, duration) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration || 2500);
}

/* ── Submit Buttons (demo feedback) ── */
function attachSubmitHandlers() {
  document.querySelectorAll('.submit-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const sheet = this.closest('.modal-sheet');
      const inputs = sheet ? sheet.querySelectorAll('.field-input') : [];

      let valid = true;
      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#e74c3c';
          valid = false;
          setTimeout(() => (input.style.borderColor = ''), 1500);
        }
      });

      if (!valid) {
        showToast('Veuillez remplir tous les champs.');
        return;
      }

      showToast('Demande envoyée avec succès !');
      const type = sheet.closest('.modal-bg').id.replace('modal-', '');
      setTimeout(() => closeModal(type), 1200);
    });
  });
}

/* ── Close modal on Escape ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-bg.open').forEach(m => {
      m.classList.remove('open');
    });
    document.body.style.overflow = '';
  }
});

/* ── Swipe-down to close modal ── */
(function setupSwipeClose() {
  let startY = 0;

  document.addEventListener('touchstart', e => {
    const sheet = e.target.closest('.modal-sheet');
    if (sheet) startY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    const sheet = e.target.closest('.modal-sheet');
    if (!sheet) return;
    const dy = e.changedTouches[0].clientY - startY;
    if (dy > 80) {
      const bg = sheet.closest('.modal-bg');
      if (bg) {
        bg.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  }, { passive: true });
})();

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  attachSubmitHandlers();
  showPage('home');
});
