import Link from "next/link"
import { Package, Box, MapPin, PackageX, Plus, Search } from "lucide-react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ItemRow } from "@/components/itens/item-row"
import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist"

interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  href?: string
}

function StatCard({ label, value, icon, href }: StatCardProps) {
  const content = (
    <div className="rounded-lg border bg-card p-5 flex items-center gap-4">
      <div className="rounded-md bg-muted p-3 shrink-0">{icon}</div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
  if (href) {
    return (
      <Link href={href} className="block hover:opacity-90 transition-opacity">
        {content}
      </Link>
    )
  }
  return content
}

export default async function DashboardPage() {
  const session = await auth()
  const userId = session!.user!.id!

  const [totalItems, totalSlots, totalLocations, unallocated, recentItems, hasGrouper, hasSlot] =
    await Promise.all([
      prisma.item.count({ where: { userId } }),
      prisma.slot.count({ where: { grouper: { location: { userId } } } }),
      prisma.location.count({ where: { userId } }),
      prisma.item.count({ where: { userId, slotId: null } }),
      prisma.item.findMany({
        where: { userId },
        include: {
          tags: { include: { tag: true } },
          slot: { include: { grouper: { include: { location: true } } } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.grouper.count({ where: { location: { userId } } }),
      prisma.slot.count({ where: { grouper: { location: { userId } } } }),
    ])

  return (
    <div className="space-y-8">
      <OnboardingChecklist
        hasLocation={totalLocations > 0}
        hasGrouper={hasGrouper > 0}
        hasSlot={totalSlots > 0}
        hasItem={totalItems > 0}
      />

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Bem-vindo de volta, {session?.user?.name?.split(" ")[0] ?? "usuário"}.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Itens no acervo"
          value={totalItems}
          href="/itens"
          icon={<Package className="h-5 w-5 text-muted-foreground" />}
        />
        <StatCard
          label="Slots cadastrados"
          value={totalSlots}
          href="/estrutura"
          icon={<Box className="h-5 w-5 text-muted-foreground" />}
        />
        <StatCard
          label="Locais"
          value={totalLocations}
          href="/estrutura"
          icon={<MapPin className="h-5 w-5 text-muted-foreground" />}
        />
        <StatCard
          label="Sem slot"
          value={unallocated}
          href="/itens"
          icon={<PackageX className="h-5 w-5 text-muted-foreground" />}
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <form action="/itens" method="get">
            <input
              name="q"
              type="search"
              placeholder="Buscar itens..."
              className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </form>
        </div>
        <Link
          href="/itens/novo"
          className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 shrink-0"
        >
          <Plus className="h-4 w-4" />
          Novo item
        </Link>
      </div>

      {recentItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Itens recentes</h2>
            <Link href="/itens" className="text-sm text-primary hover:underline">
              Ver todos →
            </Link>
          </div>
          <div className="space-y-2">
            {recentItems.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {totalItems === 0 && (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">Seu acervo está vazio</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Comece criando a estrutura de locais e slots, ou adicione um item direto.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/estrutura"
              className="inline-flex h-9 items-center rounded-md border border-input px-4 text-sm hover:bg-accent"
            >
              Criar estrutura
            </Link>
            <Link
              href="/itens/novo"
              className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Adicionar item
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
