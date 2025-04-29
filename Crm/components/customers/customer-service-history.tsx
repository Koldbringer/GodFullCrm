"use client"

import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { Calendar, Clock, FileText, MoreHorizontal, Package, User, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Przykładowe dane historii serwisowej
const serviceHistoryData = [
  {
    id: "SH001",
    customer_id: "c1",
    device_id: "DEV001",
    device_model: "Mitsubishi Electric MSZ-AP25VG",
    site_name: "Biuro główne",
    type: "Przegląd okresowy",
    status: "Zakończone",
    technician: "Piotr Nowak",
    date: "2023-09-15T14:00:00Z",
    duration: 120, // w minutach
    description:
      "Wymiana filtrów, czyszczenie jednostki wewnętrznej i zewnętrznej, sprawdzenie ciśnienia czynnika chłodniczego.",
    parts_used: ["Filtr powietrza", "Środek czyszczący"],
    cost: 350,
    invoice_id: "INV123",
    notes: "Klient zadowolony z usługi. Zalecono wymianę filtrów co 3 miesiące.",
  },
  {
    id: "SH002",
    customer_id: "c1",
    device_id: "DEV001",
    device_model: "Mitsubishi Electric MSZ-AP25VG",
    site_name: "Biuro główne",
    type: "Naprawa",
    status: "Zakończone",
    technician: "Marek Kowalski",
    date: "2023-07-20T10:30:00Z",
    duration: 90, // w minutach
    description: "Naprawa pilota zdalnego sterowania, wymiana baterii.",
    parts_used: ["Baterie AAA (2 szt.)"],
    cost: 120,
    invoice_id: "INV098",
    notes: "Pilot działał nieprawidłowo. Wymieniono baterie i zresetowano ustawienia.",
  },
  {
    id: "SH003",
    customer_id: "c1",
    device_id: "DEV002",
    device_model: "Daikin FTXM35N",
    site_name: "Sala konferencyjna",
    type: "Instalacja",
    status: "Zakończone",
    technician: "Anna Wiśniewska",
    date: "2023-06-05T11:15:00Z",
    duration: 240, // w minutach
    description: "Montaż i konfiguracja urządzenia. Instruktaż dla klienta.",
    parts_used: ["Wsporniki montażowe", "Rury miedziane", "Izolacja"],
    cost: 1200,
    invoice_id: "INV087",
    notes: "Instalacja przebiegła bez problemów. Klient przeszkolony z obsługi urządzenia.",
  },
  {
    id: "SH004",
    customer_id: "c1",
    device_id: "DEV003",
    device_model: "Vents VUT 350 EH EC",
    site_name: "Biuro główne",
    type: "Naprawa",
    status: "W trakcie",
    technician: "Piotr Nowak",
    date: "2023-10-12T09:15:00Z",
    duration: 180, // w minutach
    description: "Naprawa wentylatora, wymiana łożysk.",
    parts_used: ["Łożyska (2 szt.)", "Pasek napędowy"],
    cost: 450,
    invoice_id: null,
    notes: "Urządzenie wymaga dodatkowych części. Oczekiwanie na dostawę.",
  },
  {
    id: "SH005",
    customer_id: "c1",
    device_id: "DEV001",
    device_model: "Mitsubishi Electric MSZ-AP25VG",
    site_name: "Biuro główne",
    type: "Przegląd okresowy",
    status: "Zaplanowane",
    technician: "Marek Kowalski",
    date: "2024-03-15T10:00:00Z",
    duration: 120, // w minutach
    description: "Standardowy przegląd okresowy.",
    parts_used: [],
    cost: 350,
    invoice_id: null,
    notes: "Zaplanowany przegląd gwarancyjny.",
  },
  {
    id: "SH006",
    customer_id: "c2",
    device_id: "DEV004",
    device_model: "Daikin Altherma 3 ERGA04DV",
    site_name: "Dom jednorodzinny",
    type: "Przegląd okresowy",
    status: "Zakończone",
    technician: "Anna Wiśniewska",
    date: "2023-10-05T10:30:00Z",
    duration: 150, // w minutach
    description: "Standardowy przegląd okresowy pompy ciepła.",
    parts_used: ["Filtr wody", "Płyn niezamarzający"],
    cost: 450,
    invoice_id: "INV135",
    notes: "System działa prawidłowo. Zalecono kontrolę ciśnienia co miesiąc.",
  },
]

interface CustomerServiceHistoryProps {
  customerId: string
}

export function CustomerServiceHistory({ customerId }: CustomerServiceHistoryProps) {
  // Filtrowanie historii serwisowej dla danego klienta
  const customerServiceHistory = serviceHistoryData.filter((service) => service.customer_id === customerId)

  // Podział na przeszłe i przyszłe wizyty
  const now = new Date()
  const pastVisits = customerServiceHistory.filter((service) => new Date(service.date) < now)
  const futureVisits = customerServiceHistory.filter((service) => new Date(service.date) >= now)

  // Funkcja do określania koloru statusu
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Zakończone":
        return "secondary"
      case "W trakcie":
        return "default"
      case "Zaplanowane":
        return "outline"
      default:
        return "secondary"
    }
  }

  // Funkcja do określania koloru typu wizyty
  const getTypeVariant = (type: string) => {
    switch (type) {
      case "Przegląd okresowy":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "Instalacja":
        return "bg-green-100 text-green-800 border-green-300"
      case "Naprawa":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList>
        <TabsTrigger value="all">Wszystkie wizyty</TabsTrigger>
        <TabsTrigger value="past">Historia wizyt</TabsTrigger>
        <TabsTrigger value="future">Zaplanowane wizyty</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Urządzenie</TableHead>
                <TableHead>Lokalizacja</TableHead>
                <TableHead>Technik</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Koszt</TableHead>
                <TableHead>Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerServiceHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Brak historii serwisowej dla tego klienta.
                  </TableCell>
                </TableRow>
              ) : (
                customerServiceHistory
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{format(new Date(service.date), "d MMMM yyyy", { locale: pl })}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(service.date), "HH:mm", { locale: pl })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeVariant(service.type)} variant="outline">
                          {service.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{service.device_model}</TableCell>
                      <TableCell>{service.site_name}</TableCell>
                      <TableCell>{service.technician}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(service.status)}>{service.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {service.cost ? (
                          <span>{service.cost.toLocaleString()} zł</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Otwórz menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(service.id)}>
                              Kopiuj ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Szczegóły wizyty</DropdownMenuItem>
                            <DropdownMenuItem>Edytuj wizytę</DropdownMenuItem>
                            {service.invoice_id && (
                              <DropdownMenuItem>Pokaż fakturę {service.invoice_id}</DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Dodaj notatkę</DropdownMenuItem>
                            {service.status === "Zaplanowane" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Anuluj wizytę</DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="past" className="space-y-4">
        {pastVisits.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Brak historii wizyt dla tego klienta.</p>
            </CardContent>
          </Card>
        ) : (
          pastVisits
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((service) => (
              <Card key={service.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {format(new Date(service.date), "d MMMM yyyy, HH:mm", { locale: pl })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeVariant(service.type)} variant="outline">
                        {service.type}
                      </Badge>
                      <Badge variant={getStatusVariant(service.status)}>{service.status}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Urządzenie:</span>
                        <span>{service.device_model}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Lokalizacja:</span>
                        <span>{service.site_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Technik:</span>
                        <span>{service.technician}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Czas trwania:</span>
                        <span>{service.duration} min</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-muted-foreground">Opis:</span>
                        <p className="text-sm mt-1">{service.description}</p>
                      </div>
                      {service.parts_used.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">Użyte części:</span>
                          <p className="text-sm mt-1">{service.parts_used.join(", ")}</p>
                        </div>
                      )}
                      {service.notes && (
                        <div>
                          <span className="text-muted-foreground">Notatki:</span>
                          <p className="text-sm mt-1">{service.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div>
                      <span className="text-muted-foreground">Koszt:</span>
                      <span className="ml-2 font-medium">{service.cost.toLocaleString()} zł</span>
                      {service.invoice_id && (
                        <span className="ml-2 text-sm">
                          (Faktura: <span className="font-medium">{service.invoice_id}</span>)
                        </span>
                      )}
                    </div>
                    <Button size="sm" variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Szczegóły wizyty
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </TabsContent>

      <TabsContent value="future" className="space-y-4">
        {futureVisits.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="mb-4 text-muted-foreground">Brak zaplanowanych wizyt dla tego klienta.</p>
              <Button>Zaplanuj wizytę</Button>
            </CardContent>
          </Card>
        ) : (
          futureVisits
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((service) => (
              <Card key={service.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {format(new Date(service.date), "d MMMM yyyy, HH:mm", { locale: pl })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeVariant(service.type)} variant="outline">
                        {service.type}
                      </Badge>
                      <Badge variant={getStatusVariant(service.status)}>{service.status}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Urządzenie:</span>
                        <span>{service.device_model}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Lokalizacja:</span>
                        <span>{service.site_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Technik:</span>
                        <span>{service.technician}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Planowany czas:</span>
                        <span>{service.duration} min</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-muted-foreground">Opis:</span>
                        <p className="text-sm mt-1">{service.description}</p>
                      </div>
                      {service.notes && (
                        <div>
                          <span className="text-muted-foreground">Notatki:</span>
                          <p className="text-sm mt-1">{service.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div>
                      <span className="text-muted-foreground">Szacowany koszt:</span>
                      <span className="ml-2 font-medium">{service.cost.toLocaleString()} zł</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        Zmień termin
                      </Button>
                      <Button size="sm" variant="destructive">
                        Anuluj
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </TabsContent>
    </Tabs>
  )
}
