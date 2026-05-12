"use client"

import { useState, useTransition, useRef } from "react"
import Link from "next/link"
import { Upload, FileText, X } from "lucide-react"
import { TagInput } from "./tag-input"
import { SlotSelector } from "./slot-selector"

interface ItemFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (formData: FormData) => Promise<any> | void
  digitalPreference: "LINK" | "UPLOAD"
  locations: Array<{
    id: string
    name: string
    groupers: Array<{
      id: string
      name: string
      slots: Array<{ id: string; name: string; code: string }>
    }>
  }>
  cancelHref: string
  initial?: {
    name: string
    description?: string | null
    type: "PHYSICAL" | "DIGITAL"
    digitalUrl?: string | null
    digitalFileKey?: string | null
    tags: string[]
    slotId?: string | null
  }
}

const MAX_SIZE = 50 * 1024 * 1024

export function ItemForm({ action, digitalPreference, locations, cancelHref, initial }: ItemFormProps) {
  const [type, setType] = useState<"PHYSICAL" | "DIGITAL">(initial?.type ?? "PHYSICAL")
  const [isPending, startTransition] = useTransition()
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadedKey, setUploadedKey] = useState<string | null>(initial?.digitalFileKey ?? null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const inputClass =
    "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setUploadError(null)
    if (!file) { setSelectedFile(null); return }
    if (file.type !== "application/pdf") {
      setUploadError("Apenas arquivos PDF são aceitos.")
      e.target.value = ""
      return
    }
    if (file.size > MAX_SIZE) {
      setUploadError("Arquivo muito grande (máx. 50 MB).")
      e.target.value = ""
      return
    }
    setSelectedFile(file)
    setUploadedKey(null) // reset previous key when new file selected
  }

  async function uploadFile(file: File): Promise<string | null> {
    setUploading(true)
    try {
      const res = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }),
      })
      const data = await res.json()
      if (!res.ok) { setUploadError(data.error ?? "Erro ao preparar upload."); return null }

      const putRes = await fetch(data.presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      })
      if (!putRes.ok) { setUploadError("Erro ao enviar o arquivo. Tente novamente."); return null }

      return data.key as string
    } catch {
      setUploadError("Erro de conexão ao enviar o arquivo.")
      return null
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setUploadError(null)

    // Se digital + upload, fazer o upload antes de submeter
    if (type === "DIGITAL" && digitalPreference === "UPLOAD") {
      let key = uploadedKey

      if (selectedFile) {
        key = await uploadFile(selectedFile)
        if (!key) return // upload falhou, não submete
        setUploadedKey(key)
      }

      if (key) formData.set("digitalFileKey", key)
      formData.delete("digitalUrl")
    } else {
      formData.delete("digitalFileKey")
    }

    startTransition(async () => {
      await action(formData)
    })
  }

  const isSubmitting = isPending || uploading

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Nome <span className="text-destructive">*</span>
        </label>
        <input
          name="name"
          type="text"
          required
          defaultValue={initial?.name}
          placeholder="Nome do item"
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Descrição</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ""}
          placeholder="Descrição do item (opcional)"
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium">Tipo</span>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="PHYSICAL"
              checked={type === "PHYSICAL"}
              onChange={() => setType("PHYSICAL")}
              className="h-4 w-4"
            />
            <span className="text-sm">Físico</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="DIGITAL"
              checked={type === "DIGITAL"}
              onChange={() => setType("DIGITAL")}
              className="h-4 w-4"
            />
            <span className="text-sm">Digital</span>
          </label>
        </div>
      </div>

      {type === "DIGITAL" && (
        <div className="space-y-1.5 rounded-md border border-dashed p-4">
          <label className="text-sm font-medium">Arquivo digital</label>

          {digitalPreference === "LINK" ? (
            <input
              name="digitalUrl"
              type="url"
              defaultValue={initial?.digitalUrl ?? ""}
              placeholder="https://drive.google.com/..."
              className={inputClass}
            />
          ) : (
            <div className="space-y-3">
              {/* Arquivo já salvo (edição) */}
              {uploadedKey && !selectedFile && (
                <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="flex-1 truncate text-muted-foreground">Arquivo salvo</span>
                  <button
                    type="button"
                    onClick={() => { setUploadedKey(null); if (fileInputRef.current) fileInputRef.current.value = "" }}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Novo arquivo selecionado */}
              {selectedFile && (
                <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="flex-1 truncate">{selectedFile.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                  <button
                    type="button"
                    onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = "" }}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Input de arquivo */}
              {!uploadedKey && !selectedFile && (
                <label className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-muted-foreground/30 py-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Clique para selecionar um PDF
                  </span>
                  <span className="text-xs text-muted-foreground">Máx. 50 MB</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
              )}

              {/* Botão de troca quando já há arquivo */}
              {(uploadedKey || selectedFile) && (
                <button
                  type="button"
                  onClick={() => { setUploadedKey(null); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = "" }}
                  className="text-sm text-primary hover:underline"
                >
                  Trocar arquivo
                </button>
              )}
            </div>
          )}

          {uploadError && (
            <p className="text-sm text-destructive">{uploadError}</p>
          )}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Tags</label>
        <TagInput initialTags={initial?.tags ?? []} />
        <p className="text-xs text-muted-foreground">
          Pressione Enter ou vírgula para adicionar uma tag.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Slot (opcional)</label>
        <SlotSelector locations={locations} initialSlotId={initial?.slotId} />
      </div>

      <div className="flex gap-3 pt-2">
        <Link
          href={cancelHref}
          className="inline-flex h-9 items-center rounded-md border border-input px-4 text-sm hover:bg-accent"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-9 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {uploading ? "Enviando arquivo..." : isPending ? "Salvando..." : "Salvar item"}
        </button>
      </div>
    </form>
  )
}
