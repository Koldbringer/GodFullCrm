"use client"

import * as React from "react"
import { ThemeProvider } from "next-themes"

type Props = { children: React.ReactNode }

export function NextThemesProvider({ children }: Props) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </ThemeProvider>
  )
}
