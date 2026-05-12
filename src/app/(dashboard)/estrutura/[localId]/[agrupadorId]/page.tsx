import { notFound } from "next/navigation"
import Link from "next/link"
import { Box, Plus, ChevronRight } from "lucide-react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/ui/page-header"
import { EmptyState } from "@/components/ui/empty-state"
import { SlotCard } from "@/components/estrutura/slot-card"
import { SlotForm } from "@/components/estrutura/slot-form"

interface Props {
  params: Promise<{ localId: string; agrupadorId: string }>
}

export default async function AgrupadorPage({ params }: Props) {
  const { localId, agrupadorId } = await params
  const session = await auth()
  const userId = session!.user!.id!

  const grouper = await prisma.grouper.findFirst({
    where: { id: agrupadorId, location: { id: localId, userId } },
    include: {
      location: true,
      slots: {
        include: { _count: { select: { items: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!grouper) notFound()

  return (
    <div>
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        <Link href="/estrutura" className="hover:text-foreground transition-colors">
          Estrutura
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href={`/estrutura/${localId}`}
          className="hover:text-foreground transition-colors"
        >
          {grouper.location.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{grouper.name}</span>
      </nav>

      <PageHeader
        title={grouper.name}
        description="Slots dentro deste agrupador."
        action={
          <SlotForm
            grouperId={grouper.id}
            locationId={localId}
            trigger={
              <button className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Novo slot
              </button>
            }
          />
        }
      />

      {grouper.slots.length === 0 ? (
        <EmptyState
          icon={Box}
          title="Nenhum slot cadastrado"
          description="Crie slots dentro deste agrupador, como Prateleira 1 ou Gaveta Superior. Cada slot recebe um código único para etiqueta."
          action={
            <SlotForm
              grouperId={grouper.id}
              locationId={localId}
              trigger={
                <button className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  Criar primeiro slot
                </button>
              }
            />
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {grouper.slots.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={{ ...slot, grouperId: grouper.id, locationId: localId }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
