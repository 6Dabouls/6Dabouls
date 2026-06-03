import Link from 'next/link';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Disponible pour de nouveaux projets
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Des résultats concrets,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              pas des promesses
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Freelance spécialisé en développement, coaching et conseil.
            Je transforme vos idées en projets concrets — rapidement, efficacement, et sans vous noyer dans la technique.
          </p>

          {/* Value props */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {['Réponse sous 24h', 'Premier appel gratuit', 'Résultats garantis'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-slate-300 text-sm">
                <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/booking" className="group flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-500 transition-all hover:shadow-2xl hover:shadow-indigo-500/30 active:scale-95 text-lg">
              Réserver un appel gratuit
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#services" className="px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all border border-white/10 text-lg">
              Voir mes services
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[
              { value: '50+', label: 'Projets livrés' },
              { value: '98%', label: 'Clients satisfaits' },
              { value: '5 ans', label: "D'expérience" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-extrabold text-white">{value}</div>
                <div className="text-sm text-slate-400 mt-1">{label}</div>
              </div>
            ))}
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => <Star key={i} size={18} className="fill-amber-400 text-amber-400" />)}
              <span className="ml-2 text-slate-300 text-sm">5/5 sur 30+ avis</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
