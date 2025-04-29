import type { Metadata } from "next"
import { PlusCircle, Filter } from "lucide-react"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/devices/data-table"
import { columns } from "@/components/devices/columns"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { DeviceTypeFilter } from "@/components/devices/device-type-filter"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { Skeleton } from "@/components/ui/skeleton"
import { createServerClient } from "@/lib/supabase"

export const metadata: Metadata = {
  title: "Urządzenia HVAC - HVAC CRM ERP",
  description: "Zarządzanie urządzeniami HVAC w systemie CRM ERP",
}

// Dane zastępcze na wypadek błędu API
const fallbackData = [
  {
    id: "DEV001",
    type: "Klimatyzator",
    model: "Mitsubishi Electric MSZ-AP25VG",
    serial_number: "ME2023051001",
    installation_date: "2023-05-10T09:30:00Z",
    site_name: "Biuro główne - Adam Bielecki",
    customer_name: "Adam Bielecki",
    status: "Aktywne",
    last_service_date: "2023-09-15T14:00:00Z",
    warranty_end_date: "2025-05-10T00:00:00Z",
  },
  {
    id: "DEV002",
    type: "Pompa ciepła",
    model: "Daikin Altherma 3 ERGA04DV",
    serial_number: "DA2023062002",
    installation_date: "2023-06-20T11:45:00Z",
    site_name: "Dom jednorodzinny - Celina Dąbrowska",
    customer_name: "Celina Dąbrowska",
    status: "Aktywne",
    last_service_date: "2023-10-05T10:30:00Z",
    warranty_end_date: "2028-06-20T00:00:00Z",
  }
]

async function DevicesTable() {
  try {
    // Pobieranie danych bezpośrednio z Supabase w komponencie serwerowym
    const supabase = await createServerClient()

    console.log("Fetching devices data")

    const { data: devices, error } = await supabase
      .from('devices')
      .select(`
        *,
        sites(
          id,
          name,
          customers(id, name)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching devices:", error)
      return <DataTable data={fallbackData} columns={columns} />
    }

    // Mapowanie danych z Supabase do formatu wymaganego przez tabelę
    const formattedDevices = devices.map(device => ({
      id: device.id,
      type: device.type || "Nieznany",
      model: device.model,
      serial_number: device.serial_number,
      installation_date: device.installation_date || new Date().toISOString(),
      site_name: device.sites?.name || "Nieznana lokalizacja",
      customer_name: device.sites?.customers?.name || "Nieznany klient",
      status: "Aktywne",
      last_service_date: null,
      warranty_end_date: device.warranty_expiry || new Date().toISOString(),
    }))

    console.log(`Fetched ${formattedDevices.length} devices`)

    return <DataTable data={formattedDevices.length > 0 ? formattedDevices : fallbackData} columns={columns} />
  } catch (error) {
    console.error("Error fetching devices:", error)
    return <DataTable data={fallbackData} columns={columns} />
  }
}

function DevicesTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="rounded-md border">
        <div className="h-12 border-b px-4 flex items-center">
          {Array(7).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-4 w-[100px] mx-2" />
          ))}
        </div>
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="h-16 border-b px-4 flex items-center">
            {Array(7).fill(0).map((_, j) => (
              <Skeleton key={j} className="h-4 w-[100px] mx-2" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DevicesPage() {
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
          <h2 className="text-3xl font-bold tracking-tight">Urządzenia HVAC</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtry
            </Button>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Dodaj urządzenie
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DeviceTypeFilter />
        </div>

        <div className="space-y-4">
          <Suspense fallback={<DevicesTableSkeleton />}>
            <DevicesTable />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
