"use client"

import Link from "next/link"
import { Building2, Home, MapPin, MoreHorizontal, Store } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Przykładowe dane lokalizacji
const sitesData = [
  {
    id: "site1",
    name: "Biuro główne",
    address: "ul. Warszawska 10, 00-001 Warszawa",
    customer_id: "c1",
    type: "Biuro",
    area: 120,
    devices_count: 3,
    coordinates: { lat: 52.2297, lng: 21.0122 },
    last_visit: "2023-09-15T14:00:00Z",
    next_visit: "2023-12-15T10:00:00Z",
  },
  {
    id: "site2",
    name: "Dom jednorodzinny",
    address: "ul. Kwiatowa 5, 05-500 Piaseczno",
    customer_id: "c2",
    type: "Dom",
    area: 180,
    devices_count: 2,
    coordinates: { lat: 52.0697, lng: 21.0222 },
    last_visit: "2023-10-05T10:30:00Z",
    next_visit: "2024-01-05T11:00:00Z",
  },
]

interface CustomerSitesProps {
  customerId: string
}

export function CustomerSites({ customerId }: CustomerSitesProps) {
  // Filtrowanie lokalizacji dla danego klienta
  const customerSites = sitesData.filter((site) => site.customer_id === customerId)

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
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customerSites.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <p className="mb-4 text-muted-foreground">Brak lokalizacji dla tego klienta.</p>
              <Button>Dodaj pierwszą lokalizację</Button>
            </CardContent>
          </Card>
        ) : (
          customerSites.map((site) => (
            <Card key={site.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(site.type)}
                    <h4 className="font-medium">{site.name}</h4>
                  </div>
                  <Badge variant="outline">{site.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{site.address}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Powierzchnia:</span>
                    <span className="ml-2 font-medium">{site.area} m²</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Urządzenia:</span>
                    <span className="ml-2 font-medium">{site.devices_count}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ostatnia wizyta:</span>
                    <span className="ml-2 font-medium">
                      {site.last_visit ? new Date(site.last_visit).toLocaleDateString("pl-PL") : "Brak"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Następna wizyta:</span>
                    <span className="ml-2 font-medium">
                      {site.next_visit ? new Date(site.next_visit).toLocaleDateString("pl-PL") : "Nie zaplanowano"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/sites/${site.id}`}>Szczegóły</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {customerSites.length > 0 && (
        <div className="rounded-md border mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nazwa</TableHead>
                <TableHead>Adres</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Powierzchnia</TableHead>
                <TableHead>Urządzenia</TableHead>
                <TableHead>Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerSites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(site.type)}
                      <Link href={`/sites/${site.id}`} className="hover:underline">
                        {site.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>{site.address}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{site.type}</Badge>
                  </TableCell>
                  <TableCell>{site.area} m²</TableCell>
                  <TableCell>{site.devices_count}</TableCell>
                  <TableCell>
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
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
