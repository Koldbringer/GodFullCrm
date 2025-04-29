"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet"
import MarkerClusterGroup from "react-leaflet-markercluster"
import 'react-leaflet-markercluster/styles';
import { Icon, LatLngExpression, LatLngBounds } from "leaflet"
import L from "leaflet"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Building2, 
  User, 
  Wrench, 
  ZoomIn,
  ZoomOut,
  LocateFixed,
  Layers
} from "lucide-react"
import { LocationData } from "./map-view"

// Import Leaflet CSS
import "leaflet/dist/leaflet.css"

// Default center and zoom
const DEFAULT_CENTER: LatLngExpression = [52.2297, 21.0122] // Warsaw, Poland
const DEFAULT_ZOOM = 11

// Map control component to recenter the map
function MapControls({ center }: { center: LatLngExpression }) {
  const map = useMap()
  
  const handleCenter = () => {
    map.setView(center, DEFAULT_ZOOM)
  }
  
  const handleZoomIn = () => {
    map.setZoom(map.getZoom() + 1)
  }
  
  const handleZoomOut = () => {
    map.setZoom(map.getZoom() - 1)
  }
  
  return (
    <div className="absolute right-2 top-2 z-[1000] flex flex-col gap-2">
      <Button variant="outline" size="icon" className="h-8 w-8 bg-background shadow-md" onClick={handleCenter}>
        <LocateFixed className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" className="h-8 w-8 bg-background shadow-md" onClick={handleZoomIn}>
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" className="h-8 w-8 bg-background shadow-md" onClick={handleZoomOut}>
        <ZoomOut className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Custom marker icon based on type - memoized for performance
const markerIconCache = new Map<string, Icon>();

function getMarkerIcon(type: string, status?: string) {
  const cacheKey = `${type}-${status || 'default'}`;
  
  if (markerIconCache.has(cacheKey)) {
    return markerIconCache.get(cacheKey)!;
  }
  
  // Create a custom icon based on the marker type
  const getColor = () => {
    if (status === "active") return "#22c55e" // green
    if (status === "inactive") return "#6b7280" // gray
    if (status === "pending") return "#f59e0b" // amber
    if (status === "service-needed") return "#ef4444" // red
    
    // Default colors by type
    switch (type) {
      case "customer": return "#3b82f6" // blue
      case "site": return "#8b5cf6" // purple
      case "service": return "#f97316" // orange
      case "technician": return "#06b6d4" // cyan
      case "device": return "#14b8a6" // teal
      default: return "#6b7280" // gray
    }
  }
  
  // Create a custom HTML element for the marker
  const getIconSvg = (type: string) => {
    switch (type) {
      case "customer": return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>`;
      case "site": return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
      case "service": return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
      case "technician": return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
      case "device": return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><path d="M9 9h6v6H9z"/><path d="M15 3v2"/><path d="M9 3v2"/><path d="M15 19v2"/><path d="M9 19v2"/><path d="M3 9h2"/><path d="M3 15h2"/><path d="M19 9h2"/><path d="M19 15h2"/></svg>`;
      default: return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
    }
  }

  const markerHtml = `
    <div class="relative flex h-8 w-8 items-center justify-center">
      <div class="absolute h-8 w-8 rounded-full bg-white opacity-70"></div>
      <div class="relative flex h-6 w-6 items-center justify-center rounded-full" style="background-color: ${getColor()}">
        ${getIconSvg(type)}
      </div>
    </div>
  `

  const icon = new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(markerHtml)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
  
  markerIconCache.set(cacheKey, icon);
  return icon;
}

// Get status badge color
function getStatusBadgeColor(status?: string) {
  switch (status) {
    case "active":
      return "bg-green-500"
    case "inactive":
      return "bg-gray-500"
    case "pending":
      return "bg-amber-500"
    case "service-needed":
      return "bg-red-500"
    default:
      return "bg-blue-500"
  }
}

// Component to handle map events and bounds
function BoundsHandler({ onBoundsChange }: { onBoundsChange: (bounds: LatLngBounds) => void }) {
  const map = useMapEvents({
    moveend: () => {
      onBoundsChange(map.getBounds());
    },
    zoomend: () => {
      onBoundsChange(map.getBounds());
    },
    load: () => {
      onBoundsChange(map.getBounds());
    }
  });
  
  return null;
}

interface OptimizedMapProps {
  locations: LocationData[]
  title?: string
  description?: string
  onMarkerClick?: (location: LocationData) => void
  selectedLocation?: string
  center?: LatLngExpression
  zoom?: number
  height?: string
  className?: string
  mapType?: "standard" | "satellite" | "terrain"
  onMapTypeChange?: (type: "standard" | "satellite" | "terrain") => void
  offlineMode?: boolean
  maxMarkersToRender?: number
}

export function OptimizedMap({
  locations,
  title = "Mapa lokalizacji",
  description = "Wizualizacja lokalizacji na mapie",
  onMarkerClick,
  selectedLocation,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  height = "600px",
  className = "",
  mapType = "standard",
  onMapTypeChange,
  offlineMode = false,
  maxMarkersToRender = 1000
}: OptimizedMapProps) {
  const [mapReady, setMapReady] = useState(false)
  const mapRef = useRef<any>(null)
  const [visibleBounds, setVisibleBounds] = useState<LatLngBounds | null>(null)
  const [visibleLocations, setVisibleLocations] = useState<LocationData[]>([])
  
  // Fix for Leaflet marker icons in Next.js
  useEffect(() => {
    // This is needed to fix the marker icon issue with Next.js
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })
    
    setMapReady(true)
  }, [])
  
  // Handle bounds change to filter visible markers
  const handleBoundsChange = useCallback((bounds: LatLngBounds) => {
    setVisibleBounds(bounds);
  }, []);
  
  // Filter locations based on map bounds and limit the number of markers
  useEffect(() => {
    if (!visibleBounds) return;
    
    // Filter locations that are within the current map bounds
    const inBoundsLocations = locations.filter(location => {
      return visibleBounds.contains([location.coordinates.lat, location.coordinates.lng]);
    });
    
    // If there are too many markers, limit them and prioritize by type
    if (inBoundsLocations.length > maxMarkersToRender) {
      // Sort by priority (you can adjust this based on your needs)
      const prioritized = [...inBoundsLocations].sort((a, b) => {
        // Prioritize selected location
        if (a.id === selectedLocation) return -1;
        if (b.id === selectedLocation) return 1;
        
        // Then prioritize by type
        const typePriority: Record<string, number> = {
          "service": 1,
          "technician": 2,
          "customer": 3,
          "site": 4,
          "device": 5
        };
        
        return (typePriority[a.type] || 99) - (typePriority[b.type] || 99);
      });
      
      setVisibleLocations(prioritized.slice(0, maxMarkersToRender));
    } else {
      setVisibleLocations(inBoundsLocations);
    }
  }, [visibleBounds, locations, maxMarkersToRender, selectedLocation]);
  
  // Get map tile layer based on map type and offline mode
  const getTileLayer = () => {
    // In offline mode, always use the standard map (which we'll assume is cached)
    if (offlineMode) {
      return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    }
    
    switch (mapType) {
      case "satellite":
        return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      case "terrain":
        return "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png"
      default:
        return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    }
  }
  
  // Handle map type change
  const handleMapTypeChange = (value: string) => {
    if (onMapTypeChange && (value === "standard" || value === "satellite" || value === "terrain")) {
      onMapTypeChange(value)
    }
  }
  
  // Memoize the cluster icon creation function for performance
  const createClusterCustomIcon = useMemo(() => {
    return (cluster: any) => {
      const count = cluster.getChildCount()
      let size = 'small'
      
      if (count > 50) size = 'large'
      else if (count > 10) size = 'medium'
      
      return L.divIcon({
        html: `<div class="cluster-marker cluster-marker-${size}">${count}</div>`,
        className: 'custom-marker-cluster',
        iconSize: L.point(40, 40, true)
      })
    }
  }, []);

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Tabs defaultValue={mapType} onValueChange={handleMapTypeChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="standard">Standard</TabsTrigger>
              <TabsTrigger value="satellite" disabled={offlineMode}>Satelita</TabsTrigger>
              <TabsTrigger value="terrain" disabled={offlineMode}>Teren</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <div style={{ height, width: "100%" }} className="relative rounded-md overflow-hidden">
          {mapReady && (
            <MapContainer
              center={center}
              zoom={zoom}
              style={{ height: "100%", width: "100%" }}
              className="z-0"
              whenCreated={(map) => {
                mapRef.current = map;
              }}
            >
              <TileLayer
                attribution={offlineMode ? 'Offline Map Data' : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
                url={getTileLayer()}
              />
              <MapControls center={center} />
              <BoundsHandler onBoundsChange={handleBoundsChange} />
              
              <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={createClusterCustomIcon}
                maxClusterRadius={60}
                spiderfyOnMaxZoom={true}
                zoomToBoundsOnClick={true}
              >
                {visibleLocations.map((location) => (
                  <Marker
                    key={location.id}
                    position={[location.coordinates.lat, location.coordinates.lng]}
                    icon={getMarkerIcon(location.type, location.status)}
                    eventHandlers={{
                      click: () => onMarkerClick && onMarkerClick(location),
                    }}
                  >
                    <Popup>
                      <div className="p-1">
                        <div className="font-medium">{location.name}</div>
                        {location.address && (
                          <div className="text-sm text-muted-foreground">{location.address}</div>
                        )}
                        {location.status && (
                          <Badge 
                            variant="outline" 
                            className={`mt-1 ${getStatusBadgeColor(location.status)} text-white`}
                          >
                            {location.status}
                          </Badge>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            </MapContainer>
          )}
        </div>
        {locations.length > maxMarkersToRender && visibleLocations.length < locations.length && (
          <div className="mt-2 text-xs text-muted-foreground">
            Showing {visibleLocations.length} of {locations.length} locations. Zoom in to see more details.
          </div>
        )}
      </CardContent>
    </Card>
  )
}