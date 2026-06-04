'use strict';

/* ═══════════════════════════════════════════
   MidasDB — localStorage structuré v2
═══════════════════════════════════════════ */
(function (global) {

  const DB_KEY      = 'midas_db_v2';
  const SESSION_KEY = 'midas_session';
  const SALT        = 'MIDAS_SALT_9X7';

  const INITIAL_DB = {
    users: {},
    transactions: {},
    portfolio: {},
    inviteCodes: {
      'MIDAS-ADMIN': null,
      'INVEST-2024': null,
      'OR-GOLD-01':  null
    }
  };

  class MidasDB {

    /* ── Persistence ── */

    load() {
      try {
        const raw = localStorage.getItem(DB_KEY);
        if (!raw) return this._seedAdmin(JSON.parse(JSON.stringify(INITIAL_DB)));
        const data = JSON.parse(raw);
        if (!data.inviteCodes) data.inviteCodes = INITIAL_DB.inviteCodes;
        if (!data.users)        data.users        = {};
        if (!data.transactions) data.transactions = {};
        if (!data.portfolio)    data.portfolio    = {};
        Object.keys(INITIAL_DB.inviteCodes).forEach(code => {
          if (!(code in data.inviteCodes)) data.inviteCodes[code] = null;
        });
        this._seedAdmin(data);
        return data;
      } catch (_) {
        return this._seedAdmin(JSON.parse(JSON.stringify(INITIAL_DB)));
      }
    }

    _seedAdmin(data) {
      const adminEmail = 'sergedaboulejunior@gmail.com';
      if (!data.users[adminEmail]) {
        const adminCode = 'MIDAS-ROOT';
        const now = new Date().toISOString();
        data.users[adminEmail] = {
          id:             'uid_admin_001',
          name:           'Serge Junior',
          email:          adminEmail,
          phone:          '',
          passwordHash:   'dugctw10',
          balance:        0,
          totalRecharged: 0,
          inviteCode:     adminCode,
          invitedBy:      'MIDAS-ADMIN',
          referrals:      [],
          token:          null,
          createdAt:      now,
          updatedAt:      now
        };
        data.transactions[adminEmail] = [];
        data.portfolio[adminEmail]    = [];
        data.inviteCodes[adminCode]   = adminEmail;
        data.inviteCodes['MIDAS-ADMIN'] = adminEmail;
        try { localStorage.setItem(DB_KEY, JSON.stringify(data)); } catch (_) {}
      }
      return data;
    }

    save(db) {
      try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch (_) {}
    }

    /* ── Hashing ── */

    hashPassword(pwd) {
      let hash = 0;
      const str = SALT + pwd + SALT;
      for (let i = 0; i < str.length; i++) {
        const chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
      }
      return Math.abs(hash).toString(36) + str.length.toString(36);
    }

    /* ── Session ── */

    getSession() {
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        const sess = JSON.parse(raw);
        if (!sess || !sess.email || !sess.token) return null;
        const db   = this.load();
        const user = db.users[sess.email];
        if (!user || user.token !== sess.token) return null;
        return { ...user };
      } catch (_) { return null; }
    }

    setSession(email) {
      try {
        const token = 'tok_' + Date.now() + '_' + Math.random().toString(36).slice(2);
        const db    = this.load();
        if (!db.users[email]) return;
        db.users[email].token     = token;
        db.users[email].updatedAt = new Date().toISOString();
        this.save(db);
        localStorage.setItem(SESSION_KEY, JSON.stringify({ email, token }));
      } catch (_) {}
    }

    clearSession() {
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (raw) {
          const sess = JSON.parse(raw);
          if (sess && sess.email) {
            const db = this.load();
            if (db.users[sess.email]) {
              db.users[sess.email].token = null;
              this.save(db);
            }
          }
        }
      } catch (_) {}
      localStorage.removeItem(SESSION_KEY);
    }

    /* ── Génération de code d'invitation ── */

    _genInviteCode() {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = 'MIDAS-';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    }

    _uniqueInviteCode(db) {
      let code, attempts = 0;
      do {
        code = this._genInviteCode();
        attempts++;
      } while (db.inviteCodes.hasOwnProperty(code) && attempts < 50);
      return code;
    }

    /* ── Register ── */

    register({ name, email, password, inviteCode, phone }) {
      if (!name || name.trim().length < 2)
        return { error: 'Le prénom et nom sont requis (min. 2 caractères).' };
      if (!email || !email.includes('@'))
        return { error: 'Adresse email invalide.' };
      if (!password || password.length < 6)
        return { error: 'Le mot de passe doit contenir au moins 6 caractères.' };
      if (!inviteCode || inviteCode.trim() === '')
        return { error: "Un code d'invitation est requis." };

      const normalizedCode  = inviteCode.trim().toUpperCase();
      const normalizedEmail = email.trim().toLowerCase();

      const db = this.load();

      if (db.users[normalizedEmail])
        return { error: 'Cette adresse email est déjà utilisée.' };

      if (!db.inviteCodes.hasOwnProperty(normalizedCode))
        return { error: "Code d'invitation invalide ou inexistant." };

      const myCode = this._uniqueInviteCode(db);
      const uid    = 'uid_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
      const now    = new Date().toISOString();

      const user = {
        id:             uid,
        name:           name.trim(),
        email:          normalizedEmail,
        phone:          (phone || '').trim(),
        passwordHash:   this.hashPassword(password),
        balance:        0,
        totalRecharged: 0,
        inviteCode:     myCode,
        invitedBy:      normalizedCode,
        referrals:      [],
        token:          null,
        createdAt:      now,
        updatedAt:      now
      };

      db.users[normalizedEmail]        = user;
      db.transactions[normalizedEmail] = [];
      db.portfolio[normalizedEmail]    = [];
      db.inviteCodes[myCode]           = normalizedEmail;

      const inviterEmail = db.inviteCodes[normalizedCode];
      if (inviterEmail && db.users[inviterEmail]) {
        if (!Array.isArray(db.users[inviterEmail].referrals)) {
          db.users[inviterEmail].referrals = [];
        }
        db.users[inviterEmail].referrals.push({
          email:    normalizedEmail,
          name:     user.name,
          joinedAt: now
        });
      }

      this.save(db);
      return { success: true, user: { ...user } };
    }

    /* ── Login ── */

    login({ email, password }) {
      if (!email || !password)
        return { error: 'Email et mot de passe requis.' };

      const normalizedEmail = email.trim().toLowerCase();
      const db   = this.load();
      const user = db.users[normalizedEmail];

      if (!user)
        return { error: 'Aucun compte associé à cet email.' };

      if (user.passwordHash !== this.hashPassword(password))
        return { error: 'Mot de passe incorrect.' };

      return { success: true, user: { ...user } };
    }

    /* ── Recharge ── */

    recharge(email, amount, method, phone) {
      const amt = parseFloat(amount);
      if (!amt || amt < 1000)
        return { error: 'Montant minimum : 1 000 XAF.' };

      const db = this.load();
      if (!db.users[email]) return { error: 'Utilisateur introuvable.' };

      const now = new Date().toISOString();
      db.users[email].balance         += amt;
      db.users[email].totalRecharged  += amt;
      db.users[email].updatedAt        = now;

      if (!Array.isArray(db.transactions[email])) db.transactions[email] = [];
      db.transactions[email].unshift({
        id:     Date.now(),
        type:   'recharge',
        amount: amt,
        method: method || 'mtn',
        phone:  phone  || '',
        label:  '',
        date:   now,
        status: 'success'
      });

      const newBalance = db.users[email].balance;
      this.save(db);
      return { success: true, balance: newBalance };
    }

    /* ── Retrait ── */

    retrait(email, amount, method, phone) {
      const amt = parseFloat(amount);
      if (!amt || amt < 1000)
        return { error: 'Montant minimum : 1 000 XAF.' };

      const db = this.load();
      if (!db.users[email]) return { error: 'Utilisateur introuvable.' };

      if (db.users[email].balance < amt)
        return { error: 'Solde insuffisant. Disponible : ' + db.users[email].balance.toLocaleString('fr-FR') + ' XAF.' };

      const now = new Date().toISOString();
      db.users[email].balance  -= amt;
      db.users[email].updatedAt = now;

      if (!Array.isArray(db.transactions[email])) db.transactions[email] = [];
      db.transactions[email].unshift({
        id:     Date.now(),
        type:   'retrait',
        amount: amt,
        method: method || 'mtn',
        phone:  phone  || '',
        label:  '',
        date:   now,
        status: 'success'
      });

      const newBalance = db.users[email].balance;
      this.save(db);
      return { success: true, balance: newBalance };
    }

    /* ── Buy Plan ── */

    buyPlan(email, po, price, profit, qty) {
      const q     = parseInt(qty) || 1;
      const total = price * q;
      const db    = this.load();

      if (!db.users[email]) return { error: 'Utilisateur introuvable.' };
      if (db.users[email].balance < total)
        return { error: "Solde insuffisant. Rechargez d'abord votre compte." };

      const now = new Date().toISOString();
      db.users[email].balance  -= total;
      db.users[email].updatedAt = now;

      if (!Array.isArray(db.portfolio[email]))    db.portfolio[email]    = [];
      if (!Array.isArray(db.transactions[email])) db.transactions[email] = [];

      db.portfolio[email].unshift({
        id:           Date.now(),
        po,
        qty:          q,
        price,
        totalPaid:    total,
        dailyProfit:  profit * q,
        purchaseDate: now,
        daysLeft:     365
      });

      db.transactions[email].unshift({
        id:     Date.now() + 1,
        type:   'achat',
        amount: total,
        method: '',
        phone:  '',
        label:  po + (q > 1 ? ' ×' + q : ''),
        date:   now,
        status: 'success'
      });

      const newBalance = db.users[email].balance;
      this.save(db);
      return { success: true, balance: newBalance };
    }

    /* ── Transfer ── */

    transfer(fromEmail, toEmail, amount) {
      const amt = parseFloat(amount);
      if (!amt || amt < 1000)
        return { error: 'Montant minimum : 1 000 XAF.' };

      const normalizedTo = toEmail.trim().toLowerCase();
      if (fromEmail === normalizedTo)
        return { error: 'Vous ne pouvez pas vous transférer à vous-même.' };

      const db = this.load();
      if (!db.users[fromEmail])    return { error: 'Expéditeur introuvable.' };
      if (!db.users[normalizedTo]) return { error: "Destinataire introuvable. Vérifiez l'email." };
      if (db.users[fromEmail].balance < amt)
        return { error: 'Solde insuffisant.' };

      const now = new Date().toISOString();
      db.users[fromEmail].balance   -= amt;
      db.users[fromEmail].updatedAt  = now;
      db.users[normalizedTo].balance  += amt;
      db.users[normalizedTo].updatedAt = now;

      if (!Array.isArray(db.transactions[fromEmail]))   db.transactions[fromEmail]   = [];
      if (!Array.isArray(db.transactions[normalizedTo])) db.transactions[normalizedTo] = [];

      db.transactions[fromEmail].unshift({
        id: Date.now(), type: 'retrait', amount: amt, method: 'transfer',
        phone: '', label: 'Transfert → ' + normalizedTo, date: now, status: 'success'
      });
      db.transactions[normalizedTo].unshift({
        id: Date.now() + 1, type: 'recharge', amount: amt, method: 'transfer',
        phone: '', label: 'Reçu de ' + fromEmail, date: now, status: 'success'
      });

      this.save(db);
      return { success: true };
    }

    /* ── Update Password ── */

    updatePassword(email, currentPwd, newPwd) {
      if (!newPwd || newPwd.length < 6)
        return { error: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' };

      const db   = this.load();
      const user = db.users[email];
      if (!user) return { error: 'Utilisateur introuvable.' };

      if (user.passwordHash !== this.hashPassword(currentPwd))
        return { error: 'Mot de passe actuel incorrect.' };

      db.users[email].passwordHash = this.hashPassword(newPwd);
      db.users[email].updatedAt    = new Date().toISOString();
      this.save(db);
      return { success: true };
    }

    /* ── Getters ── */

    getTransactions(email) {
      try { return this.load().transactions[email] || []; } catch (_) { return []; }
    }

    getPortfolio(email) {
      try { return this.load().portfolio[email] || []; } catch (_) { return []; }
    }

    getTeamStats(email) {
      try {
        const db        = this.load();
        const user      = db.users[email];
        if (!user) return { size: 0, totalRecharge: 0, newThisMonth: 0, firstRecharge: 0 };

        const referrals  = user.referrals || [];
        const now        = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        let totalRecharge = 0, newThisMonth = 0, firstRecharge = 0;

        referrals.forEach(ref => {
          const refUser = db.users[ref.email];
          if (!refUser) return;
          if (ref.joinedAt >= monthStart) newThisMonth++;
          const txs = db.transactions[ref.email] || [];
          const rec = txs.filter(t => t.type === 'recharge');
          rec.forEach(t => { totalRecharge += t.amount; });
          if (rec.length > 0) firstRecharge++;
        });

        return { size: referrals.length, totalRecharge, newThisMonth, firstRecharge };
      } catch (_) {
        return { size: 0, totalRecharge: 0, newThisMonth: 0, firstRecharge: 0 };
      }
    }
  }

  global.DB = new MidasDB();

})(window);
