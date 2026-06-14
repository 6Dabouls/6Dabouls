import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

    const { topic, niche, duration, style } = await req.json()
    if (!topic) return NextResponse.json({ error: "Sujet requis" }, { status: 400 })

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Tu es un scénariste expert en vidéos TikTok virales. Tu crées des scripts optimisés pour l'engagement.",
        },
        {
          role: "user",
          content: `Crée un script TikTok pour:
          - Sujet: ${topic}
          - Niche: ${niche || "générale"}
          - Durée: ${duration || 60} secondes
          - Style: ${style || "éducatif"}

          Retourne un JSON avec exactement cette structure:
          {
            "intro": "accroche percutante (max 20 mots)",
            "development": "corps du contenu (3-4 points clés)",
            "conclusion": "résumé impactant",
            "cta": "call-to-action engageant"
          }`,
        },
      ],
      temperature: 0.8,
      max_tokens: 1500,
    })

    const content = completion.choices[0].message.content || "{}"
    let script = null
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) script = JSON.parse(jsonMatch[0])
    } catch {
      script = { intro: content, development: "", conclusion: "", cta: "" }
    }

    return NextResponse.json({ script })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
