"use client"

import { useState, useEffect } from "react"
import { MapPin } from "lucide-react"
import { getSites } from "@/lib/api"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SitesTable } from "@/components/sites/sites-table"
import { SitesMap } from "@/components/sites/sites-map"
import { SitesStats } from "@/components/sites/sites-stats"
import { HeatmapMap } from "@/components/sites/heatmap-map"
import LocationsSection from "@/components/sites/locations-section"

export function SitesView() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [districts, setDistricts] = useState<string[]>([])
  const [buildingTypes, setBuildingTypes] = useState<string[]>([])
  const [heatmapMode, setHeatmapMode] = useState(false)
  const [sites, setSites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Pobieranie lokalizacji z API
  useEffect(() => {
    const fetchSites = async () => {
      setLoading(true)
      try {
        const data = await getSites()
        setSites(data)
      } catch (error) {
        console.error('Error fetching sites:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSites()
  }, [])

  // Dynamiczne filtrowanie lokalizacji
  const filteredSites = sites.filter((site) => {
    const matchDistrict = districts.length === 0 || districts.includes(site.district || "")
    const matchType = buildingTypes.length === 0 || buildingTypes.includes(site.type || "")
    return matchDistrict && matchType && (!selectedType || site.type === selectedType)
  })

  // Prosta symulacja danych do heatmapy
  const heatmapData = filteredSites.map(site => ({
    lat: site.coordinates?.lat ?? site.lat,
    lng: site.coordinates?.lng ?? site.lng,
    intensity: Math.random() * 0.7 + 0.3 // demo: losowa intensywność
  }))

  return (
    <div className="space-y-4">
      <SitesStats sites={sites} onTypeSelect={setSelectedType} selectedType={selectedType} />
      <div className="flex items-center gap-4 pb-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={heatmapMode} onChange={e => setHeatmapMode(e.target.checked)} />
          <span className="text-sm">Tryb heatmapy</span>
        </label>
      </div>
      <Tabs defaultValue="map" className="space-y-4">
        <TabsList>
          <TabsTrigger value="map">Mapa</TabsTrigger>
          <TabsTrigger value="table">Tabela</TabsTrigger>
        </TabsList>
        <TabsContent value="map">
          <LocationsSection
            selectedDistricts={districts}
            selectedBuildingTypes={buildingTypes}
            onFilterChange={(d, t) => {
              setDistricts(d)
              setBuildingTypes(t)
            }}
          />
          {loading ? (
            <div className="flex items-center justify-center h-96 text-muted-foreground">Ładowanie lokalizacji...</div>
          ) : heatmapMode ? (
            <HeatmapMap sites={filteredSites.map(site => site.coordinates ?? { lat: site.lat, lng: site.lng })} heatmapData={heatmapData} />
          ) : (
            <SitesMap sites={filteredSites} />
          )}
        </TabsContent>
        <TabsContent value="table">
          <SitesTable sites={filteredSites} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
