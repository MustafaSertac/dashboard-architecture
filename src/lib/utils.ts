import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function toTitleCase(word: string): string {
  if (!word) return ''
  const first = word.charAt(0).toLocaleUpperCase('tr-TR')
  const rest = word.slice(1).toLocaleLowerCase('tr-TR')
  return first + rest
}

/**
 * Ad-soyad metnini normalize eder (bosluga gore split):
 * - Son parca haric tum parcalar "isim" (ilk harf buyuk, kalani kucuk).
 * - Birden fazla parca varsa son parca "soyad" ve TAMAMI buyuk harf.
 */
export function formatFullName(raw: string): string {
  const parts = raw.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return toTitleCase(parts[0])

  const lastName = parts[parts.length - 1].toLocaleUpperCase('tr-TR')
  const firstNames = parts.slice(0, -1).map(toTitleCase)
  return [...firstNames, lastName].join(' ')
}

