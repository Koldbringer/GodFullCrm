import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { handleSupabaseError } from '@/lib/supabase/error-handler'

/**
 * GET handler for inventory items
 * Fetches inventory items with optional filtering
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    
    // Create Supabase client
    const supabase = await createServerClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Failed to create Supabase client' },
        { status: 500 }
      )
    }
    
    // Build query
    let query = supabase
      .from('inventory_items')
      .select('*', { count: 'exact' })
    
    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }
    
    if (status) {
      query = query.eq('status', status)
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,supplier.ilike.%${search}%`)
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1)
    
    // Execute query
    const { data, error, count } = await query
    
    if (error) throw error
    
    return NextResponse.json({
      data,
      count,
      limit,
      offset
    })
  } catch (error) {
    const structuredError = handleSupabaseError(error, 'inventory')
    console.error('Error fetching inventory items:', structuredError)
    
    return NextResponse.json(
      { error: structuredError.message },
      { status: 500 }
    )
  }
}

/**
 * POST handler for creating a new inventory item
 */
export async function POST(request: Request) {
  try {
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
    if (!body.name || !body.sku) {
      return NextResponse.json(
        { error: 'Name and SKU are required fields' },
        { status: 400 }
      )
    }
    
    // Add timestamps
    const now = new Date().toISOString()
    const itemData = {
      ...body,
      created_at: now,
      updated_at: now
    }
    
    // Insert new item
    const { data, error } = await supabase
      .from('inventory_items')
      .insert(itemData)
      .select()
    
    if (error) throw error
    
    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    const structuredError = handleSupabaseError(error, 'inventory/create')
    console.error('Error creating inventory item:', structuredError)
    
    return NextResponse.json(
      { error: structuredError.message },
      { status: 500 }
    )
  }
}
