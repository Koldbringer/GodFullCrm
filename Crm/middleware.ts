import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '../types/supabase'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  if (process.env.NEXT_PUBLIC_DISABLE_SUPABASE_AUTH === 'true') {
    return res
  }

  try {
    // Create a middleware client
    const supabase = createMiddlewareClient<Database>({ req, res })

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
