"use client"
import { useState, useRef, useEffect } from "react"
import { Bot, Loader2, Send, Sparkles, User } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const QUICK_QUESTIONS = [
  "Pourquoi ma vidéo ne décolle pas ?",
  "Comment atteindre 100 000 abonnés ?",
  "Quel est le meilleur moment pour publier ?",
  "Comment améliorer mon taux d'engagement ?",
  "Donne-moi 5 idées virales pour ma niche",
  "Analyse les tendances TikTok du moment",
]

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Bonjour ! 👋 Je suis votre assistant IA TikTok. Je peux vous aider à analyser votre compte, générer du contenu, comprendre les tendances et optimiser votre stratégie. Que souhaitez-vous savoir ?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || loading) return

    const userMessage: Message = { role: "user", content: messageText, timestamp: new Date() }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message || "Désolé, je n'ai pas pu répondre.", timestamp: new Date() },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Une erreur s'est produite. Veuillez réessayer.", timestamp: new Date() },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-tiktok flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Assistant IA TikTok</h1>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-gray-400">En ligne · Propulsé par GPT-4</span>
          </div>
        </div>
      </div>

      {/* Quick questions */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-3">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => sendMessage(q)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-[#FE2C55]/30 hover:bg-[#FE2C55]/10 transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === "assistant" ? "gradient-tiktok" : "bg-purple-500"
            }`}>
              {msg.role === "assistant" ? (
                <Sparkles className="w-4 h-4 text-white" />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "assistant"
                    ? "bg-white/10 text-gray-200 rounded-tl-none"
                    : "bg-[#FE2C55]/20 border border-[#FE2C55]/30 text-gray-200 rounded-tr-none"
                }`}
                style={{ whiteSpace: "pre-wrap" }}
              >
                {msg.content}
              </div>
              <span className="text-xs text-gray-600">
                {msg.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full gradient-tiktok flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white/10 flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Posez votre question à l'IA..."
          className="flex-1 bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FE2C55]/50 transition-all"
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="w-12 h-12 rounded-xl gradient-tiktok flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Send className="w-5 h-5 text-white" />}
        </button>
      </div>
    </div>
  )
}
