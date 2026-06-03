import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingForm from '@/components/BookingForm';
import { Mail, Clock, Shield, Phone } from 'lucide-react';

export const metadata = {
  title: 'Réserver un appel | Serge Daboule',
  description: "Réservez votre appel découverte gratuit de 30 minutes. Parlons de votre projet sans engagement.",
};

export default function BookingPage() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">Contact</span>
            <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-slate-900">
              Réservez votre appel gratuit
            </h1>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              30 minutes pour discuter de votre projet, vos besoins et voir comment je peux vous aider.
              Sans engagement, sans pression.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Info sidebar */}
            <div className="lg:col-span-2 space-y-4">
              {/* Info cards */}
              {[
                {
                  icon: Clock,
                  title: 'Réponse rapide',
                  desc: 'Je vous réponds sous 24h pour fixer un créneau qui vous convient.',
                },
                {
                  icon: Shield,
                  title: 'Sans engagement',
                  desc: "L'appel découverte est 100% gratuit. Aucune obligation de suite.",
                },
                {
                  icon: Phone,
                  title: 'Par visio ou téléphone',
                  desc: 'On choisit ensemble le format qui vous convient le mieux.',
                },
                {
                  icon: Mail,
                  title: 'Contact direct',
                  desc: 'Préférez-vous écrire ? sergedaboulejunior@gmail.com',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Icon size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}

              {/* Testimonial snippet */}
              <div className="p-5 bg-indigo-600 rounded-2xl text-white">
                <p className="text-indigo-100 text-sm italic leading-relaxed">
                  &quot;L&apos;appel avec Serge m&apos;a donné plus de clarté en 30 minutes que 6 mois à tourner en rond. Je recommande vivement.&quot;
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">JD</span>
                  </div>
                  <span className="text-xs text-indigo-200">Jean D., Entrepreneur</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Envoyez votre demande</h2>
              <BookingForm />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
