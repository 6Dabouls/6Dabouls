import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { portfolioApi } from '../../services/api'
import { PortfolioSummary, Investment } from '../../types'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import Spinner from '../../components/ui/Spinner'
import { TrendingUp, Briefcase, DollarSign, Activity } from 'lucide-react'

function fmt(n: number) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)
}

const COLORS = ['#22c55e', '#3b82f6', '#06b6d4', '#a855f7', '#f59e0b']

export default function PortfolioPage() {
  const [data, setData] = useState<PortfolioSummary | null>(null)
  const [returns, setReturns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      portfolioApi.getSummary().then(r => setData(r.data)),
      portfolioApi.getReturns({ limit: 12 }).then(r => setReturns(r.data[0] || [])),
    ]).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  const pieData = Object.entries(data?.byEnergyType || {}).map(([name, value]) => ({
    name: name === 'solar' ? 'Solaire' : name === 'wind' ? 'Éolien' : name === 'hydro' ? 'Hydraulique' : name === 'biomass' ? 'Biomasse' : name,
    value: Number(value),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon portefeuille</h1>
        <p className="text-gray-500">Suivez vos investissements et rendements</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Capital investi" value={`${fmt(data?.totalInvested || 0)} FCFA`} icon={DollarSign} color="green" />
        <StatCard label="Revenus reçus" value={`${fmt(data?.totalReturns || 0)} FCFA`} icon={TrendingUp} color="blue" />
        <StatCard label="Valeur nette" value={`${fmt(data?.netValue || 0)} FCFA`} icon={Activity} color="purple" />
        <StatCard label="Rendement moyen" value={`${data?.averageAnnualReturn?.toFixed(1) || 0}%`} icon={Briefcase} color="yellow" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Allocation chart */}
        <div className="card">
          <h3 className="font-semibold mb-4">Répartition par énergie</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `${fmt(v)} FCFA`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-400">Aucun investissement</div>
          )}
          <div className="flex flex-wrap gap-3 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span>{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Returns history */}
        <div className="card">
          <h3 className="font-semibold mb-4">Derniers rendements</h3>
          {returns.length > 0 ? (
            <div className="space-y-3 max-h-56 overflow-y-auto">
              {returns.map((r: any) => (
                <div key={r.id} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium">{r.project?.name}</div>
                    <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <span className="font-semibold text-primary-600">+{fmt(r.amount)} FCFA</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center text-gray-400">Aucun rendement pour le moment</div>
          )}
        </div>
      </div>

      {/* Active investments */}
      <div className="card">
        <h3 className="font-semibold mb-4">Mes investissements actifs ({data?.activeInvestments || 0})</h3>
        {!data?.investments?.length ? (
          <div className="text-center text-gray-400 py-8">Aucun investissement actif</div>
        ) : (
          <div className="space-y-4">
            {data.investments.map((inv: Investment) => (
              <div key={inv.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{inv.project?.name}</span>
                    <Badge type="energy" value={inv.project?.energyType} />
                  </div>
                  <ProgressBar
                    value={Number(inv.totalReturnsReceived)}
                    max={Number(inv.amount) * (Number(inv.expectedAnnualReturn) / 100) * (Number(inv.project?.durationMonths) / 12)}
                    label={`Rendements: ${fmt(inv.totalReturnsReceived)} FCFA`}
                  />
                </div>
                <div className="text-right">
                  <div className="font-semibold">{fmt(inv.amount)} FCFA</div>
                  <div className="text-xs text-primary-600">{inv.expectedAnnualReturn}% / an</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
