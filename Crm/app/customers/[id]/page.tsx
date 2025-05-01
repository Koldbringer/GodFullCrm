import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  BarChart3,
  Building2,
  Calendar,
  Clock,
  FileAudio,
  FileText,
  Globe,
  Mail,
  MapPin,
  Mic,
  Package,
  Phone,
  User,
  Briefcase,
  DollarSign,
  Calendar as CalendarIcon,
  Share2,
} from "lucide-react"

import { Database } from "@/types/supabase" // Added import
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CustomerDevices } from "@/components/customers/customer-devices"
import { CustomerServiceHistory } from "@/components/customers/customer-service-history"
import { CustomerCommunication } from "@/components/customers/customer-communication"
import { CustomerInvoices } from "@/components/customers/customer-invoices"
import { CustomerAnalytics } from "@/components/customers/customer-analytics"
import { CustomerNotes } from "@/components/customers/customer-notes"
import { CustomerSites } from "@/components/customers/customer-sites"
import { CustomerFiles } from "@/components/customers/customer-files"
import { CustomerTranscriptions } from "@/components/customers/customer-transcriptions"
import { CustomerAudioManager } from "@/components/customers/customer-audio-manager"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { createServerClient } from "@/lib/supabase/server"
import { EditCustomerForm } from "@/components/customers/edit-customer-form"

export const metadata: Metadata = {
  title: "Profil klienta - HVAC CRM ERP",
  description: "Szczegółowe informacje o kliencie w systemie HVAC CRM ERP",
}

// Define explicit types based on Database interface
type ServiceOrder = {
  id: string
  title?: string
  status: string | null
  scheduled_date?: string
  priority?: string
  scheduled_start?: string | null
  service_type?: string | null
}

type Invoice = {
  id: string
  invoice_number: string
  issue_date: string
  due_date: string
  total_amount: number
  status: string
}

// Extended customer type with additional fields from the fallback data
type EnhancedCustomerProfile = Database['public']['Tables']['customers']['Row'] & {
  // Additional fields from database
  sites: Database['public']['Tables']['sites']['Row'][] | null
  service_orders: ServiceOrder[]
  invoices: Invoice[]
  total_service_orders: number
  total_invoices: number
  total_spent: number
  payment_status: string

  // Additional fields from fallback data
  tax_id?: string
  address?: string
  city?: string
  postal_code?: string
  type?: string
  industry?: string
  website?: string
  customer_since?: string
  status?: string
  referral_source?: string
  company_size?: number
  annual_revenue?: number
  payment_terms?: string
  credit_limit?: number
  social_media_links?: Record<string, string>
  logo_url?: string
  notes?: string
}

// Dane zastępcze na wypadek błędu API
const fallbackCustomerData = {
  id: "c1",
  name: "Adam Bielecki",
  tax_id: "1234567890",
  email: "adam.bielecki@example.com",
  phone: "+48 123 456 789",
  address: "ul. Warszawska 10, 00-001 Warszawa",
  city: "Warszawa",
  postal_code: "00-001",
  type: "Biznesowy",
  industry: "Nieruchomości",
  website: "www.bielecki-investments.pl",
  created_at: "2023-01-15T09:30:00Z",
  updated_at: "2023-10-11T10:00:00Z", // Added required field
  customer_since: "2023-01-15T00:00:00Z",
  status: "Aktywny",
  referral_source: "Polecenie",
  company_size: 50,
  annual_revenue: 5000000,
  payment_terms: "30 dni",
  credit_limit: 100000,
  social_media_links: {
    linkedin: "https://www.linkedin.com/company/bielecki-investments",
    facebook: "https://www.facebook.com/bieleckiinvestments",
    twitter: "https://twitter.com/bieleckiinvest"
  },
  logo_url: "/placeholder-logo.png",
  notes: "Klient preferuje kontakt mailowy. Zainteresowany rozbudową systemu klimatyzacji w biurze.",
  // Add derived and related properties with default values
  sites: [],
  service_orders: [],
  invoices: [],
  total_service_orders: 0,
  total_invoices: 0,
  total_spent: 0,
  payment_status: "Nieznany", // Default payment status
}

async function getCustomer(id: string): Promise<EnhancedCustomerProfile | null> {
  try {
    // Użyj klienta serwerowego do pobierania danych
    const supabase = await createServerClient()

    if (!supabase) {
      console.error("Failed to create Supabase client")
      return null
    }

    console.log(`Fetching customer data for ID: ${id}`)

    // Wykonaj zapytanie do bazy danych tylko z istniejącymi relacjami
    const { data, error } = await supabase
      .from('customers')
      .select(`
        *,
        sites(*)
      `)
      .eq('id', id)
      .single()

    // Refined check for error or null data
    if (error || !data) {
      console.error(`Error fetching customer with id ${id}:`, error || 'Customer not found')
      return null
    }

    // Pobierz dodatkowe dane, jeśli są dostępne
    let serviceOrders: ServiceOrder[] = []
    let invoices: Invoice[] = []

    // Próba pobrania zleceń serwisowych
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('service_orders')
        .select('id, status, scheduled_start, service_type')
        .eq('customer_id', id)

      if (ordersError) throw ordersError;
      if (ordersData) {
        // Map to ServiceOrder type with additional fields
        serviceOrders = ordersData.map(order => ({
          id: order.id,
          status: order.status,
          scheduled_date: order.scheduled_start || undefined,
          scheduled_start: order.scheduled_start,
          service_type: order.service_type,
          title: `Zlecenie ${order.service_type || 'serwisowe'}`,
          priority: 'Normal'
        }));
      }
    } catch (e) {
      console.log('Tabela service_orders nie istnieje lub wystąpił błąd:', e)
    }

    // Faktur nie ma w bazie danych, więc używamy pustej tablicy
    // W przyszłości można dodać tabelę faktur

    // Create the enhanced customer object
    const enhancedCustomer: EnhancedCustomerProfile = {
      // Spread all properties from the fetched customer data
      ...data,
      // Ensure related data arrays are not null
      sites: data.sites || [],
      // Add calculated fields
      service_orders: serviceOrders,
      invoices: invoices,
      total_service_orders: serviceOrders.length,
      total_invoices: invoices.length,
      total_spent: invoices.reduce((acc, invoice) => acc + (invoice.total_amount || 0), 0),
      payment_status: 'Terminowy',

      // Add fallback fields that might not be in the database
      tax_id: data.nip || '',
      status: 'Aktywny',
      type: 'Biznesowy',
      notes: '',
      customer_since: data.created_at || new Date().toISOString()
    }

    console.log(`Fetched customer data: ${enhancedCustomer.name}`)
    return enhancedCustomer
  } catch (error) {
    console.error(`Error fetching customer with id ${id}:`, error)
    return null
  }
}

export default async function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const customerId = params.id

  // Pobierz dane klienta z API
  // Use the new EnhancedCustomerProfile type
  const customer: EnhancedCustomerProfile | typeof fallbackCustomerData = await getCustomer(customerId) || fallbackCustomerData

  // If getCustomer returned null, fallbackCustomerData is used.
  // The check for !customer is likely redundant now unless fallback could also be null/undefined.
  // Assuming fallbackCustomerData is always defined, this block might not be reachable.
  // if (!customer) { ... } // Consider removing or adjusting this block

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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/customers">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Powrót</span>
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <User className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight">{customer.name}</h2>
            </div>
            <Badge variant={customer.status === "Aktywny" ? "default" : "secondary"}>{customer.status}</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href={`mailto:${customer.email}`}> {/* Email is string, no cast needed */}
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`tel:${customer.phone ? customer.phone.replace(/\s/g, "") : ""}`}>
                <Phone className="mr-2 h-4 w-4" />
                Telefon
              </Link>
            </Button>
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Zaplanuj wizytę
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urządzenia</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* <div className="text-2xl font-bold">{customer.total_devices}</div> */}
              {/* Removed total_devices as it's not available in EnhancedCustomerProfile */}
              <div className="text-2xl font-bold">N/A</div>
              <p className="text-xs text-muted-foreground">Zainstalowane urządzenia HVAC</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Zlecenia serwisowe</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customer.total_service_orders}</div>
              <p className="text-xs text-muted-foreground">Łączna liczba zleceń</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faktury</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customer.total_invoices}</div>
              <p className="text-xs text-muted-foreground">Status płatności: {customer.payment_status}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wartość klienta</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customer.total_spent.toLocaleString()} zł</div>
              <p className="text-xs text-muted-foreground">Łączna wartość zamówień</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informacje o kliencie</CardTitle>
              <CardDescription>Podstawowe dane kontaktowe i informacje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Dane kontaktowe</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                        <span>{customer.address}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Dane firmowe</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{customer.name}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>NIP: {customer.tax_id}</span>
                      </div>
                      {customer.website && (
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                          <a href={customer.website.startsWith('http') ? customer.website : `https://${customer.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {customer.website}
                          </a>
                        </div>
                      )}
                      {customer.industry && (
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Branża: {customer.industry}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Informacje finansowe</h3>
                    <div className="mt-2 space-y-2">
                      {customer.company_size && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Wielkość firmy:</span>
                          <span>{customer.company_size} pracowników</span>
                        </div>
                      )}
                      {customer.annual_revenue && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Roczny przychód:</span>
                          <span>{customer.annual_revenue.toLocaleString()} zł</span>
                        </div>
                      )}
                      {customer.payment_terms && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Warunki płatności:</span>
                          <span>{customer.payment_terms}</span>
                        </div>
                      )}
                      {customer.credit_limit && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Limit kredytowy:</span>
                          <span>{customer.credit_limit.toLocaleString()} zł</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Informacje dodatkowe</h3>
                    <div className="mt-2 space-y-2">
                      {customer.referral_source && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Źródło pozyskania:</span>
                          <span>{customer.referral_source}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Klient od:</span>
                        <span>{new Date(customer.customer_since || customer.created_at || Date.now()).toLocaleDateString("pl-PL")}</span>
                      </div>
                      {customer.social_media_links && Object.keys(customer.social_media_links).length > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Media społecznościowe:</span>
                          <div className="flex space-x-2">
                            {Object.entries(customer.social_media_links).map(([platform, url]) => (
                              <a
                                key={platform}
                                href={typeof url === 'string' ? url : ''}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80"
                                title={`${platform.charAt(0).toUpperCase() + platform.slice(1)}`}
                                aria-label={`Profil ${platform} klienta`}
                              >
                                <Share2 className="h-4 w-4" />
                                <span className="sr-only">{platform}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notatki</CardTitle>
              <CardDescription>Ostatnie notatki i uwagi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">{customer.notes}</p>
                <Separator />
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Dodaj notatkę
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="devices" className="space-y-4">
          <TabsList className="grid grid-cols-11 md:w-auto w-full">
            <TabsTrigger value="devices">Urządzenia</TabsTrigger>
            <TabsTrigger value="sites">Lokalizacje</TabsTrigger>
            <TabsTrigger value="service">Historia serwisowa</TabsTrigger>
            <TabsTrigger value="communication">Komunikacja</TabsTrigger>
            <TabsTrigger value="transcriptions">Transkrypcje</TabsTrigger>
            <TabsTrigger value="audio">Nagrania</TabsTrigger>
            <TabsTrigger value="invoices">Faktury</TabsTrigger>
            <TabsTrigger value="analytics">Analityka</TabsTrigger>
            <TabsTrigger value="notes">Notatki</TabsTrigger>
            <TabsTrigger value="files">Pliki</TabsTrigger>
            <TabsTrigger value="edit">Edytuj</TabsTrigger>
          </TabsList>

          <TabsContent value="devices" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Urządzenia klienta</h3>
              <Button>
                <Package className="mr-2 h-4 w-4" />
                Dodaj urządzenie
              </Button>
            </div>
            <CustomerDevices customerId={customer.id} />
          </TabsContent>

          <TabsContent value="sites" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Lokalizacje klienta</h3>
              <Button>
                <MapPin className="mr-2 h-4 w-4" />
                Dodaj lokalizację
              </Button>
            </div>
            {/* Pass customer.sites if available and correctly typed */}
            <CustomerSites customerId={customer.id} />
          </TabsContent>

          <TabsContent value="service" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Historia serwisowa</h3>
              <Button>
                <Calendar className="mr-2 h-4 w-4" />
                Zaplanuj wizytę
              </Button>
            </div>
            <CustomerServiceHistory customerId={customer.id} />
          </TabsContent>

          <TabsContent value="communication" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Historia komunikacji</h3>
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                Nowa wiadomość
              </Button>
            </div>
            <CustomerCommunication customerId={customer.id} />
          </TabsContent>

          <TabsContent value="transcriptions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Transkrypcje rozmów</h3>
              <Button>
                <Mic className="mr-2 h-4 w-4" />
                Dodaj transkrypcję
              </Button>
            </div>
            <CustomerTranscriptions customerId={customer.id} />
          </TabsContent>

          <TabsContent value="audio" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Nagrania rozmów</h3>
              <Button>
                <FileAudio className="mr-2 h-4 w-4" />
                Dodaj nagranie
              </Button>
            </div>
            <CustomerAudioManager customerId={customer.id} />
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Faktury i płatności</h3>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Wystaw fakturę
              </Button>
            </div>
            <CustomerInvoices customerId={customer.id} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Analityka klienta</h3>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Eksportuj raport
              </Button>
            </div>
            <CustomerAnalytics customerId={customer.id} />
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Notatki</h3>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Dodaj notatkę
              </Button>
            </div>
            <CustomerNotes customerId={customer.id} />
          </TabsContent>

          <TabsContent value="files" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Pliki</h3>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Dodaj plik
              </Button>
            </div>
            <CustomerFiles customerId={customer.id} />
          </TabsContent>

          <TabsContent value="edit">
            {/* Ensure initialData matches the expected type for EditCustomerForm */}
            <EditCustomerForm initialData={{
              id: customer.id,
              name: customer.name || "",
              tax_id: customer.tax_id ?? undefined, // Handle null for tax_id
              email: customer.email || "",
              phone: customer.phone || "",
              type: (customer.type as "Biznesowy" | "Indywidualny") || "Biznesowy", // Explicitly cast type
            }} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
