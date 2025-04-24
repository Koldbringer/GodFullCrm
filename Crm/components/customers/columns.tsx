"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"

// Definicja typu dla danych klienta w tabeli
export type CustomerTableData = {
  id: string
  name: string
  tax_id: string
  email: string
  phone: string
  type: string
  status: string
  created_at: string
}

export const columns: ColumnDef<CustomerTableData>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nazwa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "tax_id",
    header: "NIP/PESEL",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Telefon",
  },
  {
    accessorKey: "type",
    header: "Typ",
    cell: ({ row }) => {
      const type = row.getValue("type") as string

      return (
        <Badge variant={type === "Biznesowy" ? "default" : "outline"}>
          {type}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      return (
        <Badge variant={status === "Aktywny" ? "default" : status === "Nieaktywny" ? "secondary" : "outline"}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Data dodania
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      return <div>{date.toLocaleDateString("pl-PL")}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(customer.id)}>Kopiuj ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/customers/${customer.id}`}>Szczegóły klienta</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/customers/${customer.id}/edit`}>Edytuj klienta</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/customers/${customer.id}?tab=service`}>Pokaż zlecenia</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/customers/${customer.id}?tab=devices`}>Pokaż urządzenia</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Usuń klienta</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
