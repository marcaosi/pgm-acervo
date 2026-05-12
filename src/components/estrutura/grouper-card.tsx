"use client"

import Link from "next/link"
import { Layers, ChevronRight, Pencil, Trash2 } from "lucide-react"
import { deleteGrouper } from "@/actions/grouper"
import { GrouperForm } from "./grouper-form"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface GrouperCardProps {
  grouper: {
    id: string
    name: string
    locationId: string
    _count: { slots: number }
  }
}

export function GrouperCard({ grouper }: GrouperCardProps) {
  const slotLabel = grouper._count.slots === 1 ? "1 slot" : `${grouper._count.slots} slots`

  return (
    <div className="group rounded-lg border bg-card transition-colors hover:border-ring">
      <div className="flex items-center p-4 gap-3">
        <Link
          href={`/estrutura/${grouper.locationId}/${grouper.id}`}
          className="flex flex-1 items-center gap-3 min-w-0"
        >
          <div className="shrink-0 rounded-md bg-muted p-2">
            <Layers className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{grouper.name}</p>
            <p className="text-sm text-muted-foreground">{slotLabel}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto shrink-0" />
        </Link>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <GrouperForm
            locationId={grouper.locationId}
            grouper={grouper}
            trigger={
              <button className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Editar">
                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            }
          />
          <ConfirmDialog
            title="Remover agrupador?"
            description={`"${grouper.name}" e todos os slots dentro dele serão removidos permanentemente.`}
            onConfirm={() => deleteGrouper(grouper.id, grouper.locationId)}
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
    </div>
  )
}
