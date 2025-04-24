"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { MainNav } from "@/components/main-nav"
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle"
import { LanguageSwitcher } from "@/components/i18n/language-switcher"
import { useTranslation } from "@/components/i18n/i18n-provider"

export function Header({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const { t } = useTranslation()

  return (
    <header
      className={cn(
        "flex items-center justify-between px-4 py-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-4">
        {/* Możesz dodać logo tutaj */}
        <span className="font-bold text-lg tracking-tight">{t('app_name')}</span>
      </div>
      <MainNav />
      <div className="flex items-center gap-4">
        {/* Language switcher */}
        <LanguageSwitcher />
        {/* Dark mode toggle */}
        <DarkModeToggle />
        {/* User greeting */}
        <span className="text-xs text-muted-foreground">
          {t('navigation.greeting', 'Witaj, Użytkowniku')}
        </span>
      </div>
    </header>
  )
}
