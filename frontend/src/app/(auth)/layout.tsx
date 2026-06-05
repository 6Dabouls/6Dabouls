import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="text-2xl font-bold">Neero</span>
          </Link>
        </div>
        <div className="relative">
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Votre argent,<br />
            <span className="text-amber-400">votre liberté</span>
          </h2>
          <p className="text-blue-200 text-lg">
            Gérez vos finances en toute simplicité avec Mobile Money, cartes et transferts internationaux.
          </p>
          <div className="mt-8 space-y-3">
            {[
              'Dépôts et retraits Mobile Money',
              'Transferts internationaux instantanés',
              'Carte virtuelle pour payer en ligne',
              'Sécurité bancaire niveau entreprise',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-blue-100">
                <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex items-center gap-2 text-blue-200 text-sm">
          <Shield className="w-4 h-4" />
          <span>Conforme aux réglementations financières locales et internationales</span>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-xl font-bold text-blue-900">Neero</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
