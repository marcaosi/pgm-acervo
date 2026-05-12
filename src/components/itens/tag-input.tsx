"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"

interface TagInputProps {
  initialTags?: string[]
}

export function TagInput({ initialTags = [] }: TagInputProps) {
  const [tags, setTags] = useState<string[]>(initialTags)
  const [inputValue, setInputValue] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([])
      return
    }
    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/tags?q=${encodeURIComponent(inputValue.trim())}`)
      const data: string[] = await res.json()
      setSuggestions(data.filter((t) => !tags.includes(t)))
    }, 200)
    return () => clearTimeout(timeout)
  }, [inputValue, tags])

  function addTag(tag: string) {
    const normalized = tag.trim().toLowerCase()
    if (!normalized || tags.includes(normalized)) return
    setTags((prev) => [...prev, normalized])
    setInputValue("")
    setSuggestions([])
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      {tags.map((tag) => (
        <input key={tag} type="hidden" name="tag" value={tag} />
      ))}

      <div
        className="flex flex-wrap gap-1.5 min-h-[38px] w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm shadow-sm focus-within:ring-1 focus-within:ring-ring cursor-text"
        onClick={() => (containerRef.current?.querySelector("input[type=text]") as HTMLInputElement | null)?.focus()}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeTag(tag)
              }}
              className="hover:text-destructive transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={tags.length === 0 ? "Adicionar tags... (Enter ou vírgula)" : ""}
          className="outline-none flex-1 min-w-[160px] bg-transparent placeholder:text-muted-foreground"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-20 mt-1 w-full rounded-md border bg-popover shadow-md">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={() => addTag(s)}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
