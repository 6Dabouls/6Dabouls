"use client"
import { useState } from "react"
import { BarChart3, TrendingUp, Users, Eye, Heart, MessageCircle, Share2, ArrowUpRight, ArrowDownRight, Calendar } from "lucide-react"
import { formatNumber } from "@/lib/utils"

const mockData = {
  overview: { followers: 124500, views: 2847000, likes: 389200, comments: 28700, shares: 15400, engagement: 7.8 },
  growth: [
    { month: "Jan", followers: 45000, views: 890000 },
    { month: "Fév", followers: 58000, views: 1200000 },
    { month: "Mar", followers: 72000, views: 1450000 },
    { month: "Avr", followers: 85000, views: 1680000 },
    { month: "Mai", followers: 98000, views: 2100000 },
    { month: "Jun", followers: 112000, views: 2400000 },
    { month: "Jul", followers: 124500, views: 2847000 },
  ],
  topPosts: [
    { title: "Comment perdre du poids", views: 1240000, likes: 87000, engagement: 8.2, date: "2024-07-15" },
    { title: "Le secret des influenceurs", views: 893000, likes: 54000, engagement: 7.1, date: "2024-07-10" },
    { title: "POV: Ma routine matinale", views: 651000, likes: 42000, engagement: 9.3, date: "2024-07-05" },
    { title: "Réaction surprise", views: 445000, likes: 28000, engagement: 6.8, date: "2024-06-30" },
    { title: "Tutorial makeup 5 min", views: 389000, likes: 24000, engagement: 7.5, date: "2024-06-25" },
  ],
  bestTimes: [
    { time: "18h - 20h", score: 95 },
    { time: "12h - 14h", score: 82 },
    { time: "21h - 23h", score: 78 },
    { time: "07h - 09h", score: 65 },
  ],
}

const maxFollowers = Math.max(...mockData.growth.map((d) => d.followers))

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("7d")

  const periods = [
    { value: "7d", label: "7 jours" },
    { value: "30d", label: "30 jours" },
    { value: "90d", label: "90 jours" },
    { value: "1y", label: "1 an" },
  ]

  const metrics = [
    { label: "Abonnés", value: formatNumber(mockData.overview.followers), growth: 8.3, icon: Users, color: "from-blue-500 to-cyan-500" },
    { label: "Vues", value: formatNumber(mockData.overview.views), growth: 12.5, icon: Eye, color: "from-purple-500 to-pink-500" },
    { label: "Likes", value: formatNumber(mockData.overview.likes), growth: -2.1, icon: Heart, color: "from-[#FE2C55] to-orange-500" },
    { label: "Commentaires", value: formatNumber(mockData.overview.comments), growth: 5.7, icon: MessageCircle, color: "from-green-500 to-teal-500" },
    { label: "Partages", value: formatNumber(mockData.overview.shares), growth: 3.2, icon: Share2, color: "from-yellow-500 to-orange-500" },
    { label: "Engagement", value: `${mockData.overview.engagement}%`, growth: 1.1, icon: TrendingUp, color: "from-pink-500 to-rose-500" },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytiques</h1>
          <p className="text-gray-400 mt-1">Analysez les performances de votre compte TikTok</p>
        </div>
        <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                period === p.value ? "gradient-tiktok text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                <m.icon className="w-4 h-4 text-white" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${m.growth >= 0 ? "text-green-400" : "text-red-400"}`}>
                {m.growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(m.growth)}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-1">{m.label}</p>
            <p className="text-2xl font-bold text-white">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Follower Growth Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white">Croissance des abonnés</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-end gap-2 h-40">
            {mockData.growth.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full relative rounded-t-lg overflow-hidden"
                  style={{ height: `${(d.followers / maxFollowers) * 100}%`, minHeight: "8px" }}
                >
                  <div className="absolute inset-0 gradient-tiktok opacity-80" />
                </div>
                <span className="text-xs text-gray-500">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-sm text-gray-400">
            <span>Total: {formatNumber(mockData.overview.followers)} abonnés</span>
            <span className="text-green-400">+{formatNumber(124500 - 45000)} cette année</span>
          </div>
        </div>

        {/* Best Times */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#FE2C55]" />
            Meilleurs horaires
          </h3>
          <div className="space-y-3">
            {mockData.bestTimes.map((t, idx) => (
              <div key={t.time} className="flex items-center gap-3">
                <span className={`text-xs font-bold w-4 ${idx === 0 ? "text-[#FE2C55]" : "text-gray-600"}`}>#{idx + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">{t.time}</span>
                    <span className="text-xs text-gray-400">{t.score}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${idx === 0 ? "gradient-tiktok" : "bg-gray-600"}`}
                      style={{ width: `${t.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">Basé sur les performances de vos 30 dernières vidéos</p>
        </div>
      </div>

      {/* Top Posts */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <h3 className="font-semibold text-white mb-6">Top vidéos</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-white/10">
                <th className="text-left pb-3 font-medium">Vidéo</th>
                <th className="text-right pb-3 font-medium">Vues</th>
                <th className="text-right pb-3 font-medium">Likes</th>
                <th className="text-right pb-3 font-medium">Engagement</th>
                <th className="text-right pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockData.topPosts.map((post, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-black text-gray-700">#{idx + 1}</span>
                      <span className="text-sm text-gray-300">{post.title}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right text-sm text-gray-300">{formatNumber(post.views)}</td>
                  <td className="py-3 text-right text-sm text-gray-300">{formatNumber(post.likes)}</td>
                  <td className="py-3 text-right">
                    <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                      post.engagement >= 8 ? "bg-green-500/20 text-green-400" :
                      post.engagement >= 6 ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {post.engagement}%
                    </span>
                  </td>
                  <td className="py-3 text-right text-xs text-gray-500">{new Date(post.date).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
