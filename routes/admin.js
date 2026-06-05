'use strict';

const express = require('express');
const db      = require('../db/database');
const { adminMiddleware } = require('./middleware');
const router  = express.Router();

function genCode(retries = 0) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'MIDAS-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  const exists = db.prepare('SELECT code FROM invite_codes WHERE code = ?').get(code);
  return (exists && retries < 20) ? genCode(retries + 1) : code;
}

/* GET /api/admin/stats */
router.get('/stats', adminMiddleware, (req, res) => {
  const userCount     = db.prepare('SELECT COUNT(*) as n FROM users').get().n;
  const totalBalance  = db.prepare('SELECT COALESCE(SUM(balance), 0) as s FROM users').get().s;
  const totalRecharged = db.prepare(`SELECT COALESCE(SUM(amount),0) as s FROM transactions WHERE type='recharge' AND status='success'`).get().s;
  const totalWithdrawn = db.prepare(`SELECT COALESCE(SUM(amount),0) as s FROM transactions WHERE type='retrait'  AND status='success'`).get().s;
  const txCount        = db.prepare('SELECT COUNT(*) as n FROM transactions').get().n;

  res.json({ success: true, stats: { userCount, totalBalance, totalRecharged, totalWithdrawn, txCount } });
});

/* GET /api/admin/users */
router.get('/users', adminMiddleware, (req, res) => {
  const users = db.prepare(`
    SELECT u.email, u.name, u.phone, u.balance, u.total_recharged,
           u.invite_code, u.invited_by, u.is_admin, u.created_at,
           (SELECT COUNT(*) FROM users r WHERE r.invited_by = u.invite_code) as referrals
    FROM users u ORDER BY u.created_at DESC
  `).all();
  res.json({ success: true, users });
});

/* GET /api/admin/transactions */
router.get('/transactions', adminMiddleware, (req, res) => {
  const { type } = req.query;
  let query = 'SELECT * FROM transactions';
  const params = [];
  if (type && type !== 'all') { query += ' WHERE type = ?'; params.push(type); }
  query += ' ORDER BY date DESC LIMIT 500';
  const txs = db.prepare(query).all(...params);
  res.json({ success: true, transactions: txs });
});

/* GET /api/admin/codes */
router.get('/codes', adminMiddleware, (req, res) => {
  const codes = db.prepare('SELECT * FROM invite_codes ORDER BY created_at DESC').all();
  res.json({ success: true, codes });
});

/* POST /api/admin/credit */
router.post('/credit', adminMiddleware, (req, res) => {
  const { targetEmail, amount, note } = req.body;
  const amt = parseFloat(amount);
  if (!amt || amt <= 0) return res.json({ error: 'Montant invalide.' });

  const target = db.prepare('SELECT email FROM users WHERE email = ?').get(targetEmail?.trim().toLowerCase());
  if (!target) return res.json({ error: 'Utilisateur introuvable.' });

  db.prepare(`UPDATE users SET balance = balance + ?, total_recharged = total_recharged + ?, updated_at = datetime('now') WHERE email = ?`)
    .run(amt, amt, target.email);
  db.prepare(`INSERT INTO transactions (user_email, type, amount, method, label, status) VALUES (?, 'recharge', ?, 'admin', ?, 'success')`)
    .run(target.email, amt, 'Crédit admin' + (note ? ' — ' + note : ''));

  res.json({ success: true });
});

/* POST /api/admin/debit */
router.post('/debit', adminMiddleware, (req, res) => {
  const { targetEmail, amount, note } = req.body;
  const amt = parseFloat(amount);
  if (!amt || amt <= 0) return res.json({ error: 'Montant invalide.' });

  const target = db.prepare('SELECT * FROM users WHERE email = ?').get(targetEmail?.trim().toLowerCase());
  if (!target) return res.json({ error: 'Utilisateur introuvable.' });
  if ((target.balance || 0) < amt) return res.json({ error: 'Solde insuffisant.' });

  db.prepare(`UPDATE users SET balance = balance - ?, updated_at = datetime('now') WHERE email = ?`).run(amt, target.email);
  db.prepare(`INSERT INTO transactions (user_email, type, amount, method, label, status) VALUES (?, 'retrait', ?, 'admin', ?, 'success')`)
    .run(target.email, amt, 'Débit admin' + (note ? ' — ' + note : ''));

  res.json({ success: true });
});

/* POST /api/admin/generate-code */
router.post('/generate-code', adminMiddleware, (req, res) => {
  const code = genCode();
  db.prepare('INSERT INTO invite_codes (code) VALUES (?)').run(code);
  res.json({ success: true, code });
});

module.exports = router;
