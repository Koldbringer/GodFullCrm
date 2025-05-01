"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search as SearchIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserNav } from "@/components/user-nav"
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { AutomationNotifications } from "@/components/automation/automation-notifications"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()

  const toggleSearch = () => {
    setShowSearch(!showSearch)
    if (showSearch) {
      setSearchQuery("")
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Breadcrumbs for navigation context */}
        <Breadcrumbs />
:start_line:42
-------
        {/* Documentation Link */}
        <Link href="/docs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
          Dokumentacja
        </Link>
        {/* Automation Editor Link */}
        <Link href="/automation" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
          Automatyzacja
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        {showSearch ? (
          <div className="relative">
            <Input
              type="search"
              placeholder="Szukaj..."
              className="w-[200px] sm:w-[300px] pr-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={toggleSearch}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Zamknij wyszukiwanie</span>
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSearch}
            className="relative"
            aria-label="Wyszukaj"
          >
            <SearchIcon className="h-5 w-5" />
          </Button>
        )}

        {/* Automation Notifications */}
        <AutomationNotifications />

        {/* Dark mode toggle */}
        <DarkModeToggle />

        {/* User navigation */}
        <UserNav />
      </div>
    </header>
  )
}
