"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3, Bot, Calendar, ChevronRight, Flame, Hash, Home,
  Lightbulb, Play, Settings, TrendingUp, Users, Video, Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Tableau de bord", href: "/dashboard", icon: Home },
  { label: "Analytiques", href: "/analytics", icon: BarChart3 },
  { label: "Vidéos", href: "/videos", icon: Video },
  { label: "Générateur d'idées", href: "/ideas", icon: Lightbulb },
  { label: "Générateur de scripts", href: "/scripts", icon: Zap },
  { label: "Hooks viraux", href: "/hooks", icon: Flame },
  { label: "Hashtags", href: "/hashtags", icon: Hash },
  { label: "Calendrier", href: "/calendar", icon: Calendar },
  { label: "Concurrents", href: "/competitors", icon: Users },
  { label: "Tendances", href: "/trends", icon: TrendingUp },
  { label: "Assistant IA", href: "/assistant", icon: Bot },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#111] border-r border-white/5 flex flex-col z-40">
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-tiktok flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold text-white text-lg">TikBoost</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                active
                  ? "bg-gradient-to-r from-[#FE2C55]/20 to-[#25F4EE]/10 text-white border border-[#FE2C55]/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-[#FE2C55]" : "group-hover:text-white")} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="w-3 h-3 text-[#FE2C55]" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
            "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Settings className="w-4 h-4" />
          Paramètres
        </Link>
        <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-[#FE2C55]/10 to-[#25F4EE]/10 border border-white/10">
          <p className="text-xs font-semibold text-white mb-1">Plan Gratuit</p>
          <p className="text-xs text-gray-400 mb-3">3/3 analyses restantes</p>
          <div className="w-full bg-white/10 rounded-full h-1.5 mb-3">
            <div className="gradient-tiktok h-1.5 rounded-full w-full" />
          </div>
          <Link href="/pricing" className="text-xs gradient-tiktok text-transparent bg-clip-text font-semibold hover:opacity-80">
            Passer Premium →
          </Link>
        </div>
      </div>
    </aside>
  )
}
