import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json([])

  const q = req.nextUrl.searchParams.get("q") ?? ""

  const tags = await prisma.tag.findMany({
    where: {
      userId: session.user.id,
      ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
    },
    select: { name: true },
    orderBy: { name: "asc" },
    take: 10,
  })

  return NextResponse.json(tags.map((t) => t.name))
}
