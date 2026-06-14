import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

    const { niche, videoType, country, trend } = await req.json()

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Tu es un expert en SEO TikTok et hashtag strategy. Tu fournis des hashtags optimisés pour maximiser la portée.",
        },
        {
          role: "user",
          content: `Génère des hashtags TikTok optimisés pour:
          - Niche: ${niche}
          - Type de vidéo: ${videoType || "générale"}
          - Pays: ${country || "france"}
          - Inclure tendances: ${trend ? "oui" : "non"}

          Retourne un JSON avec des groupes de hashtags:
          {
            "groups": [
              {
                "category": "Hashtags de niche (populaires)",
                "tags": [
                  {"tag": "nomduhashtag", "reach": "12.5M", "competition": "high|medium|low"},
                ]
              },
              {
                "category": "Hashtags moyens (recommandés)",
                "tags": [...]
              },
              {
                "category": "Hashtags de longue traîne (faciles)",
                "tags": [...]
              }
            ]
          }

          Total: 30-40 hashtags répartis sur 3-4 groupes. Ne mets pas # devant.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const content = completion.choices[0].message.content || "{}"
    let data = { groups: [] }
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) data = JSON.parse(jsonMatch[0])
    } catch {
      data = { groups: [] }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
