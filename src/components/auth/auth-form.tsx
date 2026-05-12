"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { loginAction, registerAction, googleSignIn } from "@/actions/auth"
import { cn } from "@/lib/utils"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function validateName(v: string) {
  if (!v.trim()) return "Nome é obrigatório."
  if (v.trim().length < 2) return "Nome deve ter pelo menos 2 caracteres."
  return null
}

function validateEmail(v: string) {
  if (!v.trim()) return "E-mail é obrigatório."
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return "E-mail inválido."
  return null
}

function validatePassword(v: string) {
  if (!v) return "Senha é obrigatória."
  if (v.length < 6) return "A senha deve ter pelo menos 6 caracteres."
  return null
}

function passwordStrength(p: string): { level: 0 | 1 | 2 | 3; label: string; color: string } {
  if (!p) return { level: 0, label: "", color: "" }
  if (p.length < 6) return { level: 1, label: "Fraca", color: "text-destructive" }
  const checks = [p.length >= 8, /[A-Z]/.test(p) && /[a-z]/.test(p), /[0-9]/.test(p), /[^A-Za-z0-9]/.test(p)]
  const score = checks.filter(Boolean).length
  if (score <= 2) return { level: 1, label: "Fraca", color: "text-destructive" }
  if (score === 3) return { level: 2, label: "Média", color: "text-yellow-600" }
  return { level: 3, label: "Forte", color: "text-green-600" }
}

function inputClass(error?: string | null) {
  return cn(
    "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
    "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1",
    error ? "border-destructive focus-visible:ring-destructive" : "border-input focus-visible:ring-ring"
  )
}

// ─── Submit button com estado de pending ─────────────────────────────────────

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-60 transition-opacity"
    >
      {pending ? "Aguarde..." : label}
    </button>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface AuthFormProps {
  mode: "login" | "signup"
}

export function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === "login"
  const [state, formAction] = useActionState(isLogin ? loginAction : registerAction, null)

  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string | null
    email?: string | null
    password?: string | null
  }>({})

  const strength = !isLogin ? passwordStrength(password) : null

  function blurValidate(field: "name" | "email" | "password", value: string) {
    const fn = { name: validateName, email: validateEmail, password: validatePassword }[field]
    setFieldErrors((p) => ({ ...p, [field]: fn(value) }))
  }

  function clearError(field: "name" | "email" | "password") {
    setFieldErrors((p) => ({ ...p, [field]: null }))
  }

  function handleSubmit(e: React.FormEvent) {
    const errors: typeof fieldErrors = {}
    if (!isLogin) {
      const err = validateName(name)
      if (err) errors.name = err
    }
    const emailErr = validateEmail(email)
    if (emailErr) errors.email = emailErr
    const passErr = validatePassword(password)
    if (passErr) errors.password = passErr

    if (Object.keys(errors).some((k) => !!errors[k as keyof typeof errors])) {
      e.preventDefault()
      setFieldErrors(errors)
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">pgm-acervo</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isLogin ? "Entre na sua conta" : "Crie sua conta"}
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
        {/* Formulário e-mail/senha */}
        <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
          {state?.error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive">
              {state.error}
            </div>
          )}

          {!isLogin && (
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Nome completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); clearError("name") }}
                onBlur={(e) => blurValidate("name", e.target.value)}
                className={inputClass(fieldErrors.name)}
                placeholder="Seu nome"
                autoComplete="name"
              />
              {fieldErrors.name && (
                <p className="text-xs text-destructive">{fieldErrors.name}</p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError("email") }}
              onBlur={(e) => blurValidate("email", e.target.value)}
              className={inputClass(fieldErrors.email)}
              placeholder="seu@email.com"
              autoComplete="email"
            />
            {fieldErrors.email && (
              <p className="text-xs text-destructive">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError("password") }}
                onBlur={(e) => blurValidate("password", e.target.value)}
                className={cn(inputClass(fieldErrors.password), "pr-9")}
                placeholder="••••••••"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-destructive">{fieldErrors.password}</p>
            )}

            {/* Indicador de força (apenas no cadastro) */}
            {!isLogin && strength && strength.level > 0 && (
              <div className="space-y-1 pt-0.5">
                <div className="flex gap-1">
                  {([1, 2, 3] as const).map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors duration-300",
                        i <= strength.level
                          ? strength.level === 1
                            ? "bg-destructive"
                            : strength.level === 2
                            ? "bg-yellow-500"
                            : "bg-green-500"
                          : "bg-muted"
                      )}
                    />
                  ))}
                </div>
                <p className={cn("text-xs", strength.color)}>Senha {strength.label.toLowerCase()}</p>
              </div>
            )}
          </div>

          <SubmitButton label={isLogin ? "Entrar com e-mail" : "Criar conta"} />
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">ou</span>
          </div>
        </div>

        {/* Google */}
        <form action={googleSignIn}>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {isLogin ? "Entrar com Google" : "Continuar com Google"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isLogin ? (
            <>
              Não tem conta?{" "}
              <Link href="/cadastro" className="underline underline-offset-4 hover:text-primary">
                Cadastre-se
              </Link>
            </>
          ) : (
            <>
              Já tem conta?{" "}
              <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                Entrar
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
