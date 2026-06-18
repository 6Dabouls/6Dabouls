import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { paymentsApi } from '../../services/api'
import { Transaction } from '../../types'
import toast from 'react-hot-toast'
import { ArrowDownCircle, ArrowUpCircle, Clock, CheckCircle, XCircle } from 'lucide-react'

function fmt(n: number) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)
}

const paymentMethods = [
  { value: 'orange_money', label: '🟠 Orange Money' },
  { value: 'mtn_mobile_money', label: '🟡 MTN Mobile Money' },
  { value: 'card', label: '💳 Carte bancaire' },
  { value: 'bank_transfer', label: '🏦 Virement bancaire' },
]

const statusIcons: Record<string, JSX.Element> = {
  completed: <CheckCircle size={14} className="text-green-500" />,
  pending: <Clock size={14} className="text-yellow-500" />,
  processing: <Clock size={14} className="text-blue-500" />,
  failed: <XCircle size={14} className="text-red-500" />,
}

export default function PaymentsPage() {
  const [wallet, setWallet] = useState<any>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [tab, setTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit')
  const [loading, setLoading] = useState(false)
  const { register: regDeposit, handleSubmit: submitDeposit, reset: resetDeposit } = useForm()
  const { register: regWithdraw, handleSubmit: submitWithdraw, reset: resetWithdraw } = useForm()

  useEffect(() => {
    paymentsApi.getWallet().then(r => setWallet(r.data))
    paymentsApi.getTransactions({ limit: 20 }).then(r => setTransactions(r.data[0] || []))
  }, [])

  const onDeposit = async (data: any) => {
    setLoading(true)
    try {
      await paymentsApi.deposit(data)
      toast.success('Dépôt initié. Votre solde sera mis à jour sous peu.')
      resetDeposit()
      paymentsApi.getWallet().then(r => setWallet(r.data))
    } finally { setLoading(false) }
  }

  const onWithdraw = async (data: any) => {
    setLoading(true)
    try {
      await paymentsApi.withdraw(data)
      toast.success('Retrait en cours de traitement')
      resetWithdraw()
      paymentsApi.getWallet().then(r => setWallet(r.data))
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paiements</h1>
        <p className="text-gray-500">Gérez vos dépôts, retraits et historique</p>
      </div>

      {/* Wallet balance */}
      <div className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <p className="text-primary-100 text-sm">Solde disponible</p>
        <p className="text-4xl font-bold mt-1">{fmt(wallet?.walletBalance || 0)} FCFA</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(['deposit', 'withdraw', 'history'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'
            }`}>
            {t === 'deposit' ? '+ Dépôt' : t === 'withdraw' ? '- Retrait' : 'Historique'}
          </button>
        ))}
      </div>

      {tab === 'deposit' && (
        <form onSubmit={submitDeposit(onDeposit)} className="card space-y-4">
          <h3 className="font-semibold">Déposer des fonds</h3>
          <div>
            <label className="label">Montant (FCFA)</label>
            <input {...regDeposit('amount', { required: true, min: 1000 })}
              type="number" className="input" placeholder="Ex: 100000" />
          </div>
          <div>
            <label className="label">Mode de paiement</label>
            <select {...regDeposit('paymentMethod', { required: true })} className="input">
              <option value="">Sélectionner...</option>
              {paymentMethods.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            <ArrowDownCircle size={16} /> {loading ? 'Traitement...' : 'Déposer'}
          </button>
        </form>
      )}

      {tab === 'withdraw' && (
        <form onSubmit={submitWithdraw(onWithdraw)} className="card space-y-4">
          <h3 className="font-semibold">Retirer des fonds</h3>
          <div>
            <label className="label">Montant (FCFA)</label>
            <input {...regWithdraw('amount', { required: true, min: 5000 })}
              type="number" className="input" placeholder="Ex: 50000" />
          </div>
          <div>
            <label className="label">Mode de retrait</label>
            <select {...regWithdraw('paymentMethod', { required: true })} className="input">
              <option value="">Sélectionner...</option>
              {paymentMethods.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Numéro / Compte</label>
            <input {...regWithdraw('accountDetails.account', { required: true })}
              className="input" placeholder="Ex: +225 07 00 00 00" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            <ArrowUpCircle size={16} /> {loading ? 'Traitement...' : 'Retirer'}
          </button>
        </form>
      )}

      {tab === 'history' && (
        <div className="card space-y-3">
          <h3 className="font-semibold">Historique des transactions</h3>
          {transactions.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Aucune transaction</p>
          ) : transactions.map(tx => (
            <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${tx.type === 'deposit' || tx.type === 'return' ? 'bg-green-50' : 'bg-red-50'}`}>
                  {tx.type === 'deposit' || tx.type === 'return'
                    ? <ArrowDownCircle size={16} className="text-green-500" />
                    : <ArrowUpCircle size={16} className="text-red-500" />}
                </div>
                <div>
                  <div className="text-sm font-medium capitalize">{tx.type}</div>
                  <div className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString('fr-FR')}</div>
                </div>
              </div>
              <div className="text-right flex items-center gap-2">
                {statusIcons[tx.status]}
                <span className={`font-semibold ${tx.type === 'deposit' || tx.type === 'return' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'deposit' || tx.type === 'return' ? '+' : '-'}{fmt(tx.amount)} FCFA
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
