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
import { DeviceStatusBadge } from "./device-status-badge"

// Definicja typu dla danych urządzenia HVAC
export type Device = {
  id: string
  type: string
  model: string
  serial_number: string
  installation_date: string
  site_name: string
  customer_name: string
  status: string
  last_service_date: string | null
  warranty_end_date: string
}

export const columns: ColumnDef<Device>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Typ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "model",
    header: "Model",
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue("model")}
          <div className="text-xs text-muted-foreground">S/N: {row.original.serial_number}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "customer_name",
    header: "Klient",
    cell: ({ row }) => {
      return (
        <div>
          {row.getValue("customer_name")}
          <div className="text-xs text-muted-foreground">{row.original.site_name.split(" - ")[0]}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "installation_date",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Data instalacji
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("installation_date"))
      return <div>{date.toLocaleDateString("pl-PL")}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <DeviceStatusBadge status={row.getValue("status") as string} />
    },
  },
  {
    accessorKey: "last_service_date",
    header: "Ostatni serwis",
    cell: ({ row }) => {
      const lastService = row.original.last_service_date
      if (!lastService) return <div className="text-muted-foreground text-sm">Brak serwisu</div>

      const date = new Date(lastService)
      return <div>{date.toLocaleDateString("pl-PL")}</div>
    },
  },
  {
    accessorKey: "warranty_end_date",
    header: "Koniec gwarancji",
    cell: ({ row }) => {
      const date = new Date(row.getValue("warranty_end_date"))
      const today = new Date()
      const isExpired = date < today

      return (
        <div className={isExpired ? "text-red-500" : ""}>
          {date.toLocaleDateString("pl-PL")}
          {isExpired && <div className="text-xs">Wygasła</div>}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const device = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(device.id)}>Kopiuj ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Szczegóły urządzenia</DropdownMenuItem>
            <DropdownMenuItem>Historia serwisowa</DropdownMenuItem>
            <DropdownMenuItem>Zaplanuj serwis</DropdownMenuItem>
            <DropdownMenuItem>Edytuj urządzenie</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Usuń urządzenie</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
