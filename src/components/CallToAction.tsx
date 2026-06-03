import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';

export default function CallToAction() {
  return (
    <section className="py-24 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Calendar size={48} className="text-indigo-300 mx-auto mb-6" />
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
          Votre projet mérite un expert.{' '}
          <span className="text-indigo-200">Parlons-en maintenant.</span>
        </h2>
        <p className="mt-6 text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
          Un appel de 30 minutes, gratuit et sans engagement.
          Vous repartez avec de la clarté, peu importe si on travaille ensemble ou non.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/booking"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-xl hover:shadow-2xl active:scale-95 text-lg"
          >
            Réserver mon appel gratuit
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="mailto:sergedaboulejunior@gmail.com"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/20 text-lg"
          >
            Envoyer un email
          </a>
        </div>
        <p className="mt-6 text-indigo-200 text-sm">
          Réponse garantie sous 24h · Aucune carte de crédit requise
        </p>
      </div>
    </section>
  );
}
