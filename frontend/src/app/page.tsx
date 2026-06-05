import Link from 'next/link';
import { ArrowRight, Shield, Zap, Globe, CreditCard, Smartphone, TrendingUp, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-bold text-xl text-blue-900">Neero</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-slate-600 hover:text-blue-900">Fonctionnalités</a>
              <a href="#how-it-works" className="text-sm text-slate-600 hover:text-blue-900">Comment ça marche</a>
              <a href="#security" className="text-sm text-slate-600 hover:text-blue-900">Sécurité</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-blue-900 hover:text-blue-800 px-4 py-2">
                Connexion
              </Link>
              <Link href="/register" className="text-sm font-medium bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
                S&apos;inscrire
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-sm px-3 py-1.5 rounded-full mb-6">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Plateforme financière #1 en Afrique de l&apos;Ouest</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Gérez votre argent<br />
              <span className="text-amber-400">en toute simplicité</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-xl">
              Envoyez, recevez et gérez votre argent avec Mobile Money, cartes virtuelles et transferts internationaux depuis une seule application.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-lg"
              >
                Créer un compte gratuit
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-lg border border-white/20"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '50K+', label: 'Utilisateurs actifs' },
              { value: '99.9%', label: 'Disponibilité' },
              { value: '50+', label: 'Pays couverts' },
              { value: '< 3s', label: 'Temps de réponse' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-amber-400">{stat.value}</div>
                <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Une plateforme complète pour toutes vos opérations financières
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Smartphone, title: 'Mobile Money', description: 'Dépôts et retraits via MTN Mobile Money, Orange Money et d\'autres opérateurs.', color: 'text-amber-600 bg-amber-50' },
              { icon: CreditCard, title: 'Cartes Virtuelles & Physiques', description: 'Générez une carte virtuelle instantanément pour vos achats en ligne.', color: 'text-blue-600 bg-blue-50' },
              { icon: Globe, title: 'Transferts Internationaux', description: 'Envoyez de l\'argent dans le monde entier avec des frais compétitifs.', color: 'text-green-600 bg-green-50' },
              { icon: TrendingUp, title: 'Multi-Devises', description: 'Gérez vos fonds en XOF, EUR, USD et plus de 10 devises.', color: 'text-purple-600 bg-purple-50' },
              { icon: Shield, title: 'Sécurité Maximale', description: 'Authentification 2FA, chiffrement des données et détection de fraude.', color: 'text-red-600 bg-red-50' },
              { icon: Zap, title: 'Transactions Instantanées', description: 'Transfers en temps réel avec confirmation immédiate.', color: 'text-indigo-600 bg-indigo-50' },
            ].map((feature) => (
              <div key={feature.title} className="p-6 bg-white rounded-xl border border-slate-200 card-hover">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Comment ça marche ?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Créez votre compte', description: 'Inscription en 2 minutes avec votre téléphone ou email. Vérification OTP rapide.' },
              { step: '02', title: 'Alimentez votre wallet', description: 'Déposez via Mobile Money (MTN, Orange) ou virement bancaire.' },
              { step: '03', title: 'Envoyez et payez', description: 'Transférez, payez vos factures, ou achetez en ligne avec votre carte virtuelle.' },
            ].map((step) => (
              <div key={step.step} className="text-center p-6">
                <div className="w-14 h-14 bg-blue-900 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Votre sécurité est notre priorité
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Neero utilise les meilleures technologies de sécurité pour protéger vos données et transactions.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Authentification 2FA', desc: 'Code OTP + application d\'authentification TOTP' },
                  { title: 'Chiffrement SSL/TLS', desc: 'Toutes les communications sont chiffrées' },
                  { title: 'Vérification KYC', desc: 'Processus rigoureux de vérification d\'identité' },
                  { title: 'Détection de fraude', desc: 'Surveillance en temps réel des transactions suspectes' },
                  { title: 'Conformité réglementaire', desc: 'Respect des normes AML/CFT en vigueur' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-8 text-white">
              <Shield className="w-12 h-12 text-amber-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Certifié & Conforme</h3>
              <p className="text-blue-200">Neero est conforme aux réglementations financières applicables dans tous les pays d&apos;opération.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-xl text-blue-100 mb-8">Rejoignez des milliers d&apos;utilisateurs qui font confiance à Neero</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors"
          >
            Créer mon compte gratuitement
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">N</span>
              </div>
              <span className="font-bold text-white">Neero</span>
            </div>
            <p className="text-sm">© 2024 Neero. Tous droits réservés.</p>
            <div className="flex gap-6">
              <a href="#" className="text-sm hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="text-sm hover:text-white transition-colors">CGU</a>
              <a href="#" className="text-sm hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
