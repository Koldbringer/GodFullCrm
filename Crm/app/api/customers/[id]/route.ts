import { NextResponse } from 'next/server'
import { updateCustomer } from '@/lib/api'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json()
    const updated = await updateCustomer(params.id, data)
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 })
    }
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
