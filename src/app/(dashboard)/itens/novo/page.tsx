import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { createItem } from "@/actions/item"
import { ItemForm } from "@/components/itens/item-form"

export default async function NovoItemPage() {
  const session = await auth()
  const userId = session!.user!.id!

  const [locations, settings] = await Promise.all([
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

  return (
    <div>
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        <Link href="/itens" className="hover:text-foreground transition-colors">
          Itens
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">Novo item</span>
      </nav>

      <h1 className="text-2xl font-bold tracking-tight mb-6">Novo item</h1>

      <ItemForm
        action={createItem}
        digitalPreference={settings?.digitalItemPreference ?? "LINK"}
        locations={locations}
        cancelHref="/itens"
      />
    </div>
  )
}
