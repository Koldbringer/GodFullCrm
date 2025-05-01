import { NextResponse } from 'next/server'

export async function GET() {
  // Get environment variables directly
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://acfyvozuelayjdhmdtky.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZnl2b3p1ZWxheWpkaG1kdGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMDQwNTcsImV4cCI6MjA2MDU4MDA1N30.G3S7w0L4pFXDBUtwxBz660MfG0PJt1Esyb2GZf1l_bw'
  const disableAuth = process.env.NEXT_PUBLIC_DISABLE_SUPABASE_AUTH === 'true'

  // Generate cookie name
  const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || 'acfyvozuelayjdhmdtky'
  const cookieName = `sb-${projectRef}-auth-token`

  // Log configuration for debugging
  console.log('API environment endpoint:')
  console.log('SUPABASE_URL:', supabaseUrl ? 'Set' : 'Not set')
  console.log('SUPABASE_ANON_KEY:', supabaseKey ? 'Set (length: ' + supabaseKey.length + ')' : 'Not set')
  console.log('DISABLE_AUTH:', disableAuth)
  console.log('COOKIE_NAME:', cookieName)

  // Only expose specific environment variables that are needed on the client
  return NextResponse.json({
    SUPABASE_URL: supabaseUrl,
    SUPABASE_ANON_KEY: supabaseKey,
    NEXT_PUBLIC_DISABLE_SUPABASE_AUTH: disableAuth ? 'true' : 'false',
    COOKIE_NAME: cookieName
  })
}
