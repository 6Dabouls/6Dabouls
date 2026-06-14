import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

export const dynamic = "force-dynamic"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

    const accounts = await prisma.tikTokAccount.findMany({
      where: { userId: session.user.id },
      include: { videos: { orderBy: { views: "desc" }, take: 10 } },
    })

    if (!accounts.length) {
      return NextResponse.json({
        connected: false,
        stats: {
          followers: 0,
          views: 0,
          likes: 0,
          videos: 0,
          engagement: 0,
          viralScore: 0,
        },
        topVideos: [],
      })
    }

    const account = accounts[0]
    const totalViews = account.videos.reduce((sum, v) => sum + Number(v.views), 0)
    const totalLikes = account.videos.reduce((sum, v) => sum + v.likes, 0)

    return NextResponse.json({
      connected: true,
      account: {
        username: account.username,
        avatar: account.avatar,
        followers: account.followers,
        following: account.following,
      },
      stats: {
        followers: account.followers,
        views: Number(account.views),
        likes: Number(account.likes),
        videos: account.videos.length,
        engagement: account.engagement,
        viralScore: Math.min(100, Math.round(account.engagement * 10)),
      },
      topVideos: account.videos.slice(0, 5),
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
