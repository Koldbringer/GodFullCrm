"use client"

import { useEffect, useRef } from "react"

interface A11yAnnouncerProps {
  message: string
  assertive?: boolean
  clearAfter?: number
}

/**
 * A component that announces messages to screen readers.
 * 
 * @param message - The message to announce
 * @param assertive - Whether to use assertive (true) or polite (false) politeness setting
 * @param clearAfter - Time in milliseconds after which to clear the message (default: 5000)
 */
export function A11yAnnouncer({ 
  message, 
  assertive = false, 
  clearAfter = 5000 
}: A11yAnnouncerProps) {
  const announcerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!message || !announcerRef.current) return
    
    // Set the message
    announcerRef.current.textContent = message
    
    // Clear the message after the specified time
    const timerId = setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = ""
      }
    }, clearAfter)
    
    return () => {
      clearTimeout(timerId)
    }
  }, [message, clearAfter])
  
  return (
    <div
      ref={announcerRef}
      aria-live={assertive ? "assertive" : "polite"}
      aria-atomic="true"
      className="sr-only"
    />
  )
}
