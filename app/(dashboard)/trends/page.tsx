"use client"
import { useState } from "react"
import { TrendingUp, Music, Hash, Sparkles, RefreshCw, Loader2, Flame, Play } from "lucide-react"

const mockTrends = {
  sounds: [
    { title: "MONTAGEM PHONK FUNK #5", artist: "DJ Unknown", uses: "8.2M", growth: "+234%", category: "Phonk" },
    { title: "Flowers - Miley Cyrus", artist: "Miley Cyrus", uses: "5.1M", growth: "+89%", category: "Pop" },
    { title: "Son IA Viral #trending", artist: "AI Generated", uses: "3.8M", growth: "+456%", category: "IA" },
    { title: "MEWING Tutorial Sound", artist: "Various", uses: "2.9M", growth: "+178%", category: "Humour" },
    { title: "Get Ready With Me beat", artist: "Original", uses: "2.3M", growth: "+67%", category: "Lifestyle" },
  ],
  hashtags: [
    { tag: "pourtoi", views: "2.3T", growth: "+5%", category: "Général" },
    { tag: "fyp", views: "1.8T", growth: "+3%", category: "Général" },
    { tag: "tendance2024", views: "890M", growth: "+45%", category: "Viral" },
    { tag: "phenomeen", views: "450M", growth: "+234%", category: "Viral" },
    { tag: "routine", views: "380M", growth: "+12%", category: "Lifestyle" },
    { tag: "mewing", views: "290M", growth: "+567%", category: "Humour" },
    { tag: "businesstok", views: "210M", growth: "+89%", category: "Business" },
    { tag: "fitcheck", views: "180M", growth: "+34%", category: "Mode" },
  ],
  challenges: [
    { name: "#MewingChallenge", participants: "2.1M", growth: "+890%", description: "Défi de posture de langue viral" },
    { name: "#ReadySetGo", participants: "1.8M", growth: "+234%", description: "Transformation rapide avant/après" },
    { name: "#AIArt", participants: "1.4M", growth: "+345%", description: "Créations artistiques avec IA" },
    { name: "#SilentWalk", participants: "980K", growth: "+178%", description: "Marcher en silence pour la santé mentale" },
  ],
  effects: [
    { name: "Bold Glamour", uses: "45M", type: "Beauté", growth: "+23%" },
    { name: "AI Avatar", uses: "23M", type: "IA", growth: "+456%" },
    { name: "Green Screen", uses: "89M", type: "Créatif", growth: "+8%" },
    { name: "Time Warp Scan", uses: "34M", type: "Fun", growth: "+12%" },
  ],
}

export default function TrendsPage() {
  const [activeTab, setActiveTab] = useState("sounds")
  const [loading, setLoading] = useState(false)

  const tabs = [
    { value: "sounds", label: "Sons", icon: Music },
    { value: "hashtags", label: "Hashtags", icon: Hash },
    { value: "challenges", label: "Challenges", icon: Flame },
    { value: "effects", label: "Effets", icon: Sparkles },
  ]

  const refresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-tiktok flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Tendances TikTok</h1>
          </div>
          <p className="text-gray-400">Restez à la pointe des dernières tendances pour booster votre visibilité</p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Actualiser
        </button>
      </div>

      {/* Alert Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#FE2C55]/10 to-[#25F4EE]/10 border border-[#FE2C55]/20 flex items-center gap-3">
        <Flame className="w-5 h-5 text-[#FE2C55] flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-white">🔥 Tendance explosive : #MewingChallenge +890%</p>
          <p className="text-xs text-gray-400">Ce challenge gagne 500K participants par jour. Sautez dessus maintenant !</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.value
                ? "gradient-tiktok text-white"
                : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "sounds" && (
        <div className="space-y-3">
          {mockTrends.sounds.map((sound, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-tiktok flex items-center justify-center flex-shrink-0">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{sound.title}</p>
                <p className="text-sm text-gray-400">{sound.artist} · <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">{sound.category}</span></p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-white">{sound.uses} utilisations</p>
                <p className="text-xs text-green-400">{sound.growth}</p>
              </div>
              <button className="w-9 h-9 rounded-xl bg-[#FE2C55]/20 flex items-center justify-center hover:bg-[#FE2C55]/40 transition-colors">
                <Play className="w-4 h-4 text-[#FE2C55] fill-[#FE2C55]" />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "hashtags" && (
        <div className="grid sm:grid-cols-2 gap-3">
          {mockTrends.hashtags.map((tag, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all flex items-center gap-3">
              <span className="text-2xl font-black text-gray-700 w-7">#{idx + 1}</span>
              <div className="flex-1">
                <p className="font-semibold text-white">#{tag.tag}</p>
                <p className="text-xs text-gray-400">{tag.views} vues · <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/10">{tag.category}</span></p>
              </div>
              <span className="text-xs font-semibold text-green-400">{tag.growth}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "challenges" && (
        <div className="space-y-3">
          {mockTrends.challenges.map((c, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-white text-lg">{c.name}</p>
                  <p className="text-sm text-gray-400 mt-1">{c.description}</p>
                  <p className="text-xs text-gray-500 mt-2">{c.participants} participants</p>
                </div>
                <span className="text-sm font-bold text-green-400 flex-shrink-0">{c.growth}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "effects" && (
        <div className="grid sm:grid-cols-2 gap-3">
          {mockTrends.effects.map((effect, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-white">{effect.name}</p>
                <span className="text-xs text-green-400 font-semibold">{effect.growth}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#FE2C55]/20 text-[#FE2C55]">{effect.type}</span>
                <span className="text-xs text-gray-400">{effect.uses} utilisations</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
