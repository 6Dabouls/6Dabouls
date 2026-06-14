import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { BarChart3, CreditCard, Home, Settings, Shield, Users, Play } from "lucide-react"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "admin") redirect("/dashboard")

  const navItems = [
    { label: "Tableau de bord", href: "/admin/dashboard", icon: Home },
    { label: "Utilisateurs", href: "/admin/users", icon: Users },
    { label: "Abonnements", href: "/admin/subscriptions", icon: CreditCard },
    { label: "Statistiques", href: "/admin/analytics", icon: BarChart3 },
    { label: "Paramètres", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <aside className="fixed left-0 top-0 h-full w-56 bg-[#111] border-r border-white/5 flex flex-col z-40">
        <div className="p-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-tiktok flex items-center justify-center">
              <Play className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <span className="font-bold text-white">TikBoost</span>
          </Link>
          <div className="mt-2 flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-[#FE2C55]" />
            <span className="text-xs text-[#FE2C55] font-medium">Administration</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/5">
          <Link href="/dashboard" className="text-xs text-gray-500 hover:text-white transition-colors">
            ← Retour au dashboard
          </Link>
        </div>
      </aside>
      <div className="flex-1 ml-56 p-6">
        {children}
      </div>
    </div>
  )
}
