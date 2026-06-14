"use client"
import { useState } from "react"
import { Zap, Loader2, Sparkles, Copy, Check } from "lucide-react"
import { NICHES } from "@/lib/utils"

interface Script {
  intro: string
  development: string
  conclusion: string
  cta: string
}

export default function ScriptsPage() {
  const [form, setForm] = useState({ topic: "", niche: "", duration: "60", style: "educatif" })
  const [script, setScript] = useState<Script | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const styles = [
    { value: "educatif", label: "Éducatif" },
    { value: "divertissant", label: "Divertissant" },
    { value: "inspirant", label: "Inspirant" },
    { value: "tutoriel", label: "Tutoriel" },
    { value: "storytelling", label: "Story-telling" },
    { value: "viral", label: "Viral/Choc" },
  ]

  const handleGenerate = async () => {
    if (!form.topic) return
    setLoading(true)
    setScript(null)
    try {
      const res = await fetch("/api/ai/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setScript(data.script)
    } catch {
      console.error("Error generating script")
    } finally {
      setLoading(false)
    }
  }

  const fullScript = script
    ? `🎬 INTRO\n${script.intro}\n\n📌 DÉVELOPPEMENT\n${script.development}\n\n✅ CONCLUSION\n${script.conclusion}\n\n📣 CALL TO ACTION\n${script.cta}`
    : ""

  const copyScript = () => {
    navigator.clipboard.writeText(fullScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-tiktok flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Générateur de scripts</h1>
        </div>
        <p className="text-gray-400">Créez des scripts TikTok professionnels optimisés pour l&apos;engagement</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-5">
          <h2 className="text-lg font-semibold text-white">Paramètres du script</h2>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Sujet de la vidéo *</label>
            <input
              type="text"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              placeholder="Ex: Comment perdre du poids rapidement"
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
              <option value="">Sélectionnez une niche</option>
              {NICHES.map((n) => (
                <option key={n.value} value={n.value}>{n.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Durée (secondes)</label>
            <div className="flex gap-2">
              {["30", "60", "90", "180"].map((d) => (
                <button
                  key={d}
                  onClick={() => setForm({ ...form, duration: d })}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                    form.duration === d
                      ? "gradient-tiktok text-white"
                      : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Style</label>
            <div className="grid grid-cols-3 gap-2">
              {styles.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setForm({ ...form, style: s.value })}
                  className={`py-2 rounded-xl text-xs font-medium transition-all ${
                    form.style === s.value
                      ? "gradient-tiktok text-white"
                      : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={!form.topic || loading}
            className="w-full gradient-tiktok text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Génération...</> : <><Sparkles className="w-5 h-5" /> Générer le script</>}
          </button>
        </div>

        {/* Script Output */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Script généré</h2>
            {script && (
              <button onClick={copyScript} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copié !" : "Copier tout"}
              </button>
            )}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#FE2C55]" />
              <p className="text-gray-400 text-sm">Génération du script en cours...</p>
            </div>
          )}

          {script && !loading && (
            <div className="space-y-4">
              {[
                { label: "🎬 Introduction", content: script.intro, color: "border-blue-500/30 bg-blue-500/5" },
                { label: "📌 Développement", content: script.development, color: "border-purple-500/30 bg-purple-500/5" },
                { label: "✅ Conclusion", content: script.conclusion, color: "border-green-500/30 bg-green-500/5" },
                { label: "📣 Call to Action", content: script.cta, color: "border-[#FE2C55]/30 bg-[#FE2C55]/5" },
              ].map((section) => (
                <div key={section.label} className={`p-4 rounded-xl border ${section.color}`}>
                  <p className="text-xs font-semibold text-gray-400 mb-2">{section.label}</p>
                  <p className="text-sm text-gray-200 leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          )}

          {!script && !loading && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <Zap className="w-12 h-12 mb-4 opacity-30" />
              <p className="text-sm text-center">Remplissez les paramètres et générez votre script personnalisé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
