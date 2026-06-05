'use strict';

const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const crypto  = require('crypto');
const db      = require('../db/database');
const router  = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'midas_dev_secret';
const TOKEN_TTL  = 7 * 24 * 3600; // 7 days (seconds)

function makeToken(email) {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

function userPayload(u) {
  return {
    email:          u.email,
    name:           u.name,
    phone:          u.phone || '',
    balance:        u.balance        || 0,
    totalRecharged: u.total_recharged || 0,
    inviteCode:     u.invite_code,
    invitedBy:      u.invited_by || '',
    isAdmin:        !!u.is_admin,
    createdAt:      u.created_at
  };
}

function genInviteCode(retries = 0) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'MIDAS-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  const exists = db.prepare('SELECT code FROM invite_codes WHERE code = ?').get(code);
  return (exists && retries < 20) ? genInviteCode(retries + 1) : code;
}

/* ── POST /api/auth/register ── */
router.post('/register', (req, res) => {
  const { name, email, password, inviteCode, phone } = req.body;

  if (!name || name.trim().length < 2)
    return res.json({ error: 'Prénom et nom requis (min. 2 caractères).' });
  if (!email || !email.includes('@'))
    return res.json({ error: 'Adresse email invalide.' });
  if (!password || password.length < 6)
    return res.json({ error: 'Le mot de passe doit contenir au moins 6 caractères.' });
  if (!inviteCode || inviteCode.trim() === '')
    return res.json({ error: "Un code d'invitation est requis." });

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedCode  = inviteCode.trim().toUpperCase();

  if (db.prepare('SELECT email FROM users WHERE email = ?').get(normalizedEmail))
    return res.json({ error: 'Cette adresse email est déjà utilisée.' });

  const codeRow = db.prepare('SELECT * FROM invite_codes WHERE code = ?').get(normalizedCode);
  if (!codeRow)
    return res.json({ error: "Code d'invitation invalide ou inexistant." });

  const myCode      = genInviteCode();
  const passwordHash = bcrypt.hashSync(password, 10);

  db.prepare(`
    INSERT INTO users (email, name, phone, password_hash, invite_code, invited_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(normalizedEmail, name.trim(), (phone || '').trim(), passwordHash, myCode, normalizedCode);

  db.prepare('INSERT OR IGNORE INTO invite_codes (code, used_by) VALUES (?, ?)').run(myCode, normalizedEmail);

  const token = makeToken(normalizedEmail);
  const user  = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

  res.json({ success: true, token, user: userPayload(user) });
});

/* ── POST /api/auth/login ── */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.json({ error: 'Email et mot de passe requis.' });

  const normalizedEmail = email.trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

  if (!user)
    return res.json({ error: 'Aucun compte associé à cet email.' });

  if (!bcrypt.compareSync(password, user.password_hash))
    return res.json({ error: 'Mot de passe incorrect.' });

  const token = makeToken(normalizedEmail);
  res.json({ success: true, token, user: userPayload(user) });
});

/* ── GET /api/auth/me ── */
router.get('/me', (req, res) => {
  const auth  = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.json({ error: 'Non authentifié.' });

  try {
    const { email } = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.json({ error: 'Utilisateur introuvable.' });
    res.json({ success: true, user: userPayload(user) });
  } catch (_) {
    res.json({ error: 'Session expirée. Reconnectez-vous.' });
  }
});

module.exports = router;
