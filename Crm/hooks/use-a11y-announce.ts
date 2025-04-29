"use client"

import { useState, useCallback } from "react"

/**
 * Hook for managing accessibility announcements for screen readers.
 * 
 * @returns An object with announce function and the current announcement
 */
export function useA11yAnnounce() {
  const [announcement, setAnnouncement] = useState("")
  const [isAssertive, setIsAssertive] = useState(false)
  
  /**
   * Announce a message to screen readers
   * 
   * @param message - The message to announce
   * @param assertive - Whether to use assertive (true) or polite (false) politeness setting
   */
  const announce = useCallback((message: string, assertive = false) => {
    setAnnouncement(message)
    setIsAssertive(assertive)
    
    // Reset after a short delay to allow for multiple announcements
    setTimeout(() => {
      setAnnouncement("")
    }, 10000)
  }, [])
  
  return {
    announce,
    announcement,
    isAssertive
  }
}
