import type { Metadata } from "next"
import { PlusCircle, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/customers/data-table"
import { columns } from "@/components/customers/columns"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { getCustomers } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Klienci - HVAC CRM ERP",
  description: "Zarządzanie klientami w systemie HVAC CRM ERP",
}

// Dane zastępcze na wypadek błędu API
const fallbackData = [
  {
    id: "c1",
    name: "Adam Bielecki",
    tax_id: "1234567890",
    email: "adam.bielecki@example.com",
    phone: "+48 123 456 789",
    type: "Biznesowy",
    status: "Aktywny",
    created_at: "2023-01-15T09:30:00Z",
  },
  {
    id: "c2",
    name: "Celina Dąbrowska",
    tax_id: "2345678901",
    email: "celina.dabrowska@example.com",
    phone: "+48 234 567 890",
    type: "Indywidualny",
    status: "Aktywny",
    created_at: "2023-02-20T14:45:00Z",
  },
]

async function getCustomerData() {
  try {
    const { data, count } = await getCustomers({
      limit: 100,
      sortBy: "name",
      sortOrder: "asc"
    })
    return { data, count }
  } catch (error) {
    console.error("Error fetching customers:", error)
    return { data: fallbackData, count: fallbackData.length }
  }
}

export default async function CustomersPage() {
  const { data, count } = await getCustomerData()

  // Mapowanie danych do formatu oczekiwanego przez DataTable
  const tableData = data.map(customer => ({
    id: customer.id,
    name: customer.name,
    tax_id: customer.tax_id || "",
    email: customer.email,
    phone: customer.phone,
    type: customer.type,
    status: customer.status,
    created_at: customer.created_at,
  }))

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
          <h2 className="text-3xl font-bold tracking-tight">Klienci</h2>
          <div className="flex items-center space-x-2">
            <Link href="/customers/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Dodaj klienta
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wszyscy klienci</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count}</div>
              <p className="text-xs text-muted-foreground">Liczba klientów w systemie</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Klienci biznesowi</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.filter(c => c.type === "Biznesowy").length}</div>
              <p className="text-xs text-muted-foreground">Liczba klientów biznesowych</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Klienci indywidualni</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.filter(c => c.type === "Indywidualny").length}</div>
              <p className="text-xs text-muted-foreground">Liczba klientów indywidualnych</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nowi klienci</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.filter(c => {
                  const date = new Date(c.created_at)
                  const now = new Date()
                  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
                  return date >= thirtyDaysAgo
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">Dodani w ciągu ostatnich 30 dni</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <DataTable data={tableData} columns={columns} />
        </div>
      </div>
    </div>
  )
}
