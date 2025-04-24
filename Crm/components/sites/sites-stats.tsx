"use client"

import { Building2, Home, Store } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Site } from "./sites-table"

interface SitesStatsProps {
  sites: Site[]
  onTypeSelect: (type: string | null) => void
  selectedType: string | null
}

export function SitesStats({ sites, onTypeSelect, selectedType }: SitesStatsProps) {
  // Obliczanie statystyk
  const totalSites = sites.length
  const totalDevices = sites.reduce((sum, site) => sum + site.devices_count, 0)
  const totalArea = sites.reduce((sum, site) => sum + site.area, 0)

  // Liczba lokalizacji według typu
  const sitesByType = sites.reduce(
    (acc, site) => {
      acc[site.type] = (acc[site.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Funkcja do wybierania typu
  const handleTypeClick = (type: string) => {
    if (selectedType === type) {
      onTypeSelect(null)
    } else {
      onTypeSelect(type)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card
        className={`cursor-pointer transition-colors ${selectedType === "Biuro" ? "bg-primary/10" : ""}`}
        onClick={() => handleTypeClick("Biuro")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Biura</CardTitle>
          <Building2 className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sitesByType["Biuro"] || 0}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round(((sitesByType["Biuro"] || 0) / totalSites) * 100)}% wszystkich lokalizacji
          </p>
        </CardContent>
      </Card>

      <Card
        className={`cursor-pointer transition-colors ${selectedType === "Dom" ? "bg-primary/10" : ""}`}
        onClick={() => handleTypeClick("Dom")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Domy</CardTitle>
          <Home className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sitesByType["Dom"] || 0}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round(((sitesByType["Dom"] || 0) / totalSites) * 100)}% wszystkich lokalizacji
          </p>
        </CardContent>
      </Card>

      <Card
        className={`cursor-pointer transition-colors ${selectedType === "Mieszkanie" ? "bg-primary/10" : ""}`}
        onClick={() => handleTypeClick("Mieszkanie")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mieszkania</CardTitle>
          <Home className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sitesByType["Mieszkanie"] || 0}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round(((sitesByType["Mieszkanie"] || 0) / totalSites) * 100)}% wszystkich lokalizacji
          </p>
        </CardContent>
      </Card>

      <Card
        className={`cursor-pointer transition-colors ${selectedType === "Lokal usługowy" ? "bg-primary/10" : ""}`}
        onClick={() => handleTypeClick("Lokal usługowy")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lokale usługowe</CardTitle>
          <Store className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sitesByType["Lokal usługowy"] || 0}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round(((sitesByType["Lokal usługowy"] || 0) / totalSites) * 100)}% wszystkich lokalizacji
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
