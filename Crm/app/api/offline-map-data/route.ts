import { NextResponse } from 'next/server'

// Sample data for offline map
export async function GET() {
  // Generate sample data for the map
  const mapLocations = generateSampleLocations()
  
  return NextResponse.json(mapLocations)
}

// Function to generate sample locations
function generateSampleLocations() {
  // Sample customer types
  const customerTypes = ['residential', 'commercial', 'industrial']
  
  // Sample site types
  const siteTypes = ['primary', 'secondary', 'warehouse', 'office', 'factory']
  
  // Sample districts in Poland
  const districts = [
    'Warszawa-Śródmieście', 'Warszawa-Mokotów', 'Warszawa-Ursynów', 
    'Warszawa-Wola', 'Warszawa-Bemowo', 'Warszawa-Bielany',
    'Kraków-Stare Miasto', 'Kraków-Nowa Huta', 'Kraków-Krowodrza',
    'Wrocław-Stare Miasto', 'Wrocław-Krzyki', 'Wrocław-Fabryczna',
    'Poznań-Stare Miasto', 'Poznań-Nowe Miasto', 'Poznań-Grunwald',
    'Gdańsk-Śródmieście', 'Gdańsk-Wrzeszcz', 'Gdańsk-Oliwa'
  ]
  
  // Sample service statuses
  const serviceStatuses = ['pending', 'in_progress', 'completed', 'cancelled']
  
  // Generate 100 random locations
  const locations = []
  
  // Generate customer locations
  for (let i = 0; i < 50; i++) {
    // Generate random coordinates in Poland
    const lat = 51.9194 + (Math.random() - 0.5) * 2 // Roughly Poland's latitude range
    const lng = 19.1451 + (Math.random() - 0.5) * 4 // Roughly Poland's longitude range
    
    const customerType = customerTypes[Math.floor(Math.random() * customerTypes.length)]
    const district = districts[Math.floor(Math.random() * districts.length)]
    
    locations.push({
      id: `customer-${i + 1}`,
      name: `Klient ${i + 1}`,
      address: `ul. Przykładowa ${i + 1}, ${district}`,
      type: "customer",
      coordinates: {
        lat,
        lng
      },
      status: "active",
      meta: {
        customerType,
        district,
        siteType: siteTypes[Math.floor(Math.random() * siteTypes.length)]
      }
    })
  }
  
  // Generate service order locations
  for (let i = 0; i < 30; i++) {
    // Generate random coordinates in Poland
    const lat = 51.9194 + (Math.random() - 0.5) * 2
    const lng = 19.1451 + (Math.random() - 0.5) * 4
    
    const status = serviceStatuses[Math.floor(Math.random() * serviceStatuses.length)]
    const district = districts[Math.floor(Math.random() * districts.length)]
    
    locations.push({
      id: `service-${i + 1}`,
      name: `Zlecenie serwisowe ${i + 1}`,
      address: `ul. Serwisowa ${i + 1}, ${district}`,
      type: "service",
      coordinates: {
        lat,
        lng
      },
      status,
      customer: {
        id: `customer-${Math.floor(Math.random() * 50) + 1}`,
        name: `Klient ${Math.floor(Math.random() * 50) + 1}`
      },
      meta: {
        district,
        scheduledDate: new Date(Date.now() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
      }
    })
  }
  
  // Generate technician locations
  for (let i = 0; i < 20; i++) {
    // Generate random coordinates in Poland
    const lat = 51.9194 + (Math.random() - 0.5) * 2
    const lng = 19.1451 + (Math.random() - 0.5) * 4
    
    locations.push({
      id: `technician-${i + 1}`,
      name: `Technik ${i + 1}`,
      type: "technician",
      coordinates: {
        lat,
        lng
      },
      status: i % 3 === 0 ? "busy" : "active",
      meta: {
        phone: `+48 ${Math.floor(100000000 + Math.random() * 900000000)}`,
        email: `technik${i + 1}@example.com`
      }
    })
  }
  
  return locations
}