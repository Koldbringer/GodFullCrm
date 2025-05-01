'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'

export function PWAInstallButton() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      // Update UI to show the install button
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      // Hide the install button when app is installed
      setIsInstallable(false)
      setDeferredPrompt(null)
      console.log('PWA was installed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return
    }

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User ${outcome === 'accepted' ? 'accepted' : 'dismissed'} the install prompt`)

    // Clear the deferredPrompt variable
    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  if (!isInstallable) {
    return null
  }

  return (
    <Button 
      id="install-pwa-button" 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-1"
      onClick={handleInstallClick}
    >
      <Download className="h-4 w-4" />
      <span>Zainstaluj aplikację</span>
    </Button>
  )
}
