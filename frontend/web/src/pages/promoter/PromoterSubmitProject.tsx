import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { promoterApi } from '../../services/api'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function PromoterSubmitProject() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      await promoterApi.submitProject({
        ...data,
        totalBudget: Number(data.totalBudget),
        targetAmount: Number(data.targetAmount),
        expectedReturn: Number(data.expectedReturn),
        durationMonths: Number(data.durationMonths),
        minimumInvestment: Number(data.minimumInvestment),
        currency: data.currency || 'XOF',
      })
      toast.success('Projet soumis pour validation !')
      navigate('/promoter/projects')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Soumettre un nouveau projet</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Nom du projet *</label>
            <input {...register('name', { required: true })} className="input" placeholder="Ex: Centrale solaire de Yamoussoukro" />
          </div>

          <div className="sm:col-span-2">
            <label className="label">Description *</label>
            <textarea {...register('description', { required: true })} rows={4} className="input resize-none" placeholder="Description détaillée du projet..." />
          </div>

          <div>
            <label className="label">Type d'énergie *</label>
            <select {...register('energyType', { required: true })} className="input">
              <option value="">Sélectionner...</option>
              <option value="solar">☀️ Solaire</option>
              <option value="wind">💨 Éolien</option>
              <option value="hydro">💧 Hydraulique</option>
              <option value="biomass">🌿 Biomasse</option>
              <option value="geothermal">🌋 Géothermie</option>
            </select>
          </div>

          <div>
            <label className="label">Niveau de risque *</label>
            <select {...register('riskLevel', { required: true })} className="input">
              <option value="">Sélectionner...</option>
              <option value="low">Faible</option>
              <option value="medium">Moyen</option>
              <option value="high">Élevé</option>
            </select>
          </div>

          <div>
            <label className="label">Pays *</label>
            <input {...register('country', { required: true })} className="input" placeholder="Ex: Côte d'Ivoire" />
          </div>

          <div>
            <label className="label">Région *</label>
            <input {...register('region', { required: true })} className="input" placeholder="Ex: Lacs" />
          </div>

          <div>
            <label className="label">Ville *</label>
            <input {...register('city', { required: true })} className="input" placeholder="Ex: Yamoussoukro" />
          </div>

          <div>
            <label className="label">Devise</label>
            <select {...register('currency')} className="input">
              <option value="XOF">XOF (FCFA)</option>
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>

          <div>
            <label className="label">Budget total (FCFA) *</label>
            <input {...register('totalBudget', { required: true })} type="number" className="input" />
          </div>

          <div>
            <label className="label">Montant à lever (FCFA) *</label>
            <input {...register('targetAmount', { required: true })} type="number" className="input" />
          </div>

          <div>
            <label className="label">Rendement estimé (% / an) *</label>
            <input {...register('expectedReturn', { required: true })} type="number" step="0.1" className="input" />
          </div>

          <div>
            <label className="label">Durée (mois) *</label>
            <input {...register('durationMonths', { required: true })} type="number" className="input" />
          </div>

          <div>
            <label className="label">Investissement minimum (FCFA) *</label>
            <input {...register('minimumInvestment', { required: true })} type="number" className="input" />
          </div>

          <div>
            <label className="label">Date de début *</label>
            <input {...register('startDate', { required: true })} type="date" className="input" />
          </div>

          <div>
            <label className="label">Date de fin *</label>
            <input {...register('endDate', { required: true })} type="date" className="input" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Annuler</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />}
            Soumettre le projet
          </button>
        </div>
      </form>
    </div>
  )
}
