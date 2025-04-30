import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '../../types/supabase'

const DISABLE_AUTH = process.env.NEXT_PUBLIC_DISABLE_SUPABASE_AUTH === 'true'

export const createClient = () => {
  if (DISABLE_AUTH) return null

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing Supabase environment variables')
    }
    console.warn('Supabase client created without credentials - auth disabled')
    return null
  }

  return createBrowserClient<Database>({
    supabaseUrl,
    supabaseKey,
    cookieOptions: {
      name: 'sb-auth',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    }
  })
}
