import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { handleSupabaseError } from '@/lib/supabase/error-handler'

/**
 * GET handler for inventory item transactions
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    
    // Create Supabase client
    const supabase = await createServerClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Failed to create Supabase client' },
        { status: 500 }
      )
    }
    
    // Fetch transactions
    const { data, error, count } = await supabase
      .from('inventory_transactions')
      .select('*, service_orders(id, title)', { count: 'exact' })
      .eq('inventory_item_id', id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) throw error
    
    return NextResponse.json({
      data,
      count,
      limit,
      offset
    })
  } catch (error) {
    const structuredError = handleSupabaseError(error, `inventory/${params.id}/transactions`)
    console.error('Error fetching inventory transactions:', structuredError)
    
    return NextResponse.json(
      { error: structuredError.message },
      { status: 500 }
    )
  }
}

/**
 * POST handler for creating a new inventory transaction
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    
    // Create Supabase client
    const supabase = await createServerClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Failed to create Supabase client' },
        { status: 500 }
      )
    }
    
    // Validate required fields
    if (!body.transaction_type || !body.quantity) {
      return NextResponse.json(
        { error: 'Transaction type and quantity are required fields' },
        { status: 400 }
      )
    }
    
    // Start a transaction
    const { data: item, error: itemError } = await supabase
      .from('inventory_items')
      .select('quantity, unit_price')
      .eq('id', id)
      .single()
    
    if (itemError) throw itemError
    
    if (!item) {
      return NextResponse.json(
        { error: 'Inventory item not found' },
        { status: 404 }
      )
    }
    
    // Calculate new quantity
    let newQuantity = item.quantity
    if (body.transaction_type === 'stock_in') {
      newQuantity += body.quantity
    } else if (body.transaction_type === 'stock_out') {
      newQuantity -= body.quantity
      if (newQuantity < 0) {
        return NextResponse.json(
          { error: 'Insufficient stock' },
          { status: 400 }
        )
      }
    }
    
    // Calculate total price
    const unitPrice = body.unit_price || item.unit_price || 0
    const totalPrice = unitPrice * body.quantity
    
    // Create transaction data
    const transactionData = {
      inventory_item_id: id,
      transaction_type: body.transaction_type,
      quantity: body.quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
      service_order_id: body.service_order_id || null,
      notes: body.notes || null,
      performed_by: body.performed_by || null,
      created_at: new Date().toISOString()
    }
    
    // Insert transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('inventory_transactions')
      .insert(transactionData)
      .select()
    
    if (transactionError) throw transactionError
    
    // Update item quantity
    const { error: updateError } = await supabase
      .from('inventory_items')
      .update({
        quantity: newQuantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (updateError) throw updateError
    
    return NextResponse.json(transaction[0], { status: 201 })
  } catch (error) {
    const structuredError = handleSupabaseError(error, `inventory/${params.id}/transactions/create`)
    console.error('Error creating inventory transaction:', structuredError)
    
    return NextResponse.json(
      { error: structuredError.message },
      { status: 500 }
    )
  }
}
