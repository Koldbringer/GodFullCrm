import type { Metadata } from "next"
import { MapPin, Filter, Building2, User, Wrench, Layers, MapIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapView } from "@/components/map/map-view"
import { MapViewClient } from "./map-client"
import { MapViewClientClustered } from "./map-client-clustered"
import { createServerClient } from "@/lib/supabase"
import { MapFilters } from "./map-filters"
import { AddSampleDataButton } from "@/components/map/add-sample-data-button"
import { GeocodeAddressesButton } from "@/components/map/geocode-addresses-button"

export const metadata: Metadata = {
  title: "Mapa - HVAC CRM ERP",
  description: "Wizualizacja lokalizacji klientów i zleceń na mapie",
}

// Fetch data from Supabase
async function getMapData({
  district = '',
  limit = 100,
  customerType = '',
  siteType = '',
  serviceStatus = ''
}: {
  district?: string
  limit?: number
  customerType?: string
  siteType?: string
  serviceStatus?: string
} = {}) {
  const supabase = await createServerClient()

  // Fetch customers with their addresses
  let customersQuery = supabase
    .from('customers')
    .select(`
      id,
      name,
      email,
      phone,
      type
    `)
    .limit(limit)

  // Apply customer type filter if provided
  if (customerType && customerType !== 'all') {
    customersQuery = customersQuery.eq('type', customerType)
  }

  const { data: customers } = await customersQuery

  // Fetch addresses with customer information
  let addressesQuery = supabase
    .from('addresses')
    .select(`
      id,
      street,
      city,
      zip_code,
      address_type,
      district,
      latitude,
      longitude,
      customer_id
    `)
    .limit(limit)

  // Apply district filter if provided
  if (district && district !== 'all') {
    // Try to filter by district first, then by city if no district is available
    addressesQuery = addressesQuery.or(`district.ilike.%${district}%,city.ilike.%${district}%`)
  }

  const { data: addresses } = await addressesQuery

  // Fetch sites with coordinates (if any)
  const { data: sites } = await supabase
    .from('sites')
    .select(`
      id,
      name,
      street,
      city,
      zip_code,
      latitude,
      longitude,
      customer_id
    `)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)

  // Fetch service orders with related data
  let serviceOrdersQuery = supabase
    .from('service_orders')
    .select(`
      id,
      title,
      description,
      status,
      scheduled_start,
      scheduled_end,
      customer_id,
      site_id,
      device_id,
      technician_id,
      customers (
        id,
        name
      ),
      technicians (
        id,
        name
      )
    `)
    .order('scheduled_start', { ascending: false })
    .limit(limit)

  // Apply service status filter if provided
  if (serviceStatus && serviceStatus !== 'all') {
    serviceOrdersQuery = serviceOrdersQuery.eq('status', serviceStatus)
  }

  const { data: serviceOrders } = await serviceOrdersQuery

  // Fetch technicians
  const { data: technicians } = await supabase
    .from('technicians')
    .select('*')
    .limit(limit)

  // Get all districts for filtering from addresses
  const districts = new Set<string>()
  if (addresses && Array.isArray(addresses)) {
    addresses.forEach(address => {
      if (address && typeof address === 'object') {
        // Try to use district first, then fall back to city
        const addressObj = address as any;
        const locationDistrict = addressObj.district || addressObj.city;
        if (locationDistrict) {
          districts.add(locationDistrict);
        }
      }
    })
  }

  // Get all site types for filtering (using address types for now)
  const siteTypes = new Set<string>()
  if (addresses && Array.isArray(addresses)) {
    addresses.forEach(address => {
      if (address && typeof address === 'object') {
        const addressObj = address as any;
        if (addressObj.address_type) {
          siteTypes.add(addressObj.address_type);
        }
      }
    })
  }

  // Create a map of customer IDs to customer data for easy lookup
  const customerMap = new Map()
  if (customers && Array.isArray(customers)) {
    customers.forEach(customer => {
      if (customer && typeof customer === 'object' && 'id' in customer) {
        customerMap.set(customer.id, customer)
      }
    })
  }

  // Combine addresses with customer data
  const addressesWithCustomers = (addresses && Array.isArray(addresses))
    ? addresses.map(address => {
        if (address && typeof address === 'object' && 'customer_id' in address) {
          const customer = customerMap.get(address.customer_id)
          return {
            id: address.id,
            street: address.street,
            city: address.city,
            zip_code: address.zip_code,
            address_type: address.address_type,
            district: address.district,
            latitude: address.latitude,
            longitude: address.longitude,
            customer_id: address.customer_id,
            customer: customer ? {
              id: customer.id,
              name: customer.name,
              type: customer.type
            } : undefined
          }
        }
        return address
      })
    : []

  // Filter addresses by customer type if provided
  let filteredAddresses = addressesWithCustomers
  if (customerType && customerType !== 'all') {
    filteredAddresses = filteredAddresses.filter(
      address => {
        if (address && typeof address === 'object' && 'customer' in address) {
          const addressObj = address as any;
          return addressObj.customer?.type === customerType;
        }
        return false;
      }
    )
  }

  // Filter out empty strings and return
  return {
    customers: customers || [],
    addresses: filteredAddresses,
    sites: sites || [],
    serviceOrders: serviceOrders || [],
    technicians: technicians || [],
    districts: Array.from(districts).filter(d => d !== '').sort(),
    siteTypes: Array.from(siteTypes).filter(type => type !== '').sort()
  }
}

export default async function MapPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Extract filter parameters from URL - convert to proper types
  const district = typeof searchParams.district === 'string' ? searchParams.district : 'all'
  const limitStr = typeof searchParams.limit === 'string' ? searchParams.limit : '100'
  const limit = parseInt(limitStr) || 100
  const customerType = typeof searchParams.customerType === 'string' ? searchParams.customerType : 'all'
  const siteType = typeof searchParams.siteType === 'string' ? searchParams.siteType : 'all'
  const serviceStatus = typeof searchParams.serviceStatus === 'string' ? searchParams.serviceStatus : 'all'

  // Get data with filters
  const {
    technicians,
    districts,
    siteTypes
  } = await getMapData({
    district,
    limit: isNaN(limit) ? 100 : limit,
    customerType,
    siteType,
    serviceStatus
  })

  // Format data for the map
  const mapLocations: Array<{
    id: string;
    name: string;
    address?: string;
    type: "customer" | "site" | "service" | "technician" | "device";
    coordinates: { lat: number; lng: number };
    status?: string;
    customer?: { id: string; name: string };
    meta?: Record<string, any>;
  }> = [];

  // Add address locations
  const { addresses } = await getMapData({
    district,
    limit: isNaN(limit) ? 100 : limit,
    customerType,
    siteType,
    serviceStatus
  });

  // Add addresses with coordinates to map locations
  if (addresses && Array.isArray(addresses)) {
    addresses.forEach(address => {
      if (address && typeof address === 'object' &&
          'latitude' in address && address.latitude &&
          'longitude' in address && address.longitude) {

        const addressObj = address as any; // Type assertion for simplicity

        // Determine if this is a customer location or a site
        const locationType = addressObj.customer ? "customer" : "site";

        mapLocations.push({
          id: `address-${addressObj.id}`,
          name: addressObj.customer?.name || 'Lokalizacja',
          address: `${addressObj.street}, ${addressObj.zip_code} ${addressObj.city}`,
          type: locationType,
          coordinates: {
            lat: parseFloat(addressObj.latitude),
            lng: parseFloat(addressObj.longitude)
          },
          status: "active",
          customer: addressObj.customer ? {
            id: addressObj.customer.id,
            name: addressObj.customer.name
          } : undefined,
          meta: {
            siteType: addressObj.address_type || 'primary',
            district: addressObj.district || addressObj.city,
            customerType: addressObj.customer?.type || ''
          }
        });
      }
    });
  }

  // Add service order locations - for now, we'll skip these until we have proper coordinates
  // We'll implement this in the future when service orders are linked to addresses with coordinates

  // Add technician locations (simulated for now)
  if (technicians && Array.isArray(technicians)) {
    technicians.forEach((technician, index) => {
      if (technician && typeof technician === 'object' && 'id' in technician) {
        // Simulate technician locations around Warsaw
        const lat = 52.2297 + (Math.random() - 0.5) * 0.1
        const lng = 21.0122 + (Math.random() - 0.5) * 0.1

        const technicianObj = technician as any; // Type assertion for simplicity

        mapLocations.push({
          id: `technician-${technicianObj.id}`,
          name: technicianObj.name || 'Technik',
          type: "technician",
          coordinates: {
            lat,
            lng
          },
          status: index % 3 === 0 ? "busy" : "active",
          meta: {
            phone: technicianObj.phone || '',
            email: technicianObj.email || ''
          }
        });
      }
    });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <NotificationCenter />
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Mapa</h2>
            <p className="text-muted-foreground">
              Wizualizacja lokalizacji klientów i zleceń na mapie
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <MapFilters
              districts={districts}
              siteTypes={siteTypes}
              currentDistrict={district}
              currentLimit={isNaN(limit) ? 100 : limit}
              currentSiteType={siteType}
              currentCustomerType={customerType}
              currentServiceStatus={serviceStatus}
            />
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/sites/new">
                  <MapPin className="mr-2 h-4 w-4" />
                  Dodaj lokalizację
                </Link>
              </Button>
              <AddSampleDataButton />
              <GeocodeAddressesButton />
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center">
              <Layers className="mr-2 h-4 w-4" />
              Wszystkie
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center">
              <Building2 className="mr-2 h-4 w-4" />
              Lokalizacje
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center">
              <Wrench className="mr-2 h-4 w-4" />
              Zlecenia
            </TabsTrigger>
            <TabsTrigger value="technicians" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Technicy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <MapViewClientClustered initialLocations={mapLocations} />
          </TabsContent>

          <TabsContent value="customers">
            <MapViewClientClustered
              initialLocations={mapLocations.filter(loc => loc.type === "customer")}
              title="Mapa lokalizacji klientów"
              description="Wizualizacja wszystkich lokalizacji klientów"
            />
          </TabsContent>

          <TabsContent value="services">
            <MapViewClientClustered
              initialLocations={mapLocations.filter(loc => loc.type === "service")}
              title="Mapa zleceń serwisowych"
              description="Wizualizacja aktywnych zleceń serwisowych"
            />
          </TabsContent>

          <TabsContent value="technicians">
            <MapViewClientClustered
              initialLocations={mapLocations.filter(loc => loc.type === "technician")}
              title="Mapa techników"
              description="Lokalizacja techników w terenie"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
