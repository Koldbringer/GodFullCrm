import { Database } from '@/types/supabase'
import { SUPABASE_CONFIG } from './config'
import { SupabaseClient } from '@supabase/supabase-js'

// Route handler client - use this in API routes (route.ts)
export const createRouteClient = async (): Promise<SupabaseClient<Database> | null> => {
  // Dynamically import to avoid issues with client components
  const { createClient } = await import('@supabase/supabase-js')

  // Check if Supabase is configured
  if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing Supabase configuration')
    }
    console.warn('Supabase route client created without credentials - auth disabled')
    return null
  }

  try {
    console.log('Creating route client with URL:', SUPABASE_CONFIG.url)

    // Create a Supabase client for API route use
    return createClient<Database>(
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
    console.error('Error creating Supabase route client:', error)
    return null
  }
}
