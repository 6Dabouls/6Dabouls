import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VisaCardApplication from '@/components/VisaCardApplication';
import { CreditCard, Truck, Globe, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Carte Visa Prépayée Gratuite | Serge Daboule',
  description: "Obtenez votre carte Visa prépayée gratuite en quelques minutes. Acceptée partout dans le monde, sans frais cachés, livrée sous 5-7 jours.",
};

const benefits = [
  {
    icon: CreditCard,
    title: 'Carte 100% gratuite',
    desc: 'Aucun frais de création ni de tenue de compte.',
  },
  {
    icon: Truck,
    title: 'Livraison 5-7 jours',
    desc: "Reçue chez vous en moins d'une semaine.",
  },
  {
    icon: Globe,
    title: 'Acceptée partout',
    desc: 'Visa partout dans le monde, en ligne et en magasin.',
  },
  {
    icon: ShieldCheck,
    title: 'Sans frais cachés',
    desc: 'Ce que vous voyez est ce que vous payez : rien.',
  },
];

export default function CarteVisaPage() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">
              Offre exclusive
            </span>
            <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-slate-900">
              Votre carte Visa prépayée,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                gratuite
              </span>
            </h1>
            <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
              Remplissez le formulaire en 4 étapes. Votre carte vous sera envoyée
              sous 5 à 7 jours ouvrés, sans aucun frais.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-slate-200 shadow-sm"
              >
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-3">
                  <Icon size={20} className="text-indigo-600" />
                </div>
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Multi-step form */}
          <VisaCardApplication />
        </div>
      </div>
      <Footer />
    </main>
  );
}
