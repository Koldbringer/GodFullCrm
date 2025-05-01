import { createRouteClient } from '@/lib/supabase/route'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const supabase = await createRouteClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    // Get the referrer to redirect back after sign out
    const referrer = request.headers.get('referer') || '/'
    const redirectUrl = new URL('/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')

    // Sign out the user
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error signing out:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Clear all auth-related cookies manually as a fallback
    const cookieStore = cookies()
    const allCookies = cookieStore.getAll()

    for (const cookie of allCookies) {
      if (cookie.name.includes('supabase') || cookie.name.includes('sb-') || cookie.name.includes('auth')) {
        try {
          cookieStore.delete(cookie.name)
        } catch (e) {
          console.error(`Failed to delete cookie ${cookie.name}:`, e)
        }
      }
    }

    // Redirect to login page
    return NextResponse.redirect(redirectUrl)
  } catch (err) {
    console.error('Unexpected error during sign out:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
