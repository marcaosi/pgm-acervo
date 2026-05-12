"use client"

import { useState, useTransition } from "react"
import { updateProfile } from "@/actions/settings"

interface ProfileFormProps {
  user: { name: string | null; email: string }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await updateProfile(formData)
      if (result?.error) {
        setMessage({ type: "error", text: result.error })
      } else {
        setMessage({ type: "success", text: "Perfil atualizado com sucesso." })
      }
    })
  }

  const inputClass =
    "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">Nome</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={user.name ?? ""}
          className={inputClass}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={user.email}
          className={inputClass}
        />
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
        {isPending ? "Salvando..." : "Salvar perfil"}
      </button>
    </form>
  )
}
