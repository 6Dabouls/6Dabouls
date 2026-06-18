import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api'
import { Project } from '../../types'
import Badge from '../../components/ui/Badge'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle } from 'lucide-react'

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])

  const load = () => adminApi.getPendingProjects().then(r => setProjects(r.data[0] || []))
  useEffect(load, [])

  const approve = async (id: string) => {
    await adminApi.approveProject(id)
    toast.success('Projet approuvé')
    load()
  }

  const reject = async (id: string) => {
    const reason = prompt('Raison du refus:')
    if (!reason) return
    await adminApi.rejectProject(id, reason)
    toast.success('Projet refusé')
    load()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Projets en attente ({projects.length})</h1>
      {projects.length === 0 ? (
        <div className="card text-center py-12 text-gray-400">Aucun projet en attente</div>
      ) : projects.map(p => (
        <div key={p.id} className="card">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{p.name}</h3>
                <Badge type="energy" value={p.energyType} />
                <Badge type="risk" value={p.riskLevel} />
              </div>
              <p className="text-sm text-gray-500 mb-2">{p.description?.slice(0, 120)}...</p>
              <div className="text-xs text-gray-400">
                {p.city}, {p.country} • Objectif: {p.targetAmount?.toLocaleString()} FCFA • {p.expectedReturn}% rendement
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button onClick={() => approve(p.id)} className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100">
                <CheckCircle size={14} /> Approuver
              </button>
              <button onClick={() => reject(p.id)} className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100">
                <XCircle size={14} /> Refuser
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
