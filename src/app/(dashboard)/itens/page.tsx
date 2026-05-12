import Link from "next/link"
import { Package, Plus } from "lucide-react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/ui/page-header"
import { EmptyState } from "@/components/ui/empty-state"
import { Pagination } from "@/components/ui/pagination"
import { ItemRow } from "@/components/itens/item-row"
import { SearchFilter } from "@/components/itens/search-filter"

const PER_PAGE = 20

interface Props {
  searchParams: Promise<{ q?: string; tags?: string; slotId?: string; page?: string }>
}

export default async function ItensPage({ searchParams }: Props) {
  const { q, tags: tagsParam, slotId, page: pageParam } = await searchParams
  const session = await auth()
  const userId = session!.user!.id!

  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1)
  const selectedTags = (tagsParam ?? "").split(",").filter(Boolean)

  const where = {
    userId,
    ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
    ...(selectedTags.length ? { tags: { some: { tag: { name: { in: selectedTags } } } } } : {}),
    ...(slotId ? { slotId } : {}),
  }

  const [items, total, allTags] = await Promise.all([
    prisma.item.findMany({
      where,
      include: {
        tags: { include: { tag: true } },
        slot: { include: { grouper: { include: { location: true } } } },
      },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.item.count({ where }),
    prisma.tag.findMany({
      where: { userId },
      select: { name: true },
      orderBy: { name: "asc" },
    }),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)
  const hasFilters = !!(q || selectedTags.length || slotId)

  function buildHref(page: number) {
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (tagsParam) params.set("tags", tagsParam)
    if (slotId) params.set("slotId", slotId)
    if (page > 1) params.set("page", String(page))
    const qs = params.toString()
    return `/itens${qs ? `?${qs}` : ""}`
  }

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
            {total} {total === 1 ? "item encontrado" : "itens encontrados"}
            {totalPages > 1 && ` — página ${currentPage} de ${totalPages}`}
          </p>
          {items.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            buildHref={buildHref}
          />
        </div>
      )}
    </div>
  )
}
