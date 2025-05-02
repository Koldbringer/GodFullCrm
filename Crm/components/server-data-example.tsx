import { createServerClient } from '@/lib/supabase/server'

export async function ServerDataExample() {
  const supabase = createServerClient()
  
  if (!supabase) {
    return <div>Supabase client not available</div>
  }
  
  // Example query
  const { data, error } = await supabase.from('customers').select('*').limit(5)
  
  if (error) {
    return <div>Error: {error.message}</div>
  }
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Recent Customers (Server Component)</h2>
      <ul className="space-y-2">
        {data.map((customer) => (
          <li key={customer.id} className="p-3 bg-muted rounded-md">
            {customer.name} - {customer.email}
          </li>
        ))}
      </ul>
    </div>
  )
}
