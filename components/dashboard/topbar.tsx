"use client"
import { signOut } from "next-auth/react"
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface TopBarProps {
  user: { name?: string | null; email?: string | null; image?: string | null }
}

export function TopBar({ user }: TopBarProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="h-16 border-b border-white/5 bg-[#111]/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex-1">
        <div className="relative max-w-xs">
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#FE2C55]/30 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FE2C55] rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <div className="w-7 h-7 rounded-full gradient-tiktok flex items-center justify-center text-xs font-bold text-white">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="text-sm text-white font-medium hidden md:block">{user.name || "Utilisateur"}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
              <div className="p-1">
                <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors" onClick={() => setOpen(false)}>
                  <User className="w-4 h-4" /> Mon profil
                </Link>
                <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors" onClick={() => setOpen(false)}>
                  <Settings className="w-4 h-4" /> Paramètres
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
