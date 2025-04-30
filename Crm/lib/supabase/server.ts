// This file should only be imported by server components
import { createServerClient as createClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export const createServerClient = () => {
  const cookieStore = cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing Supabase environment variables')
    }
    console.warn('Supabase server client created without credentials - auth disabled')
    return null
  }

  return createClient<Database>({
    supabaseUrl,
    supabaseKey,
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // This can happen when attempting to set cookies in middleware
          console.error('Error setting cookie:', error)
        }
      },
      remove(name, options) {
        try {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 })
        } catch (error) {
          console.error('Error removing cookie:', error)
        }
      }
    }
  })
}