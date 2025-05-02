'use client'

import { AuthProvider } from './AuthProvider'
import { RealtimeProvider } from './RealtimeProvider'
import { Toaster } from '@/components/ui/toaster'

/**
 * Root providers component that wraps the entire application
 * Provides authentication, real-time subscriptions, and UI components
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RealtimeProvider>
        {children}
        <Toaster />
      </RealtimeProvider>
    </AuthProvider>
  )
}
