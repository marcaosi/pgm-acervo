"use client"

import { useState, useTransition } from "react"
import { X } from "lucide-react"
import { sendVerification } from "@/actions/email-verification"

export function EmailBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [sent, setSent] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (dismissed) return null

  function handleSend() {
    startTransition(async () => {
      await sendVerification()
      setSent(true)
    })
  }

  return (
    <div className="flex items-center gap-3 bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-800">
      <span className="flex-1">
        {sent
          ? "✅ E-mail de verificação enviado! Verifique sua caixa de entrada."
          : "⚠️ Seu e-mail ainda não foi verificado."}
      </span>
      {!sent && (
        <button
          onClick={handleSend}
          disabled={isPending}
          className="shrink-0 font-medium underline underline-offset-2 hover:text-amber-900 disabled:opacity-60"
        >
          {isPending ? "Enviando..." : "Reenviar verificação"}
        </button>
      )}
      <button onClick={() => setDismissed(true)} className="shrink-0 text-amber-600 hover:text-amber-900">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
