import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Create a response object that we'll modify and return
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client using the request cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
        remove(name, options) {
          // If we're in a middleware, we need to use the request's cookies
          request.cookies.delete({
            name,
            ...options,
          })

          // Update the response cookies
          response.cookies.delete({
            name,
            ...options,
          })
        },
      },
    }
  )

  // IMPORTANT: Do not add any code between client creation and auth.getUser()
  // This is critical for proper session management
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Define routes that don't require authentication
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
                      request.nextUrl.pathname.startsWith('/auth') ||
                      request.nextUrl.pathname.startsWith('/register') ||
                      request.nextUrl.pathname.startsWith('/forgot-password')

  if (!user && !isAuthRoute) {
    // Store the original URL to redirect back after login
    const redirectUrl = request.nextUrl.clone()

    // Create the login URL with the redirect parameter
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', redirectUrl.pathname + redirectUrl.search)

    return NextResponse.redirect(loginUrl)
  }

  return response
}
