import type { Metadata } from "next"
import { createServerClient } from "@/lib/supabase"
import { CustomerClientPage } from "./client-page"

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
    // Użyj klienta serwerowego do pobierania danych
    const supabase = await createServerClient()

    console.log("Wywołanie getCustomers z parametrami:", {
      limit: 100,
      sortBy: "name",
      sortOrder: "asc"
    })

    // Wykonaj zapytanie do bazy danych
    let query = supabase
      .from('customers')
      .select('*', { count: 'exact' })

    // Dodaj limity i sortowanie
    query = query.limit(100).order('name', { ascending: true })

    // Wykonaj zapytanie
    const { data, error, count } = await query

    console.log("Wynik z Supabase:", {
      data: Array.isArray(data) ? `${data.length} rekordów` : data,
      error,
      count
    })

    if (error) {
      console.error('Error fetching customers:', error)
      return { data: fallbackData, count: fallbackData.length }
    }

    // Log do konsoli serwera
    console.log(Array.isArray(data) ? data : JSON.stringify(data))

    return { data: data || [], count: count || 0 }
  } catch (error) {
    console.error("Error fetching customers:", error)
    return { data: fallbackData, count: fallbackData.length }
  }
}

export default async function CustomersPage() {
  const { data, count } = await getCustomerData()

  // Pass the initial data to the client component
  return <CustomerClientPage initialData={data} initialCount={count} />
}
