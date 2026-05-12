"use client"

import Link from "next/link"
import { MapPin, ChevronRight, Pencil, Trash2 } from "lucide-react"
import { deleteLocation } from "@/actions/location"
import { LocationForm } from "./location-form"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface LocationCardProps {
  location: {
    id: string
    name: string
    _count: { groupers: number }
  }
}

export function LocationCard({ location }: LocationCardProps) {
  const grouperLabel =
    location._count.groupers === 1 ? "1 agrupador" : `${location._count.groupers} agrupadores`

  return (
    <div className="group rounded-lg border bg-card transition-colors hover:border-ring">
      <div className="flex items-center p-4 gap-3">
        <Link
          href={`/estrutura/${location.id}`}
          className="flex flex-1 items-center gap-3 min-w-0"
        >
          <div className="shrink-0 rounded-md bg-muted p-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{location.name}</p>
            <p className="text-sm text-muted-foreground">{grouperLabel}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto shrink-0" />
        </Link>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <LocationForm
            location={location}
            trigger={
              <button className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Editar">
                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            }
          />
          <ConfirmDialog
            title="Remover local?"
            description={`"${location.name}" e todos os agrupadores e slots dentro dele serão removidos permanentemente.`}
            onConfirm={() => deleteLocation(location.id)}
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
