import { ExternalLink } from 'lucide-react';

const projects = [
  {
    title: 'Refonte Site E-commerce',
    category: 'Développement Web',
    description: '+40% de conversions après refonte UX complète.',
    gradient: 'from-indigo-500 to-purple-600',
    tag: 'E-commerce',
  },
  {
    title: 'Coaching Lancement Produit',
    category: 'Coaching',
    description: "Accompagnement d'un entrepreneur du 0 au premier client en 6 semaines.",
    gradient: 'from-purple-500 to-pink-600',
    tag: 'Coaching',
  },
  {
    title: 'Identité Visuelle & Photos',
    category: 'Photographie',
    description: 'Shooting complet + charte graphique pour une marque locale.',
    gradient: 'from-pink-500 to-red-500',
    tag: 'Photo',
  },
  {
    title: 'Application de Gestion',
    category: 'Développement Web',
    description: 'Dashboard sur mesure pour automatiser les tâches répétitives.',
    gradient: 'from-emerald-500 to-teal-600',
    tag: 'App Web',
  },
  {
    title: 'Stratégie Acquisition',
    category: 'Stratégie Digitale',
    description: '0 à 1000 abonnés qualifiés en 3 mois avec un budget minimal.',
    gradient: 'from-amber-500 to-orange-600',
    tag: 'Digital',
  },
  {
    title: 'Site Vitrine Premium',
    category: 'Développement Web',
    description: 'Site vitrine élégant avec réservation en ligne pour un consultant.',
    gradient: 'from-blue-500 to-indigo-600',
    tag: 'Site Vitrine',
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">Mon travail</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Projets récents</h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Des projets concrets, des clients satisfaits, des résultats mesurables.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.title} className="group relative overflow-hidden rounded-3xl border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className={`h-48 bg-gradient-to-br ${project.gradient} flex items-end p-6`}>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">
                  {project.tag}
                </span>
              </div>
              <div className="p-6 bg-white">
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">{project.category}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{project.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{project.description}</p>
                <button className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                  Voir le détail <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
