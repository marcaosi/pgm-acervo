import Link from "next/link"
import { Package, Plus } from "lucide-react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/ui/page-header"
import { EmptyState } from "@/components/ui/empty-state"
import { ItemRow } from "@/components/itens/item-row"
import { SearchFilter } from "@/components/itens/search-filter"

interface Props {
  searchParams: Promise<{ q?: string; tags?: string; slotId?: string }>
}

export default async function ItensPage({ searchParams }: Props) {
  const { q, tags: tagsParam, slotId } = await searchParams
  const session = await auth()
  const userId = session!.user!.id!

  const selectedTags = (tagsParam ?? "").split(",").filter(Boolean)

  const [items, allTags] = await Promise.all([
    prisma.item.findMany({
      where: {
        userId,
        ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
        ...(selectedTags.length
          ? { tags: { some: { tag: { name: { in: selectedTags } } } } }
          : {}),
        ...(slotId ? { slotId } : {}),
      },
      include: {
        tags: { include: { tag: true } },
        slot: { include: { grouper: { include: { location: true } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.tag.findMany({
      where: { userId },
      select: { name: true },
      orderBy: { name: "asc" },
    }),
  ])

  const hasFilters = !!(q || selectedTags.length || slotId)

  return (
    <div>
      <PageHeader
        title="Itens"
        description="Gerencie os itens do seu acervo."
        action={
          <Link
            href="/itens/novo"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Novo item
          </Link>
        }
      />

      <div className="mb-5">
        <SearchFilter allTags={allTags.map((t) => t.name)} />
      </div>

      {items.length === 0 ? (
        hasFilters ? (
          <div className="rounded-lg border border-dashed p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum item encontrado para os filtros aplicados.
            </p>
            <Link href="/itens" className="mt-2 inline-block text-sm text-primary hover:underline">
              Limpar filtros
            </Link>
          </div>
        ) : (
          <EmptyState
            icon={Package}
            title="Seu acervo está vazio"
            description="Cadastre seu primeiro item para começar a organizar seu acervo."
            action={
              <Link
                href="/itens/novo"
                className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Adicionar primeiro item
              </Link>
            }
          />
        )
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground mb-3">
            {items.length} {items.length === 1 ? "item encontrado" : "itens encontrados"}
          </p>
          {items.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
