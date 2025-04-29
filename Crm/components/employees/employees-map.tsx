"use client"

import { useState } from "react"
import { MapPin, User } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function EmployeesMap() {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)

  // Przykładowe dane pracowników w terenie
  const fieldEmployees = [
    {
      id: "EMP001",
      name: "Piotr Nowak",
      avatar: "/placeholder-user.jpg",
      position: "Technik HVAC",
      status: "busy",
      location: {
        address: "ul. Marszałkowska 100, Warszawa",
        coordinates: { lat: 52.2297, lng: 21.0122 },
        lastUpdate: "2023-11-15T09:45:00Z",
      },
      currentTask: {
        id: "SH004",
        type: "Naprawa",
        customer: "Adam Bielecki",
        address: "ul. Warszawska 10, Warszawa",
        startTime: "2023-11-15T09:00:00Z",
        estimatedEndTime: "2023-11-15T12:00:00Z",
      },
      nextTask: {
        id: "SH007",
        type: "Przegląd",
        customer: "Firma XYZ",
        address: "ul. Puławska 300, Warszawa",
        startTime: "2023-11-15T13:30:00Z",
        estimatedEndTime: "2023-11-15T15:30:00Z",
      },
    },
    {
      id: "EMP002",
      name: "Anna Wiśniewska",
      avatar: "/placeholder-user.jpg",
      position: "Technik HVAC",
      status: "busy",
      location: {
        address: "ul. Floriańska 25, Kraków",
        coordinates: { lat: 50.0647, lng: 19.945 },
        lastUpdate: "2023-11-15T10:15:00Z",
      },
      currentTask: {
        id: "SH006",
        type: "Przegląd",
        customer: "Celina Dąbrowska",
        address: "ul. Kwiatowa 5, Kraków",
        startTime: "2023-11-15T10:00:00Z",
        estimatedEndTime: "2023-11-15T12:00:00Z",
      },
      nextTask: {
        id: "SH008",
        type: "Instalacja",
        customer: "Jan Kowalski",
        address: "ul. Długa 15, Kraków",
        startTime: "2023-11-15T13:00:00Z",
        estimatedEndTime: "2023-11-15T17:00:00Z",
      },
    },
    {
      id: "EMP004",
      name: "Tomasz Zieliński",
      avatar: "/placeholder-user.jpg",
      position: "Technik HVAC",
      status: "available",
      location: {
        address: "ul. Głogowska 100, Poznań",
        coordinates: { lat: 52.4064, lng: 16.9252 },
        lastUpdate: "2023-11-15T10:30:00Z",
      },
      currentTask: null,
      nextTask: {
        id: "SH009",
        type: "Przegląd",
        customer: "Firma ABC",
        address: "ul. Bukowska 50, Poznań",
        startTime: "2023-11-15T14:00:00Z",
        estimatedEndTime: "2023-11-15T16:00:00Z",
      },
    },
    {
      id: "EMP005",
      name: "Karolina Dąbrowska",
      avatar: "/placeholder-user.jpg",
      position: "Technik HVAC",
      status: "available",
      location: {
        address: "ul. Długa 10, Gdańsk",
        coordinates: { lat: 54.352, lng: 18.6466 },
        lastUpdate: "2023-11-15T10:00:00Z",
      },
      currentTask: null,
      nextTask: {
        id: "SH010",
        type: "Naprawa",
        customer: "Biuro Podróży",
        address: "ul. Morska 25, Gdańsk",
        startTime: "2023-11-15T12:00:00Z",
        estimatedEndTime: "2023-11-15T14:00:00Z",
      },
    },
  ]

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

  // Funkcja do formatowania daty
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Mapa terenowa</CardTitle>
            <CardDescription>Lokalizacja pracowników w terenie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[600px] bg-muted rounded-md overflow-hidden">
              {/* Tutaj byłaby prawdziwa mapa, np. z Google Maps API */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">Mapa z lokalizacjami pracowników</p>
              </div>

              {/* Przykładowe markery na mapie */}
              {fieldEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className={`absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                    selectedEmployee === employee.id ? "z-10" : "z-0"
                  }`}
                  style={{
                    top: `${(1 - (employee.location.coordinates.lat - 50) / 5) * 100}%`,
                    left: `${((employee.location.coordinates.lng - 16) / 5) * 100}%`,
                  }}
                  onClick={() => setSelectedEmployee(employee.id)}
                >
                  <div
                    className={`flex items-center justify-center w-full h-full rounded-full ${
                      employee.status === "busy" ? "bg-yellow-500" : "bg-green-500"
                    } border-2 border-white shadow-lg`}
                  >
                    <User className="h-4 w-4 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Pracownicy w terenie</CardTitle>
            <CardDescription>Szczegóły lokalizacji i zadań</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="search-field">Szukaj pracownika</Label>
                <Input id="search-field" placeholder="Wpisz nazwisko..." />
              </div>

              <div className="space-y-2">
                {fieldEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedEmployee === employee.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedEmployee(employee.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
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
                          <div className="text-xs text-muted-foreground">{employee.position}</div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(employee.status)} variant="outline">
                        {getStatusText(employee.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {selectedEmployee && (
                <div className="pt-4 border-t">
                  {fieldEmployees
                    .filter((emp) => emp.id === selectedEmployee)
                    .map((employee) => (
                      <div key={employee.id} className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">{employee.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1" />
                            {employee.location.address}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Ostatnia aktualizacja: {new Date(employee.location.lastUpdate).toLocaleString("pl-PL")}
                          </div>
                        </div>

                        <Tabs defaultValue={employee.currentTask ? "current" : "next"}>
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="current" disabled={!employee.currentTask}>
                              Aktualne zadanie
                            </TabsTrigger>
                            <TabsTrigger value="next" disabled={!employee.nextTask}>
                              Następne zadanie
                            </TabsTrigger>
                          </TabsList>
                          {employee.currentTask && (
                            <TabsContent value="current" className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Badge variant="outline">{employee.currentTask.type}</Badge>
                                <span className="text-sm">
                                  {formatTime(employee.currentTask.startTime)} -{" "}
                                  {formatTime(employee.currentTask.estimatedEndTime)}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">{employee.currentTask.customer}</div>
                                <div className="text-sm text-muted-foreground">{employee.currentTask.address}</div>
                              </div>
                              <div className="flex justify-end">
                                <Button size="sm" variant="outline">
                                  Szczegóły zlecenia
                                </Button>
                              </div>
                            </TabsContent>
                          )}
                          {employee.nextTask && (
                            <TabsContent value="next" className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Badge variant="outline">{employee.nextTask.type}</Badge>
                                <span className="text-sm">
                                  {formatTime(employee.nextTask.startTime)} -{" "}
                                  {formatTime(employee.nextTask.estimatedEndTime)}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">{employee.nextTask.customer}</div>
                                <div className="text-sm text-muted-foreground">{employee.nextTask.address}</div>
                              </div>
                              <div className="flex justify-end">
                                <Button size="sm" variant="outline">
                                  Szczegóły zlecenia
                                </Button>
                              </div>
                            </TabsContent>
                          )}
                        </Tabs>

                        <div className="flex justify-between pt-2">
                          <Button size="sm" variant="outline">
                            Kontakt
                          </Button>
                          <Button size="sm">Przydziel zadanie</Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
