"use client"

import { useRouter } from "next/navigation"
import { deleteItem } from "@/actions/item"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface DeleteItemButtonProps {
  id: string
  name: string
}

export function DeleteItemButton({ id, name }: DeleteItemButtonProps) {
  const router = useRouter()

  return (
    <ConfirmDialog
      title="Remover item?"
      description={`"${name}" será removido permanentemente do seu acervo. Esta ação não pode ser desfeita.`}
      onConfirm={async () => {
        await deleteItem(id)
        router.push("/itens")
      }}
      trigger={
        <button className="inline-flex h-9 items-center gap-2 rounded-md border border-destructive/30 px-3 text-sm text-destructive hover:bg-destructive/10">
          Remover
        </button>
      }
    />
  )
}
