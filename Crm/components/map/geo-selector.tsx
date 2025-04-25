"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import { Icon, LatLng, LatLngExpression } from "leaflet"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Search, Loader2 } from "lucide-react"

// Import Leaflet CSS
import "leaflet/dist/leaflet.css"

// Default center (Warsaw, Poland)
const DEFAULT_CENTER: LatLngExpression = [52.2297, 21.0122]
const DEFAULT_ZOOM = 13

// Location picker component
function LocationPicker({ onLocationSelected }: { onLocationSelected: (location: LatLng) => void }) {
  const map = useMapEvents({
    click(e) {
      onLocationSelected(e.latlng)
    },
  })
  
  return null
}

// Custom marker icon
const createMarkerIcon = () => {
  const markerHtml = `
    <div class="relative flex h-8 w-8 items-center justify-center">
      <div class="absolute h-8 w-8 rounded-full bg-white opacity-70"></div>
      <div class="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    </div>
  `
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(markerHtml)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })
}

interface GeoSelectorProps {
  onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void
  initialLocation?: { lat: number; lng: number }
  title?: string
  description?: string
  height?: string
  showSearch?: boolean
  required?: boolean
}

export function GeoSelector({
  onLocationSelect,
  initialLocation,
  title = "Wybierz lokalizację",
  description = "Kliknij na mapie, aby wybrać lokalizację",
  height = "400px",
  showSearch = true,
  required = false
}: GeoSelectorProps) {
  const [mapReady, setMapReady] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(
    initialLocation ? new LatLng(initialLocation.lat, initialLocation.lng) : null
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  
  // Handle location selection
  const handleLocationSelected = (location: LatLng) => {
    setSelectedLocation(location)
    onLocationSelect({
      lat: location.lat,
      lng: location.lng
    })
    
    // Try to get address from coordinates (reverse geocoding)
    fetchAddressFromCoordinates(location.lat, location.lng)
  }
  
  // Search for location by address
  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    try {
      // Using Nominatim OpenStreetMap API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      )
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error("Error searching for location:", error)
    } finally {
      setIsSearching(false)
    }
  }
  
  // Select search result
  const selectSearchResult = (result: any) => {
    const location = new LatLng(parseFloat(result.lat), parseFloat(result.lon))
    setSelectedLocation(location)
    onLocationSelect({
      lat: location.lat,
      lng: location.lng,
      address: result.display_name
    })
    setSearchResults([])
  }
  
  // Fetch address from coordinates
  const fetchAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      )
      const data = await response.json()
      if (data && data.display_name) {
        onLocationSelect({
          lat,
          lng,
          address: data.display_name
        })
      }
    } catch (error) {
      console.error("Error fetching address:", error)
    }
  }
  
  // Fix for Leaflet marker icons in Next.js
  useEffect(() => {
    const L = require("leaflet")
    
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })
    
    setMapReady(true)
  }, [])
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showSearch && (
          <div className="relative">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Wyszukaj adres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
              <Button type="button" onClick={handleSearch} disabled={isSearching}>
                <Search className="h-4 w-4 mr-2" />
                Szukaj
              </Button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg">
                <ul className="max-h-60 overflow-auto py-1 text-base">
                  {searchResults.map((result, index) => (
                    <li
                      key={index}
                      className="relative cursor-pointer select-none py-2 px-3 hover:bg-muted"
                      onClick={() => selectSearchResult(result)}
                    >
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0 text-muted-foreground" />
                        <span className="text-sm">{result.display_name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        <div style={{ height, width: "100%" }} className="relative rounded-md overflow-hidden border">
          {mapReady && (
            <MapContainer
              center={initialLocation ? [initialLocation.lat, initialLocation.lng] : DEFAULT_CENTER}
              zoom={DEFAULT_ZOOM}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker onLocationSelected={handleLocationSelected} />
              {selectedLocation && (
                <Marker
                  position={selectedLocation}
                  icon={createMarkerIcon()}
                />
              )}
            </MapContainer>
          )}
          
          {!mapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        
        {selectedLocation && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Szerokość geograficzna</Label>
              <Input
                id="latitude"
                value={selectedLocation.lat.toFixed(6)}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="longitude">Długość geograficzna</Label>
              <Input
                id="longitude"
                value={selectedLocation.lng.toFixed(6)}
                readOnly
              />
            </div>
          </div>
        )}
        
        {required && !selectedLocation && (
          <p className="text-sm text-destructive">Wybór lokalizacji jest wymagany</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setSelectedLocation(null)
            onLocationSelect({ lat: 0, lng: 0, address: undefined })
          }}
          disabled={!selectedLocation}
        >
          Wyczyść
        </Button>
        <Button
          onClick={() => {
            if (selectedLocation) {
              onLocationSelect({
                lat: selectedLocation.lat,
                lng: selectedLocation.lng
              })
            }
          }}
          disabled={!selectedLocation}
        >
          Potwierdź lokalizację
        </Button>
      </CardFooter>
    </Card>
  )
}
