"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { AlertCircle, CheckCircle2, Clock, MoreHorizontal, Package, Plus, Loader2 } from "lucide-react"
import { StatusBadge } from "@/components/atoms/status-badge"
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd'
import Link from "next/link"
import { toast } from "sonner"
import "@/styles/kanban.css"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { updateTicket } from "@/lib/api"
import { createClient } from "@/lib/supabase"
import { fallbackTicketsData } from "./tickets-server"

interface TicketsKanbanProps {
  initialTickets?: any[]
}

// Przykładowe dane zgłoszeń są teraz importowane z tickets-server.tsx

// Mapowanie statusów z bazy danych na statusy w UI
const statusMapping = {
  open: "open",
  in_progress: "in-progress",
  scheduled: "scheduled",
  closed: "closed"
}

// Mapowanie statusów z UI na statusy w bazie danych
const reverseStatusMapping = {
  "open": "open",
  "in-progress": "in_progress",
  "scheduled": "scheduled",
  "closed": "closed"
}

type Ticket = any

export function TicketsKanban({ initialTickets = [] }: TicketsKanbanProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets.length > 0 ? initialTickets : fallbackTicketsData)
  const [loading, setLoading] = useState(false)
  const [updatingTicket, setUpdatingTicket] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [ticketsByStatus, setTicketsByStatus] = useState<Record<string, Ticket[]>>(() => ({
    open: [],
    "in-progress": [],
    scheduled: [],
    closed: [],
  }))

  // Inicjalizacja danych
  useEffect(() => {
    // Ustawienie danych początkowych
    setTickets(initialTickets.length > 0 ? initialTickets : fallbackTicketsData)

    // Create a Supabase client instance
    const supabase = createClient()

    // Subskrypcja na zmiany w tabeli tickets
    const ticketsSubscription = supabase
      .channel('tickets-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'tickets' },
        async (payload) => {
          console.log('Zmiana w tabeli tickets:', payload)
          // Odświeżenie danych po zmianie
          const data = await getTickets()
          setTickets(data)
        }
      )
      .subscribe()

    // Czyszczenie subskrypcji przy odmontowaniu komponentu
    return () => {
      supabase.removeChannel(ticketsSubscription)
    }
  }, [])

  // Filtrowanie zgłoszeń
  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.customer?.name && ticket.customer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ticket.device?.model && ticket.device.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return

    // Pobierz ID przeciąganego zgłoszenia
    const ticketId = result.draggableId
    setUpdatingTicket(ticketId)

    if (source.droppableId === destination.droppableId) {
      // Zmiana kolejności w tej samej kolumnie
      const col = Array.from(ticketsByStatus[source.droppableId])
      const [moved] = col.splice(source.index, 1)
      col.splice(destination.index, 0, moved)
      setTicketsByStatus({ ...ticketsByStatus, [source.droppableId]: col })
    } else {
      // Zmiana statusu zgłoszenia
      const sourceCol = Array.from(ticketsByStatus[source.droppableId])
      const [moved] = sourceCol.splice(source.index, 1)

      // Nowy status w formacie bazy danych
      const newStatus = reverseStatusMapping[destination.droppableId]

      try {
        // Aktualizacja w bazie danych
        await updateTicket(ticketId, {
          status: newStatus,
          updated_at: new Date().toISOString()
        })

        // Aktualizacja lokalnego stanu
        moved.status = newStatus
        const destCol = Array.from(ticketsByStatus[destination.droppableId])
        destCol.splice(destination.index, 0, moved)
        setTicketsByStatus({
          ...ticketsByStatus,
          [source.droppableId]: sourceCol,
          [destination.droppableId]: destCol,
        })

        toast.success(`Status zgłoszenia ${ticketId} zmieniony na ${destination.droppableId}`)
      } catch (error) {
        console.error('Error updating ticket status:', error)
        toast.error("Błąd podczas aktualizacji statusu zgłoszenia")

        // Przywróć oryginalny stan w przypadku błędu
        setTicketsByStatus({
          ...ticketsByStatus
        })
      } finally {
        setUpdatingTicket(null)
      }
    }
  }

  // Aktualizuj kolumny po filtrowaniu zgłoszeń
  useEffect(() => {
    setTicketsByStatus({
      open: filteredTickets.filter((t) => statusMapping[t.status] === "open"),
      "in-progress": filteredTickets.filter((t) => statusMapping[t.status] === "in-progress"),
      scheduled: filteredTickets.filter((t) => statusMapping[t.status] === "scheduled"),
      closed: filteredTickets.filter((t) => statusMapping[t.status] === "closed"),
    })
  }, [filteredTickets])

  // Funkcja do określania koloru priorytetu
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  // Funkcja do określania tekstu priorytetu
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "Wysoki"
      case "medium":
        return "Średni"
      case "low":
        return "Niski"
      default:
        return priority
    }
  }

  // Komponent karty zgłoszenia
  const TicketCard = ({ ticket }: { ticket: Ticket }) => (
    <Card className={`mb-3 ${updatingTicket === ticket.id ? 'opacity-50' : ''}`}>
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          <Badge className={getPriorityColor(ticket.priority)} variant="outline">
            {getPriorityText(ticket.priority)}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Otwórz menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Akcje</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href={`/tickets/${ticket.id}`} className="w-full">Szczegóły zgłoszenia</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Edytuj zgłoszenie</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Zmień status</DropdownMenuItem>
              <DropdownMenuItem>Przypisz technika</DropdownMenuItem>
              <DropdownMenuItem>Zaplanuj wizytę</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="font-medium text-sm mb-2">{ticket.title}</h3>
        <div className="text-xs text-muted-foreground mb-2">
          {ticket.id} • {format(new Date(ticket.created_at), "d MMM", { locale: pl })}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Package className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs truncate">
            {ticket.device?.type || "Nieznane"}: {ticket.device?.model ? ticket.device.model.split(" ")[0] : ""}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Avatar className="h-5 w-5">
              <AvatarFallback>
                {ticket.customer?.name
                  ? ticket.customer.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                  : "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs">{ticket.customer?.name ? ticket.customer.name.split(" ")[0] : "Nieznany"}</span>
          </div>

          {ticket.technician && (
            <div className="flex items-center gap-1">
              <Avatar className="h-5 w-5">
                <AvatarFallback>
                  {ticket.technician.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs">{ticket.technician.name.split(" ")[0]}</span>
            </div>
          )}
        </div>

        {updatingTicket === ticket.id && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Szukaj zgłoszenia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-8" />
                </div>
                <div className="bg-muted/50 p-2 rounded-md min-h-[500px]">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-32 w-full mb-3" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(ticketsByStatus).map(([status, tickets]) => (
              <Droppable droppableId={status} key={status}>
                {(provided: DroppableProvided) => (
                  <div className="space-y-2" ref={provided.innerRef} {...provided.droppableProps}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {status === "open" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                        {status === "in-progress" && <Clock className="h-4 w-4 text-blue-500" />}
                        {status === "scheduled" && <Clock className="h-4 w-4 text-purple-500" />}
                        {status === "closed" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        <h3 className="font-medium">{status.charAt(0).toUpperCase() + status.slice(1)}</h3>
                      </div>
                      <Badge variant="outline">{tickets.length}</Badge>
                    </div>
                    <div className="bg-muted/50 p-2 rounded-md min-h-[500px] relative">
                      {tickets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-20 text-center text-muted-foreground">
                          <p className="text-sm">Brak zgłoszeń</p>
                        </div>
                      ) : (
                        tickets.map((ticket, index) => (
                          <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                            {(prov: DraggableProvided, snap: DraggableStateSnapshot) => (
                              <div
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                                className={`draggable-item react-beautiful-dnd-draggable ${snap.isDragging ? 'is-dragging' : ''}`}
                                style={prov.draggableProps.style}
                              >
                                <TicketCard ticket={ticket} />
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        )}
      </div>
    </DragDropContext>
  )
}
