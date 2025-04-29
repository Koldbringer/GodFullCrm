"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbsProps {
  className?: string
}

// Map of route segments to human-readable names
const routeNameMap: Record<string, string> = {
  "": "Dashboard",
  "customers": "Klienci",
  "service-orders": "Zlecenia",
  "devices": "Urządzenia",
  "calendar": "Kalendarz",
  "sites": "Lokalizacje",
  "inventory": "Magazyn",
  "employees": "Pracownicy",
  "tickets": "Zgłoszenia",
  "quotes": "Oferty",
  "contracts": "Umowy",
  "invoices": "Faktury",
  "fleet": "Flota",
  "monitoring": "Monitoring",
  "reports": "Raporty",
  "settings": "Ustawienia",
  "help": "Pomoc",
  "notifications": "Powiadomienia",
  "new": "Nowy",
  "edit": "Edycja",
  "details": "Szczegóły",
  "add": "Dodaj",
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const pathname = usePathname()
  
  // Skip rendering breadcrumbs on the home page
  if (pathname === "/") {
    return null
  }
  
  // Split the pathname into segments and remove empty segments
  const segments = pathname.split("/").filter(Boolean)
  
  // Create breadcrumb items
  const breadcrumbs = [
    { name: "Dashboard", href: "/" },
    ...segments.map((segment, index) => {
      // Check if the segment is an ID (UUID or numeric ID)
      const isId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$|^\d+$/.test(segment)
      
      // If it's an ID, use the previous segment's name + "Details"
      const name = isId 
        ? `${routeNameMap[segments[index - 1]] || segments[index - 1]} #${segment.substring(0, 8)}`
        : (routeNameMap[segment] || segment)
      
      // Build the href for this breadcrumb
      const href = `/${segments.slice(0, index + 1).join("/")}`
      
      return { name, href }
    }),
  ]

  return (
    <nav aria-label="Breadcrumbs" className={cn("flex items-center text-sm", className)}>
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1
          
          return (
            <li key={breadcrumb.href} className="flex items-center">
              {index === 0 ? (
                // Home breadcrumb with icon
                <Link
                  href={breadcrumb.href}
                  className="flex items-center text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-4 w-4" />
                  <span className="sr-only">Home</span>
                </Link>
              ) : (
                // Regular breadcrumb
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  {isLast ? (
                    <span className="ml-1 font-medium text-foreground" aria-current="page">
                      {breadcrumb.name}
                    </span>
                  ) : (
                    <Link
                      href={breadcrumb.href}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      {breadcrumb.name}
                    </Link>
                  )}
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
