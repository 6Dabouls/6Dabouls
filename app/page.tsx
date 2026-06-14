import Link from "next/link"
import { ArrowRight, BarChart3, Brain, Flame, Hash, Lightbulb, Play, Sparkles, TrendingUp, Users, Zap } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: BarChart3,
      title: "Analyses avancées",
      description: "Visualisez vos métriques TikTok en temps réel : vues, likes, taux d'engagement et score de viralité.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Brain,
      title: "IA générative",
      description: "Générez des scripts, hooks percutants et idées de vidéos grâce à notre IA entraînée pour TikTok.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      title: "Détection des tendances",
      description: "Restez à la pointe avec nos alertes en temps réel sur les sons, hashtags et challenges viraux.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Hash,
      title: "Hashtags optimisés",
      description: "Obtenez les meilleurs hashtags selon votre niche, pays et type de contenu pour maximiser la portée.",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: Lightbulb,
      title: "Idées de contenu",
      description: "Ne manquez plus d'inspiration avec notre générateur qui produit 20 idées personnalisées par niche.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Users,
      title: "Analyse concurrents",
      description: "Comparez votre performance avec les créateurs de votre niche pour identifier vos opportunités.",
      color: "from-pink-500 to-rose-500",
    },
  ]

  const stats = [
    { value: "50K+", label: "Créateurs actifs" },
    { value: "2M+", label: "Analyses réalisées" },
    { value: "98%", label: "Satisfaction client" },
    { value: "3x", label: "Croissance moyenne" },
  ]

  const testimonials = [
    {
      name: "Marie L.",
      handle: "@mariebeauty",
      followers: "450K",
      text: "TikBoost m'a aidée à passer de 10K à 450K abonnés en 6 mois. Les idées de contenu IA sont incroyables !",
      avatar: "M",
    },
    {
      name: "Kevin S.",
      handle: "@kevinfit",
      followers: "890K",
      text: "L'analyse des tendances en temps réel est un game changer. Je poste toujours au bon moment avec les bons hashtags.",
      avatar: "K",
    },
    {
      name: "Sophie M.",
      handle: "@sophietravel",
      followers: "220K",
      text: "Le générateur de scripts m'économise des heures chaque semaine. Mes vidéos sont maintenant beaucoup plus engageantes.",
      avatar: "S",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-tiktok flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-xl">TikBoost</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <Link href="#features" className="hover:text-white transition-colors">Fonctionnalités</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Tarifs</Link>
            <Link href="#testimonials" className="hover:text-white transition-colors">Témoignages</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
              Connexion
            </Link>
            <Link
              href="/register"
              className="text-sm px-4 py-2 rounded-full gradient-tiktok font-medium hover:opacity-90 transition-opacity"
            >
              Démarrer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FE2C55]/20 via-transparent to-[#25F4EE]/20 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FE2C55]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#25F4EE]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm mb-6">
            <Sparkles className="w-4 h-4 text-[#FE2C55]" />
            <span>Propulsé par GPT-4 & Claude AI</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Explose sur{" "}
            <span className="text-gradient-tiktok">TikTok</span>
            <br />avec l&apos;IA
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            La plateforme tout-en-un pour analyser votre compte, générer du contenu viral
            et multiplier vos abonnés grâce à l&apos;intelligence artificielle.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full gradient-tiktok font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Commencer gratuitement
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 font-medium text-lg hover:bg-white/10 transition-colors"
            >
              Se connecter
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-gradient-tiktok">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Des outils puissants basés sur l&apos;IA pour transformer votre stratégie TikTok et atteindre vos objectifs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Showcase */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#FE2C55]/10 to-[#25F4EE]/10">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FE2C55]/20 text-[#FE2C55] text-sm mb-6">
                <Zap className="w-4 h-4" />
                IA Générative
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Votre assistant créatif
                <br />
                <span className="text-gradient-tiktok">disponible 24/7</span>
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Notre IA analyse les tendances, génère des scripts accrocheurs, crée des hooks viraux
                et vous propose des idées personnalisées selon votre niche et votre audience.
              </p>
              <ul className="space-y-3">
                {["Scripts optimisés pour TikTok", "Hooks qui captent l'attention", "20+ idées par niche", "Hashtags par pays et tendance"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-300">
                    <div className="w-5 h-5 rounded-full gradient-tiktok flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3 h-3" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full gradient-tiktok font-medium hover:opacity-90 transition-opacity"
              >
                Essayer gratuitement <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-black/50 rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-gray-500">Assistant IA TikBoost</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full gradient-tiktok flex items-center justify-center flex-shrink-0 text-xs font-bold">IA</div>
                  <div className="bg-white/10 rounded-xl rounded-tl-none px-4 py-3 text-gray-300">
                    Bonjour ! Je suis votre assistant TikTok IA. Que souhaitez-vous créer aujourd&apos;hui ?
                  </div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 text-xs font-bold">V</div>
                  <div className="bg-[#FE2C55]/20 border border-[#FE2C55]/30 rounded-xl rounded-tr-none px-4 py-3 text-gray-300">
                    Génère un hook viral pour ma vidéo sur la perte de poids rapide
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full gradient-tiktok flex items-center justify-center flex-shrink-0 text-xs font-bold">IA</div>
                  <div className="bg-white/10 rounded-xl rounded-tl-none px-4 py-3 text-gray-300">
                    <p className="font-semibold text-white mb-2">🔥 3 hooks ultra-viraux :</p>
                    <p>1. &quot;J&apos;ai perdu 10kg en 30 jours sans régime... attends de voir comment&quot;</p>
                    <p className="mt-1">2. &quot;Le médecin ne veut pas que tu saches ça sur la perte de poids&quot;</p>
                    <p className="mt-1">3. &quot;POV: Tu découvres l&apos;astuce que les influenceurs fitness cachent&quot;</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Demandez à l'IA..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#FE2C55]/50"
                  readOnly
                />
                <button className="w-9 h-9 rounded-full gradient-tiktok flex items-center justify-center">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Tarifs simples et transparents</h2>
            <p className="text-gray-400">Commencez gratuitement, évoluez selon vos besoins</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { name: "Gratuit", price: "0€", period: "/mois", features: ["3 analyses/mois", "5 idées IA/mois", "1 compte TikTok", "Tableau de bord basique"], cta: "Commencer", highlight: false },
              { name: "Premium", price: "19,99€", period: "/mois", features: ["Analyses illimitées", "IA illimitée", "3 comptes TikTok", "Calendrier éditorial", "Détection tendances"], cta: "Choisir Premium", highlight: true },
              { name: "Pro", price: "49,99€", period: "/mois", features: ["Tout Premium", "10 comptes TikTok", "Analyse concurrents", "Rapports avancés", "API Access"], cta: "Choisir Pro", highlight: false },
              { name: "Entreprise", price: "149,99€", period: "/mois", features: ["Tout Pro", "Comptes illimités", "Manager dédié", "SLA garanti", "Formation équipe"], cta: "Contacter", highlight: false },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`p-6 rounded-2xl border ${
                  plan.highlight
                    ? "gradient-tiktok border-transparent shadow-2xl shadow-[#FE2C55]/20 scale-105"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm opacity-70">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Sparkles className="w-3 h-3 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-2 rounded-full font-medium text-sm transition-all ${
                    plan.highlight
                      ? "bg-white text-[#FE2C55] hover:bg-gray-100"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-white/5">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Ils ont explosé sur TikTok</h2>
            <p className="text-gray-400">Rejoignez des milliers de créateurs qui ont transformé leur compte</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full gradient-tiktok flex items-center justify-center font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-sm text-gray-400">{t.handle} · {t.followers} abonnés</div>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Flame key={i} className="w-4 h-4 text-[#FE2C55] fill-[#FE2C55]" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">&quot;{t.text}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto p-12 rounded-3xl bg-gradient-to-br from-[#FE2C55]/20 to-[#25F4EE]/20 border border-white/10">
            <h2 className="text-4xl font-bold mb-4">Prêt à exploser sur TikTok ?</h2>
            <p className="text-gray-400 mb-8">Rejoignez 50 000+ créateurs qui utilisent TikBoost pour dominer TikTok</p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full gradient-tiktok font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Commencer gratuitement
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-xs text-gray-500 mt-4">Aucune carte bancaire requise · Annulez à tout moment</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded gradient-tiktok flex items-center justify-center">
                <Play className="w-3 h-3 text-white fill-white" />
              </div>
              <span className="font-bold">TikBoost Analytics</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white">Confidentialité</Link>
              <Link href="/terms" className="hover:text-white">CGU</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
            </div>
            <p className="text-sm text-gray-500">© 2024 TikBoost. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
