/**
 * This file should only be imported by server components
 * It creates a Supabase client with proper cookie handling for server components
 */
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'
import { SUPABASE_CONFIG } from './config'
import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client for server-side use
 * This should only be used in server components
 */
export async function createClient(): Promise<SupabaseClient<Database> | null> {
  // Check if Supabase is configured
  if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing Supabase configuration')
    }
    console.warn('Supabase not configured')
    return null
  }

  try {
    const cookieStore = cookies()

    return createSupabaseServerClient<Database>(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name, options) {
            cookieStore.delete({ name, ...options })
          }
        }
      }
    )
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    return null
  }
}

// Alias for createClient to maintain compatibility with existing code
export const createServerClient = createClient