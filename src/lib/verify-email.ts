// Módulo sem "use server" e sem imports de email — seguro para Server Components
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function verifyEmail(token: string) {
  const record = await prisma.emailVerificationToken.findUnique({ where: { token } })
  if (!record || record.expiresAt < new Date()) {
    return { error: "Link inválido ou expirado. Solicite um novo no dashboard." }
  }

  await prisma.user.update({
    where: { email: record.email },
    data: { emailVerified: new Date() },
  })
  await prisma.emailVerificationToken.delete({ where: { token } })
  revalidatePath("/dashboard")
  return { success: true }
}
