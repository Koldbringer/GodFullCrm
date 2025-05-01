'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  error: string | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  error: null,
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Create the Supabase client
  const supabase = createClient()

  useEffect(() => {
    // Skip if Supabase client is not available
    if (!supabase) {
      setIsLoading(false)
      return
    }

    const getSession = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('AuthProvider: Session error:', sessionError)
          setError(sessionError.message)
          setSession(null)
          setUser(null)
        } else if (session) {
          // Check if session is expired or about to expire (within 5 minutes)
          const expiresAt = session.expires_at * 1000
          const isExpired = expiresAt < Date.now()
          const isAboutToExpire = expiresAt < Date.now() + 5 * 60 * 1000

          if (isExpired) {
            console.log('AuthProvider: Session is expired, attempting to refresh')
            // Session is expired, try to refresh it
            const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession()

            if (refreshError || !refreshedSession) {
              console.error('AuthProvider: Failed to refresh session:', refreshError)
              setSession(null)
              setUser(null)
            } else {
              console.log('AuthProvider: Session refreshed for user:', refreshedSession.user.id)
              setSession(refreshedSession)
              setUser(refreshedSession.user)
            }
          } else if (isAboutToExpire) {
            // Session is about to expire, refresh it in the background
            console.log('AuthProvider: Session is about to expire, refreshing in background')
            supabase.auth.refreshSession().then(({ data, error }) => {
              if (error) {
                console.error('AuthProvider: Background refresh failed:', error)
              } else if (data.session) {
                console.log('AuthProvider: Background refresh successful')
                setSession(data.session)
                setUser(data.session.user)
              }
            })

            // Still use the current session for now
            setSession(session)
            setUser(session.user)
          } else {
            // Session is valid
            console.log('AuthProvider: Valid session found for user:', session.user.id)
            setSession(session)
            setUser(session.user)
          }
        } else {
          console.log('AuthProvider: No session found')
          setSession(null)
          setUser(null)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get session'
        console.error('AuthProvider: Session error:', err)
        setError(errorMessage)
        setSession(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    // Initial session check
    getSession()

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AuthProvider: Auth state changed:', event)

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          console.log('AuthProvider: New session for user:', session.user.id)
          setSession(session)
          setUser(session.user)
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('AuthProvider: User signed out')
        setSession(null)
        setUser(null)
      }

      setIsLoading(false)
      router.refresh()
    })

    return () => {
      console.log('AuthProvider: Unsubscribing from auth state changes')
      subscription.unsubscribe()
    }
  }, [router, supabase])

  const signOut = async () => {
    try {
      setIsLoading(true)

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      // Clear local state
      setUser(null)
      setSession(null)

      // Redirect to login page
      router.push('/login')

      // Force a refresh to update all components
      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out'
      setError(errorMessage)
      console.error('AuthProvider: Sign out error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    session,
    isLoading,
    error,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
