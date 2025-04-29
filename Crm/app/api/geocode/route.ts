import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { geocodeAddress, batchGeocodeAddresses } from '@/lib/geocoding'

// Geocode a single address
export async function POST(request: Request) {
  try {
    const { addressId, street, city, zipCode } = await request.json()

    if (!addressId || !street || !city) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Geocode the address
    const fullAddress = `${street}, ${zipCode} ${city}, Polska`
    const result = await geocodeAddress(fullAddress)

    if (result.success) {
      // Update the address in the database
      const supabase = await createServerClient()
      const { error: updateError } = await supabase
        .from('addresses')
        .update({
          latitude: result.lat,
          longitude: result.lng,
          district: result.district || ''
        })
        .eq('id', addressId)

      if (updateError) {
        return NextResponse.json(
          { success: false, error: updateError.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        coordinates: {
          lat: result.lat,
          lng: result.lng
        },
        district: result.district || '',
        address_details: result.address_details || {}
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error in geocode API:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Batch geocode addresses
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = parseInt(searchParams.get('skip') || '0')

    // Get addresses without coordinates
    const supabase = await createServerClient()
    const { data: addresses, error: fetchError } = await supabase
      .from('addresses')
      .select('id, street, city, zip_code')
      .is('latitude', null)
      .range(skip, skip + limit - 1)

    if (fetchError) {
      return NextResponse.json(
        { success: false, error: fetchError.message },
        { status: 500 }
      )
    }

    if (!addresses || addresses.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No addresses to geocode',
        processed: 0,
        remaining: 0
      })
    }

    // Count remaining addresses without coordinates
    const { count: remainingCount, error: countError } = await supabase
      .from('addresses')
      .select('id', { count: 'exact', head: true })
      .is('latitude', null)
      .gt('id', addresses[addresses.length - 1].id)

    if (countError) {
      console.error('Error counting remaining addresses:', countError)
    }

    // Process the batch
    const successCount = await batchGeocodeAddresses(addresses)

    return NextResponse.json({
      success: true,
      processed: addresses.length,
      successful: successCount,
      remaining: remainingCount || 0
    })
  } catch (error) {
    console.error('Error in batch geocode API:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
