import { NextRequest, NextResponse } from "next/server"
import { GetObjectCommand } from "@aws-sdk/client-s3"

export const dynamic = "force-dynamic"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { r2, R2_BUCKET } from "@/lib/r2"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const key = req.nextUrl.searchParams.get("key")
  if (!key) return NextResponse.json({ error: "Chave não informada" }, { status: 400 })

  // Verifica que o arquivo pertence ao usuário (chave começa com uploads/{userId}/)
  if (!key.startsWith(`uploads/${session.user.id}/`)) {
    // Também aceita se o item existe no banco e pertence ao usuário
    const item = await prisma.item.findFirst({
      where: { digitalFileKey: key, userId: session.user.id },
    })
    if (!item) return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
  }

  const command = new GetObjectCommand({ Bucket: R2_BUCKET, Key: key })
  const url = await getSignedUrl(r2, command, { expiresIn: 3600 })

  return NextResponse.redirect(url)
}
