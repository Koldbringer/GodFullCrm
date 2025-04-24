"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchIcon, BarcodeIcon, PackageIcon } from "lucide-react"

export function MobileInventory() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Szukaj części..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <BarcodeIcon className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="van" className="w-full">
        <TabsList className="grid grid-cols-2 h-auto">
          <TabsTrigger value="van">W samochodzie</TabsTrigger>
          <TabsTrigger value="warehouse">Magazyn</TabsTrigger>
        </TabsList>

        <TabsContent value="van" className="space-y-4 mt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <InventoryItemCard
              key={i}
              id={`P-${1000 + i}`}
              name={`Filtr powietrza ${i}`}
              category="Filtry"
              quantity={i}
              unit="szt."
              location="Samochód serwisowy"
            />
          ))}
        </TabsContent>

        <TabsContent value="warehouse" className="space-y-4 mt-4">
          {[6, 7, 8, 9, 10].map((i) => (
            <InventoryItemCard
              key={i}
              id={`P-${1000 + i}`}
              name={`Czynnik chłodniczy R${400 + i}`}
              category="Czynniki"
              quantity={i * 2}
              unit="kg"
              location="Magazyn główny"
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface InventoryItemCardProps {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  location: string
}

function InventoryItemCard({ id, name, category, quantity, unit, location }: InventoryItemCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between space-x-4 p-4">
        <div>
          <h3 className="text-sm font-semibold">{name}</h3>
          <p className="text-xs text-muted-foreground">{category}</p>
          <p className="text-xs text-muted-foreground">Lokalizacja: {location}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {quantity} {unit}
          </Badge>
          <PackageIcon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}
\
### Rozbudowa systemu HVAC CRM/ERP według wizji Elona Muska

Kontynuuję rozwój brakujących funkcji, które uzupełnią nasz boski system zarządzania firmą HVAC. Zaimplementuję kluczowe moduły, które sprawią, że system będzie kompletny i rewolucyjny.

## 1. Zarządzanie pracownikami i technikami
