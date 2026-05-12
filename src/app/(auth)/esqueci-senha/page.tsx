"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import Link from "next/link"
import { requestPasswordReset } from "@/actions/password-reset"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-60"
    >
      {pending ? "Enviando..." : "Enviar link de redefinição"}
    </button>
  )
}

export default function EsqueciSenhaPage() {
  const [state, formAction] = useActionState(requestPasswordReset, null)

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">pgm-acervo</h1>
        <p className="text-sm text-muted-foreground mt-1">Recuperar senha</p>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
        {state?.success ? (
          <div className="text-center space-y-3">
            <div className="text-4xl">📬</div>
            <p className="font-medium">Verifique seu e-mail</p>
            <p className="text-sm text-muted-foreground">
              Se esse e-mail estiver cadastrado, você receberá um link para redefinir sua senha em
              breve.
            </p>
            <Link href="/login" className="inline-block text-sm text-primary hover:underline">
              Voltar para o login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Informe seu e-mail e enviaremos um link para criar uma nova senha.
            </p>
            <form action={formAction} className="space-y-4">
              {state?.error && (
                <p className="text-sm text-destructive">{state.error}</p>
              )}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium">E-mail</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <SubmitButton />
            </form>
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                Voltar para o login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
