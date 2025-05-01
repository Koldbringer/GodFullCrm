import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '../../types/supabase'
import { SUPABASE_CONFIG } from './config'

export const createClient = () => {
  if (SUPABASE_CONFIG.disableAuth) {
    console.log('Auth is disabled via environment variable, not creating client')
    return null
  }

  if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing Supabase configuration')
    }
    console.warn('Supabase client created without credentials - auth disabled')
    return null
  }

  try {
    console.log(`Creating browser client with cookie name: ${SUPABASE_CONFIG.cookieName}`)

    return createBrowserClient<Database>({
      supabaseUrl: SUPABASE_CONFIG.url,
      supabaseKey: SUPABASE_CONFIG.anonKey,
      cookieOptions: {
        name: SUPABASE_CONFIG.cookieName,
        ...SUPABASE_CONFIG.cookieOptions
      }
    })
  } catch (error) {
    console.error('Error creating Supabase browser client:', error)
    return null
  }
}
