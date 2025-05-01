'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  try {
    const supabase = await createClient()

    // Get redirect URL from form data or default to home
    const redirectTo = formData.get('redirectTo') as string || '/'

    // Extract and validate inputs
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    // Validate inputs
    if (!data.email || !data.password) {
      return {
        error: 'Email and password are required'
      }
    }

    console.log(`Attempting to sign in user: ${data.email}`)

    // First, sign out to clear any existing sessions
    await supabase.auth.signOut()

    // Attempt to sign in
    const { data: authData, error } = await supabase.auth.signInWithPassword(data)

    if (error) {
      console.error('Login error:', error.message)
      return { error: error.message }
    }

    if (!authData.session) {
      console.error('No session returned after login')
      return { error: 'Authentication failed. Please try again.' }
    }

    console.log(`Login successful for user: ${authData.user.id}`)
    console.log(`Session expires at: ${new Date(authData.session.expires_at * 1000).toISOString()}`)

    // Revalidate all pages that might depend on auth state
    revalidatePath('/', 'layout')

    // Use redirect() to handle the redirect server-side
    // This should work now that we've fixed the middleware and server client
    try {
      redirect(redirectTo)
    } catch (redirectError) {
      // If redirect fails, return success and let the client handle it
      console.log('Server-side redirect failed, returning success to client')
      return {
        success: true,
        user: authData.user.id,
        redirectTo
      }
    }
  } catch (err) {
    console.error('Unexpected error during login:', err)
    return {
      error: err instanceof Error ? err.message : 'An unexpected error occurred'
    }
  }
}

export async function signup(formData: FormData) {
  try {
    const supabase = await createClient()

    // Extract and validate inputs
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    // Validate inputs
    if (!data.email || !data.password) {
      return {
        error: 'Email and password are required'
      }
    }

    if (data.password.length < 6) {
      return {
        error: 'Password must be at least 6 characters'
      }
    }

    console.log(`Attempting to sign up user: ${data.email}`)

    // Attempt to sign up
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/callback`
      }
    })

    if (error) {
      console.error('Signup error:', error.message)
      return { error: error.message }
    }

    console.log(`Signup successful for user: ${authData.user?.id || 'unknown'}`)

    // Revalidate all pages that might depend on auth state
    revalidatePath('/', 'layout')

    // Return success message
    return {
      success: true,
      message: 'Check your email for the confirmation link'
    }
  } catch (err) {
    console.error('Unexpected error during signup:', err)
    return {
      error: err instanceof Error ? err.message : 'An unexpected error occurred'
    }
  }
}
