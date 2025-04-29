import { Database } from '@/types/supabase'

// Route handler client - use this in API routes (route.ts)
export const createRouteClient = async () => {
  // Dynamically import to avoid issues with client components
  const { createRouteHandlerClient } = await import('@supabase/auth-helpers-nextjs')
  const { cookies } = await import('next/headers')

  const cookieStore = cookies()
  return createRouteHandlerClient<Database>({ cookies: () => cookieStore })
}
