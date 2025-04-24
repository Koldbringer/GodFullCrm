"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/components/i18n/i18n-provider"

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-pressed={theme === "dark"}
      aria-label={t('accessibility.toggle_dark_mode')}
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">{t('accessibility.toggle_dark_mode')}</span>
    </Button>
  )
}
