'use strict';

const express = require('express');
const bcrypt  = require('bcryptjs');
const db      = require('../db/database');
const { authMiddleware } = require('./middleware');
const router  = express.Router();

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

/* GET /api/user/me */
router.get('/me', authMiddleware, (req, res) => {
  res.json({ success: true, user: userPayload(req.user) });
});

/* GET /api/user/transactions */
router.get('/transactions', authMiddleware, (req, res) => {
  const txs = db.prepare(`
    SELECT * FROM transactions WHERE user_email = ? ORDER BY date DESC LIMIT 200
  `).all(req.user.email);

  res.json({ success: true, transactions: txs.map(t => ({
    id:     t.id,
    type:   t.type,
    amount: t.amount,
    method: t.method,
    phone:  t.phone,
    label:  t.label,
    date:   t.date,
    status: t.status === 'success' ? 'success' : (t.status === 'failed' ? 'failed' : 'pending')
  })) });
});

/* GET /api/user/portfolio */
router.get('/portfolio', authMiddleware, (req, res) => {
  const items = db.prepare(`
    SELECT * FROM portfolio WHERE user_email = ? ORDER BY purchase_date DESC
  `).all(req.user.email);

  res.json({ success: true, portfolio: items.map(i => ({
    id:           i.id,
    po:           i.po,
    qty:          i.qty,
    price:        i.price,
    dailyProfit:  i.daily_profit,
    totalPaid:    i.total_paid,
    daysLeft:     i.days_left,
    purchaseDate: i.purchase_date
  })) });
});

/* GET /api/user/team */
router.get('/team', authMiddleware, (req, res) => {
  const email    = req.user.email;
  const code     = req.user.invite_code;
  const referrals = db.prepare(`
    SELECT u.email, u.name, u.created_at,
      COALESCE((SELECT SUM(amount) FROM transactions WHERE user_email = u.email AND type = 'recharge'), 0) as recharged
    FROM users u
    WHERE u.invited_by = ?
  `).all(code);

  const now        = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);

  let totalRecharge = 0, newThisMonth = 0, firstRecharge = 0;
  referrals.forEach(r => {
    totalRecharge += r.recharged || 0;
    if (r.created_at && r.created_at.slice(0, 10) >= monthStart) newThisMonth++;
    if (r.recharged > 0) firstRecharge++;
  });

  res.json({
    success: true,
    team: {
      size:          referrals.length,
      totalRecharge,
      newThisMonth,
      firstRecharge,
      members:       referrals.map(r => ({ email: r.email, name: r.name, recharged: r.recharged }))
    }
  });
});

/* POST /api/user/password */
router.post('/password', authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = req.user;

  if (!newPassword || newPassword.length < 6)
    return res.json({ error: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' });

  if (!bcrypt.compareSync(currentPassword || '', user.password_hash))
    return res.json({ error: 'Mot de passe actuel incorrect.' });

  const hash = bcrypt.hashSync(newPassword, 10);
  db.prepare(`UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE email = ?`)
    .run(hash, user.email);

  res.json({ success: true });
});

module.exports = router;
