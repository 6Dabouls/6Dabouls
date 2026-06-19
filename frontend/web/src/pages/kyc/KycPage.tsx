import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { kycApi } from '../../services/api'
import toast from 'react-hot-toast'
import { Shield, CheckCircle, Clock, XCircle, Upload } from 'lucide-react'

const statusInfo: Record<string, { icon: JSX.Element; label: string; color: string; bg: string }> = {
  pending: { icon: <Clock size={20} />, label: 'Non soumis', color: 'text-gray-500', bg: 'bg-gray-50' },
  under_review: { icon: <Clock size={20} />, label: 'En cours de vérification', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  approved: { icon: <CheckCircle size={20} />, label: 'Vérifié', color: 'text-green-600', bg: 'bg-green-50' },
  rejected: { icon: <XCircle size={20} />, label: 'Rejeté', color: 'text-red-600', bg: 'bg-red-50' },
}

export default function KycPage() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm()

  useEffect(() => {
    kycApi.getStatus().then(r => setStatus(r.data))
  }, [])

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      await kycApi.submit({
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        documentFrontUrl: data.documentFront,
        documentBackUrl: data.documentBack,
        selfieUrl: data.selfie,
        proofOfAddressUrl: data.proofOfAddress,
      })
      toast.success('Documents soumis pour vérification')
      kycApi.getStatus().then(r => setStatus(r.data))
    } finally { setLoading(false) }
  }

  const info = statusInfo[status?.status || 'pending']

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vérification d'identité (KYC)</h1>
        <p className="text-gray-500">Requis pour investir sur la plateforme</p>
      </div>

      {/* Status card */}
      <div className={`card ${info.bg} border-0`}>
        <div className={`flex items-center gap-3 ${info.color}`}>
          <Shield size={32} />
          <div>
            <div className="font-semibold text-lg">{info.label}</div>
            {status?.rejectionReason && (
              <div className="text-sm text-red-600 mt-1">Motif: {status.rejectionReason}</div>
            )}
          </div>
        </div>
      </div>

      {status?.status === 'approved' ? (
        <div className="card text-center py-12">
          <CheckCircle size={48} className="text-primary-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Identité vérifiée !</h3>
          <p className="text-gray-500">Vous pouvez maintenant investir sur la plateforme.</p>
        </div>
      ) : status?.status === 'under_review' ? (
        <div className="card text-center py-12">
          <Clock size={48} className="text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Vérification en cours</h3>
          <p className="text-gray-500">Nous vérifions vos documents. Cela peut prendre 24-48h.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
          <h3 className="font-semibold">Soumettre vos documents</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Type de document</label>
              <select {...register('documentType', { required: true })} className="input">
                <option value="">Sélectionner...</option>
                <option value="national_id">Carte nationale d'identité</option>
                <option value="passport">Passeport</option>
                <option value="driving_license">Permis de conduire</option>
              </select>
            </div>
            <div>
              <label className="label">Numéro du document</label>
              <input {...register('documentNumber', { required: true })} className="input" placeholder="Ex: CI12345678" />
            </div>
          </div>

          {[
            { name: 'documentFront', label: 'Recto du document' },
            { name: 'documentBack', label: 'Verso du document' },
            { name: 'selfie', label: 'Selfie avec le document' },
            { name: 'proofOfAddress', label: 'Justificatif de domicile' },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="label">{label}</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                <input {...register(name)} type="text" className="input" placeholder="URL ou chemin du fichier" />
                <p className="text-xs text-gray-400 mt-2">
                  <Upload size={12} className="inline mr-1" />
                  Entrez l'URL ou uploadez via le stockage cloud
                </p>
              </div>
            </div>
          ))}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Envoi en cours...' : 'Soumettre pour vérification'}
          </button>
        </form>
      )}

      <div className="card bg-blue-50 border-0">
        <h4 className="font-semibold text-blue-800 mb-2">Informations requises</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Pièce d'identité officielle (CNI, Passeport ou Permis)</li>
          <li>• Selfie tenant votre document</li>
          <li>• Justificatif de domicile récent (moins de 3 mois)</li>
          <li>• La vérification prend généralement 24 à 48 heures</li>
        </ul>
      </div>
    </div>
  )
}
