import type { Metadata } from "next"
import { PlusCircle, Users, Building2, User, Download, Upload, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { columns } from "@/components/customers/columns"
// import { createServerClient } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Klienci - HVAC CRM ERP",
  description: "Zarządzanie klientami w systemie HVAC CRM ERP",
}

// Static data for Docker build
const staticData = [
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
  {
    id: "c3",
    name: "Firma XYZ Sp. z o.o.",
    tax_id: "3456789012",
    email: "kontakt@firmaxyz.pl",
    phone: "+48 345 678 901",
    type: "Biznesowy",
    status: "Aktywny",
    created_at: "2023-03-10T11:15:00Z",
  },
  {
    id: "c4",
    name: "Jan Kowalski",
    tax_id: "4567890123",
    email: "jan.kowalski@example.com",
    phone: "+48 456 789 012",
    type: "Indywidualny",
    status: "Nieaktywny",
    created_at: "2023-04-05T16:30:00Z",
  },
  {
    id: "c5",
    name: "Klimatyzacja Pro Sp. z o.o.",
    tax_id: "5678901234",
    email: "biuro@klimatyzacjapro.pl",
    phone: "+48 567 890 123",
    type: "Biznesowy",
    status: "Aktywny",
    created_at: "2023-05-12T10:00:00Z",
  },
]

async function getCustomerData() {
  // In production, this would fetch from Supabase
  // For Docker build, we're using static data
  return { data: staticData, count: staticData.length }
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

  // Liczba klientów biznesowych i indywidualnych
  const businessCustomers = data.filter(c => c.type === "Biznesowy").length
  const individualCustomers = data.filter(c => c.type === "Indywidualny").length

  // Liczba nowych klientów (ostatnie 30 dni)
  const newCustomers = data.filter(c => {
    const date = new Date(c.created_at)
    const now = new Date()
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
    return date >= thirtyDaysAgo
  }).length

  // Opcje filtrowania dla tabeli
  const typeOptions = [
    {
      label: "Biznesowy",
      value: "Biznesowy",
      icon: "building2",
    },
    {
      label: "Indywidualny",
      value: "Indywidualny",
      icon: "user",
    },
  ]

  const statusOptions = [
    {
      label: "Aktywny",
      value: "Aktywny",
    },
    {
      label: "Nieaktywny",
      value: "Nieaktywny",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Klienci</h1>
          <p className="text-muted-foreground">Zarządzaj klientami i ich danymi</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            Filtruj
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Download className="mr-2 h-4 w-4" />
            Eksportuj
          </Button>
          <Button asChild>
            <Link href="/customers/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Dodaj klienta
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30">
            <CardTitle className="text-sm font-medium">Wszyscy klienci</CardTitle>
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{count}</div>
            <p className="text-xs text-muted-foreground mt-1">Liczba klientów w systemie</p>
          </CardContent>
          <CardFooter className="p-2 border-t bg-muted/30">
            <Link href="/customers" className="text-xs text-muted-foreground hover:text-primary flex items-center w-full justify-end">
              Zarządzaj klientami
            </Link>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30">
            <CardTitle className="text-sm font-medium">Klienci biznesowi</CardTitle>
            <Building2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{businessCustomers}</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">Liczba klientów biznesowych</p>
              <Badge variant="outline" className="text-xs font-normal">
                {Math.round((businessCustomers / count) * 100)}%
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="p-2 border-t bg-muted/30">
            <Link href="/customers?type=Biznesowy" className="text-xs text-muted-foreground hover:text-primary flex items-center w-full justify-end">
              Pokaż klientów biznesowych
            </Link>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30">
            <CardTitle className="text-sm font-medium">Klienci indywidualni</CardTitle>
            <User className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{individualCustomers}</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">Liczba klientów indywidualnych</p>
              <Badge variant="outline" className="text-xs font-normal">
                {Math.round((individualCustomers / count) * 100)}%
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="p-2 border-t bg-muted/30">
            <Link href="/customers?type=Indywidualny" className="text-xs text-muted-foreground hover:text-primary flex items-center w-full justify-end">
              Pokaż klientów indywidualnych
            </Link>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30">
            <CardTitle className="text-sm font-medium">Nowi klienci</CardTitle>
            <Upload className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{newCustomers}</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">Dodani w ciągu ostatnich 30 dni</p>
              <Badge variant="outline" className="text-xs font-normal">
                {Math.round((newCustomers / count) * 100)}%
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="p-2 border-t bg-muted/30">
            <Link href="/customers?sort=created_at&order=desc" className="text-xs text-muted-foreground hover:text-primary flex items-center w-full justify-end">
              Pokaż nowych klientów
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-4">
        <DataTable
          data={tableData}
          columns={columns}
          searchColumn="name"
          filterableColumns={[
            {
              id: "type",
              title: "Typ klienta",
              options: typeOptions,
            },
            {
              id: "status",
              title: "Status",
              options: statusOptions,
            },
          ]}
        />
      </div>
    </div>
  )
}
