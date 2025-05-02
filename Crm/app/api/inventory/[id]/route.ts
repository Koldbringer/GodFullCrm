import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { handleSupabaseError } from '@/lib/supabase/error-handler'

/**
 * GET handler for a specific inventory item
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Create Supabase client
    const supabase = await createServerClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Failed to create Supabase client' },
        { status: 500 }
      )
    }
    
    // Fetch item
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    
    if (!data) {
      return NextResponse.json(
        { error: 'Inventory item not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    const structuredError = handleSupabaseError(error, `inventory/${params.id}`)
    console.error('Error fetching inventory item:', structuredError)
    
    return NextResponse.json(
      { error: structuredError.message },
      { status: 500 }
    )
  }
}

/**
 * PATCH handler for updating an inventory item
 */
export async function PATCH(
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
    
    // Add updated_at timestamp
    const updateData = {
      ...body,
      updated_at: new Date().toISOString()
    }
    
    // Update item
    const { data, error } = await supabase
      .from('inventory_items')
      .update(updateData)
      .eq('id', id)
      .select()
    
    if (error) throw error
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Inventory item not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(data[0])
  } catch (error) {
    const structuredError = handleSupabaseError(error, `inventory/${params.id}/update`)
    console.error('Error updating inventory item:', structuredError)
    
    return NextResponse.json(
      { error: structuredError.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE handler for removing an inventory item
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Create Supabase client
    const supabase = await createServerClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Failed to create Supabase client' },
        { status: 500 }
      )
    }
    
    // Delete item
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
  } catch (error) {
    const structuredError = handleSupabaseError(error, `inventory/${params.id}/delete`)
    console.error('Error deleting inventory item:', structuredError)
    
    return NextResponse.json(
      { error: structuredError.message },
      { status: 500 }
    )
  }
}
