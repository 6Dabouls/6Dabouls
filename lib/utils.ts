import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number | bigint): string {
  const n = typeof num === "bigint" ? Number(num) : num
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B"
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K"
  return n.toString()
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function getEngagementColor(rate: number): string {
  if (rate >= 10) return "text-green-500"
  if (rate >= 5) return "text-yellow-500"
  return "text-red-500"
}

export function getViralScore(views: number, likes: number, comments: number, shares: number): number {
  const engagement = ((likes + comments * 2 + shares * 3) / views) * 100
  const score = Math.min(100, Math.round(engagement * 10))
  return score
}

export const NICHES = [
  { value: "sport", label: "Sport" },
  { value: "beaute", label: "Beauté" },
  { value: "business", label: "Business" },
  { value: "humour", label: "Humour" },
  { value: "gaming", label: "Gaming" },
  { value: "motivation", label: "Motivation" },
  { value: "cuisine", label: "Cuisine" },
  { value: "voyage", label: "Voyage" },
  { value: "tech", label: "Tech" },
  { value: "mode", label: "Mode" },
  { value: "education", label: "Éducation" },
  { value: "musique", label: "Musique" },
]

export const SUBSCRIPTION_PLANS = [
  {
    name: "Gratuit",
    type: "FREE",
    price: 0,
    features: [
      "3 analyses par mois",
      "Générateur d'idées (5/mois)",
      "Tableau de bord basique",
      "1 compte TikTok",
    ],
    notIncluded: [
      "Analyse concurrents",
      "Assistant IA illimité",
      "Calendrier éditorial",
      "Support prioritaire",
    ],
  },
  {
    name: "Premium",
    type: "PREMIUM",
    price: 19.99,
    popular: true,
    features: [
      "Analyses illimitées",
      "Générateurs IA illimités",
      "Assistant IA 24/7",
      "3 comptes TikTok",
      "Calendrier éditorial",
      "Détection tendances",
    ],
    notIncluded: [
      "Analyse concurrents avancée",
      "Support dédié",
    ],
  },
  {
    name: "Pro",
    type: "PRO",
    price: 49.99,
    features: [
      "Tout Premium inclus",
      "10 comptes TikTok",
      "Analyse concurrents",
      "Rapports personnalisés",
      "API Access",
      "Support prioritaire 24/7",
    ],
    notIncluded: [],
  },
  {
    name: "Entreprise",
    type: "ENTERPRISE",
    price: 149.99,
    features: [
      "Tout Pro inclus",
      "Comptes illimités",
      "Manager dédié",
      "Intégrations personnalisées",
      "SLA garanti",
      "Formation équipe",
    ],
    notIncluded: [],
  },
]
