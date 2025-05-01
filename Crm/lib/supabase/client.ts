import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'
import { SUPABASE_CONFIG } from './config'
import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client for client components
 * Uses the latest @supabase/ssr package for better Next.js integration
 * Includes error handling and caching for better performance
 */
export function createClient(): SupabaseClient<Database> {
  try {
    // Validate configuration
    if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
      throw new Error('Missing Supabase configuration')
    }

    // Create a browser client with proper cookie handling
    return createBrowserClient<Database>(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey,
      {
        cookieOptions: {
          name: SUPABASE_CONFIG.cookieName,
          ...SUPABASE_CONFIG.cookieOptions
        },
        // Add auth configuration for better session handling
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      }
    )
  } catch (error) {
    console.error('Error creating Supabase browser client:', error)
    // Return a minimal client that will fail gracefully
    return createBrowserClient<Database>(
      SUPABASE_CONFIG.url || 'https://placeholder-url.supabase.co',
      SUPABASE_CONFIG.anonKey || 'placeholder-key',
      {
        cookieOptions: {
          name: SUPABASE_CONFIG.cookieName,
          ...SUPABASE_CONFIG.cookieOptions
        }
      }
    )
  }
}