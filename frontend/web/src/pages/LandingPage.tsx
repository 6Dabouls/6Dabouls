import { Link } from 'react-router-dom'
import { Leaf, Sun, Wind, Droplets, TrendingUp, Shield, Globe, ArrowRight, CheckCircle } from 'lucide-react'

export default function LandingPage() {
  const stats = [
    { value: '150+', label: 'Projets financés' },
    { value: '12 500+', label: 'Investisseurs' },
    { value: '€45M+', label: 'Fonds levés' },
    { value: '8.5%', label: 'Rendement moyen' },
  ]

  const features = [
    { icon: Sun, title: 'Solaire', desc: 'Centrales photovoltaïques en Afrique de l\'Ouest et du Nord', color: 'text-yellow-500 bg-yellow-50' },
    { icon: Wind, title: 'Éolien', desc: 'Parcs éoliens onshore dans des zones à fort potentiel', color: 'text-blue-500 bg-blue-50' },
    { icon: Droplets, title: 'Hydraulique', desc: 'Micro-centrales hydroélectriques sur cours d\'eau', color: 'text-cyan-500 bg-cyan-50' },
    { icon: Leaf, title: 'Biomasse', desc: 'Valorisation des déchets agricoles et forestiers', color: 'text-green-500 bg-green-50' },
  ]

  const benefits = [
    'Investissez à partir de 50 000 FCFA',
    'Rendements de 6 à 14% par an',
    'Transparence totale sur les projets',
    'Impact environnemental mesurable',
    'Distribution automatique des revenus',
    'Plateforme sécurisée et réglementée',
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Leaf size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">GreenInvest</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary text-sm py-1.5 px-4">Connexion</Link>
            <Link to="/register" className="btn-primary text-sm py-1.5 px-4">Commencer</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Leaf size={14} /> Investissement vert et rentable
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Financez la transition<br />
            <span className="text-primary-600">énergétique africaine</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Investissez dans des projets d'énergies renouvelables, suivez vos rendements en temps réel 
            et contribuez à un avenir durable.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary text-base px-8 py-3 flex items-center gap-2">
              Commencer à investir <ArrowRight size={16} />
            </Link>
            <Link to="/projects" className="btn-secondary text-base px-8 py-3">
              Voir les projets
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary-600">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center text-white">
              <div className="text-3xl font-bold">{value}</div>
              <div className="text-primary-100 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Energy types */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">Types de projets</h2>
          <p className="text-center text-gray-500 mb-12">Diversifiez vos investissements sur plusieurs technologies</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir GreenInvest ?
            </h2>
            <p className="text-gray-500 mb-8">
              Une plateforme transparente, sécurisée et rentable pour financer la révolution énergétique.
            </p>
            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle size={18} className="text-primary-500 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Shield, title: 'Sécurisé', desc: 'KYC/AML, chiffrement et conformité réglementaire' },
              { icon: TrendingUp, title: 'Rentable', desc: 'Rendements de 6 à 14% selon les projets' },
              { icon: Globe, title: 'Impact', desc: 'Réduction des émissions de CO₂ mesurable' },
              { icon: Leaf, title: 'Durable', desc: 'Projets certifiés et suivis de bout en bout' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-4">
                <Icon size={24} className="text-primary-600 mb-2" />
                <h4 className="font-semibold text-sm mb-1">{title}</h4>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary-600 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Prêt à investir ?</h2>
        <p className="text-primary-100 mb-8 max-w-xl mx-auto">
          Rejoignez plus de 12 000 investisseurs qui font fructifier leur épargne tout en contribuant à l'avenir de la planète.
        </p>
        <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors">
          Créer mon compte <ArrowRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Leaf size={14} className="text-primary-600" />
            <span>© 2025 GreenInvest – Tous droits réservés</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900">Mentions légales</a>
            <a href="#" className="hover:text-gray-900">Confidentialité</a>
            <a href="#" className="hover:text-gray-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
