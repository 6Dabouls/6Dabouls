"use client"
import { useState } from "react"
import { Video, Eye, Heart, MessageCircle, Share2, TrendingUp, TrendingDown, Search, Filter } from "lucide-react"
import { formatNumber } from "@/lib/utils"

const mockVideos = [
  { id: "1", title: "Comment perdre du poids rapidement", views: 1240000, likes: 87000, comments: 5400, shares: 3200, engagement: 8.2, viralScore: 88, date: "2024-07-15", status: "top" },
  { id: "2", title: "Le secret que personne ne connaît", views: 893000, likes: 54000, comments: 3100, shares: 2100, engagement: 7.1, viralScore: 74, date: "2024-07-10", status: "top" },
  { id: "3", title: "POV: Ma routine matinale", views: 651000, likes: 42000, comments: 2900, shares: 1800, engagement: 9.3, viralScore: 91, date: "2024-07-05", status: "top" },
  { id: "4", title: "Réaction videos virales", views: 445000, likes: 28000, comments: 1900, shares: 1200, engagement: 6.8, viralScore: 68, date: "2024-06-30", status: "average" },
  { id: "5", title: "Tutorial maquillage 5 minutes", views: 389000, likes: 24000, comments: 1700, shares: 900, engagement: 7.5, viralScore: 72, date: "2024-06-25", status: "average" },
  { id: "6", title: "Mon avis sur les influenceurs", views: 234000, likes: 12000, comments: 890, shares: 450, engagement: 5.7, viralScore: 52, date: "2024-06-20", status: "average" },
  { id: "7", title: "Essai produit viral Amazon", views: 98000, likes: 4200, comments: 310, shares: 180, engagement: 4.8, viralScore: 38, date: "2024-06-15", status: "low" },
  { id: "8", title: "Mon histoire en 60 secondes", views: 54000, likes: 2100, comments: 145, shares: 89, engagement: 4.3, viralScore: 29, date: "2024-06-10", status: "low" },
]

export default function VideosPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [selectedVideo, setSelectedVideo] = useState<typeof mockVideos[0] | null>(null)

  const filtered = mockVideos.filter((v) => {
    const matchSearch = v.title.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" || v.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-tiktok flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Mes vidéos</h1>
        </div>
        <p className="text-gray-400">Analysez les performances de chacune de vos vidéos</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une vidéo..."
            className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#FE2C55]/50"
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: "all", label: "Toutes" },
            { value: "top", label: "🔥 Top" },
            { value: "average", label: "📊 Moyen" },
            { value: "low", label: "📉 Faible" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                filter === f.value ? "gradient-tiktok text-white" : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid gap-4 ${selectedVideo ? "lg:grid-cols-2" : ""}`}>
        <div className="space-y-3">
          {filtered.map((video) => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(selectedVideo?.id === video.id ? null : video)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedVideo?.id === video.id
                  ? "bg-[#FE2C55]/10 border-[#FE2C55]/30"
                  : "bg-white/5 border-white/10 hover:bg-white/8"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  video.status === "top" ? "gradient-tiktok" :
                  video.status === "average" ? "bg-yellow-500/20" : "bg-gray-700"
                }`}>
                  {video.status === "top" ? (
                    <TrendingUp className="w-6 h-6 text-white" />
                  ) : video.status === "low" ? (
                    <TrendingDown className="w-6 h-6 text-gray-400" />
                  ) : (
                    <Video className="w-6 h-6 text-yellow-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate mb-2">{video.title}</p>
                  <div className="flex flex-wrap gap-3">
                    <span className="flex items-center gap-1 text-xs text-gray-400"><Eye className="w-3 h-3" />{formatNumber(video.views)}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400"><Heart className="w-3 h-3" />{formatNumber(video.likes)}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400"><MessageCircle className="w-3 h-3" />{formatNumber(video.comments)}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400"><Share2 className="w-3 h-3" />{formatNumber(video.shares)}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-lg font-bold ${
                    video.viralScore >= 80 ? "text-green-400" :
                    video.viralScore >= 60 ? "text-yellow-400" : "text-red-400"
                  }`}>
                    {video.viralScore}
                  </div>
                  <div className="text-xs text-gray-500">score viral</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selectedVideo && (
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 h-fit sticky top-24">
            <h3 className="font-semibold text-white mb-4">{selectedVideo.title}</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: "Vues", value: formatNumber(selectedVideo.views), icon: Eye },
                { label: "Likes", value: formatNumber(selectedVideo.likes), icon: Heart },
                { label: "Commentaires", value: formatNumber(selectedVideo.comments), icon: MessageCircle },
                { label: "Partages", value: formatNumber(selectedVideo.shares), icon: Share2 },
              ].map((m) => (
                <div key={m.label} className="p-3 rounded-xl bg-white/5">
                  <m.icon className="w-4 h-4 text-gray-400 mb-1" />
                  <div className="text-lg font-bold text-white">{m.value}</div>
                  <div className="text-xs text-gray-500">{m.label}</div>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl bg-[#FE2C55]/10 border border-[#FE2C55]/20 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white">Score viral</span>
                <span className="text-2xl font-black text-gradient-tiktok">{selectedVideo.viralScore}/100</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="gradient-tiktok h-2 rounded-full" style={{ width: `${selectedVideo.viralScore}%` }} />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-xs font-semibold text-gray-400 mb-2">💡 Recommandations IA</p>
              <ul className="text-xs text-gray-300 space-y-1.5">
                {selectedVideo.status === "top" && (
                  <>
                    <li>✅ Excellent taux d&apos;engagement - reproduisez ce format</li>
                    <li>✅ Hook efficace - gardez ce style d&apos;introduction</li>
                    <li>💡 Créez une série basée sur ce contenu</li>
                  </>
                )}
                {selectedVideo.status === "average" && (
                  <>
                    <li>💡 Améliorez le hook dans les 3 premières secondes</li>
                    <li>💡 Ajoutez un call-to-action plus fort</li>
                    <li>💡 Testez différents horaires de publication</li>
                  </>
                )}
                {selectedVideo.status === "low" && (
                  <>
                    <li>⚠️ Hook pas assez accrocheur - reformulez l&apos;intro</li>
                    <li>⚠️ Contenu trop long pour ce type de vidéo</li>
                    <li>💡 Utilisez des sons tendance pour booster la portée</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
