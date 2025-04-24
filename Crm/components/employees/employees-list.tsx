"use client"

import { useState } from "react"
import {
  Car,
  CheckCircle2,
  Clock,
  Filter,
  MapPin,
  MoreHorizontal,
  Phone,
  Star,
  PenToolIcon as Tool,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

// Przykładowe dane pracowników
const employeesData = [
  {
    id: "EMP001",
    name: "Piotr Nowak",
    avatar: "/placeholder-user.jpg",
    position: "Technik HVAC",
    email: "piotr.nowak@example.com",
    phone: "+48 123 456 789",
    status: "available",
    location: "Warszawa",
    skills: ["Klimatyzacja", "Wentylacja", "Pompy ciepła"],
    certifications: ["F-gazy", "Pompy ciepła Daikin", "Elektryczne SEP"],
    rating: 4.8,
    completedOrders: 156,
    currentAssignment: "SH004",
    vehicle: "WA12345",
    employmentDate: "2020-03-15T00:00:00Z",
    availability: {
      today: true,
      tomorrow: true,
      thisWeek: 5, // dni dostępności w tym tygodniu
    },
    performance: {
      ordersPerDay: 2.3,
      avgCompletionTime: 115, // w minutach
      customerSatisfaction: 4.7,
    },
  },
  {
    id: "EMP002",
    name: "Anna Wiśniewska",
    avatar: "/placeholder-user.jpg",
    position: "Technik HVAC",
    email: "anna.wisniewska@example.com",
    phone: "+48 234 567 890",
    status: "busy",
    location: "Kraków",
    skills: ["Klimatyzacja", "Rekuperacja", "Chłodnictwo"],
    certifications: ["F-gazy", "Mitsubishi Electric", "Elektryczne SEP"],
    rating: 4.9,
    completedOrders: 203,
    currentAssignment: "SH006",
    vehicle: "KR54321",
    employmentDate: "2019-06-10T00:00:00Z",
    availability: {
      today: false,
      tomorrow: true,
      thisWeek: 4, // dni dostępności w tym tygodniu
    },
    performance: {
      ordersPerDay: 2.5,
      avgCompletionTime: 105, // w minutach
      customerSatisfaction: 4.9,
    },
  },
  {
    id: "EMP003",
    name: "Marek Kowalski",
    avatar: "/placeholder-user.jpg",
    position: "Technik HVAC",
    email: "marek.kowalski@example.com",
    phone: "+48 345 678 901",
    status: "unavailable",
    location: "Wrocław",
    skills: ["Klimatyzacja", "Ogrzewanie", "Pompy ciepła"],
    certifications: ["F-gazy", "Pompy ciepła Vaillant", "Elektryczne SEP"],
    rating: 4.6,
    completedOrders: 134,
    currentAssignment: null,
    vehicle: "WR98765",
    employmentDate: "2021-01-20T00:00:00Z",
    availability: {
      today: false,
      tomorrow: false,
      thisWeek: 0, // dni dostępności w tym tygodniu (urlop)
    },
    performance: {
      ordersPerDay: 2.1,
      avgCompletionTime: 125, // w minutach
      customerSatisfaction: 4.5,
    },
  },
  {
    id: "EMP004",
    name: "Tomasz Zieliński",
    avatar: "/placeholder-user.jpg",
    position: "Technik HVAC",
    email: "tomasz.zielinski@example.com",
    phone: "+48 456 789 012",
    status: "available",
    location: "Poznań",
    skills: ["Klimatyzacja", "Wentylacja", "Automatyka"],
    certifications: ["F-gazy", "Toshiba", "Elektryczne SEP"],
    rating: 4.7,
    completedOrders: 178,
    currentAssignment: null,
    vehicle: "PO45678",
    employmentDate: "2020-08-05T00:00:00Z",
    availability: {
      today: true,
      tomorrow: true,
      thisWeek: 5, // dni dostępności w tym tygodniu
    },
    performance: {
      ordersPerDay: 2.4,
      avgCompletionTime: 110, // w minutach
      customerSatisfaction: 4.6,
    },
  },
  {
    id: "EMP005",
    name: "Karolina Dąbrowska",
    avatar: "/placeholder-user.jpg",
    position: "Technik HVAC",
    email: "karolina.dabrowska@example.com",
    phone: "+48 567 890 123",
    status: "available",
    location: "Gdańsk",
    skills: ["Klimatyzacja", "Rekuperacja", "Pompy ciepła"],
    certifications: ["F-gazy", "LG", "Elektryczne SEP"],
    rating: 4.9,
    completedOrders: 192,
    currentAssignment: null,
    vehicle: "GD13579",
    employmentDate: "2019-11-12T00:00:00Z",
    availability: {
      today: true,
      tomorrow: true,
      thisWeek: 5, // dni dostępności w tym tygodniu
    },
    performance: {
      ordersPerDay: 2.6,
      avgCompletionTime: 100, // w minutach
      customerSatisfaction: 4.8,
    },
  },
]

export function EmployeesList() {
  const [view, setView] = useState<"table" | "cards">("table")
  const [searchQuery, setSearchQuery] = useState("")

  // Filtrowanie pracowników na podstawie wyszukiwania
  const filteredEmployees = employeesData.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Funkcja do określania koloru statusu
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-300"
      case "busy":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "unavailable":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  // Funkcja do określania tekstu statusu
  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Dostępny"
      case "busy":
        return "Zajęty"
      case "unavailable":
        return "Niedostępny"
      default:
        return status
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Szukaj pracownika..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant={view === "table" ? "default" : "outline"} size="sm" onClick={() => setView("table")}>
            Tabela
          </Button>
          <Button variant={view === "cards" ? "default" : "outline"} size="sm" onClick={() => setView("cards")}>
            Karty
          </Button>
        </div>
      </div>

      {view === "table" ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pracownik</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Lokalizacja</TableHead>
                <TableHead>Umiejętności</TableHead>
                <TableHead>Ocena</TableHead>
                <TableHead>Dostępność</TableHead>
                <TableHead>Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Nie znaleziono pracowników.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                          <AvatarFallback>
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">{employee.position}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(employee.status)} variant="outline">
                        {employee.status === "busy" && <Clock className="mr-1 h-3 w-3" />}
                        {employee.status === "available" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                        {employee.status === "unavailable" && <XCircle className="mr-1 h-3 w-3" />}
                        {getStatusText(employee.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                        {employee.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {employee.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 text-yellow-500" />
                        <span>{employee.rating}</span>
                        <span className="ml-2 text-xs text-muted-foreground">({employee.completedOrders} zleceń)</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <span className="w-16">Dziś:</span>
                          {employee.availability.today ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="w-16">Jutro:</span>
                          {employee.availability.tomorrow ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="w-16">Tydzień:</span>
                          <span>{employee.availability.thisWeek}/5 dni</span>
                        </div>
                      </div>
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
                          <DropdownMenuItem>Profil pracownika</DropdownMenuItem>
                          <DropdownMenuItem>Harmonogram pracy</DropdownMenuItem>
                          <DropdownMenuItem>Przydziel zlecenie</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Edytuj dane</DropdownMenuItem>
                          <DropdownMenuItem>Zarządzaj uprawnieniami</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Nie znaleziono pracowników.</p>
              </CardContent>
            </Card>
          ) : (
            filteredEmployees.map((employee) => (
              <Card key={employee.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <Badge className={getStatusColor(employee.status)} variant="outline">
                      {getStatusText(employee.status)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Otwórz menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                        <DropdownMenuItem>Profil pracownika</DropdownMenuItem>
                        <DropdownMenuItem>Harmonogram pracy</DropdownMenuItem>
                        <DropdownMenuItem>Przydziel zlecenie</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edytuj dane</DropdownMenuItem>
                        <DropdownMenuItem>Zarządzaj uprawnieniami</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                      <AvatarFallback className="text-lg">
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground">{employee.position}</p>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{employee.rating}</span>
                        <span className="mx-1">•</span>
                        <span className="text-sm">{employee.completedOrders} zleceń</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>{employee.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>{employee.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Car className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Pojazd: {employee.vehicle}</span>
                    </div>
                    <div className="flex items-start">
                      <Tool className="h-4 w-4 text-muted-foreground mr-2 mt-1" />
                      <div className="flex flex-wrap gap-1">
                        {employee.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Dostępność w tym tygodniu</h4>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">{employee.availability.thisWeek}/5 dni</span>
                      <span className="text-sm">
                        {employee.availability.today ? "Dostępny dziś" : "Niedostępny dziś"}
                      </span>
                    </div>
                    <Progress value={(employee.availability.thisWeek / 5) * 100} className="h-2" />
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Wydajność</h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-medium">{employee.performance.ordersPerDay}</div>
                        <div className="text-xs text-muted-foreground">Zlecenia/dzień</div>
                      </div>
                      <div>
                        <div className="text-lg font-medium">{employee.performance.avgCompletionTime} min</div>
                        <div className="text-xs text-muted-foreground">Średni czas</div>
                      </div>
                      <div>
                        <div className="text-lg font-medium">{employee.performance.customerSatisfaction}</div>
                        <div className="text-xs text-muted-foreground">Satysfakcja</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
