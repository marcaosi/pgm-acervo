import Link from "next/link"
import { CheckCircle2, Circle, MapPin, Layers, Box, Package } from "lucide-react"

interface OnboardingChecklistProps {
  hasLocation: boolean
  hasGrouper: boolean
  hasSlot: boolean
  hasItem: boolean
}

const steps = [
  {
    key: "hasLocation" as const,
    icon: MapPin,
    label: "Criar seu primeiro local",
    description: "Ex: Casa, Consultório",
    href: "/estrutura",
    cta: "Criar local",
  },
  {
    key: "hasGrouper" as const,
    icon: Layers,
    label: "Adicionar um agrupador",
    description: "Ex: Armário, Estante",
    href: "/estrutura",
    cta: "Criar agrupador",
  },
  {
    key: "hasSlot" as const,
    icon: Box,
    label: "Criar um slot",
    description: "Ex: Prateleira 1, Gaveta",
    href: "/estrutura",
    cta: "Criar slot",
  },
  {
    key: "hasItem" as const,
    icon: Package,
    label: "Cadastrar seu primeiro item",
    description: "Físico ou digital",
    href: "/itens/novo",
    cta: "Adicionar item",
  },
]

export function OnboardingChecklist({
  hasLocation,
  hasGrouper,
  hasSlot,
  hasItem,
}: OnboardingChecklistProps) {
  const state = { hasLocation, hasGrouper, hasSlot, hasItem }
  const completed = steps.filter((s) => state[s.key]).length
  const allDone = completed === steps.length

  if (allDone) return null

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-slate-900">Configure seu acervo</h2>
          <p className="text-sm text-muted-foreground">
            {completed} de {steps.length} etapas concluídas
          </p>
        </div>
        <div className="flex gap-1">
          {steps.map((s) => (
            <div
              key={s.key}
              className={`h-2 w-8 rounded-full transition-colors ${
                state[s.key] ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {steps.map(({ key, icon: Icon, label, description, href, cta }) => {
          const done = state[key]
          return (
            <div
              key={key}
              className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
                done ? "bg-background opacity-60" : "bg-background"
              }`}
            >
              {done ? (
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
              <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${done ? "line-through text-muted-foreground" : ""}`}>
                  {label}
                </p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              {!done && (
                <Link
                  href={href}
                  className="shrink-0 inline-flex h-7 items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  {cta}
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
