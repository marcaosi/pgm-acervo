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

export async function createGrouper(locationId: string, formData: FormData) {
  const userId = await getUserId()
  const parsed = schema.safeParse({ name: formData.get("name") })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const location = await prisma.location.findFirst({ where: { id: locationId, userId } })
  if (!location) return { error: "Local não encontrado" }

  await prisma.grouper.create({ data: { name: parsed.data.name, locationId } })
  revalidatePath(`/estrutura/${locationId}`)
}

export async function updateGrouper(id: string, locationId: string, formData: FormData) {
  const userId = await getUserId()
  const parsed = schema.safeParse({ name: formData.get("name") })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await prisma.grouper.updateMany({
    where: { id, location: { userId } },
    data: { name: parsed.data.name },
  })
  revalidatePath(`/estrutura/${locationId}`)
}

export async function deleteGrouper(id: string, locationId: string) {
  const userId = await getUserId()
  await prisma.grouper.deleteMany({ where: { id, location: { userId } } })
  revalidatePath(`/estrutura/${locationId}`)
}
