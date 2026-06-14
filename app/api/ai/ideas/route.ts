import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

    const { niche } = await req.json()
    if (!niche) return NextResponse.json({ error: "Niche requise" }, { status: 400 })

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Tu es un expert en stratégie de contenu TikTok avec 10 ans d'expérience. Tu génères des idées de vidéos virales en français.",
        },
        {
          role: "user",
          content: `Génère exactement 20 idées de vidéos TikTok virales pour la niche "${niche}".
          Chaque idée doit être:
          - Originale et accrocheuse
          - Optimisée pour TikTok (format court, viral)
          - En français
          - Numérotée de 1 à 20

          Retourne UNIQUEMENT un tableau JSON avec les 20 idées sous forme de strings. Exemple: ["Idée 1", "Idée 2", ...]`,
        },
      ],
      temperature: 0.9,
      max_tokens: 2000,
    })

    const content = completion.choices[0].message.content || "[]"
    let ideas: string[] = []
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        ideas = JSON.parse(jsonMatch[0])
      } else {
        ideas = content.split("\n").filter((l) => l.trim()).slice(0, 20)
      }
    } catch {
      ideas = content.split("\n").filter((l) => l.trim()).slice(0, 20)
    }

    return NextResponse.json({ ideas })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
