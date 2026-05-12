"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  buildHref: (page: number) => string
}

export function Pagination({ currentPage, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = buildPageRange(currentPage, totalPages)

  const btnBase =
    "inline-flex h-8 min-w-8 items-center justify-center rounded-md border text-sm font-medium transition-colors"
  const btnActive = "bg-primary text-primary-foreground border-primary"
  const btnInactive = "border-input bg-background hover:bg-accent"
  const btnDisabled = "border-input bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"

  return (
    <nav className="flex items-center gap-1 justify-center mt-6">
      {currentPage <= 1 ? (
        <span className={cn(btnBase, btnDisabled, "px-2")}>
          <ChevronLeft className="h-4 w-4" />
        </span>
      ) : (
        <Link href={buildHref(currentPage - 1)} className={cn(btnBase, btnInactive, "px-2")}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1 text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page as number)}
            className={cn(btnBase, "px-3", page === currentPage ? btnActive : btnInactive)}
          >
            {page}
          </Link>
        )
      )}

      {currentPage >= totalPages ? (
        <span className={cn(btnBase, btnDisabled, "px-2")}>
          <ChevronRight className="h-4 w-4" />
        </span>
      ) : (
        <Link href={buildHref(currentPage + 1)} className={cn(btnBase, btnInactive, "px-2")}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  )
}

function buildPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total]
  if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total]
  return [1, "...", current - 1, current, current + 1, "...", total]
}
