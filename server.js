'use strict';

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.use('/api/auth',            require('./routes/auth'));
app.use('/api/payment',         require('./routes/payment'));
app.use('/api/user',            require('./routes/user'));
app.use('/api/admin',           require('./routes/admin'));

/* ── Webhook Campay (accès sans auth) ── */
app.post('/api/webhook/campay', require('./routes/payment').campayWebhook || ((req, res) => res.sendStatus(200)));

/* ── SPA fallback ── */
app.get(/^(?!\/api\/).*/, (req, res) => {
  const htmlFiles = ['index.html', 'auth.html', 'admin.html'];
  const file = req.path.replace(/^\//, '');
  const target = htmlFiles.includes(file) ? file : 'index.html';
  res.sendFile(path.join(__dirname, target));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('');
  console.log('  🏆  MIDAS INVEST — Serveur démarré');
  console.log(`  🌐  http://localhost:${PORT}`);
  console.log(`  📱  Mobile Money : Campay (${process.env.CAMPAY_ENV || 'sandbox'})`);
  console.log('');
});

module.exports = app;
