"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  
  useEffect(() => {
    // Avoid running on server
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query)
      
      // Set initial value
      setMatches(media.matches)
      
      // Create listener function
      const listener = (event: MediaQueryListEvent) => {
        setMatches(event.matches)
      }
      
      // Add listener
      media.addEventListener("change", listener)
      
      // Clean up
      return () => {
        media.removeEventListener("change", listener)
      }
    }
    
    // Default to false on server
    return () => {}
  }, [query])
  
  return matches
}
