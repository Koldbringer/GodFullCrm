"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { ArrowUpDown, MoreHorizontal, Package } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { getTickets } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "@/components/atoms/status-badge"
import { TicketsFilterBar } from "@/components/organisms/tickets-filter-bar"

// Przykładowe dane zgłoszeń na wypadek błędu API
const fallbackTicketsData = [
  {
    id: "TKT-001",
    title: "Awaria klimatyzacji w biurze",
    status: "open",
    priority: "high",
    created_at: "2023-10-15T10:30:00Z",
    customer: {
      id: "c1",
      name: "Firma ABC",
    },
    site: {
      id: "s1",
      name: "Biuro główne",
    },
    device: {
      id: "d1",
      type: "Klimatyzator",
      model: "Samsung WindFree",
    },
    technician: {
      id: "t1",
      name: "Jan Kowalski",
    },
    scheduled_date: "2023-10-17T09:00:00Z",
  },
  {
    id: "TKT-002",
    title: "Przegląd okresowy systemu wentylacji",
    status: "scheduled",
    priority: "medium",
    created_at: "2023-10-14T14:45:00Z",
    customer: {
      id: "c2",
      name: "Restauracja XYZ",
    },
    site: {
      id: "s2",
      name: "Sala główna",
    },
    device: {
      id: "d2",
      type: "System wentylacji",
      model: "Daikin VRV IV",
    },
    technician: {
      id: "t2",
      name: "Anna Nowak",
    },
    scheduled_date: "2023-10-20T11:00:00Z",
  },
  {
    id: "TKT-003",
    title: "Montaż nowej pompy ciepła",
    status: "in_progress",
    priority: "medium",
    created_at: "2023-10-10T09:15:00Z",
    customer: {
      id: "c3",
      name: "Jan Nowak",
    },
    site: {
      id: "s3",
      name: "Dom jednorodzinny",
    },
    device: {
      id: "d3",
      type: "Pompa ciepła",
      model: "Viessmann Vitocal 200-S",
    },
    technician: null,
    scheduled_date: "2023-10-16T10:00:00Z",
  }
];

export function TicketsList() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null)
  const [sortField, setSortField] = useState<string>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Pobieranie danych z API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getTickets()
        setTickets(data)
      } catch (error) {
        console.error('Error fetching tickets:', error)
        setTickets(fallbackTicketsData)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  // Funkcja do sortowania
  const toggleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Filtrowanie zgłoszeń
  const filteredTickets = tickets.filter(
    (ticket) =>
      (statusFilter === null || ticket.status === statusFilter) &&
      (priorityFilter === null || ticket.priority === priorityFilter) &&
      (searchQuery === "" ||
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ticket.customer?.name && ticket.customer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ticket.device?.model && ticket.device.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Sortowanie zgłoszeń
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    let aValue, bValue

    switch (sortField) {
      case "id":
        aValue = a.id
        bValue = b.id
        break
      case "title":
        aValue = a.title
        bValue = b.title
        break
      case "customer":
        aValue = a.customer?.name || ''
        bValue = b.customer?.name || ''
        break
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
        bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0
        break
      case "status":
        const statusOrder = { open: 4, in_progress: 3, scheduled: 2, closed: 1 }
        aValue = statusOrder[a.status as keyof typeof statusOrder] || 0
        bValue = statusOrder[b.status as keyof typeof statusOrder] || 0
        break
      case "created_at":
      default:
        aValue = new Date(a.created_at).getTime()
        bValue = new Date(b.created_at).getTime()
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return sortDirection === "asc" ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue)
  })

  // Funkcje pomocnicze

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Wysoki</Badge>
      case "medium":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Średni</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Niski</Badge>
      default:
        return <Badge>{priority}</Badge>
    }
  }

  // Obsługa filtrów z komponentu TicketsFilterBar
  const handleFilterChange = (filters: { status: string | null; search: string }) => {
    setStatusFilter(filters.status)
    setSearchQuery(filters.search)
  }

  return (
    <div className="space-y-4">
      <TicketsFilterBar onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button variant="ghost" onClick={() => toggleSort("id")} className="flex items-center gap-1">
                  ID
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort("title")} className="flex items-center gap-1">
                  Tytuł
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort("customer")} className="flex items-center gap-1">
                  Klient
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort("status")} className="flex items-center gap-1">
                  Status
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort("priority")} className="flex items-center gap-1">
                  Priorytet
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Urządzenie</TableHead>
              <TableHead>Przypisany</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort("created_at")} className="flex items-center gap-1">
                  Data utworzenia
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Brak zgłoszeń spełniających kryteria wyszukiwania.
                </TableCell>
              </TableRow>
            ) : (
              sortedTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>
                    <Link href={`/tickets/${ticket.id}`} className="hover:underline">
                      {ticket.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/customers/${ticket.customer_id}`} className="hover:underline">
                      {ticket.customer?.name || "Nieznany klient"}
                    </Link>
                  </TableCell>
                  <TableCell><StatusBadge status={ticket.status} /></TableCell>
                  <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {ticket.device?.type || "Nieznane"}: {ticket.device?.model ? ticket.device.model.split(" ")[0] : ""}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {ticket.technician ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            {ticket.technician.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{ticket.technician.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Nieprzypisany</span>
                    )}
                  </TableCell>
                  <TableCell>{format(new Date(ticket.created_at), "d MMM yyyy", { locale: pl })}</TableCell>
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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(ticket.id)}>
                          Kopiuj ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link href={`/tickets/${ticket.id}`}>Szczegóły zgłoszenia</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edytuj zgłoszenie</DropdownMenuItem>
                        <DropdownMenuItem>Przypisz technika</DropdownMenuItem>
                        <DropdownMenuItem>Zmień status</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Usuń zgłoszenie</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      )}
    </div>
  )
}
