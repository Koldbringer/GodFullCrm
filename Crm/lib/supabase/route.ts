import { Database } from '@/types/supabase'

// Route handler client - use this in API routes (route.ts)
export const createRouteClient = async () => {
  // Dynamically import to avoid issues with client components
  const { createServerClient } = await import('@supabase/ssr')
  const { cookies } = await import('next/headers')

  const cookieStore = cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing Supabase environment variables')
    }
    console.warn('Supabase route client created without credentials - auth disabled')
    return null
  }

  return createServerClient<Database>({
    supabaseUrl,
    supabaseKey,
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // This can happen when attempting to set cookies in middleware
          console.error('Error setting cookie:', error)
        }
      },
      remove(name, options) {
        try {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 })
        } catch (error) {
          console.error('Error removing cookie:', error)
        }
      }
    }
  })
}
