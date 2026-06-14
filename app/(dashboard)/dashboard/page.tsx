import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { BarChart3, Eye, Heart, TrendingUp, Users, Video, Zap, ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { formatNumber } from "@/lib/utils"

// Mock data - replace with real TikTok API data
const mockStats = {
  followers: 124500,
  followersGrowth: 8.3,
  views: 2847000,
  viewsGrowth: 12.5,
  likes: 389200,
  likesGrowth: -2.1,
  videos: 147,
  engagement: 7.8,
  viralScore: 72,
}

const mockTopVideos = [
  { id: "1", title: "Comment perdre 5kg en 2 semaines", views: 1240000, likes: 87000, engagement: 8.2 },
  { id: "2", title: "Le secret que personne ne connaît", views: 893000, likes: 54000, engagement: 7.1 },
  { id: "3", title: "POV: Tu découvres cette astuce", views: 651000, likes: 42000, engagement: 9.3 },
  { id: "4", title: "Réaction aux vidéos virales", views: 445000, likes: 28000, engagement: 6.8 },
]

const mockWeeklyData = [
  { day: "Lun", views: 45000, followers: 120 },
  { day: "Mar", views: 62000, followers: 180 },
  { day: "Mer", views: 38000, followers: 90 },
  { day: "Jeu", views: 91000, followers: 310 },
  { day: "Ven", views: 127000, followers: 450 },
  { day: "Sam", views: 156000, followers: 580 },
  { day: "Dim", views: 89000, followers: 240 },
]

const maxViews = Math.max(...mockWeeklyData.map((d) => d.views))

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const cards = [
    {
      title: "Abonnés",
      value: formatNumber(mockStats.followers),
      growth: mockStats.followersGrowth,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Vues totales",
      value: formatNumber(mockStats.views),
      growth: mockStats.viewsGrowth,
      icon: Eye,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Likes",
      value: formatNumber(mockStats.likes),
      growth: mockStats.likesGrowth,
      icon: Heart,
      color: "from-[#FE2C55] to-orange-500",
    },
    {
      title: "Taux d'engagement",
      value: `${mockStats.engagement}%`,
      growth: 1.2,
      icon: TrendingUp,
      color: "from-green-500 to-teal-500",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Bonjour, {session.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-400 mt-1">Voici un aperçu de vos performances TikTok cette semaine</p>
      </div>

      {/* Viral Score Banner */}
      <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-[#FE2C55]/20 to-[#25F4EE]/20 border border-[#FE2C55]/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl gradient-tiktok flex items-center justify-center">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Score de Viralité</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{mockStats.viralScore}</span>
              <span className="text-gray-400">/100</span>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-48 bg-white/10 rounded-full h-3">
              <div
                className="gradient-tiktok h-3 rounded-full transition-all"
                style={{ width: `${mockStats.viralScore}%` }}
              />
            </div>
            <span className="text-sm text-gray-400">{mockStats.viralScore}%</span>
          </div>
          <p className="text-xs text-gray-500">Bon potentiel viral · Améliorez vos hooks</p>
        </div>
        <Link href="/assistant" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm text-white transition-colors">
          Améliorer →
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.title} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon className="w-4 h-4 text-white" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${card.growth >= 0 ? "text-green-400" : "text-red-400"}`}>
                {card.growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(card.growth)}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-1">{card.title}</p>
            <p className="text-2xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-white">Vues cette semaine</h3>
              <p className="text-sm text-gray-400">Performance quotidienne</p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-end gap-3 h-32">
            {mockWeeklyData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative rounded-t-lg overflow-hidden" style={{ height: `${(d.views / maxViews) * 100}%`, minHeight: "8px" }}>
                  <div className="absolute inset-0 gradient-tiktok opacity-80" />
                </div>
                <span className="text-xs text-gray-500">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FE2C55]" />
            Actions rapides
          </h3>
          <div className="space-y-3">
            {[
              { label: "Générer des idées", href: "/ideas", color: "from-purple-500 to-pink-500" },
              { label: "Créer un script", href: "/scripts", color: "from-blue-500 to-cyan-500" },
              { label: "Trouver des hooks", href: "/hooks", color: "from-orange-500 to-red-500" },
              { label: "Obtenir des hashtags", href: "/hashtags", color: "from-green-500 to-teal-500" },
              { label: "Voir les tendances", href: "/trends", color: "from-yellow-500 to-orange-500" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${action.color}`} />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{action.label}</span>
                <ArrowUpRight className="w-3 h-3 text-gray-600 group-hover:text-white ml-auto transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Top Videos */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-white">Meilleures vidéos</h3>
            <p className="text-sm text-gray-400">Top performances ce mois</p>
          </div>
          <Link href="/videos" className="text-sm text-[#FE2C55] hover:underline">Voir tout →</Link>
        </div>
        <div className="space-y-3">
          {mockTopVideos.map((video, i) => (
            <div key={video.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
              <span className="text-2xl font-black text-gray-700 w-8">#{i + 1}</span>
              <div className="w-12 h-12 rounded-xl gradient-tiktok flex items-center justify-center flex-shrink-0">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{video.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {formatNumber(video.views)}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {formatNumber(video.likes)}
                  </span>
                </div>
              </div>
              <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                video.engagement >= 8 ? "bg-green-500/20 text-green-400" :
                video.engagement >= 6 ? "bg-yellow-500/20 text-yellow-400" :
                "bg-red-500/20 text-red-400"
              }`}>
                {video.engagement}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
