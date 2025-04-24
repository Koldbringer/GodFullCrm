import { NextResponse } from 'next/server'
import { createCustomer } from '@/lib/api'

export async function POST(req: Request) {
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
