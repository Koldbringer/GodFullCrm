import type { Metadata } from "next"
import { PlusCircle, Filter, RefreshCw } from "lucide-react"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const metadata: Metadata = {
  title: "Flota - HVAC CRM ERP",
  description: "Zarządzanie flotą pojazdów w systemie HVAC CRM ERP",
}

// Przykładowe dane pojazdów
const vehicles = [
  {
    id: "V001",
    name: "Ford Transit",
    registration: "WA12345",
    type: "Dostawczy",
    status: "Dostępny",
    lastService: "2023-10-15",
    nextService: "2024-04-15",
    mileage: 45678,
    fuelLevel: 85,
    assignedTo: {
      id: "T001",
      name: "Jan Kowalski",
      avatar: null,
    },
    location: "Warszawa, Mazowieckie",
    coordinates: { lat: 52.2297, lng: 21.0122 },
  },
  {
    id: "V002",
    name: "Renault Master",
    registration: "WA54321",
    type: "Dostawczy",
    status: "W trasie",
    lastService: "2023-11-20",
    nextService: "2024-05-20",
    mileage: 32456,
    fuelLevel: 65,
    assignedTo: {
      id: "T002",
      name: "Anna Nowak",
      avatar: null,
    },
    location: "Piaseczno, Mazowieckie",
    coordinates: { lat: 52.0697, lng: 21.0269 },
  },
  {
    id: "V003",
    name: "Fiat Ducato",
    registration: "WA98765",
    type: "Dostawczy",
    status: "Serwis",
    lastService: "2023-12-05",
    nextService: "2024-06-05",
    mileage: 78901,
    fuelLevel: 30,
    assignedTo: null,
    location: "Warszawa, Mazowieckie",
    coordinates: { lat: 52.2297, lng: 21.0122 },
  },
  {
    id: "V004",
    name: "Skoda Octavia",
    registration: "WA67890",
    type: "Osobowy",
    status: "Dostępny",
    lastService: "2024-01-10",
    nextService: "2024-07-10",
    mileage: 23456,
    fuelLevel: 90,
    assignedTo: {
      id: "T003",
      name: "Piotr Wiśniewski",
      avatar: null,
    },
    location: "Legionowo, Mazowieckie",
    coordinates: { lat: 52.4048, lng: 20.9304 },
  },
  {
    id: "V005",
    name: "Volkswagen Caddy",
    registration: "WA24680",
    type: "Dostawczy",
    status: "W trasie",
    lastService: "2024-02-15",
    nextService: "2024-08-15",
    mileage: 56789,
    fuelLevel: 45,
    assignedTo: {
      id: "T004",
      name: "Magdalena Kowalczyk",
      avatar: null,
    },
    location: "Otwock, Mazowieckie",
    coordinates: { lat: 52.1052, lng: 21.2565 },
  },
]

// Komponent do wyświetlania statystyk floty
function FleetStats() {
  const totalVehicles = vehicles.length
  const availableVehicles = vehicles.filter(v => v.status === "Dostępny").length
  const inServiceVehicles = vehicles.filter(v => v.status === "Serwis").length
  const inUseVehicles = vehicles.filter(v => v.status === "W trasie").length
  
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wszystkie pojazdy</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalVehicles}</div>
          <p className="text-xs text-muted-foreground">
            Łączna liczba pojazdów we flocie
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dostępne</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{availableVehicles}</div>
          <p className="text-xs text-muted-foreground">
            Pojazdy gotowe do użycia
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">W trasie</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inUseVehicles}</div>
          <p className="text-xs text-muted-foreground">
            Pojazdy aktualnie w użyciu
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">W serwisie</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inServiceVehicles}</div>
          <p className="text-xs text-muted-foreground">
            Pojazdy w trakcie serwisu
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// Komponent do wyświetlania listy pojazdów
function FleetList() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pojazd</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Przypisany do</TableHead>
            <TableHead>Przebieg</TableHead>
            <TableHead>Poziom paliwa</TableHead>
            <TableHead>Następny serwis</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{vehicle.name}</span>
                  <span className="text-xs text-muted-foreground">{vehicle.registration}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    vehicle.status === "Dostępny"
                      ? "success"
                      : vehicle.status === "W trasie"
                      ? "default"
                      : "destructive"
                  }
                >
                  {vehicle.status}
                </Badge>
              </TableCell>
              <TableCell>
                {vehicle.assignedTo ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={vehicle.assignedTo.avatar || ""} alt={vehicle.assignedTo.name} />
                      <AvatarFallback>{vehicle.assignedTo.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <span>{vehicle.assignedTo.name}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Nieprzypisany</span>
                )}
              </TableCell>
              <TableCell>{vehicle.mileage} km</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={vehicle.fuelLevel} className="h-2 w-20" />
                  <span className="text-xs">{vehicle.fuelLevel}%</span>
                </div>
              </TableCell>
              <TableCell>{vehicle.nextService}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// Komponent do wyświetlania mapy pojazdów
function FleetMap() {
  return (
    <div className="rounded-md border p-4 h-[500px] flex items-center justify-center bg-muted/30">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">Mapa floty</h3>
        <p className="text-muted-foreground mb-4">Wizualizacja lokalizacji pojazdów na mapie</p>
        <p className="text-sm">Komponent mapy zostanie zintegrowany z API map.</p>
      </div>
    </div>
  )
}

// Komponent do wyświetlania harmonogramu serwisów
function FleetMaintenance() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Harmonogram serwisów</h3>
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Odśwież
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pojazd</TableHead>
              <TableHead>Typ serwisu</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Koszt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="flex flex-col">
                  <span>Ford Transit</span>
                  <span className="text-xs text-muted-foreground">WA12345</span>
                </div>
              </TableCell>
              <TableCell>Przegląd okresowy</TableCell>
              <TableCell>15.04.2024</TableCell>
              <TableCell>
                <Badge variant="outline">Zaplanowany</Badge>
              </TableCell>
              <TableCell>-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex flex-col">
                  <span>Fiat Ducato</span>
                  <span className="text-xs text-muted-foreground">WA98765</span>
                </div>
              </TableCell>
              <TableCell>Naprawa układu hamulcowego</TableCell>
              <TableCell>05.03.2024</TableCell>
              <TableCell>
                <Badge variant="default">W trakcie</Badge>
              </TableCell>
              <TableCell>2 500 zł</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex flex-col">
                  <span>Volkswagen Caddy</span>
                  <span className="text-xs text-muted-foreground">WA24680</span>
                </div>
              </TableCell>
              <TableCell>Wymiana oleju</TableCell>
              <TableCell>15.08.2024</TableCell>
              <TableCell>
                <Badge variant="outline">Zaplanowany</Badge>
              </TableCell>
              <TableCell>-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex flex-col">
                  <span>Renault Master</span>
                  <span className="text-xs text-muted-foreground">WA54321</span>
                </div>
              </TableCell>
              <TableCell>Przegląd okresowy</TableCell>
              <TableCell>20.05.2024</TableCell>
              <TableCell>
                <Badge variant="outline">Zaplanowany</Badge>
              </TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default function FleetPage() {
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
          <h2 className="text-3xl font-bold tracking-tight">Flota</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtry
            </Button>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Dodaj pojazd
            </Button>
          </div>
        </div>
        
        <FleetStats />
        
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Lista pojazdów</TabsTrigger>
            <TabsTrigger value="map">Mapa</TabsTrigger>
            <TabsTrigger value="maintenance">Serwis</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="space-y-4">
            <FleetList />
          </TabsContent>
          <TabsContent value="map" className="space-y-4">
            <FleetMap />
          </TabsContent>
          <TabsContent value="maintenance" className="space-y-4">
            <FleetMaintenance />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
