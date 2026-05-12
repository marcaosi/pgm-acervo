"use server"

import { randomBytes } from "crypto"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/email"

// Chamada do EmailBanner (client component) — precisa de "use server"
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
    data: { email, token, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
  })

  await sendVerificationEmail(email, token)
  return { success: true }
}
