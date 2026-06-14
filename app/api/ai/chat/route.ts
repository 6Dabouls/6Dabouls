import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

    const { messages } = await req.json()

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Tu es TikBoost AI, un assistant expert en stratégie TikTok. Tu aides les créateurs de contenu à:
          - Analyser leurs performances et comprendre pourquoi leurs vidéos performent ou non
          - Développer leur audience et augmenter leur nombre d'abonnés
          - Créer du contenu viral (idées, scripts, hooks)
          - Comprendre les algorithmes TikTok
          - Optimiser leur présence sur TikTok

          Tu réponds toujours en français, de manière concise, pratique et actionnable.
          Tu utilises des emojis pour rendre tes réponses plus engageantes.
          Tes conseils sont basés sur les dernières données et tendances TikTok.`,
        },
        ...messages.slice(-10),
      ],
      temperature: 0.8,
      max_tokens: 1000,
    })

    return NextResponse.json({ message: completion.choices[0].message.content })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
