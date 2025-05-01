import type { Metadata } from "next"
import {
  ClipboardList,
  MapPin,
  Clock,
  CheckCircle2,
  Package,
  User,
  Phone,
  Mail,
  Camera,
  FileText,
  Wrench,
  AlertTriangle,
  BarChart3,
  Thermometer,
  Droplets,
  Wind,
  Gauge
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export const metadata: Metadata = {
  title: "Interfejs technika - HVAC CRM ERP",
  description: "Mobilny interfejs dla techników serwisowych",
}

export default function TechnicianMobilePage() {
  // Przykładowe dane technika
  const technician = {
    name: "Jan Kowalski",
    avatar: "/placeholder-user.jpg",
    initials: "JK",
    role: "Starszy technik",
    specialization: "Klimatyzacje",
    completedToday: 2,
    pendingToday: 3,
    efficiency: 92
  }

  // Przykładowe dane zadań
  const tasks = [
    {
      id: "T1001",
      title: "Przegląd klimatyzacji",
      type: "maintenance",
      priority: "medium",
      status: "in-progress",
      customer: {
        name: "Firma XYZ",
        phone: "+48 123 456 789",
        email: "kontakt@xyz.pl"
      },
      location: "ul. Warszawska 10, Warszawa",
      device: "Klimatyzator AC-1001",
      scheduledFor: "Dziś, 14:30",
      estimatedDuration: "1.5h",
      notes: "Klient zgłasza głośną pracę jednostki zewnętrznej."
    },
    {
      id: "T1002",
      title: "Naprawa pompy ciepła",
      type: "repair",
      priority: "high",
      status: "scheduled",
      customer: {
        name: "Anna Nowak",
        phone: "+48 987 654 321",
        email: "anna.nowak@example.com"
      },
      location: "ul. Puławska 143, Warszawa",
      device: "Pompa ciepła HP-2001",
      scheduledFor: "Dziś, 16:00",
      estimatedDuration: "2h",
      notes: "Urządzenie nie grzeje. Klient prosi o telefon przed przyjazdem."
    },
    {
      id: "T1003",
      title: "Wymiana filtrów",
      type: "maintenance",
      priority: "low",
      status: "scheduled",
      customer: {
        name: "Jan Kowalczyk",
        phone: "+48 111 222 333",
        email: "jan.kowalczyk@example.com"
      },
      location: "ul. Nowy Świat 15, Warszawa",
      device: "Klimatyzator AC-3001",
      scheduledFor: "Jutro, 10:00",
      estimatedDuration: "1h",
      notes: ""
    }
  ]

  // Przykładowe dane urządzenia
  const deviceData = {
    id: "AC-1001",
    name: "Klimatyzator główny",
    model: "SuperCool X500",
    serialNumber: "SC-X500-12345",
    installationDate: "15.05.2022",
    lastService: "10.01.2024",
    status: "warning",
    telemetry: {
      temperature: 22.5,
      humidity: 45,
      pressure: 1013,
      airflow: 85,
      energy: 1.2
    },
    parts: [
      { name: "Filtr powietrza", lastReplaced: "10.01.2024", status: "good" },
      { name: "Czynnik chłodniczy", lastReplaced: "15.05.2022", status: "warning" },
      { name: "Wentylator", lastReplaced: "15.05.2022", status: "good" }
    ]
  }

  // Funkcja zwracająca kolor dla priorytetu
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-blue-500"
      case "medium":
        return "bg-amber-500"
      case "high":
        return "bg-orange-500"
      case "urgent":
        return "bg-red-500"
      default:
        return "bg-muted"
    }
  }

  // Funkcja zwracająca kolor dla statusu części
  const getPartStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-500"
      case "warning":
        return "text-amber-500"
      case "critical":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src={technician.avatar} alt={technician.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">{technician.initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{technician.name}</div>
              <div className="text-xs text-muted-foreground">{technician.role} • {technician.specialization}</div>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 animate-pulse">
              Online
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-4">
        {/* Statystyki technika */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border shadow-sm hover-lift">
            <CardContent className="p-3 flex flex-col items-center justify-center">
              <div className="text-xl font-bold text-green-600">{technician.completedToday}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Ukończone</div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm hover-lift">
            <CardContent className="p-3 flex flex-col items-center justify-center">
              <div className="text-xl font-bold text-amber-600">{technician.pendingToday}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Oczekujące</div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm hover-lift">
            <CardContent className="p-3 flex flex-col items-center justify-center">
              <div className="text-xl font-bold text-blue-600">{technician.efficiency}%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Wydajność</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="current" className="space-y-4">
          <TabsList className="grid grid-cols-3 h-10">
            <TabsTrigger value="current">Bieżące</TabsTrigger>
            <TabsTrigger value="upcoming">Nadchodzące</TabsTrigger>
            <TabsTrigger value="device">Urządzenie</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4">
            {tasks.filter(task => task.status === "in-progress").map((task) => (
              <Card key={task.id} className="border shadow-sm">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{task.title}</CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {task.type === "maintenance" ? "Przegląd" :
                           task.type === "repair" ? "Naprawa" :
                           task.type === "installation" ? "Instalacja" : "Serwis"}
                        </Badge>
                        <span>#{task.id}</span>
                      </CardDescription>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{task.scheduledFor}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                      <span>{task.estimatedDuration}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{task.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{task.device}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{task.customer.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Button variant="link" className="h-auto p-0 text-sm">
                        {task.customer.phone}
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Button variant="link" className="h-auto p-0 text-sm">
                        {task.customer.email}
                      </Button>
                    </div>
                  </div>

                  {task.notes && (
                    <div className="bg-muted/50 p-2 rounded-md text-sm">
                      <p className="font-medium mb-1">Notatki:</p>
                      <p>{task.notes}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0 flex flex-col space-y-2">
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <Button variant="outline" className="w-full">
                      <Camera className="mr-2 h-4 w-4" />
                      Zdjęcia
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Raport
                    </Button>
                  </div>
                  <Button className="w-full">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Zakończ zadanie
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {/* Formularz raportu serwisowego */}
            <Card className="border shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">Raport serwisowy</CardTitle>
                <CardDescription>
                  Uzupełnij raport z wykonanej usługi
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="service-type">Typ usługi</Label>
                  <select
                    id="service-type"
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                    aria-label="Typ usługi"
                  >
                    <option>Przegląd okresowy</option>
                    <option>Naprawa</option>
                    <option>Wymiana części</option>
                    <option>Konserwacja</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parts-used">Użyte części</Label>
                  <Input id="parts-used" placeholder="Np. filtr powietrza, czynnik chłodniczy" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="work-description">Opis wykonanych prac</Label>
                  <Textarea id="work-description" placeholder="Opisz wykonane czynności..." className="min-h-[100px]" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recommendations">Zalecenia</Label>
                  <Textarea id="recommendations" placeholder="Zalecenia dla klienta..." className="min-h-[80px]" />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="customer-signature" />
                  <Label htmlFor="customer-signature">Podpis klienta zebrany</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="photos-attached" />
                  <Label htmlFor="photos-attached">Dołączono zdjęcia</Label>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Zapisz raport
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {tasks.filter(task => task.status === "scheduled").map((task) => (
              <Card key={task.id} className="border shadow-sm">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{task.title}</CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {task.type === "maintenance" ? "Przegląd" :
                           task.type === "repair" ? "Naprawa" :
                           task.type === "installation" ? "Instalacja" : "Serwis"}
                        </Badge>
                        <span>#{task.id}</span>
                      </CardDescription>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{task.scheduledFor}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                      <span>{task.estimatedDuration}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{task.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{task.device}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{task.customer.name}</span>
                    </div>
                  </div>

                  {task.notes && (
                    <div className="bg-muted/50 p-2 rounded-md text-sm">
                      <p>{task.notes}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <Button variant="outline" className="w-full">
                      <Phone className="mr-2 h-4 w-4" />
                      Kontakt
                    </Button>
                    <Button variant="outline" className="w-full">
                      <MapPin className="mr-2 h-4 w-4" />
                      Nawigacja
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="device" className="space-y-4">
            <Card className="border shadow-sm">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{deviceData.name}</CardTitle>
                    <CardDescription>
                      {deviceData.model} • S/N: {deviceData.serialNumber}
                    </CardDescription>
                  </div>
                  {deviceData.status === "warning" && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Ostrzeżenie
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Instalacja: {deviceData.installationDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                    <span>Ostatni serwis: {deviceData.lastService}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Telemetria</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="h-4 w-4 text-rose-500" />
                      <div className="space-y-1 flex-1">
                        <div className="flex justify-between text-xs">
                          <span>Temperatura</span>
                          <span>{deviceData.telemetry.temperature}°C</span>
                        </div>
                        <Progress value={70} className="h-1" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <div className="space-y-1 flex-1">
                        <div className="flex justify-between text-xs">
                          <span>Wilgotność</span>
                          <span>{deviceData.telemetry.humidity}%</span>
                        </div>
                        <Progress value={45} className="h-1" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Gauge className="h-4 w-4 text-amber-500" />
                      <div className="space-y-1 flex-1">
                        <div className="flex justify-between text-xs">
                          <span>Ciśnienie</span>
                          <span>{deviceData.telemetry.pressure} hPa</span>
                        </div>
                        <Progress value={60} className="h-1" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Wind className="h-4 w-4 text-cyan-500" />
                      <div className="space-y-1 flex-1">
                        <div className="flex justify-between text-xs">
                          <span>Przepływ</span>
                          <span>{deviceData.telemetry.airflow}%</span>
                        </div>
                        <Progress value={85} className="h-1" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Części</h3>
                  <div className="space-y-2">
                    {deviceData.parts.map((part, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`h-2 w-2 rounded-full ${
                            part.status === "good" ? "bg-green-500" :
                            part.status === "warning" ? "bg-amber-500" :
                            "bg-red-500"
                          }`}></div>
                          <span className="text-sm">{part.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Wymiana: {part.lastReplaced}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Historia serwisowa</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Przegląd okresowy</div>
                      <span className="text-xs text-muted-foreground">10.01.2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Wymiana filtrów</div>
                      <span className="text-xs text-muted-foreground">10.01.2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Naprawa wentylatora</div>
                      <span className="text-xs text-muted-foreground">15.09.2023</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Pełna dokumentacja
                </Button>
              </CardFooter>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">Diagnostyka</CardTitle>
                <CardDescription>
                  Przeprowadź diagnostykę urządzenia
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="diagnostic-type">Typ diagnostyki</Label>
                  <select
                    id="diagnostic-type"
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                    aria-label="Typ diagnostyki"
                  >
                    <option>Pełna diagnostyka</option>
                    <option>Diagnostyka elektryczna</option>
                    <option>Diagnostyka mechaniczna</option>
                    <option>Test wydajności</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Parametry diagnostyczne</Label>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                      Resetuj
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Temperatura pracy</span>
                      <Badge variant="outline">Sprawdź</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Ciśnienie czynnika</span>
                      <Badge variant="outline">Sprawdź</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pobór energii</span>
                      <Badge variant="outline">Sprawdź</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Wydajność chłodzenia</span>
                      <Badge variant="outline">Sprawdź</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Rozpocznij diagnostykę
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-4 gap-1">
          <Button variant="ghost" className="flex flex-col h-16 rounded-md hover:bg-primary/5 transition-colors">
            <ClipboardList className="h-5 w-5 mb-1 text-primary" />
            <span className="text-xs font-medium">Zadania</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-16 rounded-md hover:bg-primary/5 transition-colors">
            <MapPin className="h-5 w-5 mb-1 text-muted-foreground" />
            <span className="text-xs">Mapa</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-16 rounded-md hover:bg-primary/5 transition-colors">
            <Package className="h-5 w-5 mb-1 text-muted-foreground" />
            <span className="text-xs">Magazyn</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-16 rounded-md hover:bg-primary/5 transition-colors">
            <User className="h-5 w-5 mb-1 text-muted-foreground" />
            <span className="text-xs">Profil</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
