"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2, Play, Check } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const passwordChecks = [
    { label: "8 caractères minimum", valid: form.password.length >= 8 },
    { label: "Une majuscule", valid: /[A-Z]/.test(form.password) },
    { label: "Un chiffre", valid: /[0-9]/.test(form.password) },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Une erreur s'est produite")
        return
      }
      await signIn("credentials", { email: form.email, password: form.password, redirect: false })
      router.push("/dashboard")
    } catch {
      setError("Une erreur s'est produite")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg gradient-tiktok flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold text-xl text-white">TikBoost</span>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Créer un compte</h1>
        <p className="text-gray-400 mb-8">Commencez gratuitement, sans carte bancaire</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Nom complet</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Jean Dupont"
              required
              className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FE2C55]/50 focus:bg-white/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Adresse e-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="vous@exemple.com"
              required
              className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FE2C55]/50 focus:bg-white/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-[#FE2C55]/50 focus:bg-white/10 transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {form.password && (
              <div className="mt-2 space-y-1">
                {passwordChecks.map((check) => (
                  <div key={check.label} className={`flex items-center gap-2 text-xs ${check.valid ? "text-green-400" : "text-gray-500"}`}>
                    <Check className={`w-3 h-3 ${check.valid ? "text-green-400" : "text-gray-600"}`} />
                    {check.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Confirmer le mot de passe</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="••••••••"
              required
              className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FE2C55]/50 focus:bg-white/10 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-tiktok text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Créer mon compte"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-4">
          <div className="flex-1 border-t border-white/10" />
          <span className="text-sm text-gray-500">ou</span>
          <div className="flex-1 border-t border-white/10" />
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full bg-white/5 border border-white/10 text-white font-medium py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuer avec Google
        </button>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-[#FE2C55] hover:underline font-medium">Se connecter</Link>
        </p>
        <p className="text-center text-gray-600 mt-3 text-xs">
          En créant un compte, vous acceptez nos{" "}
          <Link href="/terms" className="underline hover:text-gray-400">CGU</Link> et{" "}
          <Link href="/privacy" className="underline hover:text-gray-400">Politique de confidentialité</Link>
        </p>
      </div>
    </div>
  )
}
