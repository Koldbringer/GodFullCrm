"use client"

import { Package, AlertTriangle, TrendingDown, Truck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { InventoryProduct } from "./inventory-table"

interface InventoryStatsProps {
  inventory: InventoryProduct[]
}

export function InventoryStats({ inventory }: InventoryStatsProps) {
  // Obliczanie statystyk
  const totalProducts = inventory.length
  const totalItems = inventory.reduce((sum, product) => sum + product.quantity, 0)
  const lowStockProducts = inventory.filter((product) => product.quantity <= product.min_quantity).length
  const totalValue = inventory.reduce((sum, product) => sum + product.price * product.quantity, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Produkty w magazynie</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <p className="text-xs text-muted-foreground">Łącznie {totalItems} sztuk/jednostek</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Niski stan magazynowy</CardTitle>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lowStockProducts}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((lowStockProducts / totalProducts) * 100)}% produktów wymaga uzupełnienia
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wartość magazynu</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalValue.toFixed(2)} zł</div>
          <p className="text-xs text-muted-foreground">
            Średnio {(totalValue / totalProducts).toFixed(2)} zł na produkt
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dostawy</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">Oczekujące dostawy w tym tygodniu</p>
        </CardContent>
      </Card>
    </div>
  )
}
