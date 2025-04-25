import { createServerClient } from "@/lib/supabase"
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

// Przykładowe dane produktów magazynowych (fallback)
export const fallbackInventoryData: InventoryProduct[] = [
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
  // Więcej przykładowych danych...
]

export async function InventoryServer() {
  try {
    // Pobieranie danych bezpośrednio z Supabase w komponencie serwerowym
    const supabase = await createServerClient()

    console.log("Fetching inventory products data")

    const { data: products, error } = await supabase
      .from('inventory')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error("Error fetching inventory products:", error)
      return <InventoryView initialInventory={fallbackInventoryData} />
    }

    console.log(`Fetched ${products.length} inventory products`)

    // Używamy danych z API lub danych zastępczych, jeśli API zwróci pusty wynik
    const inventoryData = products.length > 0 ? products : fallbackInventoryData

    return <InventoryView initialInventory={inventoryData} />
  } catch (error) {
    console.error("Error fetching inventory products:", error)
    return <InventoryView initialInventory={fallbackInventoryData} />
  }
}
