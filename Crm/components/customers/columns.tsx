"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Building2, User, CheckCircle, XCircle, Mail, Phone } from "lucide-react"
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
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nazwa" />,
    cell: ({ row }) => {
      return (
        <div className="font-medium">{row.getValue("name")}</div>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "tax_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="NIP/PESEL" />,
    cell: ({ row }) => {
      const taxId = row.getValue("tax_id") as string
      return taxId ? <div className="font-mono text-xs">{taxId}</div> : <div className="text-muted-foreground text-xs">Brak</div>
    },
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => {
      const email = row.getValue("email") as string
      return (
        <div className="flex items-center">
          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Telefon" />,
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string
      return (
        <div className="flex items-center">
          <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-mono">{phone}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Typ" />,
    cell: ({ row }) => {
      const type = row.getValue("type") as string

      return (
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={type === "Biznesowy" ? "default" : "outline"} className="flex items-center gap-1">
                  {type === "Biznesowy" ? <Building2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
                  {type}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{type === "Biznesowy" ? "Klient biznesowy" : "Klient indywidualny"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      return (
        <div className="flex items-center">
          <Badge
            variant={status === "Aktywny" ? "default" : status === "Nieaktywny" ? "secondary" : "outline"}
            className="flex items-center gap-1"
          >
            {status === "Aktywny" ?
              <CheckCircle className="h-3 w-3 text-green-500" /> :
              <XCircle className="h-3 w-3 text-red-500" />
            }
            {status}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Data dodania" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      const formattedDate = date.toLocaleDateString("pl-PL")
      const formattedTime = date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-sm">{formattedDate}</div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Dodano: {formattedDate} {formattedTime}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    enableSorting: true,
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(customer.id)}>
              Kopiuj ID
            </DropdownMenuItem>
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
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Usuń klienta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
