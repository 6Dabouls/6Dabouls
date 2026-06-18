import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle, Eye } from 'lucide-react'

export default function AdminKyc() {
  const [items, setItems] = useState<any[]>([])

  const load = () => adminApi.getPendingKyc().then(r => setItems(r.data[0] || []))
  useEffect(load, [])

  const approve = async (id: string) => {
    await adminApi.reviewKyc(id, { approved: true })
    toast.success('KYC approuvé')
    load()
  }

  const reject = async (id: string) => {
    const reason = prompt('Raison du refus:')
    if (!reason) return
    await adminApi.reviewKyc(id, { approved: false, reason })
    toast.success('KYC refusé')
    load()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Vérifications KYC en attente ({items.length})</h1>
      {items.length === 0 ? (
        <div className="card text-center py-12 text-gray-400">Aucune vérification en attente</div>
      ) : items.map((k: any) => (
        <div key={k.id} className="card">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{k.user?.firstName} {k.user?.lastName}</div>
              <div className="text-sm text-gray-500">{k.user?.email}</div>
              <div className="text-xs text-gray-400 mt-1">
                Doc: {k.documentType} • Soumis le {new Date(k.createdAt).toLocaleDateString('fr-FR')}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => approve(k.id)} className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                <CheckCircle size={14} /> Approuver
              </button>
              <button onClick={() => reject(k.id)} className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                <XCircle size={14} /> Refuser
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
