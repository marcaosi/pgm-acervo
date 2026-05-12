import { notFound } from "next/navigation"
import Link from "next/link"
import { Layers, Plus, ChevronRight } from "lucide-react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/ui/page-header"
import { EmptyState } from "@/components/ui/empty-state"
import { GrouperCard } from "@/components/estrutura/grouper-card"
import { GrouperForm } from "@/components/estrutura/grouper-form"

interface Props {
  params: Promise<{ localId: string }>
}

export default async function LocalPage({ params }: Props) {
  const { localId } = await params
  const session = await auth()
  const userId = session!.user!.id!

  const location = await prisma.location.findFirst({
    where: { id: localId, userId },
    include: {
      groupers: {
        include: { _count: { select: { slots: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!location) notFound()

  return (
    <div>
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        <Link href="/estrutura" className="hover:text-foreground transition-colors">
          Estrutura
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{location.name}</span>
      </nav>

      <PageHeader
        title={location.name}
        description="Agrupadores dentro deste local."
        action={
          <GrouperForm
            locationId={location.id}
            trigger={
              <button className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Novo agrupador
              </button>
            }
          />
        }
      />

      {location.groupers.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="Nenhum agrupador cadastrado"
          description="Crie um agrupador dentro deste local, como Armário da Sala ou Estante, e organize seus slots."
          action={
            <GrouperForm
              locationId={location.id}
              trigger={
                <button className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  Criar primeiro agrupador
                </button>
              }
            />
          }
        />
      ) : (
        <div className="space-y-3">
          {location.groupers.map((grouper) => (
            <GrouperCard
              key={grouper.id}
              grouper={{ ...grouper, locationId: location.id }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
