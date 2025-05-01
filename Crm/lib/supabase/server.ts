// This file should only be imported by server components
import { createServerClient as createClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'
import { SUPABASE_CONFIG } from './config'

export const createServerClient = () => {
  const cookieStore = cookies()

  // Check if Supabase is configured
  if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing Supabase configuration')
    }
    console.warn('Supabase server client created without credentials - auth disabled')
    return null
  }

  try {
    console.log('Creating server client with URL:', SUPABASE_CONFIG.url)

    return createClient<Database>({
      supabaseUrl: SUPABASE_CONFIG.url,
      supabaseKey: SUPABASE_CONFIG.anonKey,
      cookies: {
        get(name) {
          try {
            const cookie = cookieStore.get(name)
            if (cookie) {
              console.log(`Server: Reading cookie ${name}: found`)
            }
            return cookie?.value
          } catch (error) {
            console.error(`Server: Error reading cookie ${name}:`, error)
            return undefined
          }
        },
        set(name, value, options) {
          try {
            console.log(`Server: Setting cookie ${name}`)
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // This can happen when attempting to set cookies in middleware
            console.error(`Server: Error setting cookie ${name}:`, error)
          }
        },
        remove(name, options) {
          try {
            console.log(`Server: Removing cookie ${name} - DISABLED`)
            // Intentionally not removing cookies to prevent session loss
            // cookieStore.set({ name, value: '', ...options, maxAge: 0 })
          } catch (error) {
            console.error(`Server: Error removing cookie ${name}:`, error)
          }
        }
      }
    })
  } catch (error) {
    console.error('Error creating Supabase server client:', error)
    return null
  }
}