"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Não autenticado")
  return session.user.id
}

const profileSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(100),
  email: z.string().email("E-mail inválido"),
})

export async function updateProfile(formData: FormData) {
  const userId = await getUserId()
  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const emailConflict = await prisma.user.findFirst({
    where: { email: parsed.data.email, NOT: { id: userId } },
  })
  if (emailConflict) return { error: "Este e-mail já está em uso" }

  await prisma.user.update({
    where: { id: userId },
    data: { name: parsed.data.name, email: parsed.data.email },
  })
  revalidatePath("/configuracoes")
  return { success: true }
}

export async function updateDigitalPreference(formData: FormData) {
  const userId = await getUserId()
  const preference = formData.get("preference")
  if (preference !== "LINK" && preference !== "UPLOAD") return { error: "Preferência inválida" }

  await prisma.userSettings.upsert({
    where: { userId },
    create: { userId, digitalItemPreference: preference },
    update: { digitalItemPreference: preference },
  })
  revalidatePath("/configuracoes")
  return { success: true }
}
