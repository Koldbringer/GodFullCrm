import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export async function createClient() {
  const cookieStore = cookies()

  // Log the URL and key being used (without exposing the full key)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const keyPreview = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5)}...`
    : 'missing'

  console.log(`Creating server client with URL: ${url}, Key: ${keyPreview}`)

  if (!url || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase URL or Anon Key. Check your environment variables.')
  }

  return createServerClient<Database>(
    url,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          const cookie = cookieStore.get(name)
          if (cookie) {
            console.log(`Server: Reading cookie ${name}`)
          }
          return cookie?.value
        },
        set(name, value, options) {
          try {
            console.log(`Server: Setting cookie ${name}`)
            cookieStore.set(name, value, options)
          } catch (error) {
            // This will happen in Server Components
            // It's safe to ignore as we handle cookies in middleware
            console.debug(`Cookie ${name} could not be set in Server Component:`, error)
          }
        },
        remove(name, options) {
          try {
            console.log(`Server: Removing cookie ${name}`)
            cookieStore.delete(name, options)
          } catch (error) {
            // This will happen in Server Components
            // It's safe to ignore as we handle cookies in middleware
            console.debug(`Cookie ${name} could not be removed in Server Component:`, error)
          }
        }
      },
    }
  )
}
