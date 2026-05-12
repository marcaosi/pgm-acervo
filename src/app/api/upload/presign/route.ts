import { NextRequest, NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { auth } from "@/auth"
import { r2, R2_BUCKET } from "@/lib/r2"

const MAX_SIZE_BYTES = 50 * 1024 * 1024 // 50 MB

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const { filename, contentType, size } = await req.json()

  if (contentType !== "application/pdf") {
    return NextResponse.json({ error: "Apenas arquivos PDF são aceitos" }, { status: 400 })
  }

  if (typeof size === "number" && size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Arquivo muito grande (máx. 50 MB)" }, { status: 400 })
  }

  const ext = String(filename).split(".").pop()?.toLowerCase() ?? "pdf"
  const uniquePart = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const key = `uploads/${session.user.id}/${uniquePart}.${ext}`

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  })

  const presignedUrl = await getSignedUrl(r2, command, { expiresIn: 300 })

  return NextResponse.json({ presignedUrl, key })
}
