import type { Metadata } from "next"
import { PlusCircle, Filter, List, KanbanSquare } from "lucide-react"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/service-orders/data-table"
import { columns } from "@/components/service-orders/columns"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ServiceOrdersKanban } from "@/components/service-orders/service-orders-kanban"
import { createServerClient } from "@/lib/supabase"

export const metadata: Metadata = {
  title: "Zlecenia serwisowe - HVAC CRM ERP",
  description: "Zarządzanie zleceniami serwisowymi w systemie HVAC CRM ERP",
}

// Dane zastępcze na wypadek błędu API
const fallbackData = [
  {
    id: "SO001",
    customer_name: "Adam Bielecki",
    site_name: "Biuro główne",
    device_model: "Mitsubishi Electric MSZ-AP25VG",
    technician_name: "Piotr Nowak",
    status: "W trakcie",
    created_at: "2023-10-15T09:30:00Z",
    scheduled_date: "2023-10-20T10:00:00Z",
  },
  {
    id: "SO002",
    customer_name: "Celina Dąbrowska",
    site_name: "Dom jednorodzinny",
    device_model: "Daikin FTXM35N",
    technician_name: "Marek Kowalski",
    status: "Zaplanowane",
    created_at: "2023-10-16T11:45:00Z",
    scheduled_date: "2023-10-25T14:00:00Z",
  }
]

async function ServiceOrdersTable() {
  try {
    // Pobieranie danych bezpośrednio z Supabase w komponencie serwerowym
    const supabase = await createServerClient()

    console.log("Fetching service orders data")

    const { data: orders, error } = await supabase
      .from('service_orders')
      .select(`
        *,
        customers(id, name),
        sites(id, name),
        devices(id, model),
        technicians(id, name)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching service orders:", error)
      return <DataTable data={fallbackData} columns={columns} />
    }

    // Mapowanie danych z Supabase do formatu wymaganego przez tabelę
    const formattedOrders = orders.map(order => ({
      id: order.id,
      customer_name: order.customers?.name || "Nieznany klient",
      site_name: order.sites?.name || "Nieznana lokalizacja",
      device_model: order.devices?.model || "Nieznane urządzenie",
      technician_name: order.technicians?.name || "Nieprzypisany",
      status: order.status || "Nieznany",
      created_at: order.created_at,
      scheduled_date: order.scheduled_date || new Date().toISOString(),
    }))

    console.log(`Fetched ${formattedOrders.length} service orders`)

    return <DataTable data={formattedOrders.length > 0 ? formattedOrders : fallbackData} columns={columns} />
  } catch (error) {
    console.error("Error fetching service orders:", error)
    return <DataTable data={fallbackData} columns={columns} />
  }
}

function ServiceOrdersTableSkeleton() {
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

export default function ServiceOrdersPage() {
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
          <h2 className="text-3xl font-bold tracking-tight">Zlecenia serwisowe</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtry
            </Button>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nowe zlecenie
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <Tabs defaultValue="table" className="space-y-4">
            <TabsList>
              <TabsTrigger value="table" className="flex items-center">
                <List className="mr-2 h-4 w-4" />
                Tabela
              </TabsTrigger>
              <TabsTrigger value="kanban" className="flex items-center">
                <KanbanSquare className="mr-2 h-4 w-4" />
                Kanban
              </TabsTrigger>
            </TabsList>
            <TabsContent value="table" className="space-y-4">
              <Suspense fallback={<ServiceOrdersTableSkeleton />}>
                <ServiceOrdersTable />
              </Suspense>
            </TabsContent>
            <TabsContent value="kanban" className="space-y-4">
              <ServiceOrdersKanban />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
