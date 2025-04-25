import { createClient } from './supabase'

// Sample site data with addresses and coordinates
const sampleSites = [
  {
    name: "Biuro Główne Warszawa",
    street: "ul. Marszałkowska 142",
    city: "Warszawa",
    zip_code: "00-061",
    type: "Biuro",
    status: "active",
    latitude: 52.2297,
    longitude: 21.0122,
    customer_id: null // Will be set dynamically
  },
  {
    name: "Oddział Kraków",
    street: "ul. Floriańska 25",
    city: "Kraków",
    zip_code: "31-019",
    type: "Biuro",
    status: "active",
    latitude: 50.0647,
    longitude: 19.9450,
    customer_id: null
  },
  {
    name: "Centrum Handlowe Złote Tarasy",
    street: "ul. Złota 59",
    city: "Warszawa",
    zip_code: "00-120",
    type: "Lokal usługowy",
    status: "active",
    latitude: 52.2300,
    longitude: 21.0030,
    customer_id: null
  },
  {
    name: "Apartament Mokotów",
    street: "ul. Puławska 152",
    city: "Warszawa",
    zip_code: "02-670",
    type: "Mieszkanie",
    status: "active",
    latitude: 52.1880,
    longitude: 21.0250,
    customer_id: null
  },
  {
    name: "Fabryka Wola",
    street: "ul. Kasprzaka 25",
    city: "Warszawa",
    zip_code: "01-224",
    type: "Obiekt przemysłowy",
    status: "active",
    latitude: 52.2320,
    longitude: 20.9770,
    customer_id: null
  },
  {
    name: "Dom Jednorodzinny Wilanów",
    street: "ul. Klimczaka 10",
    city: "Warszawa",
    zip_code: "02-797",
    type: "Dom",
    status: "active",
    latitude: 52.1650,
    longitude: 21.0850,
    customer_id: null
  },
  {
    name: "Biurowiec Gdańsk",
    street: "ul. Długa 15",
    city: "Gdańsk",
    zip_code: "80-831",
    type: "Biuro",
    status: "active",
    latitude: 54.3520,
    longitude: 18.6466,
    customer_id: null
  },
  {
    name: "Centrum Logistyczne Łódź",
    street: "ul. Piotrkowska 100",
    city: "Łódź",
    zip_code: "90-004",
    type: "Obiekt przemysłowy",
    status: "active",
    latitude: 51.7592,
    longitude: 19.4560,
    customer_id: null
  }
]

// Sample customer data
const sampleCustomers = [
  {
    name: "ACME Corporation",
    email: "contact@acme.com",
    phone: "+48 123 456 789",
    type: "Firma",
    status: "active"
  },
  {
    name: "Jan Kowalski",
    email: "jan.kowalski@example.com",
    phone: "+48 987 654 321",
    type: "Osoba prywatna",
    status: "active"
  },
  {
    name: "Szkoła Podstawowa nr 1",
    email: "sekretariat@sp1.edu.pl",
    phone: "+48 111 222 333",
    type: "Instytucja",
    status: "active"
  },
  {
    name: "Restauracja Smaczna",
    email: "kontakt@smaczna.pl",
    phone: "+48 444 555 666",
    type: "Firma",
    status: "active"
  }
]

// Sample service orders
const sampleServiceOrders = [
  {
    title: "Przegląd klimatyzacji",
    description: "Rutynowy przegląd i czyszczenie klimatyzacji",
    status: "new",
    priority: "medium",
    scheduled_start: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    scheduled_end: new Date(Date.now() + 86400000 + 7200000).toISOString(), // Tomorrow + 2 hours
    customer_id: null, // Will be set dynamically
    site_id: null, // Will be set dynamically
    device_id: null, // Will be set dynamically
    technician_id: null // Will be set dynamically
  },
  {
    title: "Naprawa pompy ciepła",
    description: "Naprawa uszkodzonej pompy ciepła - wyciek czynnika",
    status: "in_progress",
    priority: "high",
    scheduled_start: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    scheduled_end: new Date(Date.now() - 86400000 + 14400000).toISOString(), // Yesterday + 4 hours
    customer_id: null,
    site_id: null,
    device_id: null,
    technician_id: null
  },
  {
    title: "Instalacja nowej klimatyzacji",
    description: "Montaż nowej klimatyzacji w biurze",
    status: "scheduled",
    priority: "medium",
    scheduled_start: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    scheduled_end: new Date(Date.now() + 172800000 + 28800000).toISOString(), // Day after tomorrow + 8 hours
    customer_id: null,
    site_id: null,
    device_id: null,
    technician_id: null
  }
]

// Sample technicians
const sampleTechnicians = [
  {
    name: "Adam Nowak",
    email: "adam.nowak@example.com",
    phone: "+48 111 111 111",
    specialization: "Klimatyzacje",
    status: "Dostępny"
  },
  {
    name: "Marta Wiśniewska",
    email: "marta.wisniewska@example.com",
    phone: "+48 222 222 222",
    specialization: "Pompy ciepła",
    status: "Zajęty"
  },
  {
    name: "Piotr Kowalczyk",
    email: "piotr.kowalczyk@example.com",
    phone: "+48 333 333 333",
    specialization: "Wentylacja",
    status: "Dostępny"
  }
]

// Function to add sample data to the database
export async function addSampleData() {
  const supabase = createClient()
  
  // Add customers
  const { data: customersData, error: customersError } = await supabase
    .from('customers')
    .insert(sampleCustomers)
    .select()
  
  if (customersError) {
    console.error('Error adding sample customers:', customersError)
    return { success: false, error: customersError }
  }
  
  // Add sites with customer IDs
  const sitesWithCustomers = sampleSites.map((site, index) => ({
    ...site,
    customer_id: customersData[index % customersData.length].id
  }))
  
  const { data: sitesData, error: sitesError } = await supabase
    .from('sites')
    .insert(sitesWithCustomers)
    .select()
  
  if (sitesError) {
    console.error('Error adding sample sites:', sitesError)
    return { success: false, error: sitesError }
  }
  
  // Add technicians
  const { data: techniciansData, error: techniciansError } = await supabase
    .from('technicians')
    .insert(sampleTechnicians)
    .select()
  
  if (techniciansError) {
    console.error('Error adding sample technicians:', techniciansError)
    return { success: false, error: techniciansError }
  }
  
  // Add service orders
  const serviceOrdersWithRelations = sampleServiceOrders.map((order, index) => ({
    ...order,
    customer_id: customersData[index % customersData.length].id,
    site_id: sitesData[index % sitesData.length].id,
    technician_id: techniciansData[index % techniciansData.length].id
  }))
  
  const { data: ordersData, error: ordersError } = await supabase
    .from('service_orders')
    .insert(serviceOrdersWithRelations)
    .select()
  
  if (ordersError) {
    console.error('Error adding sample service orders:', ordersError)
    return { success: false, error: ordersError }
  }
  
  return { 
    success: true, 
    data: {
      customers: customersData,
      sites: sitesData,
      technicians: techniciansData,
      orders: ordersData
    }
  }
}

// Function to check if sample data exists
export async function checkSampleData() {
  const supabase = createClient()
  
  // Check if there are any sites with coordinates
  const { data: sites, error: sitesError } = await supabase
    .from('sites')
    .select('id, latitude, longitude')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .limit(1)
  
  if (sitesError) {
    console.error('Error checking sample sites:', sitesError)
    return { exists: false, error: sitesError }
  }
  
  return { exists: sites && sites.length > 0 }
}
