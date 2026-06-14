"use client"
import { Suspense } from "react"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2, Play } from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      })
      if (result?.error) {
        setError("Email ou mot de passe incorrect")
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError("Une erreur s'est produite")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl })
  }

  return (
    <div className="w-full max-w-md">
      <Link href="/" className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded-lg gradient-tiktok flex items-center justify-center">
          <Play className="w-4 h-4 text-white fill-white" />
        </div>
        <span className="font-bold text-xl text-white">TikBoost</span>
      </Link>

      <h1 className="text-3xl font-bold text-white mb-2">Bon retour !</h1>
      <p className="text-gray-400 mb-8">Connectez-vous pour accéder à votre tableau de bord</p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Adresse e-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-[#FE2C55]/50 focus:bg-white/10 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex justify-end mt-2">
            <Link href="/forgot-password" className="text-sm text-[#FE2C55] hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full gradient-tiktok text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Se connecter"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="flex-1 border-t border-white/10" />
        <span className="text-sm text-gray-500">ou</span>
        <div className="flex-1 border-t border-white/10" />
      </div>

      <button
        onClick={handleGoogleSignIn}
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
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-[#FE2C55] hover:underline font-medium">
          S&apos;inscrire gratuitement
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense fallback={
          <div className="w-full max-w-md flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#FE2C55]" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-[#FE2C55]/20 to-[#25F4EE]/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center px-12">
          <div className="text-8xl font-black text-gradient-tiktok mb-6">+300%</div>
          <p className="text-2xl font-bold text-white mb-3">Croissance moyenne</p>
          <p className="text-gray-400">des créateurs utilisant TikBoost pendant 90 jours</p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { n: "50K+", l: "Créateurs" },
              { n: "2M+", l: "Analyses" },
              { n: "98%", l: "Satisfaits" },
            ].map((s) => (
              <div key={s.l} className="bg-white/10 rounded-2xl p-4">
                <div className="text-2xl font-bold text-white">{s.n}</div>
                <div className="text-xs text-gray-400">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
