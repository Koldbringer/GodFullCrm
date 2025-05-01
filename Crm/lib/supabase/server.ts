// This file should only be imported by server components
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'
import { SUPABASE_CONFIG } from './config'
import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client for server components
 * Uses the latest @supabase/ssr package for better Next.js integration
 */
export const createClient = async (): Promise<SupabaseClient<Database> | null> => {
  // Check if Supabase is configured
  if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing Supabase configuration')
    }
    console.warn('Supabase server client created without credentials - auth disabled')
    return null
  }

  try {
    // Get cookies from the Next.js cookies() API
    const cookieStore = cookies()

    // Create a Supabase client for server-side use with proper cookie handling
    return createSupabaseServerClient<Database>(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value
          },
          set(name, value, options) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Handle cookie setting errors in read-only contexts
              console.warn('Could not set cookie in read-only context:', error)
            }
          },
          remove(name, options) {
            try {
              cookieStore.set({ name, value: '', ...options, maxAge: 0 })
            } catch (error) {
              // Handle cookie removal errors in read-only contexts
              console.warn('Could not remove cookie in read-only context:', error)
            }
          }
        }
      }
    )
  } catch (error) {
    console.error('Error creating Supabase server client:', error)
    return null
  }
}

// Alias for createClient to maintain compatibility with existing code
export const createServerClient = createClient;