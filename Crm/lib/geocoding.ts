import { createClient } from './supabase'

interface GeocodingResult {
  lat: number
  lng: number
  success: boolean
  error?: string
  district?: string
  address_details?: any
}

/**
 * Geocode an address using the OpenStreetMap Nominatim API
 * This is a free service with usage limits (1 request per second)
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult> {
  try {
    // Format the address for the API
    const formattedAddress = encodeURIComponent(address)

    // Call the Nominatim API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${formattedAddress}&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'HVAC-CRM-App',
          'Accept-Language': 'pl-PL'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`)
    }

    const data = await response.json()

    if (data && data.length > 0) {
      // Extract district information from address details
      const addressDetails = data[0].address || {}

      // Try to find district information in different fields
      // OpenStreetMap might return district in different fields depending on the location
      const district =
        addressDetails.suburb ||
        addressDetails.district ||
        addressDetails.neighbourhood ||
        addressDetails.quarter ||
        addressDetails.borough ||
        '';

      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        district: district,
        address_details: addressDetails,
        success: true
      }
    } else {
      return {
        lat: 0,
        lng: 0,
        success: false,
        error: 'No results found'
      }
    }
  } catch (error) {
    console.error('Geocoding error:', error)
    return {
      lat: 0,
      lng: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Get coordinates for an address, first checking the database
 * If not found, geocode the address and store the result
 */
export async function getCoordinates(
  addressId: string,
  street: string,
  city: string,
  zipCode: string
): Promise<GeocodingResult> {
  const supabase = createClient()

  // Check if we already have coordinates for this address
  const { data: addressData, error: addressError } = await supabase
    .from('addresses')
    .select('latitude, longitude, district')
    .eq('id', addressId)
    .single()

  // If we have coordinates, return them
  if (addressData && addressData.latitude && addressData.longitude) {
    return {
      lat: parseFloat(addressData.latitude),
      lng: parseFloat(addressData.longitude),
      district: addressData.district || '',
      success: true
    }
  }

  // Otherwise, geocode the address
  const fullAddress = `${street}, ${zipCode} ${city}, Polska`
  const result = await geocodeAddress(fullAddress)

  // If geocoding was successful, store the coordinates and district
  if (result.success) {
    const { error: updateError } = await supabase
      .from('addresses')
      .update({
        latitude: result.lat,
        longitude: result.lng,
        district: result.district || ''
      })
      .eq('id', addressId)

    if (updateError) {
      console.error('Error updating address coordinates:', updateError)
    }
  }

  return result
}

/**
 * Batch geocode multiple addresses
 * This respects rate limits by adding delays between requests
 */
export async function batchGeocodeAddresses(
  addresses: Array<{
    id: string
    street: string
    city: string
    zip_code: string
  }>,
  onProgress?: (current: number, total: number) => void
): Promise<number> {
  let successCount = 0
  const total = addresses.length

  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i]

    // Get coordinates (from DB or geocode)
    const result = await getCoordinates(
      address.id,
      address.street,
      address.city,
      address.zip_code
    )

    if (result.success) {
      successCount++
    }

    // Report progress
    if (onProgress) {
      onProgress(i + 1, total)
    }

    // Respect rate limits (1 request per second)
    if (i < addresses.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1100))
    }
  }

  return successCount
}
