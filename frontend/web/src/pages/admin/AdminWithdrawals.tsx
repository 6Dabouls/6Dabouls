import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle } from 'lucide-react'

export default function AdminWithdrawals() {
  const [items, setItems] = useState<any[]>([])

  const load = () => adminApi.getPendingWithdrawals().then(r => setItems(r.data[0] || []))
  useEffect(load, [])

  const approve = async (id: string) => {
    await adminApi.approveWithdrawal(id)
    toast.success('Retrait approuvé')
    load()
  }

  const reject = async (id: string) => {
    const reason = prompt('Raison du refus:')
    if (!reason) return
    await adminApi.rejectWithdrawal(id, reason)
    toast.success('Retrait refusé')
    load()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Retraits en attente ({items.length})</h1>
      {items.map((tx: any) => (
        <div key={tx.id} className="card flex items-center justify-between">
          <div>
            <div className="font-medium">{tx.user?.firstName} {tx.user?.lastName}</div>
            <div className="text-sm text-gray-500">{tx.user?.email}</div>
            <div className="font-semibold text-lg mt-1">{Number(tx.amount).toLocaleString()} FCFA</div>
            <div className="text-xs text-gray-400">{tx.paymentMethod} • {new Date(tx.createdAt).toLocaleDateString('fr-FR')}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => approve(tx.id)} className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
              <CheckCircle size={14} /> Approuver
            </button>
            <button onClick={() => reject(tx.id)} className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
              <XCircle size={14} /> Refuser
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
