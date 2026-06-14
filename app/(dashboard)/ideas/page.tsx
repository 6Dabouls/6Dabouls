"use client"
import { useState } from "react"
import { Lightbulb, Loader2, Sparkles, Copy, Check, RefreshCw } from "lucide-react"
import { NICHES } from "@/lib/utils"

export default function IdeasPage() {
  const [niche, setNiche] = useState("")
  const [ideas, setIdeas] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<number | null>(null)

  const handleGenerate = async () => {
    if (!niche) return
    setLoading(true)
    setIdeas([])
    try {
      const res = await fetch("/api/ai/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche }),
      })
      const data = await res.json()
      setIdeas(data.ideas || [])
    } catch {
      setIdeas(["Erreur lors de la génération. Veuillez réessayer."])
    } finally {
      setLoading(false)
    }
  }

  const copyIdea = (idx: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(idx)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-tiktok flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Générateur d&apos;idées</h1>
        </div>
        <p className="text-gray-400">Générez 20 idées de vidéos TikTok virales personnalisées selon votre niche</p>
      </div>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Choisissez votre niche</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          {NICHES.map((n) => (
            <button
              key={n.value}
              onClick={() => setNiche(n.value)}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                niche === n.value
                  ? "gradient-tiktok border-transparent text-white"
                  : "border-white/10 text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/5"
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleGenerate}
          disabled={!niche || loading}
          className="w-full gradient-tiktok text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Génération en cours...</>
          ) : (
            <><Sparkles className="w-5 h-5" /> Générer 20 idées virales</>
          )}
        </button>
      </div>

      {ideas.length > 0 && (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              {ideas.length} idées pour la niche <span className="text-gradient-tiktok capitalize">{niche}</span>
            </h2>
            <button onClick={handleGenerate} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              <RefreshCw className="w-4 h-4" /> Régénérer
            </button>
          </div>
          <div className="space-y-3">
            {ideas.map((idea, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                <span className="text-2xl font-black text-gray-700 w-7 flex-shrink-0 mt-0.5">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <p className="flex-1 text-gray-300 text-sm leading-relaxed">{idea}</p>
                <button
                  onClick={() => copyIdea(idx, idea)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-white"
                >
                  {copied === idx ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!ideas.length && !loading && (
        <div className="text-center py-16 text-gray-500">
          <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Sélectionnez une niche et cliquez sur &quot;Générer&quot; pour obtenir vos idées</p>
        </div>
      )}
    </div>
  )
}
