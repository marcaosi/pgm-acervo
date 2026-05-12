import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { updateItem } from "@/actions/item"
import { ItemForm } from "@/components/itens/item-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarItemPage({ params }: Props) {
  const { id } = await params
  const session = await auth()
  const userId = session!.user!.id!

  const [item, locations, settings] = await Promise.all([
    prisma.item.findFirst({
      where: { id, userId },
      include: { tags: { include: { tag: true } } },
    }),
    prisma.location.findMany({
      where: { userId },
      include: {
        groupers: {
          include: { slots: { select: { id: true, name: true, code: true } } },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.userSettings.findUnique({ where: { userId } }),
  ])

  if (!item) notFound()

  const updateWithId = updateItem.bind(null, id)

  return (
    <div>
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        <Link href="/itens" className="hover:text-foreground transition-colors">
          Itens
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/itens/${id}`} className="hover:text-foreground transition-colors truncate max-w-[200px]">
          {item.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">Editar</span>
      </nav>

      <h1 className="text-2xl font-bold tracking-tight mb-6">Editar item</h1>

      <ItemForm
        action={updateWithId}
        digitalPreference={settings?.digitalItemPreference ?? "LINK"}
        locations={locations}
        cancelHref={`/itens/${id}`}
        initial={{
          name: item.name,
          description: item.description,
          type: item.type,
          digitalUrl: item.digitalUrl,
          digitalFileKey: item.digitalFileKey,
          tags: item.tags.map((t) => t.tag.name),
          slotId: item.slotId,
        }}
      />
    </div>
  )
}
