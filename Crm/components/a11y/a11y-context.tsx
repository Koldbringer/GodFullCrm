"use client"

import React, { createContext, useContext, ReactNode } from "react"
import { useA11yAnnounce } from "@/hooks/use-a11y-announce"
import { A11yAnnouncer } from "@/components/atoms/a11y-announcer"

type A11yContextType = {
  announce: (message: string, assertive?: boolean) => void
}

const A11yContext = createContext<A11yContextType | null>(null)

export function useA11y() {
  const context = useContext(A11yContext)
  if (!context) {
    throw new Error("useA11y must be used within an A11yProvider")
  }
  return context
}

export function A11yProvider({ children }: { children: ReactNode }) {
  const { announce, announcement, isAssertive } = useA11yAnnounce()
  
  return (
    <A11yContext.Provider value={{ announce }}>
      {children}
      <A11yAnnouncer message={announcement} assertive={isAssertive} />
    </A11yContext.Provider>
  )
}
