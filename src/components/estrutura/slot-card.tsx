"use client"

import Link from "next/link"
import { Box, Pencil, Trash2 } from "lucide-react"
import { deleteSlot } from "@/actions/slot"
import { SlotForm } from "./slot-form"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface SlotCardProps {
  slot: {
    id: string
    code: string
    name: string
    grouperId: string
    locationId: string
    _count: { items: number }
  }
}

export function SlotCard({ slot }: SlotCardProps) {
  const itemLabel = slot._count.items === 1 ? "1 item" : `${slot._count.items} itens`

  return (
    <div className="group rounded-lg border bg-card p-4 transition-colors hover:border-ring">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Box className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="font-mono text-xs text-muted-foreground">{slot.code}</span>
          </div>
          <p className="font-medium truncate">{slot.name}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{itemLabel}</p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <SlotForm
            grouperId={slot.grouperId}
            locationId={slot.locationId}
            slot={slot}
            trigger={
              <button className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Editar">
                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            }
          />
          <ConfirmDialog
            title="Remover slot?"
            description={`"${slot.name}" será removido. Os itens alocados aqui ficam sem slot.`}
            onConfirm={() => deleteSlot(slot.id, slot.grouperId, slot.locationId)}
            trigger={
              <button
                className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                title="Remover"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            }
          />
        </div>
      </div>

      {slot._count.items > 0 && (
        <Link
          href={`/itens?slotId=${slot.id}`}
          className="mt-3 inline-flex text-xs text-primary hover:underline"
        >
          Ver itens →
        </Link>
      )}
    </div>
  )
}
