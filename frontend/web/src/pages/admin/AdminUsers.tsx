import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api'
import { User } from '../../types'
import toast from 'react-hot-toast'
import { Search, Ban, CheckCircle } from 'lucide-react'

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const load = () => {
    adminApi.getUsers({ page, search }).then(r => {
      setUsers(r.data[0] || [])
      setTotal(r.data[1] || 0)
    })
  }
  useEffect(load, [page, search])

  const ban = async (id: string) => {
    const reason = prompt('Raison du bannissement:')
    if (!reason) return
    await adminApi.banUser(id, reason)
    toast.success('Utilisateur banni')
    load()
  }

  const unban = async (id: string) => {
    await adminApi.unbanUser(id)
    toast.success('Utilisateur débanni')
    load()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Gestion des utilisateurs ({total})</h1>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="input pl-9" />
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100">
            <th className="text-left py-2 px-3 text-gray-500 font-medium">Nom</th>
            <th className="text-left py-2 px-3 text-gray-500 font-medium">Email</th>
            <th className="text-left py-2 px-3 text-gray-500 font-medium">Rôle</th>
            <th className="text-left py-2 px-3 text-gray-500 font-medium">KYC</th>
            <th className="text-left py-2 px-3 text-gray-500 font-medium">Statut</th>
            <th className="text-right py-2 px-3 text-gray-500 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-2 px-3 font-medium">{u.firstName} {u.lastName}</td>
                <td className="py-2 px-3 text-gray-500">{u.email}</td>
                <td className="py-2 px-3 capitalize">{u.role}</td>
                <td className="py-2 px-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${u.kycStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {u.kycStatus}
                  </span>
                </td>
                <td className="py-2 px-3">
                  {u.isBanned
                    ? <span className="text-xs text-red-600">Banni</span>
                    : <span className="text-xs text-green-600">Actif</span>}
                </td>
                <td className="py-2 px-3 text-right">
                  {u.isBanned
                    ? <button onClick={() => unban(u.id)} className="text-xs text-green-600 hover:underline"><CheckCircle size={14} /></button>
                    : <button onClick={() => ban(u.id)} className="text-xs text-red-600 hover:underline"><Ban size={14} /></button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
