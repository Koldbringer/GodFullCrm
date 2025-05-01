import { createBrowserClient } from '@supabase/ssr'
export function createServerClient() {
  const cookieStore = cookies()

  return create(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => cookieStore.set(name, value, options),
        delete: (name: string, options: any) => cookieStore.delete(name, options),
      },
    }
  )
}
