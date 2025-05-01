"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/customers"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname?.startsWith("/customers") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Klienci
      </Link>
      <Link
        href="/service-orders"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname?.startsWith("/service-orders") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Zlecenia
      </Link>
      <Link
        href="/devices"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname?.startsWith("/devices") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Urządzenia
      </Link>
      <Link
        href="/calendar"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname?.startsWith("/calendar") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Kalendarz
      </Link>
      <Link
        href="/sites"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname?.startsWith("/sites") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Lokalizacje
      </Link>
      <Link
        href="/inventory"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname?.startsWith("/inventory") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Magazyn
      </Link>
      <Link
        href="/employees"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname?.startsWith("/employees") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Pracownicy
      </Link>
      <Link
        href="/tickets"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname?.startsWith("/tickets") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Zgłoszenia
      </Link>
      <Link
        href="/quotes"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname?.startsWith("/quotes") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Oferty
      </Link>
      <Link
        href="/contracts"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname?.startsWith("/contracts") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Umowy
      </Link>
      <Link
        href="/fleet"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname?.startsWith("/fleet") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Flota
      </Link>
      <Link
        href="/monitoring"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname?.startsWith("/monitoring") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Monitoring
      </Link>
      <Link
        href="/reports"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname?.startsWith("/reports") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Raporty
      </Link>
      <Link
        href="/automation/dashboard"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname?.startsWith("/automation") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Automatyzacja
      </Link>
    </nav>
  )
}
