'use strict';

const Database = require('better-sqlite3');
const bcrypt   = require('bcryptjs');
const path     = require('path');
require('dotenv').config();

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'midas.db');
const db      = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/* ── Schema ── */
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    email           TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    phone           TEXT DEFAULT '',
    password_hash   TEXT NOT NULL,
    balance         REAL DEFAULT 0,
    total_recharged REAL DEFAULT 0,
    invite_code     TEXT UNIQUE NOT NULL,
    invited_by      TEXT DEFAULT '',
    is_admin        INTEGER DEFAULT 0,
    created_at      TEXT DEFAULT (datetime('now')),
    updated_at      TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token      TEXT PRIMARY KEY,
    user_email TEXT NOT NULL,
    expires_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS invite_codes (
    code       TEXT PRIMARY KEY,
    used_by    TEXT DEFAULT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    type       TEXT NOT NULL,
    amount     REAL NOT NULL,
    method     TEXT DEFAULT '',
    phone      TEXT DEFAULT '',
    label      TEXT DEFAULT '',
    reference  TEXT DEFAULT '',
    status     TEXT DEFAULT 'pending',
    date       TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS portfolio (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email    TEXT NOT NULL,
    po            TEXT NOT NULL,
    qty           INTEGER DEFAULT 1,
    price         REAL NOT NULL,
    daily_profit  REAL NOT NULL,
    total_paid    REAL NOT NULL,
    days_left     INTEGER DEFAULT 365,
    purchase_date TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_tx_user   ON transactions(user_email);
  CREATE INDEX IF NOT EXISTS idx_tx_ref    ON transactions(reference);
  CREATE INDEX IF NOT EXISTS idx_port_user ON portfolio(user_email);
`);

/* ── Seed invite codes ── */
const seedCodes = ['MIDAS-ADMIN', 'INVEST-2024', 'OR-GOLD-01'];
const insertCode = db.prepare('INSERT OR IGNORE INTO invite_codes (code) VALUES (?)');
seedCodes.forEach(c => insertCode.run(c));

/* ── Seed admin user ── */
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sergedaboulejunior@gmail.com';
if (!db.prepare('SELECT email FROM users WHERE email = ?').get(ADMIN_EMAIL)) {
  const hash     = bcrypt.hashSync('691Juni@', 10);
  const adminCode = 'MIDAS-ROOT';
  db.prepare(`
    INSERT INTO users (email, name, phone, password_hash, invite_code, invited_by, is_admin)
    VALUES (?, 'Serge Junior', '', ?, ?, 'MIDAS-ADMIN', 1)
  `).run(ADMIN_EMAIL, hash, adminCode);
  db.prepare('INSERT OR IGNORE INTO invite_codes (code, used_by) VALUES (?, ?)').run(adminCode, ADMIN_EMAIL);
  db.prepare('UPDATE invite_codes SET used_by = ? WHERE code = ?').run(ADMIN_EMAIL, 'MIDAS-ADMIN');
  console.log('✅  Admin account seeded:', ADMIN_EMAIL);
}

module.exports = db;
