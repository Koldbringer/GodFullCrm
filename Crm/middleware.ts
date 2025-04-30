import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  if (process.env.NEXT_PUBLIC_DISABLE_SUPABASE_AUTH === 'true') {
    return res
  }

  try {
    // Create a middleware client
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return req.cookies.get(name)?.value
          },
          set(name, value, options) {
            req.cookies.set({
              name,
              value,
              ...options,
            })
            res.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name, options) {
            req.cookies.set({
              name,
              value: '',
              ...options,
              maxAge: 0,
            })
            res.cookies.set({
              name,
              value: '',
              ...options,
              maxAge: 0,
            })
          },
        },
      }
    )

    // Check if the user is authenticated
    const { data: { session } } = await supabase.auth.getSession()

    // If no session and not on login page, redirect to login
    if (!session && !req.nextUrl.pathname.startsWith('/login')) {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = '/login'
      return NextResponse.redirect(loginUrl)
    }
  } catch (error) {
    console.error('Error in middleware:', error)
  }

  return res
}

export const config = {
  matcher: [
    '/((?!login|_next|favicon.ico|api/auth).*)',
  ],
}
