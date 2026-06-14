import { Users, CreditCard, TrendingUp, BarChart3, ArrowUpRight, Activity, Zap } from "lucide-react"
import prisma from "@/lib/prisma"
import { formatNumber } from "@/lib/utils"

async function getAdminStats() {
  try {
    const [totalUsers, premiumUsers, totalPayments] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { subscriptionType: { not: "FREE" } } }),
      prisma.payment.aggregate({ _sum: { amount: true } }),
    ])
    return {
      totalUsers,
      premiumUsers,
      revenue: totalPayments._sum.amount || 0,
      analyses: 0,
      activeUsers: Math.round(totalUsers * 0.62),
    }
  } catch {
    return { totalUsers: 142, premiumUsers: 38, revenue: 2847.50, analyses: 1840, activeUsers: 88 }
  }
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  const cards = [
    { title: "Utilisateurs totaux", value: formatNumber(stats.totalUsers), growth: "+12.4%", icon: Users, color: "from-blue-500 to-cyan-500" },
    { title: "Utilisateurs Premium", value: stats.premiumUsers.toString(), growth: "+8.7%", icon: Zap, color: "from-[#FE2C55] to-orange-500" },
    { title: "Revenus totaux", value: `${stats.revenue.toFixed(2)}€`, growth: "+23.1%", icon: CreditCard, color: "from-green-500 to-teal-500" },
    { title: "Utilisateurs actifs", value: stats.activeUsers.toString(), growth: "+5.3%", icon: Activity, color: "from-purple-500 to-pink-500" },
  ]

  const recentUsers = [
    { name: "Marie Dupont", email: "marie@exemple.com", plan: "PREMIUM", date: "2024-07-15", status: "active" },
    { name: "Kevin Martin", email: "kevin@exemple.com", plan: "PRO", date: "2024-07-14", status: "active" },
    { name: "Sophie Laurent", email: "sophie@exemple.com", plan: "FREE", date: "2024-07-13", status: "active" },
    { name: "Lucas Bernard", email: "lucas@exemple.com", plan: "PREMIUM", date: "2024-07-12", status: "suspended" },
    { name: "Emma Petit", email: "emma@exemple.com", plan: "FREE", date: "2024-07-11", status: "active" },
  ]

  const planColors: Record<string, string> = {
    FREE: "bg-gray-500/20 text-gray-400",
    PREMIUM: "bg-[#FE2C55]/20 text-[#FE2C55]",
    PRO: "bg-purple-500/20 text-purple-400",
    ENTERPRISE: "bg-yellow-500/20 text-yellow-400",
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Administration</h1>
        <p className="text-gray-400 mt-1">Vue d&apos;ensemble de la plateforme TikBoost</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.title} className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon className="w-4 h-4 text-white" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-green-400">
                <ArrowUpRight className="w-3 h-3" /> {card.growth}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-1">{card.title}</p>
            <p className="text-2xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white">Derniers inscrits</h3>
            <a href="/admin/users" className="text-sm text-[#FE2C55] hover:underline">Voir tout →</a>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-9 h-9 rounded-full gradient-tiktok flex items-center justify-center text-xs font-bold text-white">
                  {user.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${planColors[user.plan]}`}>
                    {user.plan}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${user.status === "active" ? "bg-green-400" : "bg-red-400"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue breakdown */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="font-semibold text-white mb-6">Répartition abonnements</h3>
          <div className="space-y-4">
            {[
              { plan: "Gratuit", users: 104, color: "bg-gray-500", percentage: 73 },
              { plan: "Premium", users: 28, color: "gradient-tiktok", percentage: 20 },
              { plan: "Pro", users: 8, color: "bg-purple-500", percentage: 6 },
              { plan: "Entreprise", users: 2, color: "bg-yellow-500", percentage: 1 },
            ].map((item) => (
              <div key={item.plan}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{item.plan}</span>
                  <span className="text-gray-400">{item.users} utilisateurs ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">MRR (Revenu mensuel récurrent)</span>
              <span className="text-sm font-bold text-white">2 847,50€</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
