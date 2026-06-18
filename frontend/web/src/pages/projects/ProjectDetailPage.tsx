import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { MapPin, TrendingUp, Clock, Users, FileText, AlertCircle } from 'lucide-react'
import { projectsApi, investmentsApi } from '../../services/api'
import { Project } from '../../types'
import { RootState } from '../../store'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import Spinner from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

function fmt(n: number, currency = 'XOF') {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useSelector((s: RootState) => s.auth)
  const [project, setProject] = useState<Project | null>(null)
  const [updates, setUpdates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState('')
  const [investing, setInvesting] = useState(false)
  const [tab, setTab] = useState<'details' | 'updates' | 'documents'>('details')

  useEffect(() => {
    if (!id) return
    Promise.all([
      projectsApi.getOne(id).then(r => setProject(r.data)),
      projectsApi.getUpdates(id).then(r => setUpdates(r.data)),
    ]).finally(() => setLoading(false))
  }, [id])

  const handleInvest = async () => {
    if (!amount || !project) return
    if (user?.kycStatus !== 'approved') {
      toast.error('Vérification KYC requise avant d\'investir')
      navigate('/kyc')
      return
    }
    setInvesting(true)
    try {
      await investmentsApi.invest({ projectId: project.id, amount: Number(amount) })
      toast.success('Investissement effectué avec succès !')
      navigate('/portfolio')
    } catch {
      // error handled by interceptor
    } finally {
      setInvesting(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!project) return <div className="text-center py-20 text-gray-500">Projet introuvable</div>

  const remaining = project.targetAmount - project.raisedAmount

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge type="energy" value={project.energyType} />
            <Badge type="risk" value={project.riskLevel} />
            <Badge type="status" value={project.status} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin size={16} /> {project.city}, {project.region}, {project.country}
          </div>
          <p className="text-gray-600 leading-relaxed">{project.description}</p>

          {project.images?.[0] && (
            <img src={project.images[0]} alt={project.name}
              className="w-full h-64 object-cover rounded-xl" />
          )}
        </div>

        {/* Investment panel */}
        <div className="space-y-4">
          <div className="card sticky top-4">
            <h3 className="font-semibold text-gray-900 mb-4">Investir dans ce projet</h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Rendement estimé</span>
                <span className="font-semibold text-primary-600">{project.expectedReturn}% / an</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Durée</span>
                <span className="font-medium">{project.durationMonths} mois</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Min. investissement</span>
                <span className="font-medium">{fmt(project.minimumInvestment, project.currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Investisseurs</span>
                <span className="font-medium">{project.investorCount}</span>
              </div>
            </div>

            <ProgressBar value={project.fundingProgress} label={`${fmt(project.raisedAmount, project.currency)} levés`} />
            <p className="text-xs text-gray-400 mt-1 mb-4">
              Il reste {fmt(remaining, project.currency)} à financer
            </p>

            {project.status === 'active' ? (
              <>
                <div className="mb-3">
                  <label className="label text-xs">Montant à investir ({project.currency})</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    min={project.minimumInvestment}
                    className="input"
                    placeholder={`Min. ${project.minimumInvestment}`}
                  />
                </div>
                {user?.kycStatus !== 'approved' && (
                  <div className="flex items-center gap-2 text-xs text-yellow-700 bg-yellow-50 p-2 rounded-lg mb-3">
                    <AlertCircle size={14} /> KYC requis pour investir
                  </div>
                )}
                <button
                  onClick={handleInvest}
                  disabled={investing || !amount}
                  className="btn-primary w-full"
                >
                  {investing ? 'Traitement...' : 'Investir maintenant'}
                </button>
              </>
            ) : (
              <div className="text-center text-gray-500 text-sm py-2">
                Ce projet n'accepte plus d'investissements
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="flex border-b border-gray-200 mb-4">
          {(['details', 'updates', 'documents'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === t ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {t === 'details' ? 'Détails' : t === 'updates' ? `Actualités (${updates.length})` : 'Documents'}
            </button>
          ))}
        </div>

        {tab === 'details' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: TrendingUp, label: 'Budget total', value: fmt(project.totalBudget, project.currency) },
              { icon: TrendingUp, label: 'Objectif', value: fmt(project.targetAmount, project.currency) },
              { icon: Clock, label: 'Début', value: new Date(project.startDate).toLocaleDateString('fr-FR') },
              { icon: Clock, label: 'Fin', value: new Date(project.endDate).toLocaleDateString('fr-FR') },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="card p-4">
                <Icon size={16} className="text-primary-500 mb-2" />
                <div className="text-xs text-gray-500">{label}</div>
                <div className="font-semibold text-sm">{value}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'updates' && (
          <div className="space-y-4">
            {updates.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Aucune mise à jour pour le moment</p>
            ) : updates.map((u: any) => (
              <div key={u.id} className="card">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{u.title}</h4>
                  <span className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                <p className="text-gray-600 text-sm">{u.content}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'documents' && (
          <div className="space-y-2">
            {!project.documents?.length ? (
              <p className="text-gray-400 text-center py-8">Aucun document disponible</p>
            ) : project.documents.map((doc, i) => (
              <a key={i} href={doc.url} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 p-3 card hover:shadow-md transition-shadow">
                <FileText size={18} className="text-primary-500" />
                <span className="text-sm font-medium">{doc.name}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
