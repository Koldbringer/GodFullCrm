import type { Metadata } from "next"
import { 
  PlusCircle, 
  Filter, 
  RefreshCw, 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  Battery, 
  Wifi, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  Bell,
  Clock,
  BarChart3
} from "lucide-react"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata: Metadata = {
  title: "Monitoring - HVAC CRM ERP",
  description: "Monitoring urządzeń i systemów w systemie HVAC CRM ERP",
}

// Przykładowe dane urządzeń
const devices = [
  {
    id: "DEV001",
    name: "Klimatyzator Samsung WindFree",
    location: "Biuro główne, Warszawa",
    status: "online",
    temperature: 22.5,
    humidity: 45,
    pressure: 1013,
    airflow: 80,
    battery: 95,
    lastUpdate: "2 min temu",
    alerts: 0,
    type: "Klimatyzator",
    model: "Samsung WindFree",
    serialNumber: "SN12345678",
    installationDate: "2023-05-15",
    customer: {
      id: "C001",
      name: "Firma XYZ",
    },
  },
  {
    id: "DEV002",
    name: "System wentylacji Daikin VRV IV",
    location: "Restauracja ABC, Kraków",
    status: "warning",
    temperature: 24.8,
    humidity: 60,
    pressure: 1010,
    airflow: 65,
    battery: 45,
    lastUpdate: "5 min temu",
    alerts: 2,
    type: "System wentylacji",
    model: "Daikin VRV IV",
    serialNumber: "SN87654321",
    installationDate: "2022-11-20",
    customer: {
      id: "C002",
      name: "Restauracja ABC",
    },
  },
  {
    id: "DEV003",
    name: "Pompa ciepła Viessmann Vitocal",
    location: "Dom jednorodzinny, Gdańsk",
    status: "offline",
    temperature: null,
    humidity: null,
    pressure: null,
    airflow: null,
    battery: 10,
    lastUpdate: "2 godz. temu",
    alerts: 1,
    type: "Pompa ciepła",
    model: "Viessmann Vitocal",
    serialNumber: "SN11223344",
    installationDate: "2023-02-10",
    customer: {
      id: "C003",
      name: "Jan Kowalski",
    },
  },
  {
    id: "DEV004",
    name: "Klimatyzator LG Artcool",
    location: "Apartament, Wrocław",
    status: "online",
    temperature: 21.0,
    humidity: 40,
    pressure: 1015,
    airflow: 75,
    battery: 85,
    lastUpdate: "10 min temu",
    alerts: 0,
    type: "Klimatyzator",
    model: "LG Artcool",
    serialNumber: "SN55667788",
    installationDate: "2023-07-05",
    customer: {
      id: "C004",
      name: "Anna Nowak",
    },
  },
  {
    id: "DEV005",
    name: "Rekuperator Vents TwinFresh",
    location: "Biuro, Poznań",
    status: "warning",
    temperature: 23.2,
    humidity: 55,
    pressure: 1012,
    airflow: 50,
    battery: 60,
    lastUpdate: "15 min temu",
    alerts: 1,
    type: "Rekuperator",
    model: "Vents TwinFresh",
    serialNumber: "SN99887766",
    installationDate: "2022-09-15",
    customer: {
      id: "C005",
      name: "Firma ABC",
    },
  },
]

// Przykładowe dane alertów
const alerts = [
  {
    id: "ALT001",
    deviceId: "DEV002",
    deviceName: "System wentylacji Daikin VRV IV",
    type: "Wysoka temperatura",
    severity: "warning",
    message: "Temperatura przekroczyła 24°C",
    timestamp: "2024-03-15T14:30:00Z",
    status: "active",
    location: "Restauracja ABC, Kraków",
  },
  {
    id: "ALT002",
    deviceId: "DEV002",
    deviceName: "System wentylacji Daikin VRV IV",
    type: "Niski poziom baterii",
    severity: "warning",
    message: "Poziom baterii poniżej 50%",
    timestamp: "2024-03-15T14:35:00Z",
    status: "active",
    location: "Restauracja ABC, Kraków",
  },
  {
    id: "ALT003",
    deviceId: "DEV003",
    deviceName: "Pompa ciepła Viessmann Vitocal",
    type: "Utrata połączenia",
    severity: "critical",
    message: "Urządzenie offline od 2 godzin",
    timestamp: "2024-03-15T13:00:00Z",
    status: "active",
    location: "Dom jednorodzinny, Gdańsk",
  },
  {
    id: "ALT004",
    deviceId: "DEV005",
    deviceName: "Rekuperator Vents TwinFresh",
    type: "Niski przepływ powietrza",
    severity: "warning",
    message: "Przepływ powietrza poniżej 60%",
    timestamp: "2024-03-15T14:15:00Z",
    status: "active",
    location: "Biuro, Poznań",
  },
  {
    id: "ALT005",
    deviceId: "DEV001",
    deviceName: "Klimatyzator Samsung WindFree",
    type: "Wysoka temperatura",
    severity: "warning",
    message: "Temperatura przekroczyła 25°C",
    timestamp: "2024-03-14T10:30:00Z",
    status: "resolved",
    location: "Biuro główne, Warszawa",
  },
]

// Funkcja pomocnicza do określania koloru statusu
function getStatusColor(status: string) {
  switch (status) {
    case "online":
      return "text-green-500"
    case "warning":
      return "text-amber-500"
    case "offline":
      return "text-red-500"
    default:
      return "text-gray-500"
  }
}

// Funkcja pomocnicza do określania ikony statusu
function getStatusIcon(status: string) {
  switch (status) {
    case "online":
      return <CheckCircle2 className="h-4 w-4" />
    case "warning":
      return <AlertTriangle className="h-4 w-4" />
    case "offline":
      return <XCircle className="h-4 w-4" />
    default:
      return <Wifi className="h-4 w-4" />
  }
}

// Komponent do wyświetlania statystyk monitoringu
function MonitoringStats() {
  const totalDevices = devices.length
  const onlineDevices = devices.filter(d => d.status === "online").length
  const warningDevices = devices.filter(d => d.status === "warning").length
  const offlineDevices = devices.filter(d => d.status === "offline").length
  const activeAlerts = alerts.filter(a => a.status === "active").length
  
  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wszystkie urządzenia</CardTitle>
          <Wifi className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDevices}</div>
          <p className="text-xs text-muted-foreground">
            Łączna liczba monitorowanych urządzeń
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Online</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{onlineDevices}</div>
          <p className="text-xs text-muted-foreground">
            Urządzenia działające prawidłowo
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ostrzeżenia</CardTitle>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{warningDevices}</div>
          <p className="text-xs text-muted-foreground">
            Urządzenia z ostrzeżeniami
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Offline</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{offlineDevices}</div>
          <p className="text-xs text-muted-foreground">
            Urządzenia bez połączenia
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aktywne alerty</CardTitle>
          <Bell className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeAlerts}</div>
          <p className="text-xs text-muted-foreground">
            Alerty wymagające uwagi
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// Komponent do wyświetlania listy urządzeń
function DevicesList() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Szukaj urządzenia..."
            className="w-[250px]"
          />
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtruj po statusie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie statusy</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="warning">Ostrzeżenia</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Odśwież dane
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Urządzenie</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Lokalizacja</TableHead>
              <TableHead>Parametry</TableHead>
              <TableHead>Bateria</TableHead>
              <TableHead>Ostatnia aktualizacja</TableHead>
              <TableHead>Alerty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{device.name}</span>
                    <span className="text-xs text-muted-foreground">{device.type}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`flex items-center ${getStatusColor(device.status)}`}>
                    {getStatusIcon(device.status)}
                    <span className="ml-2 capitalize">{device.status}</span>
                  </div>
                </TableCell>
                <TableCell>{device.location}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-1">
                            <Thermometer className="h-4 w-4 text-rose-500" />
                            <span className="text-xs">
                              {device.status !== "offline" ? `${device.temperature}°C` : "—"}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Temperatura</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-1">
                            <Droplets className="h-4 w-4 text-blue-500" />
                            <span className="text-xs">
                              {device.status !== "offline" ? `${device.humidity}%` : "—"}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Wilgotność</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-1">
                            <Wind className="h-4 w-4 text-cyan-500" />
                            <span className="text-xs">
                              {device.status !== "offline" ? `${device.airflow}%` : "—"}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Przepływ powietrza</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Progress 
                      value={device.battery} 
                      className="h-2 w-16" 
                      indicatorClassName={device.battery < 20 ? "bg-red-500" : device.battery < 50 ? "bg-amber-500" : "bg-green-500"}
                    />
                    <span className="text-xs">{device.battery}%</span>
                  </div>
                </TableCell>
                <TableCell>{device.lastUpdate}</TableCell>
                <TableCell>
                  {device.alerts > 0 ? (
                    <Badge variant="destructive">{device.alerts}</Badge>
                  ) : (
                    <Badge variant="outline">0</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// Komponent do wyświetlania alertów
function AlertsList() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Szukaj alertu..."
            className="w-[250px]"
          />
          <Select defaultValue="active">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtruj po statusie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie statusy</SelectItem>
              <SelectItem value="active">Aktywne</SelectItem>
              <SelectItem value="resolved">Rozwiązane</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Odśwież dane
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alert</TableHead>
              <TableHead>Urządzenie</TableHead>
              <TableHead>Lokalizacja</TableHead>
              <TableHead>Czas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Badge variant={alert.severity === "critical" ? "destructive" : "warning"}>
                      {alert.severity === "critical" ? "Krytyczny" : "Ostrzeżenie"}
                    </Badge>
                    <span>{alert.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                </TableCell>
                <TableCell>{alert.deviceName}</TableCell>
                <TableCell>{alert.location}</TableCell>
                <TableCell>
                  {new Date(alert.timestamp).toLocaleString('pl-PL', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell>
                  <Badge variant={alert.status === "active" ? "default" : "outline"}>
                    {alert.status === "active" ? "Aktywny" : "Rozwiązany"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {alert.status === "active" && (
                    <Button variant="outline" size="sm">
                      Rozwiąż
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// Komponent do wyświetlania wykresów i analiz
function AnalyticsPanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Analiza danych</h3>
        <div className="flex items-center space-x-2">
          <Select defaultValue="7days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Okres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24hours">Ostatnie 24 godziny</SelectItem>
              <SelectItem value="7days">Ostatnie 7 dni</SelectItem>
              <SelectItem value="30days">Ostatnie 30 dni</SelectItem>
              <SelectItem value="custom">Niestandardowy</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Odśwież
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Temperatura</CardTitle>
            <CardDescription>Średnia temperatura urządzeń w czasie</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/30">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p>Wykres temperatury zostanie zintegrowany z API wykresów.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Wilgotność</CardTitle>
            <CardDescription>Średnia wilgotność urządzeń w czasie</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/30">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p>Wykres wilgotności zostanie zintegrowany z API wykresów.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Przepływ powietrza</CardTitle>
            <CardDescription>Średni przepływ powietrza urządzeń w czasie</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/30">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p>Wykres przepływu powietrza zostanie zintegrowany z API wykresów.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Alerty</CardTitle>
            <CardDescription>Liczba alertów w czasie</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/30">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p>Wykres alertów zostanie zintegrowany z API wykresów.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function MonitoringPage() {
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
          <h2 className="text-3xl font-bold tracking-tight">Monitoring</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtry
            </Button>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Dodaj urządzenie
            </Button>
          </div>
        </div>
        
        <MonitoringStats />
        
        <Tabs defaultValue="devices" className="space-y-4">
          <TabsList>
            <TabsTrigger value="devices">Urządzenia</TabsTrigger>
            <TabsTrigger value="alerts">Alerty</TabsTrigger>
            <TabsTrigger value="analytics">Analityka</TabsTrigger>
          </TabsList>
          <TabsContent value="devices" className="space-y-4">
            <DevicesList />
          </TabsContent>
          <TabsContent value="alerts" className="space-y-4">
            <AlertsList />
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
