"use client"

import { Package } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { InventoryProduct } from "./inventory-table"
import { cn } from "@/lib/utils"

interface InventoryCategoriesProps {
  inventory: InventoryProduct[]
  onCategorySelect: (category: string | null) => void
  selectedCategory: string | null
}

export function InventoryCategories({ inventory, onCategorySelect, selectedCategory }: InventoryCategoriesProps) {
  // Grupowanie produktów według kategorii
  const categories = inventory.reduce(
    (acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = {
          count: 0,
          value: 0,
        }
      }

      acc[product.category].count += 1
      acc[product.category].value += product.price * product.quantity

      return acc
    },
    {} as Record<string, { count: number; value: number }>,
  )

  // Sortowanie kategorii według liczby produktów
  const sortedCategories = Object.entries(categories).sort((a, b) => b[1].count - a[1].count)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kategorie</CardTitle>
        <CardDescription>Filtruj produkty według kategorii</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div
            className={cn(
              "flex justify-between items-center p-2 rounded-md cursor-pointer transition-colors",
              selectedCategory === null ? "bg-primary/10" : "hover:bg-muted",
            )}
            onClick={() => onCategorySelect(null)}
          >
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Wszystkie kategorie</span>
            </div>
            <span className="text-sm text-muted-foreground">{inventory.length}</span>
          </div>

          {sortedCategories.map(([category, data]) => (
            <div
              key={category}
              className={cn(
                "flex justify-between items-center p-2 rounded-md cursor-pointer transition-colors",
                selectedCategory === category ? "bg-primary/10" : "hover:bg-muted",
              )}
              onClick={() => onCategorySelect(category)}
            >
              <span>{category}</span>
              <span className="text-sm text-muted-foreground">{data.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
