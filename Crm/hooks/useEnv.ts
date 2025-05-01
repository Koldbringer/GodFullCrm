'use client'

import { useState, useEffect } from 'react'

type EnvVars = {
  SUPABASE_URL: string | null
  SUPABASE_ANON_KEY: string | null
  NEXT_PUBLIC_DISABLE_SUPABASE_AUTH: string | null
  COOKIE_NAME: string | null
  isLoading: boolean
  error: string | null
}

const initialState: EnvVars = {
  SUPABASE_URL: null,
  SUPABASE_ANON_KEY: null,
  NEXT_PUBLIC_DISABLE_SUPABASE_AUTH: null,
  COOKIE_NAME: null,
  isLoading: true,
  error: null
}

// Cache for environment variables to avoid multiple fetches
let envCache: EnvVars | null = null

export function useEnv(): EnvVars {
  const [env, setEnv] = useState<EnvVars>(envCache || initialState)

  useEffect(() => {
    // If we already have cached values, use them
    if (envCache && !envCache.isLoading) {
      setEnv(envCache)
      return
    }

    const fetchEnv = async () => {
      try {
        const response = await fetch('/api/env')

        if (!response.ok) {
          throw new Error(`Failed to fetch environment variables: ${response.status}`)
        }

        const data = await response.json()

        const newEnv = {
          SUPABASE_URL: data.SUPABASE_URL,
          SUPABASE_ANON_KEY: data.SUPABASE_ANON_KEY,
          NEXT_PUBLIC_DISABLE_SUPABASE_AUTH: data.NEXT_PUBLIC_DISABLE_SUPABASE_AUTH,
          COOKIE_NAME: data.COOKIE_NAME,
          isLoading: false,
          error: null
        }

        // Update the cache
        envCache = newEnv
        setEnv(newEnv)
      } catch (error) {
        console.error('Error fetching environment variables:', error)
        const errorEnv = {
          ...initialState,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
        envCache = errorEnv
        setEnv(errorEnv)
      }
    }

    fetchEnv()
  }, [])

  return env
}
