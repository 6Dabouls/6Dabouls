import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TikBoost Analytics | Plateforme IA pour créateurs TikTok",
  description: "Boostez votre croissance TikTok avec l'intelligence artificielle. Analyses, idées de contenu, scripts, hooks et bien plus.",
  keywords: ["TikTok", "analytics", "IA", "créateur de contenu", "croissance", "abonnés"],
  openGraph: {
    title: "TikBoost Analytics",
    description: "La plateforme IA pour les créateurs TikTok ambitieux",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
