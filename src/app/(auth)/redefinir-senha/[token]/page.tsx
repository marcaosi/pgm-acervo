"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { use, useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { confirmPasswordReset } from "@/actions/password-reset"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-60"
    >
      {pending ? "Salvando..." : "Redefinir senha"}
    </button>
  )
}

interface Props {
  params: Promise<{ token: string }>
}

export default function RedefinirSenhaPage({ params }: Props) {
  const { token } = use(params)
  const [state, formAction] = useActionState(confirmPasswordReset, null)
  const [show, setShow] = useState(false)

  const inputClass =
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">pgm-acervo</h1>
        <p className="text-sm text-muted-foreground mt-1">Nova senha</p>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
        {state?.success ? (
          <div className="text-center space-y-3">
            <div className="text-4xl">✅</div>
            <p className="font-medium">Senha redefinida!</p>
            <p className="text-sm text-muted-foreground">
              Sua senha foi atualizada. Faça login com a nova senha.
            </p>
            <Link
              href="/login"
              className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Ir para o login
            </Link>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="token" value={token} />

            {state?.error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive">
                {state.error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nova senha</label>
              <div className="relative">
                <input
                  name="password"
                  type={show ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className={`${inputClass} pr-9`}
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  tabIndex={-1}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Confirmar senha</label>
              <input
                name="confirm"
                type={show ? "text" : "password"}
                required
                minLength={6}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            <SubmitButton />
          </form>
        )}
      </div>
    </div>
  )
}
