import Link from 'next/link';
import { Code2, Lightbulb, Camera, TrendingUp, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Code2,
    title: 'Développement Web',
    description: 'Sites vitrine, applications web, e-commerce. Du design à la mise en ligne, je gère tout.',
    features: ['Site vitrine sur mesure', 'Application web', 'E-commerce', 'Refonte & optimisation'],
    from: 'À partir de 800€',
    color: 'indigo',
  },
  {
    icon: Lightbulb,
    title: 'Coaching & Consulting',
    description: "Accompagnement personnalisé pour débloquer vos projets, clarifier votre stratégie et passer à l'action.",
    features: ['Session découverte gratuite', "Plan d'action concret", 'Suivi hebdomadaire', 'Ressources exclusives'],
    from: 'À partir de 150€/session',
    color: 'purple',
  },
  {
    icon: Camera,
    title: 'Photographie',
    description: 'Photos professionnelles pour votre marque, vos événements ou votre portfolio personnel.',
    features: ['Portrait professionnel', 'Photo événementielle', 'Photo produit', 'Retouche incluse'],
    from: 'À partir de 300€',
    color: 'pink',
  },
  {
    icon: TrendingUp,
    title: 'Stratégie Digitale',
    description: "Audit, positionnement, acquisition clients. Je vous aide à trouver vos premiers clients en ligne.",
    features: ['Audit de visibilité', 'Stratégie de contenu', 'SEO & réseaux sociaux', 'Formation & autonomie'],
    from: 'À partir de 500€',
    color: 'emerald',
  },
];

const colorMap: Record<string, string> = {
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white',
  purple: 'bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-600 group-hover:text-white',
  pink: 'bg-pink-50 text-pink-600 border-pink-100 group-hover:bg-pink-600 group-hover:text-white',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white',
};

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">Ce que je fais</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Mes services</h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Des prestations sur mesure, pensées pour vous donner des résultats rapides sans perdre de temps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.title} className="group relative p-8 bg-white border border-slate-200 rounded-3xl hover:border-slate-300 hover:shadow-xl transition-all duration-300">
                <div className={`inline-flex p-3 rounded-2xl border transition-all duration-300 ${colorMap[service.color]}`}>
                  <Icon size={24} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900">{service.title}</h3>
                <p className="mt-2 text-slate-500 leading-relaxed">{service.description}</p>
                <ul className="mt-4 space-y-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-semibold text-indigo-600">{service.from}</span>
                  <Link href="/booking" className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors">
                    En savoir plus <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
