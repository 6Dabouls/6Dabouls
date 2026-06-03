'use client';
import { useState, FormEvent } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

const services = [
  'Développement Web',
  'Coaching & Consulting',
  'Photographie',
  'Stratégie Digitale',
  'Autre / Je ne sais pas encore',
];

const budgets = [
  'Moins de 500€',
  '500€ - 1 000€',
  '1 000€ - 3 000€',
  'Plus de 3 000€',
  'À discuter',
];

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function BookingForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({
    name: '',
    email: '',
    service: '',
    budget: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Use Formspree — replace YOUR_FORM_ID with your actual Formspree form ID
    // Sign up free at https://formspree.io to get a form ID
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

    // Fallback: open mailto if Formspree is not configured
    if (FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
      const subject = encodeURIComponent(`[Réservation] ${form.service || 'Nouveau projet'} - ${form.name}`);
      const body = encodeURIComponent(
        `Nom: ${form.name}\nEmail: ${form.email}\nService: ${form.service}\nBudget: ${form.budget}\n\nMessage:\n${form.message}`
      );
      window.location.href = `mailto:sergedaboulejunior@gmail.com?subject=${subject}&body=${body}`;
      setStatus('success');
      return;
    }

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', service: '', budget: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-16 px-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">Message envoyé !</h3>
        <p className="text-slate-500 max-w-sm mx-auto">
          Merci pour votre message. Je vous répondrai sous 24h pour fixer notre appel.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-8 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Votre nom *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Marie Dupont"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="marie@exemple.com"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Service souhaité *</label>
        <select
          name="service"
          value={form.service}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900 bg-white"
        >
          <option value="">Choisissez un service</option>
          {services.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Budget envisagé</label>
        <select
          name="budget"
          value={form.budget}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900 bg-white"
        >
          <option value="">Sélectionnez une fourchette</option>
          {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Décrivez votre projet *</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Parlez-moi de votre projet, vos objectifs, où vous en êtes actuellement..."
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400 resize-none"
        />
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          <AlertCircle size={16} />
          Une erreur s&apos;est produite. Veuillez réessayer ou m&apos;écrire directement à sergedaboulejunior@gmail.com
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-lg"
      >
        {status === 'loading' ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send size={20} />
            Envoyer ma demande
          </>
        )}
      </button>

      <p className="text-center text-xs text-slate-400">
        En envoyant ce formulaire, vous acceptez d&apos;être contacté par email. Pas de spam, promis.
      </p>
    </form>
  );
}
