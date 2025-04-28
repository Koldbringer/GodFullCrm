"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Search as SearchIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserNav } from "@/components/user-nav"
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/breadcrumbs"

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
        {/* Documentation Link */}
        <Link href="/docs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
          Dokumentacja
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

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Powiadomienia"
          asChild
        >
          <Link href="/notifications">
            <Bell className="h-5 w-5" />
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              3
            </Badge>
            <span className="sr-only">Powiadomienia</span>
          </Link>
        </Button>

        {/* Dark mode toggle */}
        <DarkModeToggle />

        {/* User navigation */}
        <UserNav />
      </div>
    </header>
  )
}
