"use client"

import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

export function RegisterServiceWorker() {
  const { toast } = useToast()

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope)
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error)
          })
      })

      // Listen for service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        toast({
          title: "Aplikacja zaktualizowana",
          description: "Nowa wersja aplikacji jest dostępna. Odśwież stronę, aby zobaczyć zmiany.",
          variant: "default",
        })
      })
    }
  }, [toast])

  return null
}