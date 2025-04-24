import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  BarChart3,
  Building2,
  Calendar,
  Clock,
  FileText,
  Globe,
  Mail,
  MapPin,
  Package,
  Phone,
  User,
  Briefcase,
  DollarSign,
  Calendar as CalendarIcon,
  Share2,
} from "lucide-react"

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
import { NotificationCenter } from "@/components/notifications/notification-center"
import { getCustomerById } from "@/lib/api"
import { EditCustomerForm } from "@/components/customers/edit-customer-form"

export const metadata: Metadata = {
  title: "Profil klienta - HVAC CRM ERP",
  description: "Szczegółowe informacje o kliencie w systemie HVAC CRM ERP",
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
  company_name: "Bielecki Investments Sp. z o.o.",
  type: "Biznesowy",
  industry: "Nieruchomości",
  website: "www.bielecki-investments.pl",
  wealth_assessment: "Wysoka",
  created_at: "2023-01-15T09:30:00Z",
  customer_since: "2023-01-15T00:00:00Z",
  last_contact: "2023-10-10T14:30:00Z",
  status: "Aktywny",
  account_manager: "Jan Kowalski",
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
  total_devices: 3,
  total_service_orders: 8,
  total_invoices: 12,
  total_spent: 45600,
  payment_status: "Terminowy",
  notes: "Klient preferuje kontakt mailowy. Zainteresowany rozbudową systemu klimatyzacji w biurze.",
}

async function getCustomer(id: string) {
  try {
    const customer = await getCustomerById(id, true)
    return customer
  } catch (error) {
    console.error(`Error fetching customer with id ${id}:`, error)
    return null
  }
}

export default async function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const customerId = params.id

  // Pobierz dane klienta z API
  const customer = await getCustomer(customerId) || fallbackCustomerData

  // Jeśli nie znaleziono klienta, wyświetl komunikat
  if (!customer) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" asChild>
                <Link href="/customers">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Powrót</span>
                </Link>
              </Button>
              <h2 className="text-3xl font-bold tracking-tight">Klient nie znaleziony</h2>
            </div>
            <p>Nie znaleziono klienta o podanym identyfikatorze.</p>
          </div>
        </div>
      </div>
    )
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
              <Link href={`mailto:${customer.email as string}`}>
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`tel:${(customer.phone as string).replace(/\s/g, "")}`}>
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
              <div className="text-2xl font-bold">{customer.total_devices}</div>
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
                        <span>{customer.company_name}</span>
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
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Ocena zamożności:</span>
                        <Badge variant="outline">{customer.wealth_assessment}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Informacje dodatkowe</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Opiekun klienta:</span>
                        <span>{customer.account_manager}</span>
                      </div>
                      {customer.referral_source && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Źródło pozyskania:</span>
                          <span>{customer.referral_source}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Klient od:</span>
                        <span>{new Date(customer.customer_since || customer.created_at).toLocaleDateString("pl-PL")}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Ostatni kontakt:</span>
                        <span>{new Date(customer.last_contact).toLocaleDateString("pl-PL")}</span>
                      </div>
                      {customer.social_media_links && Object.keys(customer.social_media_links).length > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Media społecznościowe:</span>
                          <div className="flex space-x-2">
                            {Object.entries(customer.social_media_links).map(([platform, url]) => (
                              <a key={platform} href={typeof url === 'string' ? url : ''} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                                <Share2 className="h-4 w-4" />
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
          <TabsList className="grid grid-cols-8 md:w-auto w-full">
            <TabsTrigger value="devices">Urządzenia</TabsTrigger>
            <TabsTrigger value="sites">Lokalizacje</TabsTrigger>
            <TabsTrigger value="service">Historia serwisowa</TabsTrigger>
            <TabsTrigger value="communication">Komunikacja</TabsTrigger>
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
              <h3 className="text-lg font-medium">Pliki i dokumenty</h3>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Dodaj plik
              </Button>
            </div>
            <CustomerFiles customerId={customer.id} />
          </TabsContent>

          <TabsContent value="edit">
            <EditCustomerForm initialData={customer as any} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
