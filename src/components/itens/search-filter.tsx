"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTransition, useState, useCallback, useEffect } from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchFilterProps {
  allTags: string[]
}

export function SearchFilter({ allTags }: SearchFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [q, setQ] = useState(searchParams.get("q") ?? "")

  const selectedTags = (searchParams.get("tags") ?? "").split(",").filter(Boolean)

  const push = useCallback(
    (params: URLSearchParams) => {
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [pathname, router]
  )

  // Auto-debounce: dispara busca 400ms após parar de digitar
  useEffect(() => {
    const timeout = setTimeout(() => {
      const current = searchParams.get("q") ?? ""
      if (q === current) return
      const params = new URLSearchParams(searchParams)
      if (q) params.set("q", q)
      else params.delete("q")
      push(params)
    }, 400)
    return () => clearTimeout(timeout)
  }, [q]) // eslint-disable-line react-hooks/exhaustive-deps

  function toggleTag(tag: string) {
    const params = new URLSearchParams(searchParams)
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag]
    if (next.length) params.set("tags", next.join(","))
    else params.delete("tags")
    push(params)
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nome..."
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            isPending && "opacity-70"
          )}
        />
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                selectedTags.includes(tag)
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
