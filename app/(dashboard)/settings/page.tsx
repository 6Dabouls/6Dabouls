"use client"
import { useState } from "react"
import { User, Bell, Shield, CreditCard, Trash2, Save, Check } from "lucide-react"
import { useSession } from "next-auth/react"

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [activeTab, setActiveTab] = useState("profile")
  const [saved, setSaved] = useState(false)
  const [notifications, setNotifications] = useState({
    trends: true,
    hashtags: true,
    bestTimes: true,
    stats: true,
    email: false,
    mobile: true,
  })

  const handleSave = async () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs = [
    { value: "profile", label: "Profil", icon: User },
    { value: "notifications", label: "Notifications", icon: Bell },
    { value: "security", label: "Sécurité", icon: Shield },
    { value: "billing", label: "Facturation", icon: CreditCard },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Paramètres</h1>
        <p className="text-gray-400 mt-1">Gérez votre compte et vos préférences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.value
                    ? "bg-[#FE2C55]/20 text-[#FE2C55] border border-[#FE2C55]/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-5">
              <h2 className="text-lg font-semibold text-white">Informations personnelles</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl gradient-tiktok flex items-center justify-center text-2xl font-bold text-white">
                  {session?.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-white font-medium">{session?.user?.name}</p>
                  <p className="text-gray-400 text-sm">{session?.user?.email}</p>
                  <button className="text-xs text-[#FE2C55] hover:underline mt-1">Changer la photo</button>
                </div>
              </div>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Nom complet</label>
                  <input
                    type="text"
                    defaultValue={session?.user?.name || ""}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FE2C55]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Adresse e-mail</label>
                  <input
                    type="email"
                    defaultValue={session?.user?.email || ""}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FE2C55]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Niche principale</label>
                  <select className="w-full bg-[#1a1a1a] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none">
                    <option value="">Sélectionner...</option>
                    <option>Fitness</option>
                    <option>Beauté</option>
                    <option>Business</option>
                    <option>Gaming</option>
                    <option>Cuisine</option>
                    <option>Voyage</option>
                  </select>
                </div>
              </div>
              <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-tiktok text-white text-sm font-medium">
                {saved ? <><Check className="w-4 h-4" /> Sauvegardé !</> : <><Save className="w-4 h-4" /> Sauvegarder</>}
              </button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-5">
              <h2 className="text-lg font-semibold text-white">Préférences de notifications</h2>
              <div className="space-y-4">
                {[
                  { key: "trends", label: "Nouvelles tendances", description: "Soyez alerté quand une tendance explose" },
                  { key: "hashtags", label: "Hashtags viraux", description: "Nouveaux hashtags avec fort potentiel" },
                  { key: "bestTimes", label: "Meilleures heures", description: "Rappel aux heures optimales de publication" },
                  { key: "stats", label: "Statistiques hebdomadaires", description: "Résumé de vos performances chaque semaine" },
                  { key: "email", label: "Notifications email", description: "Recevoir les alertes par email" },
                  { key: "mobile", label: "Notifications push", description: "Notifications sur votre téléphone" },
                ].map((notif) => (
                  <div key={notif.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div>
                      <p className="text-sm font-medium text-white">{notif.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{notif.description}</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [notif.key]: !notifications[notif.key as keyof typeof notifications] })}
                      className={`relative w-11 h-6 rounded-full transition-colors ${notifications[notif.key as keyof typeof notifications] ? "gradient-tiktok" : "bg-white/10"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications[notif.key as keyof typeof notifications] ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-tiktok text-white text-sm font-medium">
                {saved ? <><Check className="w-4 h-4" /> Sauvegardé !</> : <><Save className="w-4 h-4" /> Sauvegarder</>}
              </button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-5">
              <h2 className="text-lg font-semibold text-white">Sécurité du compte</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Mot de passe actuel</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FE2C55]/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Nouveau mot de passe</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FE2C55]/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Confirmer le nouveau mot de passe</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FE2C55]/50" />
                </div>
              </div>
              <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-tiktok text-white text-sm font-medium">
                {saved ? <><Check className="w-4 h-4" /> Sauvegardé !</> : <><Save className="w-4 h-4" /> Changer le mot de passe</>}
              </button>
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-sm font-semibold text-red-400 mb-3">Zone dangereuse</h3>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 transition-colors">
                  <Trash2 className="w-4 h-4" /> Supprimer mon compte
                </button>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Plan actuel</h2>
                  <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs font-medium">Gratuit</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">Vous utilisez le plan gratuit. Passez à Premium pour accéder à toutes les fonctionnalités.</p>
                <a href="/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-tiktok text-white text-sm font-medium hover:opacity-90">
                  Passer Premium →
                </a>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-semibold text-white mb-4">Historique des paiements</h3>
                <p className="text-sm text-gray-500 text-center py-8">Aucun paiement pour le moment</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
