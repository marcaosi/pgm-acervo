"use server"

import { randomBytes } from "crypto"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/email"

export async function sendVerification() {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) return { error: "Não autenticado." }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { emailVerified: true, email: true },
  })
  if (dbUser?.emailVerified) return { error: "E-mail já verificado." }

  const email = dbUser?.email ?? session.user.email
  await prisma.emailVerificationToken.deleteMany({ where: { email } })
  const token = randomBytes(32).toString("hex")
  await prisma.emailVerificationToken.create({
    data: {
      email,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    },
  })

  await sendVerificationEmail(email, token)
  return { success: true }
}

export async function verifyEmail(token: string) {
  const record = await prisma.emailVerificationToken.findUnique({ where: { token } })
  if (!record || record.expiresAt < new Date()) return { error: "Link inválido ou expirado." }

  await prisma.user.update({
    where: { email: record.email },
    data: { emailVerified: new Date() },
  })
  await prisma.emailVerificationToken.delete({ where: { token } })
  revalidatePath("/dashboard")
  return { success: true }
}
