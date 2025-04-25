import { createServerClient } from '@/lib/supabase'

export async function ServerCustomersList() {
  const supabase = createServerClient()
  
  // Get the session from the server
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return <div>Please log in to view customers</div>
  }
  
  // Fetch customers with the authenticated session
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .limit(5)
  
  if (error) {
    console.error('Error fetching customers:', error)
    return <div>Error loading customers</div>
  }
  
  return (
    <div className="bg-muted p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-2">Recent Customers (Server Component)</h3>
      <ul className="space-y-2">
        {customers?.map((customer) => (
          <li key={customer.id} className="p-2 bg-card rounded">
            {customer.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
