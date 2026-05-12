import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { randomBytes } from "crypto"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function shortCode(length = 5): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const bytes = randomBytes(length)
  return Array.from(bytes)
    .map((b) => chars[b % chars.length])
    .join("")
}

export function generateSlotCode(): string {
  return `SL-${shortCode()}`
}

export function generateItemCode(): string {
  return `IT-${shortCode()}`
}
