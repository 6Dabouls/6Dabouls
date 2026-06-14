"use client"
import { useState } from "react"
import { Users, Search, Filter, Shield, Ban, Trash2, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react"

const mockUsers = Array.from({ length: 20 }, (_, i) => ({
  id: `user_${i + 1}`,
  name: ["Marie Dupont", "Kevin Martin", "Sophie Laurent", "Lucas Bernard", "Emma Petit", "Thomas Moreau", "Chloé Simon", "Antoine Blanc", "Julie Robert", "Nicolas Garcia"][i % 10],
  email: `user${i + 1}@exemple.com`,
  plan: (["FREE", "PREMIUM", "PRO", "ENTERPRISE"] as const)[Math.floor(Math.random() * 4)],
  status: Math.random() > 0.15 ? "active" : "suspended",
  analyses: Math.floor(Math.random() * 200),
  createdAt: new Date(2024, Math.floor(Math.random() * 7), Math.floor(Math.random() * 28) + 1).toLocaleDateString("fr-FR"),
}))

const planColors: Record<string, string> = {
  FREE: "bg-gray-500/20 text-gray-400",
  PREMIUM: "bg-[#FE2C55]/20 text-[#FE2C55]",
  PRO: "bg-purple-500/20 text-purple-400",
  ENTERPRISE: "bg-yellow-500/20 text-yellow-400",
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [page, setPage] = useState(1)
  const perPage = 10

  const filtered = mockUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search)
    const matchFilter = filter === "all" || u.plan === filter || u.status === filter
    return matchSearch && matchFilter
  })

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(filtered.length / perPage)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-tiktok flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Gestion des utilisateurs</h1>
        </div>
        <p className="text-gray-400">{mockUsers.length} utilisateurs enregistrés</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou email..."
            className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#FE2C55]/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none"
          >
            <option value="all">Tous</option>
            <option value="FREE">Gratuit</option>
            <option value="PREMIUM">Premium</option>
            <option value="PRO">Pro</option>
            <option value="active">Actifs</option>
            <option value="suspended">Suspendus</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr className="text-xs text-gray-500">
                <th className="text-left px-4 py-3 font-medium">Utilisateur</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Plan</th>
                <th className="text-left px-4 py-3 font-medium">Statut</th>
                <th className="text-right px-4 py-3 font-medium">Analyses</th>
                <th className="text-left px-4 py-3 font-medium">Inscrit le</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginated.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full gradient-tiktok flex items-center justify-center text-xs font-bold text-white">
                        {user.name[0]}
                      </div>
                      <span className="text-sm font-medium text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${planColors[user.plan]}`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-green-400" : "bg-red-400"}`} />
                      <span className={`text-xs ${user.status === "active" ? "text-green-400" : "text-red-400"}`}>
                        {user.status === "active" ? "Actif" : "Suspendu"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-400">{user.analyses}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{user.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Promouvoir admin">
                        <Shield className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-yellow-500/10 text-gray-400 hover:text-yellow-400 transition-colors" title="Suspendre">
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors" title="Supprimer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} sur {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-white">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
