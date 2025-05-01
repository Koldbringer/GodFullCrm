import { Database } from '@/types/supabase'
import { SUPABASE_CONFIG } from './config'

// Route handler client - use this in API routes (route.ts)
export const createRouteClient = async () => {
  // Dynamically import to avoid issues with client components
  const { createServerClient } = await import('@supabase/ssr')
  const { cookies } = await import('next/headers')

  const cookieStore = cookies()

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

    return createServerClient<Database>({
      supabaseUrl: SUPABASE_CONFIG.url,
      supabaseKey: SUPABASE_CONFIG.anonKey,
      cookies: {
        get(name) {
          try {
            const cookie = cookieStore.get(name)
            if (cookie) {
              console.log(`Route: Reading cookie ${name}: found`)
            }
            return cookie?.value
          } catch (error) {
            console.error(`Route: Error reading cookie ${name}:`, error)
            return undefined
          }
        },
        set(name, value, options) {
          try {
            console.log(`Route: Setting cookie ${name}`)
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // This can happen when attempting to set cookies in middleware
            console.error(`Route: Error setting cookie ${name}:`, error)
          }
        },
        remove(name, options) {
          try {
            console.log(`Route: Removing cookie ${name} - DISABLED`)
            // Intentionally not removing cookies to prevent session loss
            // cookieStore.set({ name, value: '', ...options, maxAge: 0 })
          } catch (error) {
            console.error(`Route: Error removing cookie ${name}:`, error)
          }
        }
      }
    })
  } catch (error) {
    console.error('Error creating Supabase route client:', error)
    return null
  }
}
