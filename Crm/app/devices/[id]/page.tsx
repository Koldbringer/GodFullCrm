import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, FileText, History, PenToolIcon as Tool, Wrench } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { DeviceStatusBadge } from "@/components/devices/device-status-badge"
import { Separator } from "@/components/ui/separator"
import { ServiceHistoryTable } from "@/components/devices/service-history-table"

export const metadata: Metadata = {
  title: "Szczegóły urządzenia - HVAC CRM ERP",
  description: "Szczegółowe informacje o urządzeniu HVAC",
}

export default function DeviceDetailsPage({ params }: { params: { id: string } }) {
  // W rzeczywistej aplikacji, dane byłyby pobierane z bazy danych na podstawie ID
  const deviceId = params.id

  // Przykładowe dane urządzenia
  const device = {
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
    specifications: {
      cooling_capacity: "2.5 kW",
      heating_capacity: "3.2 kW",
      energy_class: "A+++",
      refrigerant: "R32",
      indoor_unit_dimensions: "798 x 299 x 219 mm",
      outdoor_unit_dimensions: "800 x 550 x 285 mm",
      weight_indoor: "10.5 kg",
      weight_outdoor: "31 kg",
      noise_level_indoor: "19-42 dB(A)",
      noise_level_outdoor: "50 dB(A)",
    },
    notes:
      "Urządzenie zainstalowane w głównej sali konferencyjnej. Klient zgłaszał problem z pilotem, wymieniono baterie podczas ostatniego serwisu.",
  }

  // Przykładowa historia serwisowa
  const serviceHistory = [
    {
      id: "SH001",
      date: "2023-09-15T14:00:00Z",
      type: "Przegląd okresowy",
      technician: "Piotr Nowak",
      description:
        "Wymiana filtrów, czyszczenie jednostki wewnętrznej i zewnętrznej, sprawdzenie ciśnienia czynnika chłodniczego.",
      parts_used: ["Filtr powietrza", "Środek czyszczący"],
    },
    {
      id: "SH002",
      date: "2023-07-20T10:30:00Z",
      type: "Naprawa",
      technician: "Marek Kowalski",
      description: "Naprawa pilota zdalnego sterowania, wymiana baterii.",
      parts_used: ["Baterie AAA (2 szt.)"],
    },
    {
      id: "SH003",
      date: "2023-06-05T11:15:00Z",
      type: "Instalacja",
      technician: "Anna Wiśniewska",
      description: "Montaż i konfiguracja urządzenia. Instruktaż dla klienta.",
      parts_used: ["Wsporniki montażowe", "Rury miedziane", "Izolacja"],
    },
  ]

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
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/devices">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Powrót</span>
              </Link>
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">{device.model}</h2>
            <DeviceStatusBadge status={device.status} />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Tool className="mr-2 h-4 w-4" />
              Zaplanuj serwis
            </Button>
            <Button>
              <Wrench className="mr-2 h-4 w-4" />
              Edytuj urządzenie
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Informacje podstawowe</CardTitle>
              <CardDescription>Podstawowe dane urządzenia</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="font-medium">ID:</dt>
                  <dd>{device.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Typ:</dt>
                  <dd>{device.type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Model:</dt>
                  <dd>{device.model}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Numer seryjny:</dt>
                  <dd>{device.serial_number}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Status:</dt>
                  <dd>
                    <DeviceStatusBadge status={device.status} />
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lokalizacja</CardTitle>
              <CardDescription>Dane klienta i lokalizacji</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="font-medium">Klient:</dt>
                  <dd>{device.customer_name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Lokalizacja:</dt>
                  <dd>{device.site_name.split(" - ")[0]}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Data instalacji:</dt>
                  <dd>{new Date(device.installation_date).toLocaleDateString("pl-PL")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Ostatni serwis:</dt>
                  <dd>{new Date(device.last_service_date).toLocaleDateString("pl-PL")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Koniec gwarancji:</dt>
                  <dd>{new Date(device.warranty_end_date).toLocaleDateString("pl-PL")}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Najbliższe działania</CardTitle>
              <CardDescription>Zaplanowane czynności</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    Przegląd okresowy:{" "}
                    {new Date(new Date().setMonth(new Date().getMonth() + 3)).toLocaleDateString("pl-PL")}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    Wymiana filtrów:{" "}
                    {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString("pl-PL")}
                  </span>
                </div>
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Koniec gwarancji: {new Date(device.warranty_end_date).toLocaleDateString("pl-PL")}</span>
                </div>

                <Separator className="my-4" />

                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Zaplanuj nowe zadanie
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="specifications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="specifications">Specyfikacja techniczna</TabsTrigger>
            <TabsTrigger value="service-history">Historia serwisowa</TabsTrigger>
            <TabsTrigger value="notes">Notatki</TabsTrigger>
            <TabsTrigger value="documents">Dokumenty</TabsTrigger>
          </TabsList>

          <TabsContent value="specifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Specyfikacja techniczna</CardTitle>
                <CardDescription>Szczegółowe parametry urządzenia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Parametry wydajnościowe</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt>Moc chłodnicza:</dt>
                        <dd>{device.specifications.cooling_capacity}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Moc grzewcza:</dt>
                        <dd>{device.specifications.heating_capacity}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Klasa energetyczna:</dt>
                        <dd>{device.specifications.energy_class}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Czynnik chłodniczy:</dt>
                        <dd>{device.specifications.refrigerant}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Wymiary i waga</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt>Wymiary jedn. wewnętrznej:</dt>
                        <dd>{device.specifications.indoor_unit_dimensions}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Wymiary jedn. zewnętrznej:</dt>
                        <dd>{device.specifications.outdoor_unit_dimensions}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Waga jedn. wewnętrznej:</dt>
                        <dd>{device.specifications.weight_indoor}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Waga jedn. zewnętrznej:</dt>
                        <dd>{device.specifications.weight_outdoor}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Parametry akustyczne</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt>Poziom hałasu jedn. wewnętrznej:</dt>
                        <dd>{device.specifications.noise_level_indoor}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Poziom hałasu jedn. zewnętrznej:</dt>
                        <dd>{device.specifications.noise_level_outdoor}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="service-history">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Historia serwisowa</CardTitle>
                  <CardDescription>Historia przeglądów i napraw urządzenia</CardDescription>
                </div>
                <Button>
                  <History className="mr-2 h-4 w-4" />
                  Dodaj wpis serwisowy
                </Button>
              </CardHeader>
              <CardContent>
                <ServiceHistoryTable serviceHistory={serviceHistory} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Notatki</CardTitle>
                <CardDescription>Dodatkowe informacje o urządzeniu</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{device.notes}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Dokumenty</CardTitle>
                <CardDescription>Dokumentacja urządzenia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Instrukcja obsługi.pdf</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Pobierz
                    </Button>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Karta gwarancyjna.pdf</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Pobierz
                    </Button>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Protokół instalacji.pdf</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Pobierz
                    </Button>
                  </div>
                  <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Raport z ostatniego serwisu.pdf</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Pobierz
                    </Button>
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
