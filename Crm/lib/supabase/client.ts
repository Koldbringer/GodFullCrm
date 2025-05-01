import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'
import { SUPABASE_CONFIG } from './config'

export function createClient() {
  return createBrowserClient<Database>(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey,
    {
      cookieOptions: {
        name: SUPABASE_CONFIG.cookieName,
        ...SUPABASE_CONFIG.cookieOptions
      }
    }
  )
}