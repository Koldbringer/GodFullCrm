// import { createServerClient } from "@/lib/supabase"
import { InventoryView } from "@/components/inventory/inventory-view"

// Typ danych dla produktu magazynowego
export type InventoryProduct = {
  id: string
  name: string
  category: string
  sku: string
  quantity: number
  unit: string
  min_quantity: number
  price: number
  supplier: string
  location: string
  last_restock: string
}

// Static data for Docker build
export const staticInventoryData: InventoryProduct[] = [
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
    name: "Sprężarka rotacyjna",
    category: "Części zamienne",
    sku: "CZ-SPR-003",
    quantity: 12,
    unit: "szt.",
    min_quantity: 3,
    price: 450.00,
    supplier: "HVAC Parts Ltd.",
    location: "C-02-4",
    last_restock: "2023-10-10T09:15:00Z",
  },
  {
    id: "INV004",
    name: "Rura miedziana 1/4\"",
    category: "Instalacyjne",
    sku: "INS-RM-004",
    quantity: 150,
    unit: "m",
    min_quantity: 50,
    price: 15.75,
    supplier: "CopperTech S.A.",
    location: "D-10-2",
    last_restock: "2023-09-15T11:30:00Z",
  }
]

export async function InventoryServer() {
  // In production, this would fetch from Supabase
  // For Docker build, we're using static data
  console.log("Using static inventory data for Docker build")
  
  return <InventoryView initialInventory={staticInventoryData} />
}
