"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InventoryTable } from "@/components/inventory/inventory-table"
import { InventoryStats } from "@/components/inventory/inventory-stats"
import { InventoryCategories } from "@/components/inventory/inventory-categories"

// Przykładowe dane produktów magazynowych
export const inventoryData = [
  {
    id: "INV001",
    name: "Filtr powietrza HEPA",
    category: "Filtry",
    sku: "FIL-HEPA-001",
    quantity: 45,
    unit: "szt.",
    min_quantity: 10,
    price: 29.99,
    supplier: "CleanAir Sp. z o.o.",
    location: "A-12-3",
    last_restock: "2023-10-05T10:00:00Z",
  },
  {
    id: "INV002",
    name: "Czynnik chłodniczy R32",
    category: "Czynniki chłodnicze",
    sku: "CHM-R32-002",
    quantity: 8,
    unit: "kg",
    min_quantity: 5,
    price: 120.5,
    supplier: "ChillChem Sp. z o.o.",
    location: "B-05-1",
    last_restock: "2023-09-20T14:30:00Z",
  },
  {
    id: "INV003",
    name: "Sprężarka rotacyjna 2.5kW",
    category: "Sprężarki",
    sku: "SPR-ROT-003",
    quantity: 3,
    unit: "szt.",
    min_quantity: 2,
    price: 450.0,
    supplier: "CoolParts S.A.",
    location: "C-02-4",
    last_restock: "2023-08-15T09:15:00Z",
  },
  {
    id: "INV004",
    name: "Wentylator osiowy 120mm",
    category: "Wentylatory",
    sku: "WEN-OSI-004",
    quantity: 22,
    unit: "szt.",
    min_quantity: 8,
    price: 35.75,
    supplier: "AirFlow Sp. z o.o.",
    location: "A-08-2",
    last_restock: "2023-10-10T11:45:00Z",
  },
  {
    id: "INV005",
    name: "Termostat elektroniczny",
    category: "Sterowanie",
    sku: "STE-TER-005",
    quantity: 15,
    unit: "szt.",
    min_quantity: 5,
    price: 85.2,
    supplier: "TechControl S.A.",
    location: "D-03-1",
    last_restock: "2023-09-28T13:20:00Z",
  },
  {
    id: "INV006",
    name: 'Rura miedziana 1/4" (6.35mm)',
    category: "Rury i złączki",
    sku: "RUR-MIE-006",
    quantity: 120,
    unit: "m",
    min_quantity: 30,
    price: 12.8,
    supplier: "CopperTech Sp. z o.o.",
    location: "B-01-3",
    last_restock: "2023-10-02T10:10:00Z",
  },
  {
    id: "INV007",
    name: "Izolacja termiczna 10mm",
    category: "Izolacje",
    sku: "IZO-TER-007",
    quantity: 85,
    unit: "m",
    min_quantity: 20,
    price: 8.5,
    supplier: "IsoTherm Sp. z o.o.",
    location: "A-04-2",
    last_restock: "2023-09-15T15:30:00Z",
  },
  {
    id: "INV008",
    name: "Zawór rozprężny",
    category: "Zawory",
    sku: "ZAW-ROZ-008",
    quantity: 7,
    unit: "szt.",
    min_quantity: 3,
    price: 95.0,
    supplier: "CoolParts S.A.",
    location: "C-06-1",
    last_restock: "2023-08-25T09:45:00Z",
  },
  {
    id: "INV009",
    name: "Olej do sprężarek",
    category: "Oleje i smary",
    sku: "OLE-SPR-009",
    quantity: 12,
    unit: "l",
    min_quantity: 4,
    price: 45.3,
    supplier: "LubeTech Sp. z o.o.",
    location: "D-07-3",
    last_restock: "2023-10-08T14:15:00Z",
  },
  {
    id: "INV010",
    name: "Wspornik montażowy",
    category: "Akcesoria montażowe",
    sku: "AKC-WSP-010",
    quantity: 38,
    unit: "szt.",
    min_quantity: 10,
    price: 22.5,
    supplier: "MountPro Sp. z o.o.",
    location: "B-09-2",
    last_restock: "2023-09-22T11:30:00Z",
  },
]

export function InventoryView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Filtrowanie produktów
  const filteredProducts = inventoryData.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.supplier.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory ? product.category === selectedCategory : true

    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-4">
      <InventoryStats inventory={inventoryData} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <InventoryCategories
            inventory={inventoryData}
            onCategorySelect={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
        </div>

        <div className="md:col-span-3">
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Wszystkie produkty</TabsTrigger>
              <TabsTrigger value="low">Niski stan</TabsTrigger>
              <TabsTrigger value="recent">Ostatnio uzupełnione</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Szukaj produktu, SKU lub dostawcy..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <InventoryTable products={filteredProducts} filter="all" />
            </TabsContent>

            <TabsContent value="low" className="space-y-4">
              <InventoryTable products={filteredProducts.filter((p) => p.quantity <= p.min_quantity)} filter="low" />
            </TabsContent>

            <TabsContent value="recent" className="space-y-4">
              <InventoryTable
                products={filteredProducts
                  .sort((a, b) => new Date(b.last_restock).getTime() - new Date(a.last_restock).getTime())
                  .slice(0, 5)}
                filter="recent"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
