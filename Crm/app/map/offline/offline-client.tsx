"use client"

import { useState, useEffect } from "react"
import { OfflineMap } from "@/components/map/offline-map"
import { LocationData } from "@/components/map/map-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Building2, User, Wrench, Download, WifiOff, Wifi, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function OfflineMapClient({ initialLocations }: { initialLocations: LocationData[] }) {
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined)
  const [activeTab, setActiveTab] = useState("all")
  const [locations, setLocations] = useState<LocationData[]>(initialLocations)
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [lastDownloaded, setLastDownloaded] = useState<string | null>(null)
  const { toast } = useToast()
  
  // Check for cached data on component mount
  useEffect(() => {
    const cachedData = localStorage.getItem('offline-map-data')
    const lastDownloadTime = localStorage.getItem('offline-map-last-download')
    
    if (lastDownloadTime) {
      setLastDownloaded(lastDownloadTime)
    }
    
    if (cachedData && isOfflineMode) {
      try {
        const parsedData = JSON.parse(cachedData)
        setLocations(parsedData)
        toast({
          title: "Tryb offline aktywny",
          description: "Używane są dane zapisane lokalnie.",
          variant: "default",
        })
      } catch (error) {
        console.error('Error parsing cached data:', error)
        toast({
          title: "Błąd danych offline",
          description: "Nie udało się wczytać zapisanych danych. Używane są dane domyślne.",
          variant: "destructive",
        })
      }
    }
  }, [isOfflineMode, toast])
  
  // Download map data for offline use
  const downloadMapData = async () => {
    setIsDownloading(true)
    
    try {
      const response = await fetch('/api/offline-map-data')
      
      if (!response.ok) {
        throw new Error('Failed to fetch offline map data')
      }
      
      const data = await response.json()
      
      // Save to localStorage
      localStorage.setItem('offline-map-data', JSON.stringify(data))
      
      // Save download timestamp
      const now = new Date().toISOString()
      localStorage.setItem('offline-map-last-download', now)
      setLastDownloaded(now)
      
      toast({
        title: "Dane pobrane pomyślnie",
        description: "Dane mapy zostały zapisane do użytku offline.",
        variant: "default",
      })
      
      // Update locations if in offline mode
      if (isOfflineMode) {
        setLocations(data)
      }
    } catch (error) {
      console.error('Error downloading map data:', error)
      toast({
        title: "Błąd pobierania danych",
        description: "Nie udało się pobrać danych mapy do użytku offline.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }
  
  // Toggle offline mode
  const toggleOfflineMode = (checked: boolean) => {
    setIsOfflineMode(checked)
    
    if (checked) {
      // Switch to offline data
      const cachedData = localStorage.getItem('offline-map-data')
      
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData)
          setLocations(parsedData)
          toast({
            title: "Tryb offline włączony",
            description: "Używane są dane zapisane lokalnie.",
            variant: "default",
          })
        } catch (error) {
          console.error('Error parsing cached data:', error)
          toast({
            title: "Błąd danych offline",
            description: "Nie udało się wczytać zapisanych danych. Używane są dane domyślne.",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Brak danych offline",
          description: "Pobierz dane mapy, aby używać ich w trybie offline.",
          variant: "default",
        })
      }
    } else {
      // Switch back to online data
      setLocations(initialLocations)
      toast({
        title: "Tryb online włączony",
        description: "Używane są dane z serwera.",
        variant: "default",
      })
    }
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  // Filter locations based on active tab
  const getFilteredLocations = () => {
    if (activeTab === "all") return locations
    return locations.filter(location => location.type === activeTab)
  }
  
  // Handle marker click
  const handleMarkerClick = (location: LocationData) => {
    setSelectedLocation(location.id)
  }
  
  // Get location details by ID
  const getLocationDetails = (id?: string) => {
    if (!id) return null
    return locations.find(location => location.id === id)
  }
  
  // Selected location details
  const selectedLocationDetails = getLocationDetails(selectedLocation)
  
  return (
    <div className="grid gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center space-x-4">
          <Button 
            onClick={downloadMapData} 
            disabled={isDownloading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "Pobieranie..." : "Pobierz dane do użytku offline"}
          </Button>
          
          {lastDownloaded && (
            <p className="text-sm text-muted-foreground">
              Ostatnia aktualizacja: {formatDate(lastDownloaded)}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="offline-mode"
            checked={isOfflineMode}
            onCheckedChange={toggleOfflineMode}
          />
          <Label htmlFor="offline-mode" className="flex items-center gap-2">
            {isOfflineMode ? (
              <>
                <WifiOff className="h-4 w-4" />
                Tryb offline
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4" />
                Tryb online
              </>
            )}
          </Label>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-1">
            <Layers className="h-4 w-4" />
            <span>Wszystkie</span>
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
              {locations.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="customer" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>Klienci</span>
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
              {locations.filter(l => l.type === "customer").length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="site" className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>Lokalizacje</span>
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
              {locations.filter(l => l.type === "site").length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="service" className="flex items-center gap-1">
            <Wrench className="h-4 w-4" />
            <span>Zlecenia</span>
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
              {locations.filter(l => l.type === "service").length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="technician" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>Technicy</span>
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
              {locations.filter(l => l.type === "technician").length}
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <OfflineMap
                initialLocations={getFilteredLocations()}
                onMarkerClick={handleMarkerClick}
                selectedLocation={selectedLocation}
                title="Mapa offline"
                description="Wizualizacja lokalizacji dostępna offline"
              />
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Szczegóły lokalizacji</CardTitle>
                  <CardDescription>
                    {selectedLocationDetails 
                      ? `Informacje o lokalizacji: ${selectedLocationDetails.name}`
                      : "Wybierz lokalizację na mapie, aby zobaczyć szczegóły"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedLocationDetails ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">{selectedLocationDetails.name}</h3>
                        {selectedLocationDetails.address && (
                          <p className="text-sm text-muted-foreground">{selectedLocationDetails.address}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg border p-3">
                          <h4 className="text-sm font-medium">Typ</h4>
                          <p className="mt-1 text-sm">
                            {selectedLocationDetails.type === "customer" && "Klient"}
                            {selectedLocationDetails.type === "site" && "Lokalizacja"}
                            {selectedLocationDetails.type === "service" && "Zlecenie"}
                            {selectedLocationDetails.type === "technician" && "Technik"}
                            {selectedLocationDetails.type === "device" && "Urządzenie"}
                          </p>
                        </div>
                        
                        <div className="rounded-lg border p-3">
                          <h4 className="text-sm font-medium">Status</h4>
                          <p className="mt-1 text-sm">
                            {selectedLocationDetails.status || "Aktywny"}
                          </p>
                        </div>
                      </div>
                      
                      {selectedLocationDetails.customer && (
                        <div className="rounded-lg border p-3">
                          <h4 className="text-sm font-medium">Klient</h4>
                          <p className="mt-1 text-sm">{selectedLocationDetails.customer.name}</p>
                        </div>
                      )}
                      
                      {selectedLocationDetails.meta && (
                        <div className="rounded-lg border p-3">
                          <h4 className="text-sm font-medium">Dodatkowe informacje</h4>
                          <div className="mt-1 space-y-1">
                            {Object.entries(selectedLocationDetails.meta).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <span className="font-medium">{key}: </span>
                                <span>{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="rounded-lg border p-3">
                        <h4 className="text-sm font-medium">Współrzędne</h4>
                        <p className="mt-1 text-sm">
                          {selectedLocationDetails.coordinates.lat.toFixed(6)}, {selectedLocationDetails.coordinates.lng.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
                      <div className="text-center">
                        <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
                        <h3 className="mt-2 text-lg font-medium">Brak wybranej lokalizacji</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Kliknij na marker na mapie, aby zobaczyć szczegóły
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="customer" className="mt-4">
          <OfflineMap
            initialLocations={getFilteredLocations()}
            onMarkerClick={handleMarkerClick}
            selectedLocation={selectedLocation}
            title="Klienci"
            description="Lokalizacje klientów"
          />
        </TabsContent>
        
        <TabsContent value="site" className="mt-4">
          <OfflineMap
            initialLocations={getFilteredLocations()}
            onMarkerClick={handleMarkerClick}
            selectedLocation={selectedLocation}
            title="Lokalizacje"
            description="Wszystkie lokalizacje"
          />
        </TabsContent>
        
        <TabsContent value="service" className="mt-4">
          <OfflineMap
            initialLocations={getFilteredLocations()}
            onMarkerClick={handleMarkerClick}
            selectedLocation={selectedLocation}
            title="Zlecenia"
            description="Lokalizacje zleceń serwisowych"
          />
        </TabsContent>
        
        <TabsContent value="technician" className="mt-4">
          <OfflineMap
            initialLocations={getFilteredLocations()}
            onMarkerClick={handleMarkerClick}
            selectedLocation={selectedLocation}
            title="Technicy"
            description="Lokalizacje techników"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}