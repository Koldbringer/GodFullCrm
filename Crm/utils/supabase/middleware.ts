import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { SUPABASE_CONFIG } from '@/lib/supabase/config'

export async function updateSession(request: NextRequest) {
  // Create a response object that we'll modify and return
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

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
        },
        remove(name) {
          // If we're in a middleware, we need to use the request's cookies
          request.cookies.delete(name)

          // Update the response cookies
          response.cookies.delete(name)
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

  // Add debug route that should always be accessible
  const isDebugRoute = request.nextUrl.pathname.startsWith('/auth-debug')

  // Define routes that don't require authentication
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
                      request.nextUrl.pathname.startsWith('/auth') ||
                      request.nextUrl.pathname.startsWith('/register') ||
                      request.nextUrl.pathname.startsWith('/forgot-password') ||
                      isDebugRoute

  // Log authentication status for debugging
  console.log(`Middleware: Path=${request.nextUrl.pathname}, User=${user ? user.id : 'not authenticated'}, IsAuthRoute=${isAuthRoute}, HasSession=${!!session}`)

  if (!user && !isAuthRoute) {
    // Store the original URL to redirect back after login
    const redirectUrl = request.nextUrl.clone()

    // Create the login URL with the redirect parameter
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', redirectUrl.pathname + redirectUrl.search)

    console.log(`Middleware: Redirecting to ${loginUrl.toString()}`)
    return NextResponse.redirect(loginUrl)
  }

  return response
}
