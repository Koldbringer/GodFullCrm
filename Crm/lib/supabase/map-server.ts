/**
 * Dedicated Supabase client for the map page
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Create a Supabase client for server-side use in the map page
export async function createMapServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://acfyvozuelayjdhmdtky.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZnl2b3p1ZWxheWpkaG1kdGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMDQwNTcsImV4cCI6MjA2MDU4MDA1N30.G3S7w0L4pFXDBUtwxBz660MfG0PJt1Esyb2GZf1l_bw'

  try {
    console.log('Creating map server client with URL:', supabaseUrl)

    // Create a Supabase client for server-side use
    return createSupabaseClient<Database>(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        }
      }
    )
  } catch (error) {
    console.error('Error creating Supabase map server client:', error)
    return null
  }
}
