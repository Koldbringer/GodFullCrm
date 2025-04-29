"use client"

import { useEffect, useState, useRef } from "react"
import dynamic from 'next/dynamic'
import { LocationData } from "./map-view"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Building2, 
  User, 
  Wrench, 
  ZoomIn,
  ZoomOut,
  LocateFixed,
  Download,
  WifiOff,
  Loader2
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

// Dynamically import the ClusteredMap component with no SSR
const ClusteredMap = dynamic(
  () => import('./clustered-map').then((mod) => mod.ClusteredMap),
  { ssr: false }
)

interface OfflineMapProps {
  initialLocations: LocationData[]
  title?: string
  description?: string
  onMarkerClick?: (location: LocationData) => void
  selectedLocation?: string
  center?: [number, number]
  zoom?: number
  height?: string
  className?: string
}

export function OfflineMap({
  initialLocations,
  title = "Mapa offline",
  description = "Wizualizacja lokalizacji dostępna offline",
  onMarkerClick,
  selectedLocation,
  center = [52.2297, 21.0122], // Warsaw, Poland
  zoom = 11,
  height = "600px",
  className = ""
}: OfflineMapProps) {
  const [mapReady, setMapReady] = useState(false)
  const [mapType, setMapType] = useState<"standard" | "satellite" | "terrain">("standard")
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(false)
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const { toast } = useToast()
  const mapBoundsRef = useRef<any>(null)

  // Check if offline data is available on component mount
  useEffect(() => {
    checkOfflineAvailability()
  }, [])

  // Check if offline data is available in local storage
  const checkOfflineAvailability = () => {
    try {
      const offlineData = localStorage.getItem('offlineMapData')
      const offlineTiles = localStorage.getItem('offlineMapTiles')
      setIsOfflineAvailable(!!offlineData && !!offlineTiles)
    } catch (error) {
      console.error('Error checking offline availability:', error)
      setIsOfflineAvailable(false)
    }
  }

  // Download map data for offline use
  const downloadMapData = async () => {
    setIsDownloading(true)
    setDownloadProgress(0)
    
    try {
      // Store location data in localStorage
      localStorage.setItem('offlineMapData', JSON.stringify(initialLocations))
      setDownloadProgress(50)
      
      // Simulate downloading map tiles (in a real app, you would download actual map tiles)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Store a flag indicating that tiles are available
      localStorage.setItem('offlineMapTiles', 'true')
      localStorage.setItem('offlineMapTimestamp', new Date().toISOString())
      
      setDownloadProgress(100)
      setIsOfflineAvailable(true)
      
      toast({
        title: "Sukces!",
        description: "Dane mapy zostały pobrane do użytku offline.",
        variant: "default",
      })
      
      // Reset progress after a delay
      setTimeout(() => {
        setIsDownloading(false)
        setDownloadProgress(0)
      }, 1000)
    } catch (error) {
      console.error('Error downloading map data:', error)
      toast({
        title: "Błąd",
        description: "Wystąpił problem podczas pobierania danych mapy.",
        variant: "destructive",
      })
      setIsDownloading(false)
    }
  }

  // Toggle offline mode
  const toggleOfflineMode = () => {
    if (!isOfflineAvailable && !isOfflineMode) {
      toast({
        title: "Brak danych offline",
        description: "Najpierw pobierz dane mapy do użytku offline.",
        variant: "destructive",
      })
      return
    }
    
    setIsOfflineMode(!isOfflineMode)
    
    if (!isOfflineMode) {
      toast({
        title: "Tryb offline włączony",
        description: "Korzystasz z zapisanych danych mapy.",
        variant: "default",
      })
    } else {
      toast({
        title: "Tryb offline wyłączony",
        description: "Korzystasz z aktualnych danych mapy.",
        variant: "default",
      })
    }
  }

  // Get offline data from local storage
  const getOfflineData = (): LocationData[] => {
    try {
      const offlineData = localStorage.getItem('offlineMapData')
      return offlineData ? JSON.parse(offlineData) : []
    } catch (error) {
      console.error('Error getting offline data:', error)
      return []
    }
  }

  // Get the data to display based on the current mode
  const getDisplayData = (): LocationData[] => {
    return isOfflineMode ? getOfflineData() : initialLocations
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
            {isOfflineMode && (
              <Badge variant="outline" className="mt-1 bg-amber-500 text-white">
                Tryb Offline
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleOfflineMode}
              className={isOfflineMode ? "bg-amber-100" : ""}
            >
              <WifiOff className="mr-2 h-4 w-4" />
              {isOfflineMode ? "Wyłącz tryb offline" : "Włącz tryb offline"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadMapData}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Pobieranie...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Pobierz do użytku offline
                </>
              )}
            </Button>
          </div>
        </div>
        {isDownloading && (
          <div className="mt-2">
            <Progress value={downloadProgress} className="h-2" />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-muted-foreground">{downloadProgress}%</span>
            </div>
          </div>
        )}
        <Tabs defaultValue={mapType} onValueChange={(value) => setMapType(value as any)} className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="standard">Standard</TabsTrigger>
            <TabsTrigger value="satellite" disabled={isOfflineMode}>Satelita</TabsTrigger>
            <TabsTrigger value="terrain" disabled={isOfflineMode}>Teren</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-2">
        <div style={{ height, width: "100%" }} className="relative rounded-md overflow-hidden">
          <ClusteredMap
            locations={getDisplayData()}
            onMarkerClick={onMarkerClick}
            selectedLocation={selectedLocation}
            center={center}
            zoom={zoom}
            mapType={mapType}
            onMapTypeChange={setMapType}
            offlineMode={isOfflineMode}
            onMapBoundsChange={(bounds) => {
              mapBoundsRef.current = bounds
            }}
          />
        </div>
        {isOfflineAvailable && (
          <div className="mt-2 text-xs text-muted-foreground">
            Ostatnia aktualizacja danych offline: {new Date(localStorage.getItem('offlineMapTimestamp') || '').toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}