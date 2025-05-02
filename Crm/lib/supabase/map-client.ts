// Special Supabase client for the map page
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import { SUPABASE_CONFIG } from './config'

// Create a Supabase client for server-side use in the map page
export async function createMapClient() {
  // Check if Supabase is configured
  if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing Supabase configuration')
    }
    console.warn('Supabase map client created without credentials - data access disabled')
    return null
  }

  try {
    console.log('Creating map client with URL:', SUPABASE_CONFIG.url)

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
    console.error('Error creating Supabase map client:', error)
    return null
  }
}
