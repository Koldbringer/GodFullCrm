"use client"

import { useState } from "react"
import { 
  MapPin, 
  Search, 
  Layers, 
  Home, 
  Building, 
  Building2, 
  CircleUser, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  ChevronDown,
  Plus,
  Minus,
  Maximize2,
  RotateCw,
  Settings
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Location {
  id: string
  name: string
  address: string
  type: "apartment" | "house" | "office" | "commercial"
  coordinates: {
    lat: number
    lng: number
  }
  status: "active" | "inactive" | "service-needed"
  devices: number
  lastVisit?: string
  nextVisit?: string
  customer: {
    name: string
    phone?: string
  }
}

export function AdvancedMapView() {
  const [mapZoom, setMapZoom] = useState(12)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [mapType, setMapType] = useState<"standard" | "satellite" | "terrain">("standard")
  
  // Przykładowe dane lokalizacji
  const locations: Location[] = [
    {
      id: "L1",
      name: "Apartament w Śródmieściu",
      address: "ul. Nowy Świat 15, Warszawa",
      type: "apartment",
      coordinates: {
        lat: 52.2315,
        lng: 21.0196
      },
      status: "active",
      devices: 3,
      lastVisit: "15.03.2024",
      nextVisit: "15.06.2024",
      customer: {
        name: "Jan Kowalski",
        phone: "+48 123 456 789"
      }
    },
    {
      id: "L2",
      name: "Dom na Mokotowie",
      address: "ul. Puławska 143, Warszawa",
      type: "house",
      coordinates: {
        lat: 52.1923,
        lng: 21.0354
      },
      status: "service-needed",
      devices: 5,
      lastVisit: "02.04.2024",
      nextVisit: "15.05.2024",
      customer: {
        name: "Anna Nowak",
        phone: "+48 987 654 321"
      }
    },
    {
      id: "L3",
      name: "Biuro główne",
      address: "ul. Marszałkowska 89, Warszawa",
      type: "office",
      coordinates: {
        lat: 52.2289,
        lng: 21.0122
      },
      status: "active",
      devices: 12,
      lastVisit: "10.04.2024",
      nextVisit: "10.07.2024",
      customer: {
        name: "Firma XYZ",
        phone: "+48 111 222 333"
      }
    },
    {
      id: "L4",
      name: "Centrum handlowe",
      address: "ul. Wołoska 12, Warszawa",
      type: "commercial",
      coordinates: {
        lat: 52.1823,
        lng: 21.0012
      },
      status: "inactive",
      devices: 20,
      lastVisit: "01.02.2024",
      customer: {
        name: "Galeria Mokotów",
        phone: "+48 444 555 666"
      }
    }
  ]

  // Funkcja zwracająca kolor dla statusu
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "service-needed":
        return "bg-amber-500"
      case "inactive":
        return "bg-slate-500"
      default:
        return "bg-muted"
    }
  }

  // Funkcja zwracająca ikonę dla typu lokalizacji
  const getLocationIcon = (type: string) => {
    switch (type) {
      case "apartment":
        return <Home className="h-4 w-4" />
      case "house":
        return <Building className="h-4 w-4" />
      case "office":
        return <Building2 className="h-4 w-4" />
      case "commercial":
        return <Building2 className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  // Funkcja zwracająca tekst dla typu lokalizacji
  const getLocationType = (type: string) => {
    switch (type) {
      case "apartment":
        return "Apartament"
      case "house":
        return "Dom"
      case "office":
        return "Biuro"
      case "commercial":
        return "Obiekt komercyjny"
      default:
        return "Lokalizacja"
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Szukaj lokalizacji..."
              className="pl-8"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Filtry
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Typ lokalizacji</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Apartamenty</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Domy</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Biura</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Obiekty komercyjne</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuCheckboxItem checked>Aktywne</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Wymagające serwisu</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Nieaktywne</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Layers className="mr-2 h-4 w-4" />
                {mapType === "standard" ? "Standardowa" : mapType === "satellite" ? "Satelitarna" : "Terenowa"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setMapType("standard")}>
                Standardowa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMapType("satellite")}>
                Satelitarna
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMapType("terrain")}>
                Terenowa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setMapZoom(Math.min(mapZoom + 1, 20))}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setMapZoom(Math.max(mapZoom - 1, 1))}>
            <Minus className="h-4 w-4" />
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pełny ekran</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <RotateCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Odśwież mapę</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ustawienia mapy</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
        <div className="col-span-2 relative">
          <div className="absolute inset-0 bg-muted rounded-md border flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-20" />
              <p className="text-muted-foreground">Mapa zostanie wyświetlona tutaj</p>
              <p className="text-xs text-muted-foreground mt-1">Zoom: {mapZoom}, Typ: {mapType}</p>
            </div>
          </div>
          
          {/* Symulacja pinezek na mapie */}
          <div className="absolute left-1/4 top-1/3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-background border-2 border-green-500 hover:bg-green-50"
                    onClick={() => setSelectedLocation(locations[0])}
                  >
                    <Home className="h-4 w-4 text-green-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{locations[0].name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="absolute left-1/2 top-1/2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-background border-2 border-amber-500 hover:bg-amber-50"
                    onClick={() => setSelectedLocation(locations[1])}
                  >
                    <Building className="h-4 w-4 text-amber-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{locations[1].name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="absolute left-1/3 top-1/4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-background border-2 border-green-500 hover:bg-green-50"
                    onClick={() => setSelectedLocation(locations[2])}
                  >
                    <Building2 className="h-4 w-4 text-green-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{locations[2].name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="absolute left-2/3 top-2/3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-background border-2 border-slate-500 hover:bg-slate-50"
                    onClick={() => setSelectedLocation(locations[3])}
                  >
                    <Building2 className="h-4 w-4 text-slate-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{locations[3].name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="space-y-4 overflow-y-auto pr-2">
          <Tabs defaultValue="locations" className="w-full">
            <TabsList className="grid grid-cols-2 h-9">
              <TabsTrigger value="locations">Lokalizacje</TabsTrigger>
              <TabsTrigger value="details">Szczegóły</TabsTrigger>
            </TabsList>
            
            <TabsContent value="locations" className="space-y-2 mt-2">
              {locations.map((location) => (
                <Card 
                  key={location.id} 
                  className={`border cursor-pointer hover:bg-accent/10 transition-colors ${selectedLocation?.id === location.id ? 'ring-1 ring-primary' : ''}`}
                  onClick={() => setSelectedLocation(location)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className={`h-2 w-2 rounded-full ${getStatusColor(location.status)}`}></div>
                          <h3 className="font-medium text-sm">{location.name}</h3>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{location.address}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-2 h-5 text-[10px]">
                        {getLocationType(location.type)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <div className="flex items-center">
                        <span className="text-muted-foreground">Urządzenia:</span>
                        <span className="ml-1 font-medium">{location.devices}</span>
                      </div>
                      {location.lastVisit && (
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>{location.lastVisit}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="details" className="space-y-4 mt-2">
              {selectedLocation ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{selectedLocation.name}</h3>
                      <Badge 
                        variant={
                          selectedLocation.status === "active" ? "default" : 
                          selectedLocation.status === "service-needed" ? "secondary" : 
                          "outline"
                        }
                      >
                        {selectedLocation.status === "active" ? (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        ) : selectedLocation.status === "service-needed" ? (
                          <AlertTriangle className="mr-1 h-3 w-3" />
                        ) : (
                          <Clock className="mr-1 h-3 w-3" />
                        )}
                        {selectedLocation.status === "active" ? "Aktywna" : 
                         selectedLocation.status === "service-needed" ? "Wymaga serwisu" : 
                         "Nieaktywna"}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{selectedLocation.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      {getLocationIcon(selectedLocation.type)}
                      <span className="ml-1">{getLocationType(selectedLocation.type)}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Informacje o kliencie</h4>
                    <div className="flex items-center text-sm">
                      <CircleUser className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{selectedLocation.customer.name}</span>
                    </div>
                    {selectedLocation.customer.phone && (
                      <Button variant="link" className="h-auto p-0 text-sm">
                        {selectedLocation.customer.phone}
                      </Button>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Urządzenia i serwis</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-muted/50 rounded-md">
                        <div className="text-xs text-muted-foreground">Liczba urządzeń</div>
                        <div className="text-lg font-bold">{selectedLocation.devices}</div>
                      </div>
                      {selectedLocation.lastVisit && (
                        <div className="p-2 bg-muted/50 rounded-md">
                          <div className="text-xs text-muted-foreground">Ostatnia wizyta</div>
                          <div className="text-lg font-bold">{selectedLocation.lastVisit}</div>
                        </div>
                      )}
                    </div>
                    {selectedLocation.nextVisit && (
                      <div className="p-2 bg-muted/50 rounded-md">
                        <div className="text-xs text-muted-foreground">Następna wizyta</div>
                        <div className="text-lg font-bold">{selectedLocation.nextVisit}</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button>
                      Szczegóły lokalizacji
                    </Button>
                    <Button variant="outline">
                      Zaplanuj wizytę
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MapPin className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
                  <h3 className="font-medium">Wybierz lokalizację</h3>
                  <p className="text-sm text-muted-foreground">
                    Wybierz lokalizację na mapie lub z listy, aby zobaczyć szczegóły.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
