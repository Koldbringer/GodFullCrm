'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Define validation schemas for better type safety and validation
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  redirectTo: z.string().optional()
})

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

/**
 * Server action for user login
 * Uses Zod for input validation and includes improved error handling
 */
export async function login(formData: FormData) {
  try {
    // Get redirect URL from form data or default to home
    const redirectTo = formData.get('redirectTo') as string || '/'

    // Extract inputs
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirectTo
    }

    // Validate inputs using Zod
    const validationResult = loginSchema.safeParse(rawData)
    if (!validationResult.success) {
      const errors = validationResult.error.flatten()
      const errorMessage = Object.values(errors.fieldErrors).flat()[0] || 'Invalid input'
      return { error: errorMessage }
    }

    const data = validationResult.data

    // Get Supabase client
    const supabase = await createClient()
    if (!supabase) {
      return { error: 'Database connection failed' }
    }

    // Only log in development to avoid exposing sensitive info in production
    if (process.env.NODE_ENV === 'development') {
      console.log(`Attempting to sign in user: ${data.email}`)
    }

    // First, sign out to clear any existing sessions
    await supabase.auth.signOut()

    // Attempt to sign in with rate limiting protection
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    })

    if (error) {
      // Handle specific error cases
      if (error.message.includes('Invalid login credentials')) {
        return { error: 'Invalid email or password' }
      }
      if (error.message.includes('rate limit')) {
        return { error: 'Too many login attempts. Please try again later.' }
      }

      console.error('Login error:', error.message)
      return { error: error.message }
    }

    if (!authData.session) {
      return { error: 'Authentication failed. Please try again.' }
    }

    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Login successful for user: ${authData.user.id}`)
      console.log(`Session expires at: ${new Date(authData.session.expires_at * 1000).toISOString()}`)
    }

    // Revalidate all pages that might depend on auth state
    revalidatePath('/', 'layout')

    // Use redirect() to handle the redirect server-side
    try {
      redirect(redirectTo)
    } catch (redirectError) {
      // If redirect fails, return success and let the client handle it
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

/**
 * Server action for user signup
 * Uses Zod for input validation and includes improved error handling
 */
export async function signup(formData: FormData) {
  try {
    // Extract inputs
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    }

    // Validate inputs using Zod
    const validationResult = signupSchema.safeParse(rawData)
    if (!validationResult.success) {
      const errors = validationResult.error.flatten()
      const errorMessage = Object.values(errors.fieldErrors).flat()[0] || 'Invalid input'
      return { error: errorMessage }
    }

    const data = validationResult.data

    // Get Supabase client
    const supabase = await createClient()
    if (!supabase) {
      return { error: 'Database connection failed' }
    }

    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Attempting to sign up user: ${data.email}`)
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', data.email)
      .maybeSingle()

    if (existingUser) {
      return { error: 'An account with this email already exists' }
    }

    // Get the base URL for email redirects
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    // Attempt to sign up
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${baseUrl}/auth/callback`,
        data: {
          // Add any additional user metadata here
          created_at: new Date().toISOString()
        }
      }
    })

    if (error) {
      // Handle specific error cases
      if (error.message.includes('already registered')) {
        return { error: 'This email is already registered. Please log in instead.' }
      }

      console.error('Signup error:', error.message)
      return { error: error.message }
    }

    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Signup successful for user: ${authData.user?.id || 'unknown'}`)
    }

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
