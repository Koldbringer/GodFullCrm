import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

// Get the project reference from the URL to create a consistent cookie name
const getProjectRef = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  return url.split('//')[1]?.split('.')[0] || '';
};

export function createClient() {
  // Log the URL and key being used (without exposing the full key)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const keyPreview = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5)}...`
    : 'missing'

  console.log(`Creating browser client with URL: ${url}, Key: ${keyPreview}`)

  if (!url || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase URL or Anon Key. Check your environment variables.')
    throw new Error('Missing Supabase URL or Anon Key')
  }

  const projectRef = getProjectRef();
  const cookieName = projectRef ? `sb-${projectRef}-auth-token` : undefined;

  console.log(`Using cookie name: ${cookieName}`)

  return createBrowserClient<Database>({
    supabaseUrl: url,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    cookieOptions: {
      name: cookieName,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    }
  })
}
