"use client"

import React, { useEffect, useRef } from "react"

interface FocusTrapProps {
  children: React.ReactNode
  active?: boolean
  initialFocus?: boolean
  returnFocus?: boolean
  onEscape?: () => void
}

export function FocusTrap({
  children,
  active = true,
  initialFocus = true,
  returnFocus = true,
  onEscape,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Store the previously focused element
  useEffect(() => {
    if (active && returnFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement
    }
    
    return () => {
      if (active && returnFocus && previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [active, returnFocus])

  // Set initial focus
  useEffect(() => {
    if (active && initialFocus && containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus()
      }
    }
  }, [active, initialFocus])

  // Handle keyboard navigation
  useEffect(() => {
    if (!active || !containerRef.current) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === "Escape" && onEscape) {
        e.preventDefault()
        onEscape()
        return
      }

      // Handle Tab key for focus trapping
      if (e.key === "Tab" && containerRef.current) {
        const focusableElements = containerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        
        if (focusableElements.length === 0) return
        
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
        
        // Shift + Tab
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } 
        // Tab
        else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [active, onEscape])

  if (!active) {
    return <>{children}</>
  }

  return (
    <div ref={containerRef} style={{ outline: "none" }}>
      {children}
    </div>
  )
}
