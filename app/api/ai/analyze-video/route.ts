import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

    const { views, likes, comments, shares, title } = await req.json()

    const engagement = views > 0 ? ((likes + comments * 2 + shares * 3) / views) * 100 : 0
    const viralScore = Math.min(100, Math.round(engagement * 10))

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Tu es un expert en analyse de vidéos TikTok. Tu identifies les forces, faiblesses et suggestions d'amélioration.",
        },
        {
          role: "user",
          content: `Analyse cette vidéo TikTok:
          Titre: ${title || "Non spécifié"}
          Vues: ${views}
          Likes: ${likes}
          Commentaires: ${comments}
          Partages: ${shares}
          Taux d'engagement: ${engagement.toFixed(2)}%
          Score viral: ${viralScore}/100

          Retourne un JSON:
          {
            "strengths": ["point fort 1", "point fort 2"],
            "weaknesses": ["point faible 1", "point faible 2"],
            "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
            "overallScore": ${viralScore},
            "verdict": "verdict en une phrase"
          }`,
        },
      ],
      temperature: 0.7,
      max_tokens: 600,
    })

    const content = completion.choices[0].message.content || "{}"
    let analysis = null
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) analysis = JSON.parse(jsonMatch[0])
    } catch {
      analysis = { strengths: [], weaknesses: [], suggestions: [], overallScore: viralScore, verdict: "Analyse non disponible" }
    }

    return NextResponse.json({ analysis, engagement: engagement.toFixed(2), viralScore })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
