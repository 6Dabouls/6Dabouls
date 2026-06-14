"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, Play, Send } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg gradient-tiktok flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold text-xl text-white">TikBoost</span>
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl gradient-tiktok flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Email envoyé !</h1>
            <p className="text-gray-400 mb-6">
              Si un compte existe avec <strong className="text-white">{email}</strong>,
              vous recevrez un lien de réinitialisation dans quelques minutes.
            </p>
            <Link href="/login" className="inline-flex items-center gap-2 text-[#FE2C55] hover:underline">
              <ArrowLeft className="w-4 h-4" /> Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-white mb-2">Mot de passe oublié</h1>
            <p className="text-gray-400 mb-8">Entrez votre email pour recevoir un lien de réinitialisation</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Adresse e-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FE2C55]/50 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-tiktok text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Envoyer le lien"}
              </button>
            </form>
            <Link href="/login" className="flex items-center justify-center gap-2 mt-6 text-gray-500 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Retour à la connexion
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
