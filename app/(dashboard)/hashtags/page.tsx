"use client"
import { useState } from "react"
import { Hash, Loader2, Sparkles, Copy, Check, TrendingUp } from "lucide-react"
import { NICHES } from "@/lib/utils"

interface HashtagGroup {
  category: string
  tags: Array<{ tag: string; reach: string; competition: "low" | "medium" | "high" }>
}

export default function HashtagsPage() {
  const [form, setForm] = useState({ niche: "", videoType: "", country: "fr", trend: false })
  const [groups, setGroups] = useState<HashtagGroup[]>([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const countries = [
    { value: "fr", label: "🇫🇷 France" },
    { value: "us", label: "🇺🇸 USA" },
    { value: "gb", label: "🇬🇧 UK" },
    { value: "be", label: "🇧🇪 Belgique" },
    { value: "ca", label: "🇨🇦 Canada" },
    { value: "sn", label: "🇸🇳 Sénégal" },
    { value: "ci", label: "🇨🇮 Côte d'Ivoire" },
    { value: "cm", label: "🇨🇲 Cameroun" },
  ]

  const handleGenerate = async () => {
    if (!form.niche) return
    setLoading(true)
    setGroups([])
    try {
      const res = await fetch("/api/ai/hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setGroups(data.groups || [])
    } catch {
      console.error("Error")
    } finally {
      setLoading(false)
    }
  }

  const allTags = groups.flatMap((g) => g.tags.map((t) => t.tag)).join(" ")

  const copyAll = () => {
    navigator.clipboard.writeText(allTags)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const competitionColor = {
    low: "text-green-400 bg-green-400/10",
    medium: "text-yellow-400 bg-yellow-400/10",
    high: "text-red-400 bg-red-400/10",
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-tiktok flex items-center justify-center">
            <Hash className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Générateur de hashtags</h1>
        </div>
        <p className="text-gray-400">Trouvez les meilleurs hashtags selon votre niche, pays et type de contenu</p>
      </div>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Niche *</label>
            <select
              value={form.niche}
              onChange={(e) => setForm({ ...form, niche: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FE2C55]/50"
            >
              <option value="">Sélectionnez une niche</option>
              {NICHES.map((n) => (
                <option key={n.value} value={n.value}>{n.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Type de vidéo</label>
            <input
              type="text"
              value={form.videoType}
              onChange={(e) => setForm({ ...form, videoType: e.target.value })}
              placeholder="Ex: tutoriel, routine, vlog..."
              className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FE2C55]/50"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Pays cible</label>
          <div className="grid grid-cols-4 gap-2">
            {countries.map((c) => (
              <button
                key={c.value}
                onClick={() => setForm({ ...form, country: c.value })}
                className={`py-2 rounded-xl text-xs font-medium transition-all ${
                  form.country === c.value
                    ? "gradient-tiktok text-white"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setForm({ ...form, trend: !form.trend })}
            className={`relative w-12 h-6 rounded-full transition-colors ${form.trend ? "gradient-tiktok" : "bg-white/10"}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.trend ? "translate-x-7" : "translate-x-1"}`} />
          </button>
          <span className="text-sm text-gray-300">Inclure les hashtags tendances</span>
          <TrendingUp className="w-4 h-4 text-[#FE2C55]" />
        </div>
        <button
          onClick={handleGenerate}
          disabled={!form.niche || loading}
          className="w-full gradient-tiktok text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Recherche...</> : <><Sparkles className="w-5 h-5" /> Générer les hashtags</>}
        </button>
      </div>

      {groups.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Hashtags recommandés</h2>
            <button onClick={copyAll} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copié !" : "Copier tous"}
            </button>
          </div>
          {groups.map((group) => (
            <div key={group.category} className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">{group.category}</h3>
              <div className="flex flex-wrap gap-2">
                {group.tags.map((tag) => (
                  <button
                    key={tag.tag}
                    onClick={() => navigator.clipboard.writeText(tag.tag)}
                    className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#FE2C55]/30 hover:bg-[#FE2C55]/10 transition-all"
                    title={`Portée: ${tag.reach} · Compétition: ${tag.competition}`}
                  >
                    <span className="text-sm text-gray-300 group-hover:text-white">#{tag.tag}</span>
                    <span className={`text-xs px-1.5 rounded-full ${competitionColor[tag.competition]}`}>
                      {tag.competition === "low" ? "facile" : tag.competition === "medium" ? "moyen" : "difficile"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="p-4 rounded-xl bg-[#25F4EE]/5 border border-[#25F4EE]/20">
            <p className="text-xs text-gray-400 mb-2 font-medium">📋 Tous les hashtags (cliquez pour copier)</p>
            <p className="text-sm text-[#25F4EE] break-all font-mono cursor-pointer hover:text-white transition-colors" onClick={copyAll}>
              {allTags}
            </p>
          </div>
        </div>
      )}

      {!groups.length && !loading && (
        <div className="text-center py-16 text-gray-500">
          <Hash className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Configurez vos préférences et générez vos hashtags optimisés</p>
        </div>
      )}
    </div>
  )
}
