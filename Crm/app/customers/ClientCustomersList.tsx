'use client'

import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'

export function ClientCustomersList() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  
  useEffect(() => {
    const fetchCustomers = async () => {
      if (!user) return
      
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .limit(5)
          
        if (error) throw error
        
        setCustomers(data || [])
      } catch (err: any) {
        console.error('Error fetching customers:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCustomers()
  }, [user])
  
  if (loading) {
    return <div>Loading customers...</div>
  }
  
  if (error) {
    return <div>Error: {error}</div>
  }
  
  return (
    <div className="bg-muted p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-2">Recent Customers (Client Component)</h3>
      <ul className="space-y-2">
        {customers.map((customer) => (
          <li key={customer.id} className="p-2 bg-card rounded">
            {customer.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
