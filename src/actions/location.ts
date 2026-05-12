"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

const schema = z.object({ name: z.string().min(1, "Nome obrigatório").max(100) })

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Não autenticado")
  return session.user.id
}

export async function createLocation(formData: FormData) {
  const userId = await getUserId()
  const parsed = schema.safeParse({ name: formData.get("name") })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await prisma.location.create({ data: { name: parsed.data.name, userId } })
  revalidatePath("/estrutura")
}

export async function updateLocation(id: string, formData: FormData) {
  const userId = await getUserId()
  const parsed = schema.safeParse({ name: formData.get("name") })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await prisma.location.updateMany({
    where: { id, userId },
    data: { name: parsed.data.name },
  })
  revalidatePath("/estrutura")
}

export async function deleteLocation(id: string) {
  const userId = await getUserId()
  await prisma.location.deleteMany({ where: { id, userId } })
  revalidatePath("/estrutura")
}
