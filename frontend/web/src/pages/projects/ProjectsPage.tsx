import { useEffect, useState, useCallback } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { projectsApi } from '../../services/api'
import { Project, EnergyType, RiskLevel } from '../../types'
import ProjectCard from '../../components/projects/ProjectCard'
import Spinner from '../../components/ui/Spinner'

const energyTypes: { value: EnergyType; label: string }[] = [
  { value: 'solar', label: '☀️ Solaire' },
  { value: 'wind', label: '💨 Éolien' },
  { value: 'hydro', label: '💧 Hydraulique' },
  { value: 'biomass', label: '🌿 Biomasse' },
]

const riskLevels: { value: RiskLevel; label: string }[] = [
  { value: 'low', label: 'Faible' },
  { value: 'medium', label: 'Moyen' },
  { value: 'high', label: 'Élevé' },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [energyType, setEnergyType] = useState<EnergyType | ''>('')
  const [riskLevel, setRiskLevel] = useState<RiskLevel | ''>('')
  const [showFilters, setShowFilters] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await projectsApi.getAll({
        page, limit: 12,
        ...(search && { search }),
        ...(energyType && { energyType }),
        ...(riskLevel && { riskLevel }),
      })
      setProjects(res.data[0] || [])
      setTotal(res.data[1] || 0)
    } finally {
      setLoading(false)
    }
  }, [page, search, energyType, riskLevel])

  useEffect(() => { load() }, [load])

  const clearFilters = () => {
    setSearch(''); setEnergyType(''); setRiskLevel(''); setPage(1)
  }

  const hasFilters = search || energyType || riskLevel

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Catalogue des projets</h1>
        <p className="text-gray-500">{total} projet{total !== 1 ? 's' : ''} disponible{total !== 1 ? 's' : ''}</p>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Rechercher un projet..."
            className="input pl-9"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary flex items-center gap-2 ${showFilters ? 'ring-2 ring-primary-300' : ''}`}
        >
          <Filter size={16} /> Filtres
          {hasFilters && <span className="w-2 h-2 bg-primary-500 rounded-full" />}
        </button>
        {hasFilters && (
          <button onClick={clearFilters} className="btn-secondary flex items-center gap-1 text-red-600">
            <X size={16} /> Réinitialiser
          </button>
        )}
      </div>

      {showFilters && (
        <div className="card flex flex-wrap gap-4">
          <div>
            <label className="label text-xs">Type d'énergie</label>
            <select value={energyType} onChange={e => { setEnergyType(e.target.value as any); setPage(1) }} className="input w-40">
              <option value="">Tous</option>
              {energyTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label text-xs">Niveau de risque</label>
            <select value={riskLevel} onChange={e => { setRiskLevel(e.target.value as any); setPage(1) }} className="input w-36">
              <option value="">Tous</option>
              {riskLevels.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <span className="text-5xl mb-4 block">🌱</span>
          <p>Aucun projet trouvé</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
          {total > 12 && (
            <div className="flex items-center justify-center gap-3">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary disabled:opacity-40">
                Précédent
              </button>
              <span className="text-sm text-gray-500">Page {page} / {Math.ceil(total / 12)}</span>
              <button disabled={page * 12 >= total} onClick={() => setPage(p => p + 1)} className="btn-secondary disabled:opacity-40">
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
