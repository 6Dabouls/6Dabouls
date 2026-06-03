import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Marie L.',
    role: 'Fondatrice, Studio Créatif',
    content: 'Serge a transformé ma vision en un site web magnifique en 3 semaines. Résultat : 2 nouveaux clients en moins d\'un mois après le lancement. Je recommande à 100% !',
    stars: 5,
    initials: 'ML',
    color: 'from-indigo-400 to-purple-500',
  },
  {
    name: 'Thomas B.',
    role: 'Consultant RH indépendant',
    content: 'Le coaching de Serge a été décisif pour moi. En 6 sessions, j\'ai clarifié ma proposition de valeur et décroché 3 nouveaux contrats. Un investissement rentabilisé dès le premier mois.',
    stars: 5,
    initials: 'TB',
    color: 'from-purple-400 to-pink-500',
  },
  {
    name: 'Aïcha M.',
    role: 'Artisane, Bijoux Fait-Main',
    content: 'Avant de travailler avec Serge, je galérais à me faire connaître. Il a tout géré : site, photos, stratégie Instagram. Aujourd\'hui je gère mes commandes à plein temps. Merci !',
    stars: 5,
    initials: 'AM',
    color: 'from-pink-400 to-rose-500',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">Témoignages</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Ce que disent mes clients</h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Des vrais retours de personnes qui ont fait confiance à mon travail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="relative p-8 bg-slate-50 rounded-3xl border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all">
              <Quote size={32} className="text-indigo-200 mb-4" />
              <div className="flex mb-3">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 leading-relaxed italic">&ldquo;{t.content}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-xs font-bold">{t.initials}</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
