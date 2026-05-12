import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight, FileDigit, Package, MapPin, ExternalLink, Pencil } from "lucide-react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { DeleteItemButton } from "@/components/itens/delete-item-button"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ItemPage({ params }: Props) {
  const { id } = await params
  const session = await auth()
  const userId = session!.user!.id!

  const item = await prisma.item.findFirst({
    where: { id, userId },
    include: {
      tags: { include: { tag: true } },
      slot: {
        include: {
          grouper: { include: { location: true } },
        },
      },
    },
  })

  if (!item) notFound()

  const isDigital = item.type === "DIGITAL"

  return (
    <div className="max-w-2xl">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        <Link href="/itens" className="hover:text-foreground transition-colors">
          Itens
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium truncate">{item.name}</span>
      </nav>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isDigital ? (
              <FileDigit className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Package className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="font-mono text-sm text-muted-foreground">{item.code}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{item.name}</h1>
          <span className="text-sm text-muted-foreground">
            {isDigital ? "Item digital" : "Item físico"}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/itens/${item.id}/editar`}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-input px-3 text-sm hover:bg-accent"
          >
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </Link>
          <DeleteItemButton id={item.id} name={item.name} />
        </div>
      </div>

      <div className="space-y-5 rounded-lg border bg-card p-5">
        {item.description && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Descrição
            </p>
            <p className="text-sm whitespace-pre-wrap">{item.description}</p>
          </div>
        )}

        {item.tags.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Tags
            </p>
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map(({ tag }) => (
                <span
                  key={tag.name}
                  className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Localização
          </p>
          {item.slot ? (
            <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2.5">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-sm">
                  {item.slot.grouper.location.name} › {item.slot.grouper.name} › {item.slot.name}
                </p>
                <p className="text-xs text-muted-foreground font-mono">{item.slot.code}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">Não alocado</p>
          )}
        </div>

        {isDigital && (item.digitalUrl || item.digitalFileKey) && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Arquivo digital
            </p>
            {item.digitalUrl && (
              <a
                href={item.digitalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Abrir arquivo
              </a>
            )}
            {item.digitalFileKey && (
              <a
                href={`/api/upload/view?key=${encodeURIComponent(item.digitalFileKey)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Baixar PDF
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
