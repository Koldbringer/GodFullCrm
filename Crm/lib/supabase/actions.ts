'use server'

import { createServerClient } from './server'
import type { Database } from '@/types/supabase'

// Use this in server actions to get data from Supabase
export async function getServerData<T>(
  fetcher: (supabase: ReturnType<typeof createServerClient>) => Promise<T>
): Promise<T | null> {
  try {
    const supabase = createServerClient()
    if (!supabase) return null
    return await fetcher(supabase)
  } catch (error) {
    console.error('Error in server action:', error)
    return null
  }
}

// Example usage:
// export async function getCustomers() {
//   return getServerData(async (supabase) => {
//     const { data, error } = await supabase.from('customers').select('*')
//     if (error) throw error
//     return data
//   })
// }
