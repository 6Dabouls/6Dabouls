"use client"
import { useState } from "react"
import { Flame, Loader2, Sparkles, Copy, Check } from "lucide-react"
import { NICHES } from "@/lib/utils"

export default function HooksPage() {
  const [form, setForm] = useState({ topic: "", niche: "", emotion: "curiosite" })
  const [hooks, setHooks] = useState<Array<{ hook: string; type: string; score: number }>>([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<number | null>(null)

  const emotions = [
    { value: "curiosite", label: "🤔 Curiosité" },
    { value: "surprise", label: "😮 Surprise" },
    { value: "peur", label: "😱 Peur/FOMO" },
    { value: "inspiration", label: "✨ Inspiration" },
    { value: "humour", label: "😂 Humour" },
    { value: "colere", label: "😤 Indignation" },
  ]

  const handleGenerate = async () => {
    if (!form.topic) return
    setLoading(true)
    setHooks([])
    try {
      const res = await fetch("/api/ai/hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setHooks(data.hooks || [])
    } catch {
      console.error("Error")
    } finally {
      setLoading(false)
    }
  }

  const copyHook = (idx: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(idx)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-tiktok flex items-center justify-center">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Générateur de hooks viraux</h1>
        </div>
        <p className="text-gray-400">Créez des accroches irrésistibles qui captent l&apos;attention en moins de 3 secondes</p>
      </div>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Sujet de votre vidéo *</label>
            <input
              type="text"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              placeholder="Ex: Recette de tiramisu express"
              className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FE2C55]/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Niche</label>
            <select
              value={form.niche}
              onChange={(e) => setForm({ ...form, niche: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FE2C55]/50"
            >
              <option value="">Toutes niches</option>
              {NICHES.map((n) => (
                <option key={n.value} value={n.value}>{n.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Émotion ciblée</label>
          <div className="grid grid-cols-3 gap-2">
            {emotions.map((e) => (
              <button
                key={e.value}
                onClick={() => setForm({ ...form, emotion: e.value })}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                  form.emotion === e.value
                    ? "gradient-tiktok text-white"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={!form.topic || loading}
          className="w-full gradient-tiktok text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Génération...</> : <><Flame className="w-5 h-5" /> Générer 10 hooks viraux</>}
        </button>
      </div>

      {hooks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white px-1">
            {hooks.length} hooks générés
          </h2>
          {hooks.map((h, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#FE2C55]/20 text-[#FE2C55] font-medium">{h.type}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${i < Math.round(h.score / 20) ? "bg-[#FE2C55]" : "bg-white/10"}`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">{h.score}%</span>
                    </div>
                  </div>
                  <p className="text-gray-200 font-medium">&quot;{h.hook}&quot;</p>
                </div>
                <button
                  onClick={() => copyHook(idx, h.hook)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-white mt-1"
                >
                  {copied === idx ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!hooks.length && !loading && (
        <div className="text-center py-16 text-gray-500">
          <Flame className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Entrez votre sujet et générez des hooks qui accrochent</p>
        </div>
      )}
    </div>
  )
}
