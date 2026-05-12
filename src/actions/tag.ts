"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function getUserTags(q?: string) {
  const session = await auth()
  if (!session?.user?.id) return []

  const tags = await prisma.tag.findMany({
    where: {
      userId: session.user.id,
      ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
    },
    select: { name: true },
    orderBy: { name: "asc" },
    take: 20,
  })

  return tags.map((t) => t.name)
}
