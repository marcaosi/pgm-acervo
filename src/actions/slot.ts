"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { generateSlotCode } from "@/lib/utils"

const schema = z.object({ name: z.string().min(1, "Nome obrigatório").max(100) })

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Não autenticado")
  return session.user.id
}

async function uniqueSlotCode() {
  let code = generateSlotCode()
  while (await prisma.slot.findUnique({ where: { code } })) {
    code = generateSlotCode()
  }
  return code
}

export async function createSlot(grouperId: string, locationId: string, formData: FormData) {
  const userId = await getUserId()
  const parsed = schema.safeParse({ name: formData.get("name") })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const grouper = await prisma.grouper.findFirst({
    where: { id: grouperId, location: { userId } },
  })
  if (!grouper) return { error: "Agrupador não encontrado" }

  const code = await uniqueSlotCode()
  await prisma.slot.create({ data: { code, name: parsed.data.name, grouperId } })
  revalidatePath(`/estrutura/${locationId}/${grouperId}`)
}

export async function updateSlot(id: string, grouperId: string, locationId: string, formData: FormData) {
  const userId = await getUserId()
  const parsed = schema.safeParse({ name: formData.get("name") })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await prisma.slot.updateMany({
    where: { id, grouper: { location: { userId } } },
    data: { name: parsed.data.name },
  })
  revalidatePath(`/estrutura/${locationId}/${grouperId}`)
}

export async function deleteSlot(id: string, grouperId: string, locationId: string) {
  const userId = await getUserId()
  await prisma.slot.deleteMany({ where: { id, grouper: { location: { userId } } } })
  revalidatePath(`/estrutura/${locationId}/${grouperId}`)
}
