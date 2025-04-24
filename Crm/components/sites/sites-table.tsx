"use client"

import { useState } from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { ArrowUpDown, Building2, Home, MapPin, MoreHorizontal, Store } from "lucide-react"
import Link from "next/link"

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

// Typ dla lokalizacji
export interface Site {
  id: string
  name: string
  street: string
  customer_name: string
  customer_id: string
  type: string
  area: number
  devices_count: number
  latitude: number | null
  longitude: number | null
  last_visit: string | null
  next_visit: string | null
}

interface SitesTableProps {
  sites: Site[]
  loading?: boolean
}

export function SitesTable({ sites, loading = false }: SitesTableProps) {
  const [sortField, setSortField] = useState<keyof Site>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Funkcja do sortowania
  const toggleSort = (field: keyof Site) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Sortowanie lokalizacji
  const sortedSites = [...sites].sort((a, b) => {
    if (sortField === "last_visit" || sortField === "next_visit") {
      const aValue = a[sortField] ? new Date(a[sortField] as string).getTime() : 0
      const bValue = b[sortField] ? new Date(b[sortField] as string).getTime() : 0
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

  // Ikona dla typu lokalizacji
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Biuro":
        return <Building2 className="h-4 w-4 text-blue-500" />
      case "Dom":
        return <Home className="h-4 w-4 text-green-500" />
      case "Mieszkanie":
        return <Home className="h-4 w-4 text-yellow-500" />
      case "Lokal usługowy":
        return <Store className="h-4 w-4 text-purple-500" />
      default:
        return <MapPin className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">
              <Button variant="ghost" onClick={() => toggleSort("name")} className="flex items-center gap-1">
                Nazwa
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Adres</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => toggleSort("customer_name")} className="flex items-center gap-1">
                Klient
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => toggleSort("type")} className="flex items-center gap-1">
                Typ
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" onClick={() => toggleSort("devices_count")} className="flex items-center gap-1">
                Urządzenia
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => toggleSort("next_visit")} className="flex items-center gap-1">
                Następna wizyta
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Akcje</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSites.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Brak lokalizacji spełniających kryteria wyszukiwania.
              </TableCell>
            </TableRow>
          ) : (
            sortedSites.map((site) => (
              <TableRow key={site.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(site.type)}
                    <Link href={`/sites/${site.id}`} className="hover:underline">
                      {site.name}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>{site.street}</TableCell>
                <TableCell>
                  <Link href={`/customers/${site.customer_id}`} className="hover:underline">
                    {site.customer_name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{site.type}</Badge>
                </TableCell>
                <TableCell className="text-right">{site.devices_count}</TableCell>
                <TableCell>
                  {site.next_visit ? (
                    format(new Date(site.next_visit), "d MMMM yyyy", { locale: pl })
                  ) : (
                    <span className="text-muted-foreground">Nie zaplanowano</span>
                  )}
                </TableCell>
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
                      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(site.id)}>
                        Kopiuj ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href={`/sites/${site.id}`}>Szczegóły lokalizacji</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edytuj lokalizację</DropdownMenuItem>
                      <DropdownMenuItem>Pokaż urządzenia</DropdownMenuItem>
                      <DropdownMenuItem>Zaplanuj wizytę</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Usuń lokalizację</DropdownMenuItem>
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
