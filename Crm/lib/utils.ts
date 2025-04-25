import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string to a localized format
 * @param dateString - ISO date string or Date object
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }
): string {
  if (!dateString) return "—"

  try {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString
    return new Intl.DateTimeFormat("pl-PL", options).format(date)
  } catch (error) {
    console.error("Error formatting date:", error)
    return String(dateString)
  }
}

/**
 * Format a date string to a relative format (e.g., "2 days ago")
 * @param dateString - ISO date string or Date object
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string | Date | null | undefined): string {
  if (!dateString) return "—"

  try {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    // Less than a minute
    if (diffInSeconds < 60) {
      return "przed chwilą"
    }

    // Less than an hour
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} ${minutes === 1 ? "minutę" : minutes < 5 ? "minuty" : "minut"} temu`
    }

    // Less than a day
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ${hours === 1 ? "godzinę" : hours < 5 ? "godziny" : "godzin"} temu`
    }

    // Less than a week
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} ${days === 1 ? "dzień" : "dni"} temu`
    }

    // Default to formatted date
    return formatDate(date, { day: "2-digit", month: "2-digit", year: "numeric" })
  } catch (error) {
    console.error("Error formatting relative time:", error)
    return String(dateString)
  }
}
