'use client'

import { useEffect } from 'react'

export function PWARegister() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/_next/static/sw.js')
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope)
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error)
          })
      })
    }

    // Add to home screen prompt handler
    let deferredPrompt: any
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      deferredPrompt = e
      
      // Optionally, show your own "Add to Home Screen" UI element
      const installButton = document.getElementById('install-pwa-button')
      if (installButton) {
        installButton.style.display = 'block'
        
        installButton.addEventListener('click', () => {
          // Show the install prompt
          deferredPrompt.prompt()
          
          // Wait for the user to respond to the prompt
          deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the install prompt')
            } else {
              console.log('User dismissed the install prompt')
            }
            deferredPrompt = null
            
            // Hide the install button
            if (installButton) {
              installButton.style.display = 'none'
            }
          })
        })
      }
    })
    
    // Handle app installed event
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed')
      // Hide the install button if it exists
      const installButton = document.getElementById('install-pwa-button')
      if (installButton) {
        installButton.style.display = 'none'
      }
    })
  }, [])

  return null
}
