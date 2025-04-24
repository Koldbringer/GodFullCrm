"use client"

import { useState } from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { ArrowUpDown, MoreHorizontal, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Typ dla produktu magazynowego
export interface InventoryProduct {
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

interface InventoryTableProps {
  products: InventoryProduct[]
  filter: "all" | "low" | "recent"
}

export function InventoryTable({ products, filter }: InventoryTableProps) {
  const [sortField, setSortField] = useState<keyof InventoryProduct>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Funkcja do sortowania
  const toggleSort = (field: keyof InventoryProduct) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Sortowanie produktów
  const sortedProducts = [...products].sort((a, b) => {
    if (sortField === "last_restock") {
      const aValue = new Date(a.last_restock).getTime()
      const bValue = new Date(b.last_restock).getTime()
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  // Funkcja do określania statusu ilości
  const getQuantityStatus = (product: InventoryProduct) => {
    if (product.quantity <= 0) {
      return "danger"
    } else if (product.quantity <= product.min_quantity) {
      return "warning"
    } else {
      return "success"
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">
              <Button variant="ghost" onClick={() => toggleSort("name")} className="flex items-center gap-1">
                Nazwa produktu
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => toggleSort("category")} className="flex items-center gap-1">
                Kategoria
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => toggleSort("quantity")} className="flex items-center gap-1">
                Ilość
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => toggleSort("price")} className="flex items-center gap-1">
                Cena
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Lokalizacja</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => toggleSort("last_restock")} className="flex items-center gap-1">
                Ostatnie uzupełnienie
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Akcje</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Brak produktów spełniających kryteria wyszukiwania.
              </TableCell>
            </TableRow>
          ) : (
            sortedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    {product.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{product.category}</Badge>
                </TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        getQuantityStatus(product) === "danger"
                          ? "destructive"
                          : getQuantityStatus(product) === "warning"
                            ? "outline"
                            : "default"
                      }
                    >
                      {product.quantity} {product.unit}
                    </Badge>
                    {product.quantity <= product.min_quantity && (
                      <span className="text-xs text-muted-foreground">(min: {product.min_quantity})</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{product.price.toFixed(2)} zł</TableCell>
                <TableCell>{product.location}</TableCell>
                <TableCell>{format(new Date(product.last_restock), "d MMM yyyy", { locale: pl })}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Otwórz menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.id)}>
                        Kopiuj ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Edytuj produkt</DropdownMenuItem>
                      <DropdownMenuItem>Uzupełnij stan</DropdownMenuItem>
                      <DropdownMenuItem>Historia zmian</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Usuń produkt</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
