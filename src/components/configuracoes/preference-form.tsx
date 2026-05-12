"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { updateDigitalPreference } from "@/actions/settings"

interface PreferenceFormProps {
  current: "LINK" | "UPLOAD"
}

export function PreferenceForm({ current }: PreferenceFormProps) {
  const [selected, setSelected] = useState<"LINK" | "UPLOAD">(current)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await updateDigitalPreference(formData)
      if (result?.error) {
        setMessage({ type: "error", text: result.error })
        toast.error(result.error)
      } else {
        setMessage({ type: "success", text: "Preferência salva com sucesso." })
        toast.success("Preferência salva!")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="preference" value={selected} />

      <div className="space-y-3">
        <label
          className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
            selected === "LINK" ? "border-ring bg-accent/40" : "hover:bg-muted/40"
          }`}
          onClick={() => setSelected("LINK")}
        >
          <input
            type="radio"
            name="_pref"
            value="LINK"
            checked={selected === "LINK"}
            onChange={() => setSelected("LINK")}
            className="mt-0.5 h-4 w-4"
          />
          <div>
            <p className="text-sm font-medium">Link externo (URL)</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Informe um link do Google Drive, Dropbox ou outro serviço.
            </p>
          </div>
        </label>

        <label
          className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
            selected === "UPLOAD" ? "border-ring bg-accent/40" : "hover:bg-muted/40"
          }`}
          onClick={() => setSelected("UPLOAD")}
        >
          <input
            type="radio"
            name="_pref"
            value="UPLOAD"
            checked={selected === "UPLOAD"}
            onChange={() => setSelected("UPLOAD")}
            className="mt-0.5 h-4 w-4"
          />
          <div>
            <p className="text-sm font-medium">Upload de arquivo (PDF)</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Envie o arquivo direto para o sistema. Máx. 50 MB — armazenado no Cloudflare R2.
            </p>
          </div>
        </label>
      </div>

      {message && (
        <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-destructive"}`}>
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {isPending ? "Salvando..." : "Salvar preferência"}
      </button>
    </form>
  )
}
