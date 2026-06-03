'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Comment se passe le premier appel ?',
    a: "C'est un échange informel de 30 minutes, gratuit et sans engagement. On parle de votre projet, vos besoins et vos objectifs. À la fin, je vous donne une première recommandation et on voit si on peut travailler ensemble.",
  },
  {
    q: 'Quels sont vos délais habituels ?',
    a: 'Pour un site vitrine : 1 à 3 semaines. Pour une application web : 4 à 8 semaines. Pour une session de coaching : dès la semaine suivante. Je suis transparent sur les délais et je les respecte.',
  },
  {
    q: 'Est-ce que vous travaillez à distance ?',
    a: "Oui, à 100%. J'ai l'habitude de travailler en remote avec des clients partout en France et à l'international. Les échanges se font par visio, email et outils collaboratifs.",
  },
  {
    q: 'Comment se passe le paiement ?',
    a: 'En général, 50% à la commande, 50% à la livraison. Pour les projets longs, on peut étaler les paiements. Je facture en euros, par virement bancaire ou PayPal.',
  },
  {
    q: 'Proposez-vous une garantie ?',
    a: "Oui. Si le livrable ne correspond pas au cahier des charges validé ensemble, je retravaille gratuitement jusqu'à satisfaction. Votre satisfaction est ma priorité.",
  },
  {
    q: 'Puis-je vous contacter pour un projet urgent ?',
    a: "Bien sûr. Mentionnez-le dans votre demande et je ferai de mon mieux pour m'adapter. Des tarifs urgence peuvent s'appliquer selon la disponibilité.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">Questions fréquentes</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Vous avez des questions ?</h2>
          <p className="mt-4 text-lg text-slate-500">Voici les réponses aux questions les plus posées.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-slate-900 pr-4">{faq.q}</span>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 text-slate-400 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100">
                  <p className="pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
