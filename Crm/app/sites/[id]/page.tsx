import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowDownToLine, Building2, CalendarClock, CalendarDays, Clock, FileText, Home, MapPin, Package, Store, User } from "lucide-react"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SiteDevices } from "@/components/sites/site-devices"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { getSiteById } from "@/lib/api"

export const metadata: Metadata = {
  title: "Szczegóły lokalizacji - HVAC CRM ERP",
  description: "Szczegółowe informacje o lokalizacji klienta",
}

async function getSite(id: string) {
  const site = await getSiteById(id)
  if (!site) {
    notFound()
  }
  return site
}

export default async function SiteDetailsPage({ params }: { params: { id: string } }) {
  const siteId = params.id
  const site = await getSite(siteId)

  // Ikona dla typu lokalizacji
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Biuro":
        return <Building2 className="h-5 w-5 text-blue-500" />
      case "Dom":
        return <Home className="h-5 w-5 text-green-500" />
      case "Mieszkanie":
        return <Home className="h-5 w-5 text-yellow-500" />
      case "Lokal usługowy":
        return <Store className="h-5 w-5 text-purple-500" />
      default:
        return <MapPin className="h-5 w-5 text-gray-500" />
    }
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
              <Link href="/sites">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Powrót</span>
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              {getTypeIcon(site.type)}
              <h2 className="text-3xl font-bold tracking-tight">{site.name}</h2>
            </div>
            <Badge variant="outline">{site.type}</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <MapPin className="mr-2 h-4 w-4" />
              Edytuj lokalizację
            </Button>
            <Button>
              <CalendarDays className="mr-2 h-4 w-4" />
              Zaplanuj wizytę
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Informacje podstawowe</CardTitle>
              <CardDescription>Podstawowe dane lokalizacji</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="font-medium">ID:</dt>
                  <dd>{site.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Nazwa:</dt>
                  <dd>{site.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Typ:</dt>
                  <dd className="flex items-center gap-1">
                    {getTypeIcon(site.type)}
                    {site.type}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Powierzchnia:</dt>
                  <dd>{site.area} m²</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Liczba urządzeń:</dt>
                  <dd>{site.devices_count}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adres i kontakt</CardTitle>
              <CardDescription>Dane adresowe i kontaktowe</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="font-medium">Adres:</dt>
                  <dd>{site.address}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Klient:</dt>
                  <dd>
                    <Link href={`/customers/${site.customer_id}`} className="flex items-center gap-1 hover:underline">
                      <User className="h-4 w-4" />
                      {site.customer_name}
                    </Link>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Współrzędne:</dt>
                  <dd>
                    {site.coordinates.lat.toFixed(4)}, {site.coordinates.lng.toFixed(4)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wizyty serwisowe</CardTitle>
              <CardDescription>Historia i planowane wizyty</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Ostatnia wizyta:</span>
                  <span className="ml-auto">
                    {site.last_visit ? new Date(site.last_visit).toLocaleDateString("pl-PL") : "Brak wizyt"}
                  </span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Następna wizyta:</span>
                  <span className="ml-auto">
                    {site.next_visit ? new Date(site.next_visit).toLocaleDateString("pl-PL") : "Nie zaplanowano"}
                  </span>
                </div>

                <Separator className="my-4" />

                <Button variant="outline" className="w-full">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Historia wizyt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="devices" className="space-y-4">
          <TabsList>
            <TabsTrigger value="devices">Urządzenia</TabsTrigger>
            <TabsTrigger value="notes">Notatki</TabsTrigger>
            <TabsTrigger value="documents">Dokumenty</TabsTrigger>
            <TabsTrigger value="map">Mapa</TabsTrigger>
            <TabsTrigger value="reports">Raporty</TabsTrigger>
            <TabsTrigger value="analytics">Analityka</TabsTrigger>
          </TabsList>

          <TabsContent value="devices" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Urządzenia w lokalizacji</h3>
              <Button>
                <Package className="mr-2 h-4 w-4" />
                Dodaj urządzenie
              </Button>
            </div>
            <SiteDevices siteId={site.id} />
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Notatki</CardTitle>
                <CardDescription>Dodatkowe informacje o lokalizacji</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Brak notatek dla tej lokalizacji.</p>
                <Button className="mt-4">Dodaj notatkę</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Dokumenty</CardTitle>
                <CardDescription>Dokumentacja związana z lokalizacją</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Brak dokumentów dla tej lokalizacji.</p>
                <Button className="mt-4">Dodaj dokument</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle>Mapa</CardTitle>
                <CardDescription>Lokalizacja na mapie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[400px] rounded-md border bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">Mapa zostanie wyświetlona tutaj.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Raporty</CardTitle>
                <CardDescription>Generuj i przeglądaj raporty dla tej lokalizacji</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">Raport stanu urządzeń</h3>
                      <p className="text-sm text-muted-foreground">Szczegółowy raport o stanie wszystkich urządzeń w lokalizacji</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Podgląd
                      </Button>
                      <Button size="sm">
                        <ArrowDownToLine className="mr-2 h-4 w-4" />
                        Pobierz PDF
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">Historia serwisowa</h3>
                      <p className="text-sm text-muted-foreground">Raport wszystkich wizyt serwisowych w tej lokalizacji</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Podgląd
                      </Button>
                      <Button size="sm">
                        <ArrowDownToLine className="mr-2 h-4 w-4" />
                        Pobierz PDF
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-4">
                    <div>
                      <h3 className="font-medium">Raport efektywności energetycznej</h3>
                      <p className="text-sm text-muted-foreground">Analiza zużycia energii i rekomendacje optymalizacji</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Podgląd
                      </Button>
                      <Button size="sm">
                        <ArrowDownToLine className="mr-2 h-4 w-4" />
                        Pobierz PDF
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Zaplanuj automatyczne raporty</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="report-type">Typ raportu</Label>
                        <Select>
                          <SelectTrigger id="report-type">
                            <SelectValue placeholder="Wybierz typ raportu" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="devices">Stan urządzeń</SelectItem>
                            <SelectItem value="service">Historia serwisowa</SelectItem>
                            <SelectItem value="energy">Efektywność energetyczna</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="frequency">Częstotliwość</Label>
                        <Select>
                          <SelectTrigger id="frequency">
                            <SelectValue placeholder="Wybierz częstotliwość" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Co tydzień</SelectItem>
                            <SelectItem value="monthly">Co miesiąc</SelectItem>
                            <SelectItem value="quarterly">Co kwartał</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Adres email</Label>
                        <Input id="email" placeholder="Adres email do wysyłki raportu" />
                      </div>
                      <div className="flex items-end">
                        <Button className="w-full">
                          <CalendarClock className="mr-2 h-4 w-4" />
                          Zaplanuj raporty
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analityka lokalizacji</CardTitle>
                <CardDescription>Szczegółowe dane analityczne dla tej lokalizacji</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="font-medium mb-4">Zużycie energii</h3>
                    <div className="h-[300px] w-full bg-muted rounded-md border flex items-center justify-center">
                      <p className="text-muted-foreground">Wykres zużycia energii zostanie wyświetlony tutaj</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Temperatura pomieszczeń</h3>
                    <div className="h-[300px] w-full bg-muted rounded-md border flex items-center justify-center">
                      <p className="text-muted-foreground">Wykres temperatur zostanie wyświetlony tutaj</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Statystyki serwisowe</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Liczba wizyt</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">12</div>
                          <p className="text-xs text-muted-foreground">W ciągu ostatniego roku</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Średni czas naprawy</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">2.5h</div>
                          <p className="text-xs text-muted-foreground">W ciągu ostatniego roku</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Koszty serwisowe</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">4,250 zł</div>
                          <p className="text-xs text-muted-foreground">W ciągu ostatniego roku</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
