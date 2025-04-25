"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { AlertCircle, CheckCircle2, Clock, MoreHorizontal, Package, Plus, Loader2, Calendar } from "lucide-react"
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
import { getServiceOrders, updateServiceOrder } from "@/lib/api"
import { createClient } from "@/lib/supabase"
import { Database } from "@/types/supabase"

// Mapowanie statusów z bazy danych na statusy w UI
const statusMapping: Record<string, string> = {
  "new": "new",
  "in_progress": "in-progress",
  "scheduled": "scheduled",
  "completed": "completed",
  "cancelled": "cancelled"
}

// Mapowanie statusów z UI na statusy w bazie danych
const reverseStatusMapping: Record<string, string> = {
  "new": "new",
  "in-progress": "in_progress",
  "scheduled": "scheduled",
  "completed": "completed",
  "cancelled": "cancelled"
}

// Kolory dla priorytetów
const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800 hover:bg-red-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
    case 'low':
      return 'bg-green-100 text-green-800 hover:bg-green-200'
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
  }
}

// Teksty dla priorytetów
const getPriorityText = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'Wysoki'
    case 'medium':
      return 'Średni'
    case 'low':
      return 'Niski'
    default:
      return 'Normalny'
  }
}

// Typ dla zlecenia serwisowego
type ServiceOrder = Database['public']['Tables']['service_orders']['Row'] & {
  customers?: {
    name: string;
  };
  sites?: {
    name: string;
  };
  devices?: {
    model: string;
    type: string;
  };
  technicians?: {
    name: string;
  };
}

// Dane zastępcze na wypadek błędu pobierania
const fallbackServiceOrdersData: ServiceOrder[] = [
  {
    id: "SO-001",
    title: "Przegląd klimatyzacji",
    description: "Standardowy przegląd klimatyzacji",
    status: "new",
    priority: "medium",
    type: "maintenance",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    customer_id: "c1",
    site_id: "s1",
    device_id: "d1",
    technician_id: null,
    scheduled_date: null,
    completed_date: null,
    estimated_duration: 60,
    notes: null,
    customers: {
      name: "Firma ABC",
    },
    sites: {
      name: "Biuro główne",
    },
    devices: {
      model: "Daikin FTXM35N",
      type: "Klimatyzator",
    },
    technicians: null,
  },
  {
    id: "SO-002",
    title: "Naprawa pompy ciepła",
    description: "Naprawa pompy ciepła po awarii",
    status: "in_progress",
    priority: "high",
    type: "repair",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    customer_id: "c2",
    site_id: "s2",
    device_id: "d2",
    technician_id: "t1",
    scheduled_date: new Date().toISOString(),
    completed_date: null,
    estimated_duration: 120,
    notes: "Klient zgłasza hałas podczas pracy urządzenia",
    customers: {
      name: "Jan Kowalski",
    },
    sites: {
      name: "Dom jednorodzinny",
    },
    devices: {
      model: "Viessmann Vitocal 200-S",
      type: "Pompa ciepła",
    },
    technicians: {
      name: "Adam Nowak",
    },
  },
  {
    id: "SO-003",
    title: "Montaż klimatyzacji",
    description: "Montaż nowej klimatyzacji",
    status: "scheduled",
    priority: "medium",
    type: "installation",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    customer_id: "c3",
    site_id: "s3",
    device_id: "d3",
    technician_id: "t2",
    scheduled_date: new Date(Date.now() + 86400000).toISOString(),
    completed_date: null,
    estimated_duration: 180,
    notes: null,
    customers: {
      name: "Anna Nowak",
    },
    sites: {
      name: "Mieszkanie",
    },
    devices: {
      model: "Mitsubishi MSZ-AP25VG",
      type: "Klimatyzator",
    },
    technicians: {
      name: "Piotr Wiśniewski",
    },
  }
]

export function ServiceOrdersKanban() {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [ordersByStatus, setOrdersByStatus] = useState<Record<string, ServiceOrder[]>>(() => ({
    new: [],
    "in-progress": [],
    scheduled: [],
    completed: [],
    cancelled: []
  }))

  // Pobieranie danych z API
  useEffect(() => {
    const fetchServiceOrders = async () => {
      try {
        const data = await getServiceOrders()
        setServiceOrders(data)
      } catch (error) {
        console.error('Error fetching service orders:', error)
        setServiceOrders(fallbackServiceOrdersData)
        toast.error("Błąd podczas pobierania zleceń serwisowych")
      } finally {
        setLoading(false)
      }
    }

    fetchServiceOrders()

    // Create a Supabase client instance
    const supabase = createClient()

    // Subskrypcja na zmiany w tabeli service_orders
    const serviceOrdersSubscription = supabase
      .channel('service-orders-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'service_orders' },
        async (payload) => {
          console.log('Zmiana w tabeli service_orders:', payload)
          // Odświeżenie danych po zmianie
          const data = await getServiceOrders()
          setServiceOrders(data)
        }
      )
      .subscribe()

    // Czyszczenie subskrypcji przy odmontowaniu komponentu
    return () => {
      supabase.removeChannel(serviceOrdersSubscription)
    }
  }, [])

  // Filtrowanie zleceń
  const filteredOrders = serviceOrders.filter(
    (order) =>
      order.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customers?.name && order.customers.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.devices?.model && order.devices.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return

    // Pobierz ID przeciąganego zlecenia
    const orderId = result.draggableId
    setUpdatingOrder(orderId)

    if (source.droppableId === destination.droppableId) {
      // Zmiana kolejności w tej samej kolumnie
      const col = Array.from(ordersByStatus[source.droppableId])
      const [moved] = col.splice(source.index, 1)
      col.splice(destination.index, 0, moved)
      setOrdersByStatus({ ...ordersByStatus, [source.droppableId]: col })
    } else {
      // Zmiana statusu zlecenia
      const sourceCol = Array.from(ordersByStatus[source.droppableId])
      const [moved] = sourceCol.splice(source.index, 1)

      // Nowy status w formacie bazy danych
      const newStatus = reverseStatusMapping[destination.droppableId]

      try {
        // Aktualizacja w bazie danych
        await updateServiceOrder(orderId, {
          status: newStatus,
          updated_at: new Date().toISOString()
        })

        // Aktualizacja lokalnego stanu
        moved.status = newStatus
        const destCol = Array.from(ordersByStatus[destination.droppableId])
        destCol.splice(destination.index, 0, moved)
        setOrdersByStatus({
          ...ordersByStatus,
          [source.droppableId]: sourceCol,
          [destination.droppableId]: destCol,
        })

        toast.success(`Status zlecenia ${orderId} zmieniony na ${destination.droppableId}`)
      } catch (error) {
        console.error('Error updating service order status:', error)
        toast.error("Błąd podczas aktualizacji statusu zlecenia")

        // Przywróć oryginalny stan w przypadku błędu
        setOrdersByStatus({
          ...ordersByStatus
        })
      } finally {
        setUpdatingOrder(null)
      }
    }
  }

  // Aktualizuj kolumny po filtrowaniu zleceń
  useEffect(() => {
    setOrdersByStatus({
      new: filteredOrders.filter((o) => statusMapping[o.status] === "new"),
      "in-progress": filteredOrders.filter((o) => statusMapping[o.status] === "in-progress"),
      scheduled: filteredOrders.filter((o) => statusMapping[o.status] === "scheduled"),
      completed: filteredOrders.filter((o) => statusMapping[o.status] === "completed"),
      cancelled: filteredOrders.filter((o) => statusMapping[o.status] === "cancelled"),
    })
  }, [filteredOrders])

  // Formatowanie daty
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nie zaplanowano"
    return format(new Date(dateString), "dd MMM yyyy", { locale: pl })
  }

  // Komponent karty zlecenia
  const ServiceOrderCard = ({ order }: { order: ServiceOrder }) => (
    <Card className={`mb-3 ${updatingOrder === order.id ? 'opacity-50' : ''} relative`}>
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          <Badge className={getPriorityColor(order.priority)} variant="outline">
            {getPriorityText(order.priority)}
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
                <Link href={`/service-orders/${order.id}`} className="w-full">Szczegóły zlecenia</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edytuj zlecenie</DropdownMenuItem>
              <DropdownMenuItem>Przypisz technika</DropdownMenuItem>
              <DropdownMenuItem>Dodaj dokumenty</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Anuluj zlecenie</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-2">
          <h3 className="font-medium text-sm">{order.title}</h3>
          <p className="text-xs text-muted-foreground truncate">{order.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
          <div>
            <p className="text-muted-foreground">Klient:</p>
            <p className="font-medium truncate">{order.customers?.name || "Nieznany"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Lokalizacja:</p>
            <p className="font-medium truncate">{order.sites?.name || "Nieznana"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
          <div>
            <p className="text-muted-foreground">Urządzenie:</p>
            <p className="font-medium truncate">{order.devices?.model || "Nieznane"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Technik:</p>
            <p className="font-medium truncate">{order.technicians?.name || "Nieprzypisany"}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>{formatDate(order.scheduled_date)}</span>
          </div>
          <div>
            <Badge variant="outline" className="text-xs">
              {order.type === "maintenance" ? "Przegląd" :
               order.type === "repair" ? "Naprawa" :
               order.type === "installation" ? "Montaż" :
               order.type}
            </Badge>
          </div>
        </div>

        {updatingOrder === order.id && (
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
            placeholder="Szukaj zlecenia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(ordersByStatus).map(([status, orders]) => (
              <Droppable droppableId={status} key={status}>
                {(provided: DroppableProvided) => (
                  <div className="space-y-2" ref={provided.innerRef} {...provided.droppableProps}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {status === "new" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                        {status === "in-progress" && <Clock className="h-4 w-4 text-blue-500" />}
                        {status === "scheduled" && <Calendar className="h-4 w-4 text-purple-500" />}
                        {status === "completed" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        {status === "cancelled" && <AlertCircle className="h-4 w-4 text-red-500" />}
                        <h3 className="font-medium">
                          {status === "new" ? "Nowe" :
                           status === "in-progress" ? "W trakcie" :
                           status === "scheduled" ? "Zaplanowane" :
                           status === "completed" ? "Zakończone" :
                           status === "cancelled" ? "Anulowane" :
                           status.charAt(0).toUpperCase() + status.slice(1)}
                        </h3>
                      </div>
                      <Badge variant="outline">{orders.length}</Badge>
                    </div>
                    <div className="bg-muted/50 p-2 rounded-md min-h-[500px] relative">
                      {orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-20 text-center text-muted-foreground">
                          <p className="text-sm">Brak zleceń</p>
                        </div>
                      ) : (
                        orders.map((order, index) => (
                          <Draggable key={order.id} draggableId={order.id} index={index}>
                            {(prov: DraggableProvided, snap: DraggableStateSnapshot) => (
                              <div
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                                className={`draggable-item react-beautiful-dnd-draggable ${snap.isDragging ? 'is-dragging' : ''}`}
                                style={prov.draggableProps.style}
                              >
                                <ServiceOrderCard order={order} />
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
