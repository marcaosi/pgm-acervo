"use server"

import { randomBytes } from "crypto"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"

type State = { error?: string; success?: boolean } | null

export async function requestPasswordReset(_prev: State, formData: FormData): Promise<State> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  if (!email) return { error: "Informe seu e-mail." }

  const user = await prisma.user.findUnique({ where: { email } })

  // Não revelamos se o e-mail existe (segurança)
  if (!user || !user.passwordHash) return { success: true }

  // Remove tokens anteriores e cria um novo
  await prisma.passwordResetToken.deleteMany({ where: { email } })
  const token = randomBytes(32).toString("hex")
  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
    },
  })

  await sendPasswordResetEmail(email, token)
  return { success: true }
}

const resetSchema = z
  .object({
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "As senhas não coincidem.", path: ["confirm"] })

export async function confirmPasswordReset(_prev: State, formData: FormData): Promise<State> {
  const token = String(formData.get("token") ?? "")
  const parsed = resetSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const record = await prisma.passwordResetToken.findUnique({ where: { token } })
  if (!record || record.expiresAt < new Date()) {
    return { error: "Link inválido ou expirado. Solicite um novo." }
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12)
  await prisma.user.update({
    where: { email: record.email },
    data: { passwordHash },
  })
  await prisma.passwordResetToken.delete({ where: { token } })

  return { success: true }
}
