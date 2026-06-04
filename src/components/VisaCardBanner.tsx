import Link from 'next/link';
import { CreditCard, ArrowRight } from 'lucide-react';

export default function VisaCardBanner() {
  return (
    <section className="py-12 bg-gradient-to-r from-indigo-600 to-indigo-700">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <CreditCard size={24} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg">Carte Visa Prépayée — 100% Gratuite</p>
            <p className="text-indigo-200 text-sm">Acceptée partout · Livraison 5-7j · Zéro frais caché</p>
          </div>
        </div>
        <Link
          href="/carte-visa"
          className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-lg active:scale-95"
        >
          Faire ma demande <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
