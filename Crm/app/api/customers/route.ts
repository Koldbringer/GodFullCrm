import { NextResponse } from 'next/server'
import { createCustomer } from '@/lib/api'
import { createRouteClient } from '@/lib/supabase/route'

export async function POST(req: Request) {
  const supabase = await createRouteClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: User not logged in' }, { status: 401 });
  }
  try {
    const data = await req.json()
    const customer = await createCustomer(data)
    if (!customer) {
      return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
    }
    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
