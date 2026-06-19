import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { promoterApi } from '../../services/api'
import { Project } from '../../types'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import { Plus } from 'lucide-react'

export default function PromoterProjects() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => { promoterApi.getProjects().then(r => setProjects(r.data[0] || [])) }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mes projets ({projects.length})</h1>
        <Link to="/promoter/projects/new" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Nouveau projet
        </Link>
      </div>

      {projects.map(p => (
        <div key={p.id} className="card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold">{p.name}</h3>
              <Badge type="energy" value={p.energyType} />
              <Badge type="risk" value={p.riskLevel} />
              <Badge type="status" value={p.status} />
            </div>
            <span className="text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
          <p className="text-sm text-gray-500">{p.description?.slice(0, 100)}...</p>
          <ProgressBar value={p.fundingProgress} label={`${Number(p.raisedAmount).toLocaleString()} / ${Number(p.targetAmount).toLocaleString()} FCFA`} />
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{p.investorCount} investisseurs • {p.expectedReturn}% rendement</span>
            <span>{p.city}, {p.country}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
