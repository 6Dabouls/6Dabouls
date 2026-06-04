import Link from 'next/link';
import { Check, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Découverte',
    price: 'Gratuit',
    period: '',
    description: 'Pour faire connaissance et voir si on peut travailler ensemble.',
    features: [
      'Appel de 30 minutes',
      'Analyse de votre situation',
      'Recommandations initiales',
      'Sans engagement',
    ],
    cta: 'Réserver maintenant',
    highlight: false,
  },
  {
    name: 'Projet',
    price: '500€',
    period: '/ projet',
    description: 'Pour un projet ciblé avec des livrables clairs et un budget maîtrisé.',
    features: [
      'Périmètre défini ensemble',
      'Livrables clairs et datés',
      'Révisions incluses',
      'Suivi post-livraison 30j',
      'Accès prioritaire',
    ],
    cta: 'Démarrer un projet',
    highlight: true,
    badge: 'Le plus populaire',
  },
  {
    name: 'Sur mesure',
    price: 'Devis',
    period: 'personnalisé',
    description: 'Pour des projets complexes ou un accompagnement long terme.',
    features: [
      'Tout ce qui précède',
      'Accompagnement mensuel',
      'Accès illimité par email',
      'Revues stratégiques',
      'Tarif préférentiel',
    ],
    cta: 'Me contacter',
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="tarifs" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-indigo-400 font-semibold text-sm uppercase tracking-widest">Investissement</span>
          <h2 className="mt-3 text-4xl font-extrabold text-white">Des tarifs clairs et honnêtes</h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Pas de surprise, pas de frais cachés. Vous savez exactement ce que vous obtenez.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all ${
                plan.highlight
                  ? 'bg-indigo-600 border-indigo-500 shadow-2xl shadow-indigo-500/20 scale-105'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 px-4 py-1.5 bg-amber-400 text-amber-900 text-xs font-bold rounded-full shadow-lg">
                    <Zap size={12} /> {plan.badge}
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h3 className={`text-lg font-bold ${plan.highlight ? 'text-white' : 'text-slate-100'}`}>{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  {plan.period && <span className={`text-sm ${plan.highlight ? 'text-indigo-200' : 'text-slate-400'}`}>{plan.period}</span>}
                </div>
                <p className={`mt-3 text-sm leading-relaxed ${plan.highlight ? 'text-indigo-100' : 'text-slate-400'}`}>{plan.description}</p>
              </div>

              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check size={16} className={`flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-indigo-200' : 'text-indigo-400'}`} />
                    <span className={`text-sm ${plan.highlight ? 'text-indigo-100' : 'text-slate-300'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/booking"
                className={`block text-center py-3.5 px-6 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                  plan.highlight
                    ? 'bg-white text-indigo-700 hover:bg-slate-50 shadow-lg'
                    : 'bg-slate-700 text-white hover:bg-slate-600 border border-slate-600'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
