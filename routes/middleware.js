'use strict';

const jwt = require('jsonwebtoken');
const db  = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'midas_dev_secret';

function authMiddleware(req, res, next) {
  const auth  = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentification requise.' });

  try {
    const { email } = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(401).json({ error: 'Utilisateur introuvable.' });
    req.user = user;
    next();
  } catch (_) {
    return res.status(401).json({ error: 'Session expirée. Reconnectez-vous.' });
  }
}

function adminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (!req.user.is_admin)
      return res.status(403).json({ error: 'Accès réservé aux administrateurs.' });
    next();
  });
}

module.exports = { authMiddleware, adminMiddleware };
