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
// import { createServerClient } from "@/lib/supabase"

export const metadata: Metadata = {
  title: "Zlecenia serwisowe - HVAC CRM ERP",
  description: "Zarządzanie zleceniami serwisowymi w systemie HVAC CRM ERP",
}

// Static data for Docker build
const staticServiceOrdersData = [
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
  },
  {
    id: "SO003",
    customer_name: "Firma XYZ Sp. z o.o.",
    site_name: "Biuro",
    device_model: "Vents VUT 350 PE EC",
    technician_name: "Anna Wiśniewska",
    status: "Zakończone",
    created_at: "2023-10-10T08:15:00Z",
    scheduled_date: "2023-10-18T09:30:00Z",
  }
]

async function ServiceOrdersTable() {
  // In production, this would fetch from Supabase
  // For Docker build, we're using static data
  console.log("Using static service orders data for Docker build")
  
  return <DataTable data={staticServiceOrdersData} columns={columns} />
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
