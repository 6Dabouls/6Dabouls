'use strict';

const express = require('express');
const fetch   = require('node-fetch');
const db      = require('../db/database');
const { authMiddleware } = require('./middleware');
const router  = express.Router();
require('dotenv').config();

/* ── Campay helpers ── */
const CAMPAY_BASE = () =>
  (process.env.CAMPAY_ENV === 'prod')
    ? 'https://www.campay.net/api'
    : 'https://demo.campay.net/api';

let _campayTokenCache = null;

async function getCampayToken() {
  if (_campayTokenCache && _campayTokenCache.expires > Date.now()) {
    return _campayTokenCache.token;
  }
  const res = await fetch(`${CAMPAY_BASE()}/token/`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      username: process.env.CAMPAY_USERNAME || '',
      password: process.env.CAMPAY_PASSWORD || ''
    }),
    timeout: 10000
  });
  const data = await res.json();
  if (!data.token) throw new Error('Campay auth failed: ' + JSON.stringify(data));
  _campayTokenCache = { token: data.token, expires: Date.now() + 50 * 60 * 1000 };
  return data.token;
}

async function campayRequest(endpoint, method, body) {
  const token = await getCampayToken();
  const res   = await fetch(`${CAMPAY_BASE()}${endpoint}`, {
    method:  method || 'GET',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Token ${token}`
    },
    body: body ? JSON.stringify(body) : undefined,
    timeout: 15000
  });
  return res.json();
}

function fmt237(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('237')) return digits;
  return '237' + digits.slice(-9);
}

function extRef(prefix) {
  return prefix + '-' + Date.now() + '-' + Math.floor(Math.random() * 9999);
}

/* ═══════════════════════════════════════
   POST /api/payment/recharge
   Initie une collecte Mobile Money
═══════════════════════════════════════ */
router.post('/recharge', authMiddleware, async (req, res) => {
  const { amount, method, phone } = req.body;
  const email = req.user.email;

  const amt = parseFloat(amount);
  if (!amt || amt < 500)  return res.json({ error: 'Montant minimum : 500 XAF.' });
  if (!phone)              return res.json({ error: 'Numéro de téléphone requis.' });

  const phoneFormatted = fmt237(phone);
  const externalRef    = extRef('RCH');

  /* ── Enregistrer la transaction en PENDING ── */
  const txInfo = db.prepare(`
    INSERT INTO transactions (user_email, type, amount, method, phone, label, reference, status)
    VALUES (?, 'recharge', ?, ?, ?, 'Recharge Mobile Money', ?, 'pending')
  `).run(email, amt, method || 'mtn', phone, externalRef);

  /* ── Appel Campay ── */
  try {
    const data = await campayRequest('/collect/', 'POST', {
      amount:             amt.toString(),
      currency:           'XAF',
      from:               phoneFormatted,
      description:        'MIDAS INVEST — Recharge de compte',
      external_reference: externalRef,
      redirect_url:       (process.env.APP_URL || '') + '/index.html'
    });

    if (data.reference) {
      /* Mettre à jour la référence Campay dans la DB */
      db.prepare('UPDATE transactions SET reference = ? WHERE id = ?')
        .run(data.reference, txInfo.lastInsertRowid);

      return res.json({
        success:        true,
        reference:      data.reference,
        external_ref:   externalRef,
        ussd_code:      data.ussd_code || null,
        operator:       data.operator  || method
      });
    } else {
      db.prepare('UPDATE transactions SET status = ? WHERE id = ?').run('failed', txInfo.lastInsertRowid);
      return res.json({ error: data.message || "Échec de l'initiation du paiement. Vérifiez votre numéro." });
    }
  } catch (err) {
    console.error('[Campay collect error]', err.message);
    db.prepare('UPDATE transactions SET status = ? WHERE id = ?').run('failed', txInfo.lastInsertRowid);
    return res.json({ error: 'Erreur de connexion au service de paiement. Réessayez.' });
  }
});

/* ═══════════════════════════════════════
   GET /api/payment/status/:reference
   Vérifie le statut d'une transaction Campay
═══════════════════════════════════════ */
router.get('/status/:reference', authMiddleware, async (req, res) => {
  const { reference } = req.params;
  const email         = req.user.email;

  /* Cherche la transaction en DB */
  const tx = db.prepare(
    'SELECT * FROM transactions WHERE reference = ? AND user_email = ?'
  ).get(reference, email);

  /* Déjà confirmée en DB ? */
  if (tx && tx.status === 'success') {
    const user = db.prepare('SELECT balance FROM users WHERE email = ?').get(email);
    return res.json({ status: 'SUCCESSFUL', balance: user?.balance || 0 });
  }
  if (tx && tx.status === 'failed') {
    return res.json({ status: 'FAILED' });
  }

  /* Interroger Campay ── */
  try {
    const data = await campayRequest(`/transaction/${reference}/`, 'GET');

    if (data.status === 'SUCCESSFUL') {
      /* Créditer le compte */
      const amount = tx ? tx.amount : parseFloat(data.amount || 0);
      db.prepare(`UPDATE transactions SET status = 'success' WHERE reference = ?`).run(reference);
      db.prepare(`
        UPDATE users SET balance = balance + ?, total_recharged = total_recharged + ?,
        updated_at = datetime('now') WHERE email = ?
      `).run(amount, amount, email);

      const user = db.prepare('SELECT balance FROM users WHERE email = ?').get(email);
      return res.json({ status: 'SUCCESSFUL', balance: user?.balance || 0 });

    } else if (data.status === 'FAILED') {
      db.prepare(`UPDATE transactions SET status = 'failed' WHERE reference = ?`).run(reference);
      return res.json({ status: 'FAILED' });
    } else {
      return res.json({ status: 'PENDING' });
    }
  } catch (err) {
    console.error('[Campay status error]', err.message);
    return res.json({ status: 'PENDING' });
  }
});

/* ═══════════════════════════════════════
   POST /api/payment/retrait
   Retrait vers Mobile Money
═══════════════════════════════════════ */
router.post('/retrait', authMiddleware, async (req, res) => {
  const { amount, method, phone } = req.body;
  const email = req.user.email;

  const amt = parseFloat(amount);
  if (!amt || amt < 500) return res.json({ error: 'Montant minimum : 500 XAF.' });
  if (!phone)             return res.json({ error: 'Numéro de téléphone requis.' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || (user.balance || 0) < amt)
    return res.json({ error: `Solde insuffisant. Disponible : ${(user?.balance || 0).toLocaleString('fr-FR')} XAF.` });

  const phoneFormatted = fmt237(phone);
  const externalRef    = extRef('RTR');

  /* Débiter immédiatement (optimistic) */
  db.prepare(`
    UPDATE users SET balance = balance - ?, updated_at = datetime('now') WHERE email = ?
  `).run(amt, email);

  const txInfo = db.prepare(`
    INSERT INTO transactions (user_email, type, amount, method, phone, label, reference, status)
    VALUES (?, 'retrait', ?, ?, ?, 'Retrait Mobile Money', ?, 'pending')
  `).run(email, amt, method || 'mtn', phone, externalRef);

  /* ── Appel Campay withdraw ── */
  try {
    const data = await campayRequest('/withdraw/', 'POST', {
      amount:             amt.toString(),
      currency:           'XAF',
      to:                 phoneFormatted,
      description:        'MIDAS INVEST — Retrait',
      external_reference: externalRef
    });

    if (data.reference) {
      db.prepare('UPDATE transactions SET reference = ?, status = ? WHERE id = ?')
        .run(data.reference, 'success', txInfo.lastInsertRowid);

      const updated = db.prepare('SELECT balance FROM users WHERE email = ?').get(email);
      return res.json({
        success:   true,
        reference: data.reference,
        balance:   updated?.balance || 0
      });
    } else {
      /* Rembourser si échec */
      db.prepare(`UPDATE users SET balance = balance + ? WHERE email = ?`).run(amt, email);
      db.prepare('UPDATE transactions SET status = ? WHERE id = ?').run('failed', txInfo.lastInsertRowid);
      return res.json({ error: data.message || 'Échec du retrait. Réessayez.' });
    }
  } catch (err) {
    console.error('[Campay withdraw error]', err.message);
    /* Rembourser si erreur réseau */
    db.prepare(`UPDATE users SET balance = balance + ? WHERE email = ?`).run(amt, email);
    db.prepare('UPDATE transactions SET status = ? WHERE id = ?').run('failed', txInfo.lastInsertRowid);
    return res.json({ error: 'Erreur de connexion au service de paiement. Réessayez.' });
  }
});

/* ═══════════════════════════════════════
   POST /api/payment/webhook/campay
   Webhook Campay (notifications push)
═══════════════════════════════════════ */
router.post('/webhook/campay', (req, res) => {
  const { reference, status, amount } = req.body;
  if (!reference) return res.sendStatus(400);

  const tx = db.prepare('SELECT * FROM transactions WHERE reference = ?').get(reference);
  if (!tx || tx.status !== 'pending') return res.sendStatus(200);

  if (status === 'SUCCESSFUL') {
    const amt = parseFloat(amount || tx.amount);
    db.prepare(`UPDATE transactions SET status = 'success' WHERE reference = ?`).run(reference);
    if (tx.type === 'recharge') {
      db.prepare(`
        UPDATE users SET balance = balance + ?, total_recharged = total_recharged + ?,
        updated_at = datetime('now') WHERE email = ?
      `).run(amt, amt, tx.user_email);
    }
  } else if (status === 'FAILED') {
    db.prepare(`UPDATE transactions SET status = 'failed' WHERE reference = ?`).run(reference);
    if (tx.type === 'retrait') {
      /* Rembourser */
      db.prepare(`UPDATE users SET balance = balance + ? WHERE email = ?`).run(tx.amount, tx.user_email);
    }
  }

  res.sendStatus(200);
});

/* ═══════════════════════════════════════
   POST /api/payment/buy
   Achat d'un plan d'investissement
═══════════════════════════════════════ */
router.post('/buy', authMiddleware, (req, res) => {
  const { po, price, profit, qty } = req.body;
  const email  = req.user.email;
  const q      = Math.max(1, parseInt(qty) || 1);
  const total  = parseFloat(price) * q;
  const profit_ = parseFloat(profit) * q;

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || (user.balance || 0) < total)
    return res.json({ error: "Solde insuffisant. Rechargez d'abord votre compte." });

  db.prepare(`UPDATE users SET balance = balance - ?, updated_at = datetime('now') WHERE email = ?`).run(total, email);

  db.prepare(`
    INSERT INTO portfolio (user_email, po, qty, price, daily_profit, total_paid, days_left)
    VALUES (?, ?, ?, ?, ?, ?, 365)
  `).run(email, po, q, price, profit_, total);

  db.prepare(`
    INSERT INTO transactions (user_email, type, amount, method, label, status)
    VALUES (?, 'achat', ?, '', ?, 'success')
  `).run(email, total, po + (q > 1 ? ' ×' + q : ''));

  const updated = db.prepare('SELECT balance FROM users WHERE email = ?').get(email);
  res.json({ success: true, balance: updated?.balance || 0 });
});

/* ═══════════════════════════════════════
   POST /api/payment/transfer
   Transfert entre utilisateurs
═══════════════════════════════════════ */
router.post('/transfer', authMiddleware, (req, res) => {
  const { toEmail, amount } = req.body;
  const fromEmail = req.user.email;

  const amt = parseFloat(amount);
  if (!amt || amt < 500)  return res.json({ error: 'Montant minimum : 500 XAF.' });
  if (!toEmail)            return res.json({ error: 'Email destinataire requis.' });

  const normalTo = toEmail.trim().toLowerCase();
  if (normalTo === fromEmail) return res.json({ error: 'Vous ne pouvez pas vous transférer à vous-même.' });

  const sender   = db.prepare('SELECT * FROM users WHERE email = ?').get(fromEmail);
  const receiver = db.prepare('SELECT * FROM users WHERE email = ?').get(normalTo);

  if (!receiver) return res.json({ error: "Destinataire introuvable. Vérifiez l'email." });
  if ((sender?.balance || 0) < amt) return res.json({ error: 'Solde insuffisant.' });

  db.prepare(`UPDATE users SET balance = balance - ?, updated_at = datetime('now') WHERE email = ?`).run(amt, fromEmail);
  db.prepare(`UPDATE users SET balance = balance + ?, updated_at = datetime('now') WHERE email = ?`).run(amt, normalTo);

  db.prepare(`
    INSERT INTO transactions (user_email, type, amount, method, label, status)
    VALUES (?, 'retrait', ?, 'transfer', ?, 'success')
  `).run(fromEmail, amt, 'Transfert → ' + normalTo);

  db.prepare(`
    INSERT INTO transactions (user_email, type, amount, method, label, status)
    VALUES (?, 'recharge', ?, 'transfer', ?, 'success')
  `).run(normalTo, amt, 'Reçu de ' + fromEmail);

  const updated = db.prepare('SELECT balance FROM users WHERE email = ?').get(fromEmail);
  res.json({ success: true, balance: updated?.balance || 0 });
});

module.exports = router;
