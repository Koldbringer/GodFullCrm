"use client"

import { useState, useEffect } from "react"
import { LocationData } from "@/components/map/map-view"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  User,
  Building2,
  Wrench,
  Calendar,
  Clock,
  Phone,
  Mail,
  Search
} from "lucide-react"
import { formatDate } from "@/lib/utils"
import { ClusteredMap } from "@/components/map/clustered-map"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface MapViewClientProps {
  initialLocations: LocationData[]
  title?: string
  description?: string
}

export function MapViewClientClustered({
  initialLocations,
  title,
  description
}: MapViewClientProps) {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [filteredLocations, setFilteredLocations] = useState<LocationData[]>(initialLocations)
  const [mapType, setMapType] = useState<"standard" | "satellite" | "terrain">("standard")
  const [searchQuery, setSearchQuery] = useState("")

  // Update filtered locations when initialLocations change
  useEffect(() => {
    setFilteredLocations(initialLocations)
  }, [initialLocations])

  // Handle marker click
  const handleMarkerClick = (location: LocationData) => {
    setSelectedLocation(location)
  }

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredLocations(initialLocations)
      return
    }

    const query = searchQuery.toLowerCase().trim()
    const filtered = initialLocations.filter(location => 
      location.name.toLowerCase().includes(query) || 
      location.address?.toLowerCase().includes(query) ||
      location.customer?.name.toLowerCase().includes(query) ||
      location.meta?.district?.toString().toLowerCase().includes(query)
    )
    
    setFilteredLocations(filtered)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    setFilteredLocations(initialLocations)
  }

  // Get status badge color
  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 text-white"
      case "inactive":
        return "bg-gray-500 text-white"
      case "pending":
        return "bg-amber-500 text-white"
      case "service-needed":
        return "bg-red-500 text-white"
      case "busy":
        return "bg-yellow-500 text-white"
      default:
        return "bg-blue-500 text-white"
    }
  }

  // Get icon for location type
  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case "customer":
        return <User className="h-5 w-5 text-blue-500" />
      case "site":
        return <Building2 className="h-5 w-5 text-purple-500" />
      case "service":
        return <Wrench className="h-5 w-5 text-orange-500" />
      case "technician":
        return <User className="h-5 w-5 text-cyan-500" />
      default:
        return <MapPin className="h-5 w-5 text-gray-500" />
    }
  }

  // Get location type name
  const getLocationTypeName = (type: string) => {
    switch (type) {
      case "customer":
        return "Klient"
      case "site":
        return "Lokalizacja"
      case "service":
        return "Zlecenia serwisowe"
      case "technician":
        return "Technik"
      default:
        return "Lokalizacja"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <div className="mb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Szukaj po nazwie, adresie lub dzielnicy..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>Szukaj</Button>
            {searchQuery && (
              <Button variant="outline" onClick={clearSearch}>Wyczyść</Button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-1">
              Znaleziono {filteredLocations.length} lokalizacji
            </p>
          )}
        </div>
        
        <ClusteredMap
          locations={filteredLocations}
          onMarkerClick={handleMarkerClick}
          selectedLocation={selectedLocation?.id}
          title={title}
          description={description}
          mapType={mapType}
          onMapTypeChange={setMapType}
        />
      </div>

      <div>
        {selectedLocation ? (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getLocationTypeIcon(selectedLocation.type)}
                  <CardTitle>{selectedLocation.name}</CardTitle>
                </div>
                {selectedLocation.status && (
                  <Badge className={getStatusBadgeColor(selectedLocation.status)}>
                    {selectedLocation.status}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedLocation.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div className="text-sm">{selectedLocation.address}</div>
                </div>
              )}

              {selectedLocation.customer && (
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div className="text-sm">{selectedLocation.customer.name}</div>
                </div>
              )}

              {/* Type-specific details */}
              {selectedLocation.type === "service" && selectedLocation.meta && (
                <>
                  {selectedLocation.meta.scheduledStart && (
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="text-sm">
                        Zaplanowano: {formatDate(selectedLocation.meta.scheduledStart)}
                      </div>
                    </div>
                  )}

                  {selectedLocation.meta.technicianName && (
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="text-sm">
                        Technik: {selectedLocation.meta.technicianName}
                      </div>
                    </div>
                  )}
                </>
              )}

              {selectedLocation.type === "technician" && selectedLocation.meta && (
                <>
                  {selectedLocation.meta.phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="text-sm">{selectedLocation.meta.phone}</div>
                    </div>
                  )}

                  {selectedLocation.meta.email && (
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="text-sm">{selectedLocation.meta.email}</div>
                    </div>
                  )}
                </>
              )}

              <div className="pt-2">
                <div className="text-xs text-muted-foreground">
                  {getLocationTypeName(selectedLocation.type)} ID: {selectedLocation.id.split('-')[1]}
                </div>
                <div className="text-xs text-muted-foreground">
                  Współrzędne: {selectedLocation.coordinates.lat.toFixed(6)}, {selectedLocation.coordinates.lng.toFixed(6)}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Szczegóły lokalizacji</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-medium">Wybierz lokalizację</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Kliknij na marker na mapie, aby zobaczyć szczegóły lokalizacji.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-4 grid grid-cols-3 gap-4">
          <Card className="col-span-1">
            <CardContent className="p-4 text-center">
              <Building2 className="h-8 w-8 mx-auto text-purple-500" />
              <div className="mt-2 text-2xl font-bold">
                {filteredLocations.filter(loc => loc.type === "site").length}
              </div>
              <div className="text-xs text-muted-foreground">Lokalizacje</div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardContent className="p-4 text-center">
              <Wrench className="h-8 w-8 mx-auto text-orange-500" />
              <div className="mt-2 text-2xl font-bold">
                {filteredLocations.filter(loc => loc.type === "service").length}
              </div>
              <div className="text-xs text-muted-foreground">Zlecenia</div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardContent className="p-4 text-center">
              <User className="h-8 w-8 mx-auto text-cyan-500" />
              <div className="mt-2 text-2xl font-bold">
                {filteredLocations.filter(loc => loc.type === "technician").length}
              </div>
              <div className="text-xs text-muted-foreground">Technicy</div>
            </CardContent>
          </Card>
        </div>

        {/* District statistics */}
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lokalizacje według dzielnic</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {Array.from(
                filteredLocations
                  .filter(loc => loc.meta?.district)
                  .reduce((acc, loc) => {
                    const district = loc.meta?.district as string
                    if (district) {
                      acc.set(district, (acc.get(district) || 0) + 1)
                    }
                    return acc
                  }, new Map<string, number>())
              )
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([district, count]) => (
                  <div key={district} className="flex items-center justify-between">
                    <div className="text-sm">{district}</div>
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: `${Math.min(100, (count / filteredLocations.length) * 100)}%`
                          }}
                        />
                      </div>
                      <span className="ml-2 text-xs text-muted-foreground">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
