import Link from "next/link"
import { Check, Sparkles, Zap } from "lucide-react"
import { SUBSCRIPTION_PLANS } from "@/lib/utils"

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-3">Choisissez votre plan</h1>
        <p className="text-gray-400">Commencez gratuitement, évoluez à votre rythme</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <div
            key={plan.type}
            className={`relative p-6 rounded-2xl border transition-all ${
              plan.popular
                ? "gradient-tiktok border-transparent shadow-2xl shadow-[#FE2C55]/20"
                : "bg-white/5 border-white/10 hover:border-white/20"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-white text-[#FE2C55] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" /> POPULAIRE
                </span>
              </div>
            )}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">{plan.price === 0 ? "0" : plan.price.toFixed(2).replace(".", ",")}€</span>
                <span className="text-sm text-white/60">/mois</span>
              </div>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? "text-white" : "text-green-400"}`} />
                  <span className={plan.popular ? "text-white" : "text-gray-300"}>{f}</span>
                </li>
              ))}
              {plan.notIncluded.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm opacity-40">
                  <span className="w-4 text-center flex-shrink-0 mt-0.5">✗</span>
                  <span className={plan.popular ? "text-white" : "text-gray-500"}>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={plan.price === 0 ? "/dashboard" : `/checkout?plan=${plan.type}`}
              className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition-all ${
                plan.popular
                  ? "bg-white text-[#FE2C55] hover:bg-gray-100"
                  : plan.price === 0
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "gradient-tiktok text-white hover:opacity-90"
              }`}
            >
              {plan.price === 0 ? "Plan actuel" : plan.type === "ENTERPRISE" ? "Nous contacter" : `Choisir ${plan.name}`}
            </Link>
          </div>
        ))}
      </div>

      {/* Payment methods */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500 mb-4">Méthodes de paiement acceptées</p>
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {["Stripe", "PayPal", "Orange Money", "MTN Mobile Money"].map((method) => (
            <span key={method} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400">
              {method}
            </span>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-white text-center mb-6">Questions fréquentes</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { q: "Puis-je annuler à tout moment ?", a: "Oui, vous pouvez annuler votre abonnement à tout moment depuis vos paramètres. Aucun frais d'annulation." },
            { q: "Y a-t-il une période d'essai ?", a: "Le plan gratuit est disponible indéfiniment. Passez à Premium à tout moment sans engagement." },
            { q: "Mes données sont-elles sécurisées ?", a: "Oui, toutes vos données sont chiffrées et stockées de façon sécurisée. Nous ne partageons jamais vos informations." },
            { q: "Comment fonctionne l'analyse TikTok ?", a: "Connectez votre compte TikTok via OAuth et notre IA analyse automatiquement vos performances." },
          ].map((faq) => (
            <div key={faq.q} className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FE2C55]" /> {faq.q}
              </p>
              <p className="text-sm text-gray-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
