import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { SUPABASE_CONFIG } from '@/lib/supabase/config'

/**
 * Middleware function to handle authentication and session management
 * Uses the latest @supabase/ssr package for better Next.js integration
 * Includes improved error handling and performance optimizations
 */
export async function updateSession(request: NextRequest) {
  try {
    // Create a response object that we'll modify and return
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    // Check if Supabase is configured
    if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
      console.warn('Supabase not configured, skipping auth middleware')
      return response
    }

    // Create a Supabase client using the request cookies
    const supabase = createServerClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value
          },
          set(name, value, options) {
            try {
              // If we're in a middleware, we need to use the request's cookies
              request.cookies.set({
                name,
                value,
                ...options,
              })

              // Update the response cookies
              response.cookies.set({
                name,
                value,
                ...options,
              })
            } catch (error) {
              console.warn(`Failed to set cookie ${name}:`, error)
            }
          },
          remove(name) {
            try {
              // If we're in a middleware, we need to use the request's cookies
              request.cookies.delete(name)

              // Update the response cookies
              response.cookies.delete(name)
            } catch (error) {
              console.warn(`Failed to remove cookie ${name}:`, error)
            }
          },
        },
      }
    )

    // IMPORTANT: Do not add any code between client creation and auth.getSession()
    // This is critical for proper session management
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Get user from session
    const user = session?.user

    // Define public routes that don't require authentication
    const publicRoutes = [
      '/login',
      '/auth',
      '/register',
      '/forgot-password',
      '/reset-password',
      '/auth-debug',
      '/auth-test',
      '/_next',
      '/api/auth',
      '/favicon.ico',
      '/share', // Public sharing links
    ]

    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some(route =>
      request.nextUrl.pathname.startsWith(route)
    )

    // Check for static assets
    const isStaticAsset = /\.(jpg|jpeg|png|gif|svg|css|js|woff|woff2|ttf|eot)$/i.test(
      request.nextUrl.pathname
    )

    // Determine if the route should be accessible without authentication
    const isAccessibleWithoutAuth = isPublicRoute || isStaticAsset

    // Only log in development to avoid cluttering production logs
    if (process.env.NODE_ENV === 'development') {
      console.log(`Middleware: Path=${request.nextUrl.pathname}, User=${user ? user.id : 'not authenticated'}, IsPublicRoute=${isPublicRoute}, HasSession=${!!session}`)
    }

    // Redirect to login if not authenticated and trying to access a protected route
    if (!user && !isAccessibleWithoutAuth) {
      // Store the original URL to redirect back after login
      const redirectUrl = request.nextUrl.clone()

      // Create the login URL with the redirect parameter
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', redirectUrl.pathname + redirectUrl.search)

      if (process.env.NODE_ENV === 'development') {
        console.log(`Middleware: Redirecting to ${loginUrl.toString()}`)
      }

      return NextResponse.redirect(loginUrl)
    }

    // Add user info to request headers for server components
    if (user) {
      response.headers.set('x-user-id', user.id)
      response.headers.set('x-user-email', user.email || '')
      response.headers.set('x-user-role', user.role?.toString() || 'user')
    }

    return response
  } catch (error) {
    console.error('Error in auth middleware:', error)
    // Return the original response in case of error to avoid breaking the application
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
}
