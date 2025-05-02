/**
 * This file provides a Supabase client for API route handlers
 * Use this in route.ts files for API routes
 */
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'
import { SUPABASE_CONFIG } from './config'
import { SupabaseClient } from '@supabase/supabase-js'

// Route handler client - use this in API routes (route.ts)
export const createRouteClient = async (): Promise<SupabaseClient<Database> | null> => {
  // Check if Supabase is configured
  if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing Supabase configuration')
    }
    console.warn('Supabase route client created without credentials - auth disabled')
    return null
  }

  try {
    const cookieStore = cookies()

    // Create a Supabase client for API routes with proper cookie handling
    return createRouteHandlerClient<Database>({
      cookies: () => cookieStore
    })
  } catch (error) {
    console.error('Error creating Supabase route client:', error)
    return null
  }
}
