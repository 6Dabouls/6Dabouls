import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

    const { topic, niche, emotion } = await req.json()

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Tu es un expert en copywriting viral pour TikTok. Tu crées des hooks (accroches) qui captivent en moins de 3 secondes.",
        },
        {
          role: "user",
          content: `Génère 10 hooks TikTok ultra-viraux pour:
          - Sujet: ${topic}
          - Niche: ${niche || "générale"}
          - Émotion cible: ${emotion || "curiosité"}

          Retourne un tableau JSON:
          [
            {
              "hook": "texte du hook",
              "type": "type de hook (question/choc/secret/pov/challenge...)",
              "score": score viral de 0 à 100
            }
          ]`,
        },
      ],
      temperature: 0.9,
      max_tokens: 1500,
    })

    const content = completion.choices[0].message.content || "[]"
    let hooks = []
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) hooks = JSON.parse(jsonMatch[0])
    } catch {
      hooks = []
    }

    return NextResponse.json({ hooks })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
