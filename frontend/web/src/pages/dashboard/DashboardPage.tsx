import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { TrendingUp, Briefcase, DollarSign, Activity, ArrowRight, AlertCircle } from 'lucide-react'
import { portfolioApi, projectsApi } from '../../services/api'
import { RootState } from '../../store'
import { PortfolioSummary, Project } from '../../types'
import StatCard from '../../components/ui/StatCard'
import ProjectCard from '../../components/projects/ProjectCard'
import Spinner from '../../components/ui/Spinner'

function fmt(n: number) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' FCFA'
}

export default function DashboardPage() {
  const { user } = useSelector((s: RootState) => s.auth)
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null)
  const [featured, setFeatured] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      portfolioApi.getSummary().then(r => setPortfolio(r.data)),
      projectsApi.getFeatured().then(r => setFeatured(r.data)),
    ]).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {user?.firstName} 👋
        </h1>
        <p className="text-gray-500">Voici un aperçu de votre portefeuille</p>
      </div>

      {user?.kycStatus !== 'approved' && (
        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span className="text-sm">
            Complétez votre vérification KYC pour investir.{' '}
            <Link to="/kyc" className="underline font-medium">Vérifier maintenant</Link>
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Capital investi"
          value={fmt(portfolio?.totalInvested || 0)}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          label="Revenus générés"
          value={fmt(portfolio?.totalReturns || 0)}
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          label="Valeur nette"
          value={fmt(portfolio?.netValue || 0)}
          icon={Activity}
          color="purple"
        />
        <StatCard
          label="Investissements actifs"
          value={portfolio?.activeInvestments || 0}
          icon={Briefcase}
          color="yellow"
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { to: '/projects', label: 'Explorer les projets', emoji: '🌱' },
          { to: '/portfolio', label: 'Mon portefeuille', emoji: '📊' },
          { to: '/payments', label: 'Dépôt / Retrait', emoji: '💳' },
          { to: '/kyc', label: 'Vérification KYC', emoji: '🔐' },
        ].map(({ to, label, emoji }) => (
          <Link key={to} to={to}
            className="flex flex-col items-center gap-2 p-4 card hover:shadow-md transition-shadow text-center">
            <span className="text-2xl">{emoji}</span>
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </Link>
        ))}
      </div>

      {/* Featured projects */}
      {featured.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Projets à la une</h2>
            <Link to="/projects" className="flex items-center gap-1 text-primary-600 text-sm hover:underline">
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.slice(0, 3).map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
