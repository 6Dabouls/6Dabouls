'use strict';

/* ═══════════════════════════════════════════
   MIDAS INVEST — Frontend API Client
   Toutes les données viennent du backend.
   Clé session : localStorage 'midas_token'
═══════════════════════════════════════════ */
(function (global) {

  const TOKEN_KEY = 'midas_token';
  const USER_KEY  = 'midas_user_cache';

  const API = {

    /* ── Session locale ── */
    getToken()  { return localStorage.getItem(TOKEN_KEY); },
    setToken(t) { localStorage.setItem(TOKEN_KEY, t); },
    clearToken(){ localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); },

    getCachedUser() {
      try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch (_) { return null; }
    },
    cacheUser(u) {
      if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    },

    /* ── HTTP helper ── */
    async req(endpoint, opts = {}) {
      const token   = this.getToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = 'Bearer ' + token;

      try {
        const res  = await fetch('/api' + endpoint, {
          method:  opts.method || 'GET',
          headers,
          body:    opts.body !== undefined ? JSON.stringify(opts.body) : undefined
        });
        const data = await res.json();
        return data;
      } catch (err) {
        console.error('[API]', endpoint, err.message);
        return { error: 'Erreur réseau. Vérifiez votre connexion.' };
      }
    },

    /* ── Auth ── */
    async login(email, password) {
      const r = await this.req('/auth/login', { method: 'POST', body: { email, password } });
      if (r.token) { this.setToken(r.token); this.cacheUser(r.user); }
      return r;
    },

    async register({ name, email, password, inviteCode, phone }) {
      const r = await this.req('/auth/register', { method: 'POST', body: { name, email, password, inviteCode, phone } });
      if (r.token) { this.setToken(r.token); this.cacheUser(r.user); }
      return r;
    },

    async getUser() {
      const r = await this.req('/auth/me');
      if (r.user) this.cacheUser(r.user);
      return r;
    },

    logout() {
      this.clearToken();
      window.location.href = 'auth.html';
    },

    isLoggedIn() { return !!this.getToken(); },

    async isAdmin() {
      const u = this.getCachedUser();
      return !!(u && u.isAdmin);
    },

    /* ── User data ── */
    async getTransactions() { return this.req('/user/transactions'); },
    async getPortfolio()    { return this.req('/user/portfolio'); },
    async getTeam()         { return this.req('/user/team'); },

    async updatePassword(currentPassword, newPassword) {
      return this.req('/user/password', { method: 'POST', body: { currentPassword, newPassword } });
    },

    /* ── Paiements ── */
    async initRecharge(amount, method, phone) {
      return this.req('/payment/recharge', { method: 'POST', body: { amount, method, phone } });
    },

    async checkPaymentStatus(reference) {
      return this.req('/payment/status/' + reference);
    },

    async retrait(amount, method, phone) {
      return this.req('/payment/retrait', { method: 'POST', body: { amount, method, phone } });
    },

    async buyPlan(po, price, profit, qty) {
      const r = await this.req('/payment/buy', { method: 'POST', body: { po, price, profit, qty } });
      if (r.success) {
        const u = this.getCachedUser();
        if (u) { u.balance = r.balance; this.cacheUser(u); }
      }
      return r;
    },

    async transfer(toEmail, amount) {
      return this.req('/payment/transfer', { method: 'POST', body: { toEmail, amount } });
    },

    /* ── Admin ── */
    admin: {
      async stats()               { return API.req('/admin/stats'); },
      async users()               { return API.req('/admin/users'); },
      async transactions(type)    { return API.req('/admin/transactions' + (type && type !== 'all' ? '?type=' + type : '')); },
      async codes()               { return API.req('/admin/codes'); },
      async credit(targetEmail, amount, note) {
        return API.req('/admin/credit', { method: 'POST', body: { targetEmail, amount, note } });
      },
      async debit(targetEmail, amount, note) {
        return API.req('/admin/debit', { method: 'POST', body: { targetEmail, amount, note } });
      },
      async generateCode() { return API.req('/admin/generate-code', { method: 'POST', body: {} }); }
    }
  };

  global.API = API;

})(window);
