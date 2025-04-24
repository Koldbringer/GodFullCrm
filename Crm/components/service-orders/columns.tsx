"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Definicja typu dla danych zlecenia serwisowego
export type ServiceOrder = {
  id: string
  customer_name: string
  site_name: string
  device_model: string
  technician_name: string
  status: string
  created_at: string
  scheduled_date: string
}

export const columns: ColumnDef<ServiceOrder>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "customer_name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Klient
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "site_name",
    header: "Lokalizacja",
  },
  {
    accessorKey: "device_model",
    header: "Urządzenie",
  },
  {
    accessorKey: "technician_name",
    header: "Technik",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      let variant: "default" | "outline" | "secondary" | "destructive" = "default"

      switch (status) {
        case "W trakcie":
          variant = "default"
          break
        case "Zaplanowane":
          variant = "outline"
          break
        case "Zakończone":
          variant = "secondary"
          break
        case "Anulowane":
          variant = "destructive"
          break
      }

      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    accessorKey: "scheduled_date",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Data wizyty
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("scheduled_date"))
      return (
        <div>
          {date.toLocaleDateString("pl-PL")} {date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Otwórz menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Akcje</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id)}>Kopiuj ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edytuj zlecenie</DropdownMenuItem>
            <DropdownMenuItem>Przypisz technika</DropdownMenuItem>
            <DropdownMenuItem>Dodaj dokumenty</DropdownMenuItem>
            <DropdownMenuItem>Zmień status</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Anuluj zlecenie</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
