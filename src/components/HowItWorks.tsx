import { MessageSquare, Target, Rocket, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    number: '01',
    title: 'On se parle',
    description: 'Réservez un appel découverte gratuit de 30 minutes. On discute de votre projet, vos besoins et vos objectifs sans engagement.',
  },
  {
    icon: Target,
    number: '02',
    title: 'Je propose un plan',
    description: "Sous 48h, vous recevez un devis détaillé et un plan d'action clair avec les livrables, les délais et le budget.",
  },
  {
    icon: Rocket,
    number: '03',
    title: 'On travaille ensemble',
    description: "Dès votre accord, je me mets au travail. Vous êtes informé à chaque étape et restez maître du projet.",
  },
  {
    icon: CheckCircle2,
    number: '04',
    title: 'Vous obtenez des résultats',
    description: "Livraison dans les délais, avec un accompagnement post-projet pour que vous soyez 100% autonome.",
  },
];

export default function HowItWorks() {
  return (
    <section id="comment" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">Le processus</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Comment ça marche</h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Un processus simple et transparent, du premier contact jusqu&apos;aux résultats.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent z-0 -translate-y-1/2" />
                )}
                <div className="relative bg-white rounded-3xl p-6 border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
                      <Icon size={22} className="text-white" />
                    </div>
                    <span className="text-4xl font-black text-slate-100 leading-none mt-1">{step.number}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
