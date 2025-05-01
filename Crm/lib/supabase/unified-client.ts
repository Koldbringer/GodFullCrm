/**
 * Unified Supabase client for all contexts
 * This file provides a consistent interface for all Supabase clients
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import { SUPABASE_CONFIG } from './config'

// Create a Supabase client for server-side use
export async function createServerClient() {
  // Check if Supabase is configured
  if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing Supabase configuration')
    }
    console.warn('Supabase server client created without credentials - data access disabled')
    return null
  }

  try {
    console.log('Creating server client with URL:', SUPABASE_CONFIG.url)

    // Create a Supabase client for server-side use
    return createSupabaseClient<Database>(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        }
      }
    )
  } catch (error) {
    console.error('Error creating Supabase server client:', error)
    return null
  }
}
