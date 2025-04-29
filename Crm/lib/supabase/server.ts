import { Database } from '@/types/supabase'

// Server component client - use this in server components (page.tsx)
export const createServerClient = async () => {
  // Dynamically import to avoid issues with client components
  const { createServerComponentClient } = await import('@supabase/auth-helpers-nextjs')
  const { cookies } = await import('next/headers')

  // Use an async function to get cookies to fix the warning
  const cookieStore = await cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}
