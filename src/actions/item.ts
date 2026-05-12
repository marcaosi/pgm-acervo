"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { generateItemCode } from "@/lib/utils"

const schema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(200),
  description: z.string().max(1000).optional(),
  type: z.enum(["PHYSICAL", "DIGITAL"]),
  digitalUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  digitalFileKey: z.string().optional().or(z.literal("")),
  slotId: z.string().optional().nullable(),
})

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Não autenticado")
  return session.user.id
}

async function uniqueItemCode() {
  let code = generateItemCode()
  while (await prisma.item.findUnique({ where: { code } })) {
    code = generateItemCode()
  }
  return code
}

async function syncTags(tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], itemId: string, userId: string, tagNames: string[]) {
  const normalized = tagNames.map((t) => t.trim().toLowerCase()).filter(Boolean)
  const tagIds: string[] = []

  for (const name of normalized) {
    const tag = await tx.tag.upsert({
      where: { name_userId: { name, userId } },
      create: { name, userId },
      update: {},
    })
    await tx.itemTag.upsert({
      where: { itemId_tagId: { itemId, tagId: tag.id } },
      create: { itemId, tagId: tag.id },
      update: {},
    })
    tagIds.push(tag.id)
  }

  await tx.itemTag.deleteMany({
    where: { itemId, tagId: { notIn: tagIds } },
  })
}

export async function createItem(formData: FormData) {
  const userId = await getUserId()

  const parsed = schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    type: formData.get("type"),
    digitalUrl: formData.get("digitalUrl"),
    digitalFileKey: formData.get("digitalFileKey"),
    slotId: formData.get("slotId") || null,
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const tagNames = formData.getAll("tag") as string[]
  const code = await uniqueItemCode()

  let itemId = ""
  await prisma.$transaction(async (tx) => {
    const item = await tx.item.create({
      data: {
        code,
        name: parsed.data.name,
        description: parsed.data.description || null,
        type: parsed.data.type,
        digitalUrl: parsed.data.digitalUrl || null,
        digitalFileKey: parsed.data.digitalFileKey || null,
        slotId: parsed.data.slotId || null,
        userId,
      },
    })
    itemId = item.id
    await syncTags(tx, item.id, userId, tagNames)
  })

  revalidatePath("/itens")
  redirect(`/itens/${itemId}`)
}

export async function updateItem(id: string, formData: FormData) {
  const userId = await getUserId()

  const existing = await prisma.item.findFirst({ where: { id, userId } })
  if (!existing) return { error: "Item não encontrado" }

  const parsed = schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    type: formData.get("type"),
    digitalUrl: formData.get("digitalUrl"),
    digitalFileKey: formData.get("digitalFileKey"),
    slotId: formData.get("slotId") || null,
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const tagNames = formData.getAll("tag") as string[]

  await prisma.$transaction(async (tx) => {
    await tx.item.update({
      where: { id },
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
        type: parsed.data.type,
        digitalUrl: parsed.data.digitalUrl || null,
        digitalFileKey: parsed.data.digitalFileKey || null,
        slotId: parsed.data.slotId || null,
      },
    })
    await syncTags(tx, id, userId, tagNames)
  })

  revalidatePath("/itens")
  revalidatePath(`/itens/${id}`)
  redirect(`/itens/${id}`)
}

export async function deleteItem(id: string) {
  const userId = await getUserId()
  await prisma.item.deleteMany({ where: { id, userId } })
  revalidatePath("/itens")
  redirect("/itens")
}
