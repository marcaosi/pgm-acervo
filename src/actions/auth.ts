"use server"

import { AuthError } from "next-auth"
import bcrypt from "bcryptjs"
import { signIn } from "@/auth"
import { prisma } from "@/lib/prisma"

type ActionState = { error: string } | null

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) return { error: "Preencha todos os campos." }

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" })
    return null
  } catch (err) {
    if (err instanceof AuthError) return { error: "E-mail ou senha incorretos." }
    throw err // re-throw NEXT_REDIRECT para o Next.js processar
  }
}

export async function registerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")

  if (name.length < 2) return { error: "Nome deve ter pelo menos 2 caracteres." }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "E-mail inválido." }
  if (password.length < 6) return { error: "A senha deve ter pelo menos 6 caracteres." }

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return { error: "Este e-mail já está cadastrado." }

  const passwordHash = await bcrypt.hash(password, 12)
  await prisma.user.create({ data: { name, email, passwordHash } })

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" })
    return null
  } catch (err) {
    if (err instanceof AuthError) return { error: "Conta criada! Tente entrar manualmente." }
    throw err
  }
}

export async function googleSignIn() {
  await signIn("google", { redirectTo: "/dashboard" })
}
