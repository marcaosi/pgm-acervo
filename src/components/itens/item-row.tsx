import Link from "next/link"
import { FileDigit, Package } from "lucide-react"

interface ItemRowProps {
  item: {
    id: string
    code: string
    name: string
    type: "PHYSICAL" | "DIGITAL"
    tags: Array<{ tag: { name: string } }>
    slot: {
      name: string
      code: string
      grouper: {
        name: string
        location: { name: string }
      }
    } | null
  }
}

export function ItemRow({ item }: ItemRowProps) {
  const location = item.slot
    ? `${item.slot.grouper.location.name} › ${item.slot.grouper.name} › ${item.slot.name}`
    : null

  return (
    <Link
      href={`/itens/${item.id}`}
      className="flex items-center gap-4 rounded-lg border bg-card px-4 py-3 hover:border-ring transition-colors group"
    >
      <div className="shrink-0 text-muted-foreground">
        {item.type === "DIGITAL" ? (
          <FileDigit className="h-5 w-5" />
        ) : (
          <Package className="h-5 w-5" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground shrink-0">{item.code}</span>
          <span className="font-medium truncate">{item.name}</span>
        </div>
        {location && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">📍 {location}</p>
        )}
        {!location && (
          <p className="text-xs text-muted-foreground mt-0.5 italic">Não alocado</p>
        )}
      </div>

      {item.tags.length > 0 && (
        <div className="hidden sm:flex flex-wrap gap-1 shrink-0 max-w-[200px]">
          {item.tags.slice(0, 3).map(({ tag }) => (
            <span
              key={tag.name}
              className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium"
            >
              {tag.name}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              +{item.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </Link>
  )
}
