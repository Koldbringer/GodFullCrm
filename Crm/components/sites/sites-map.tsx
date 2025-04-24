"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Site } from "./sites-table"

interface SitesMapProps {
  sites: Site[]
}

export function SitesMap({ sites }: SitesMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Symulacja ładowania mapy
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <div ref={mapRef} className="w-full h-[500px] rounded-md border bg-muted relative overflow-hidden">
          {!mapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Symulacja mapy */}
              <div className="absolute inset-0 bg-[#f0f0f0]">
                {/* Symulacja pinezek na mapie */}
                {sites.map((site) => (
                  <div
                    key={site.id}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110"
                    style={{
                      left: `${(((site.coordinates?.lng || 0) + 180) / 360) * 100}%`,
                      top: `${((90 - (site.coordinates?.lat || 0)) / 180) * 100}%`,
                    }}
                    onClick={() => setSelectedSite(site)}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center ${
                          selectedSite?.id === site.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-background text-foreground border"
                        }`}
                      >
                        {site.devices_count || 0}
                      </div>
                      <MapPin
                        className={`h-8 w-8 -mt-1 ${selectedSite?.id === site.id ? "text-primary" : "text-foreground"}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Informacja o wybranej lokalizacji */}
              {selectedSite && (
                <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-72 bg-background p-4 rounded-md shadow-lg border">
                  <div className="flex justify-between items-start">
                    <div className="font-medium">{selectedSite.name}</div>
                    <Badge variant="outline">{selectedSite.type}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{selectedSite.address}</div>
                  <div className="text-sm mt-2">
                    Klient: <span className="font-medium">{selectedSite.customer_name || selectedSite.customers?.name || "Brak danych"}</span>
                  </div>
                  <div className="text-sm">
                    Urządzenia: <span className="font-medium">{selectedSite.devices_count || 0}</span>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button size="sm" variant="outline" asChild>
                      <a href={`/sites/${selectedSite.id}`}>Szczegóły</a>
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Lista lokalizacji</CardTitle>
            <CardDescription>Kliknij na lokalizację, aby zobaczyć ją na mapie</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto">
            <div className="space-y-2">
              {sites.map((site) => (
                <div
                  key={site.id}
                  className={`p-2 rounded-md cursor-pointer transition-colors ${
                    selectedSite?.id === site.id ? "bg-primary/10" : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedSite(site)}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{site.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground ml-6">{site.address}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
