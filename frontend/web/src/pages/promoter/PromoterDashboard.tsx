import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { promoterApi } from '../../services/api'
import { Project } from '../../types'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import { FolderOpen, Plus } from 'lucide-react'

export default function PromoterDashboard() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => { promoterApi.getProjects().then(r => setProjects(r.data[0] || [])) }, [])

  const totalRaised = projects.reduce((s, p) => s + Number(p.raisedAmount), 0)
  const totalInvestors = projects.reduce((s, p) => s + Number(p.investorCount), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Promoteur</h1>
          <p className="text-gray-500">Gérez vos projets et investisseurs</p>
        </div>
        <Link to="/promoter/projects/new" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Nouveau projet
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Projets', value: projects.length },
          { label: 'Total levé', value: `${totalRaised.toLocaleString()} FCFA` },
          { label: 'Investisseurs', value: totalInvestors },
        ].map(({ label, value }) => (
          <div key={label} className="card text-center">
            <div className="text-2xl font-bold text-primary-600">{value}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {projects.length === 0 ? (
          <div className="card text-center py-12">
            <FolderOpen size={48} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">Aucun projet soumis</p>
            <Link to="/promoter/projects/new" className="btn-primary">Soumettre un projet</Link>
          </div>
        ) : projects.map(p => (
          <div key={p.id} className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{p.name}</h3>
                <Badge type="energy" value={p.energyType} />
                <Badge type="status" value={p.status} />
              </div>
              <span className="text-sm font-medium">{p.investorCount} invest.</span>
            </div>
            <ProgressBar value={p.fundingProgress} label={`${Number(p.raisedAmount).toLocaleString()} / ${Number(p.targetAmount).toLocaleString()} FCFA`} />
          </div>
        ))}
      </div>
    </div>
  )
}
