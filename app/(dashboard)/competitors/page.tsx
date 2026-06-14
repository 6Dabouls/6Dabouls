"use client"
import { useState } from "react"
import { Users, Search, TrendingUp, Eye, Heart, Plus, X } from "lucide-react"
import { formatNumber } from "@/lib/utils"

const mockCompetitors = [
  { username: "@fitnessguru_fr", followers: 450000, avgViews: 89000, engagement: 9.2, postsPerWeek: 7, growth: "+12.3%", niche: "Fitness" },
  { username: "@beautefrancaise", followers: 289000, avgViews: 45000, engagement: 7.8, postsPerWeek: 5, growth: "+8.1%", niche: "Beauté" },
  { username: "@businesstips_fr", followers: 178000, avgViews: 32000, engagement: 11.4, postsPerWeek: 4, growth: "+15.7%", niche: "Business" },
]

const myAccount = { username: "@moncompte", followers: 124500, avgViews: 38000, engagement: 7.8, postsPerWeek: 3, growth: "+8.3%", niche: "Ma niche" }

export default function CompetitorsPage() {
  const [search, setSearch] = useState("")
  const [competitors, setCompetitors] = useState(mockCompetitors)

  const addCompetitor = () => {
    if (!search.trim()) return
    setCompetitors([...competitors, {
      username: search.startsWith("@") ? search : `@${search}`,
      followers: Math.floor(Math.random() * 500000),
      avgViews: Math.floor(Math.random() * 100000),
      engagement: Math.round(Math.random() * 10 * 10) / 10,
      postsPerWeek: Math.floor(Math.random() * 10) + 1,
      growth: `+${Math.round(Math.random() * 20 * 10) / 10}%`,
      niche: "Inconnue",
    }])
    setSearch("")
  }

  const remove = (idx: number) => setCompetitors(competitors.filter((_, i) => i !== idx))

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-tiktok flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Analyse concurrents</h1>
        </div>
        <p className="text-gray-400">Comparez vos performances avec d&apos;autres créateurs de votre niche</p>
      </div>

      {/* Add competitor */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-3">Ajouter un concurrent</h2>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCompetitor()}
              placeholder="@nomutilisateur ou URL TikTok"
              className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#FE2C55]/50"
            />
          </div>
          <button
            onClick={addCompetitor}
            className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-tiktok text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 overflow-x-auto">
        <h2 className="text-lg font-semibold text-white mb-6">Comparaison des performances</h2>
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-white/10">
              <th className="text-left pb-3 font-medium">Créateur</th>
              <th className="text-right pb-3 font-medium">Abonnés</th>
              <th className="text-right pb-3 font-medium">Vues moy.</th>
              <th className="text-right pb-3 font-medium">Engagement</th>
              <th className="text-right pb-3 font-medium">Posts/sem.</th>
              <th className="text-right pb-3 font-medium">Croissance</th>
              <th className="text-right pb-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {/* My account */}
            <tr className="bg-[#FE2C55]/5">
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-tiktok flex items-center justify-center text-xs font-bold text-white">Moi</div>
                  <div>
                    <p className="text-sm font-semibold text-white">{myAccount.username}</p>
                    <p className="text-xs text-[#FE2C55]">{myAccount.niche}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 text-right text-sm font-semibold text-white">{formatNumber(myAccount.followers)}</td>
              <td className="py-4 text-right text-sm text-white">{formatNumber(myAccount.avgViews)}</td>
              <td className="py-4 text-right">
                <span className="text-sm font-semibold text-yellow-400">{myAccount.engagement}%</span>
              </td>
              <td className="py-4 text-right text-sm text-white">{myAccount.postsPerWeek}</td>
              <td className="py-4 text-right text-sm text-green-400 font-semibold">{myAccount.growth}</td>
              <td className="py-4 text-right" />
            </tr>
            {/* Competitors */}
            {competitors.map((c, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">
                      {c.username[1]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">{c.username}</p>
                      <p className="text-xs text-gray-500">{c.niche}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-right text-sm text-gray-300">{formatNumber(c.followers)}</td>
                <td className="py-4 text-right text-sm text-gray-300">{formatNumber(c.avgViews)}</td>
                <td className="py-4 text-right">
                  <span className={`text-sm font-medium ${c.engagement > myAccount.engagement ? "text-red-400" : "text-green-400"}`}>
                    {c.engagement}%
                  </span>
                </td>
                <td className="py-4 text-right text-sm text-gray-300">{c.postsPerWeek}</td>
                <td className="py-4 text-right text-sm text-green-400">{c.growth}</td>
                <td className="py-4 text-right">
                  <button onClick={() => remove(idx)} className="text-gray-600 hover:text-red-400 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insights */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-green-500/10 border border-green-500/20">
          <TrendingUp className="w-5 h-5 text-green-400 mb-2" />
          <p className="text-sm font-semibold text-white mb-1">Votre avantage</p>
          <p className="text-xs text-gray-400">Votre taux de croissance est dans la moyenne de votre niche. Publiez 2x plus pour dépasser vos concurrents.</p>
        </div>
        <div className="p-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
          <Eye className="w-5 h-5 text-yellow-400 mb-2" />
          <p className="text-sm font-semibold text-white mb-1">À améliorer</p>
          <p className="text-xs text-gray-400">Vos vues moyennes sont inférieures à 2 concurrents. Optimisez vos hooks pour augmenter la portée organique.</p>
        </div>
        <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
          <Heart className="w-5 h-5 text-blue-400 mb-2" />
          <p className="text-sm font-semibold text-white mb-1">Opportunité</p>
          <p className="text-xs text-gray-400">Le concurrent @businesstips_fr a 11.4% d&apos;engagement. Analysez son format de contenu pour vous en inspirer.</p>
        </div>
      </div>
    </div>
  )
}
