import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api'
import StatCard from '../../components/ui/StatCard'
import { Users, FolderOpen, Shield, CreditCard, TrendingUp, DollarSign } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => { adminApi.getDashboard().then(r => setStats(r.data)) }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Administrateur</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Utilisateurs" value={stats?.totalUsers || 0} icon={Users} color="blue" />
        <StatCard label="Projets actifs" value={stats?.totalProjects || 0} icon={FolderOpen} color="green" />
        <StatCard label="KYC en attente" value={stats?.pendingKyc || 0} icon={Shield} color="yellow" />
        <StatCard label="Retraits en attente" value={stats?.pendingWithdrawals || 0} icon={CreditCard} color="purple" />
        <StatCard label="Total levé" value={`${Number(stats?.totalFunded || 0).toLocaleString()} FCFA`} icon={TrendingUp} color="green" />
        <StatCard label="Total investi" value={`${Number(stats?.totalInvestments || 0).toLocaleString()} FCFA`} icon={DollarSign} color="blue" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-3">Actions rapides</h3>
          <div className="space-y-2">
            {[
              { to: '/admin/kyc', label: `${stats?.pendingKyc || 0} KYC à valider`, color: 'text-yellow-600' },
              { to: '/admin/projects', label: 'Projets en attente de validation', color: 'text-blue-600' },
              { to: '/admin/withdrawals', label: `${stats?.pendingWithdrawals || 0} retraits à traiter`, color: 'text-purple-600' },
            ].map(({ to, label, color }) => (
              <a key={to} href={to} className={`block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-medium ${color}`}>
                {label} →
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
