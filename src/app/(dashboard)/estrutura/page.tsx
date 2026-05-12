import { MapPin, Plus } from "lucide-react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/ui/page-header"
import { EmptyState } from "@/components/ui/empty-state"
import { LocationCard } from "@/components/estrutura/location-card"
import { LocationForm } from "@/components/estrutura/location-form"

export default async function EstruturaPage() {
  const session = await auth()
  const userId = session!.user!.id!

  const locations = await prisma.location.findMany({
    where: { userId },
    include: { _count: { select: { groupers: true } } },
    orderBy: { createdAt: "asc" },
  })

  return (
    <div>
      <PageHeader
        title="Estrutura"
        description="Organize seus locais, agrupadores e slots de armazenamento."
        action={
          <LocationForm
            trigger={
              <button className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Novo local
              </button>
            }
          />
        }
      />

      {locations.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="Nenhum local cadastrado"
          description="Comece criando um local físico, como Casa ou Consultório, e depois organize agrupadores e slots dentro dele."
          action={
            <LocationForm
              trigger={
                <button className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  Criar primeiro local
                </button>
              }
            />
          }
        />
      ) : (
        <div className="space-y-3">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      )}
    </div>
  )
}
