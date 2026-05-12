"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { useState, useTransition } from "react"
import { createGrouper, updateGrouper } from "@/actions/grouper"

interface GrouperFormProps {
  locationId: string
  grouper?: { id: string; name: string }
  trigger: React.ReactNode
}

export function GrouperForm({ locationId, grouper, trigger }: GrouperFormProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      if (grouper) {
        await updateGrouper(grouper.id, locationId, formData)
      } else {
        await createGrouper(locationId, formData)
      }
      setOpen(false)
    })
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold mb-4">
            {grouper ? "Editar agrupador" : "Novo agrupador"}
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="grp-name" className="text-sm font-medium">
                Nome <span className="text-destructive">*</span>
              </label>
              <input
                id="grp-name"
                name="name"
                type="text"
                required
                defaultValue={grouper?.name}
                placeholder="Ex: Armário da Sala, Estante"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex h-9 items-center rounded-md border border-input px-4 text-sm hover:bg-accent"
                >
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isPending ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
