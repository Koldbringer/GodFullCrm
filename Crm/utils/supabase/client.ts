import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export function createClient() {
  // Get the project reference from the URL to create a consistent cookie name
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const projectRef = url.split('//')[1]?.split('.')[0] || ''
  const cookieName = projectRef ? `sb-${projectRef}-auth-token` : undefined

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        name: cookieName,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  )
}
