"use client"

import { useState, useEffect, useRef } from "react"
import { Plus } from "lucide-react" // Keep Plus for the "Nowe zlecenie" button
import { toast } from "sonner"
import "@/styles/kanban.css"

import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'; // Keep dropTargetForElements for column drop

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" // Keep Tabs components
import { getServiceOrders, updateServiceOrder } from "@/lib/api"
import { createClient } from "@/lib/supabase"
import { KanbanColumn } from "./kanban-column" // Import the new KanbanColumn component
import { ServiceOrder } from "../../lib/types" // Import the shared ServiceOrder type

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

// Dane zastępcze na wypadek błędu pobierania - używamy zaktualizowanego typu
const fallbackServiceOrdersData: ServiceOrder[] = [
  {
    id: "SO-001",
    title: "Przegląd klimatyzacji",
    description: "Standardowy przegląd klimatyzacji",
    status: "new",
    priority: "medium",
    service_type: "maintenance",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    customer_id: "c1",
    site_id: "s1",
    device_id: "d1",
    technician_id: null,
    scheduled_start: null,
    scheduled_end: null,
    completed_date: null,
    estimated_duration: 60,
    notes: null,
    cost: null,
    payment_status: null,
    customers: {
      id: "c1",
      name: "Firma ABC",
    },
    sites: {
      id: "s1",
      name: "Biuro główne",
    },
    devices: {
      id: "d1",
      model: "Daikin FTXM35N",
      type: "Klimatyzator",
    },
    technicians: undefined,
  },
  {
    id: "SO-002",
    title: "Naprawa pompy ciepła",
    description: "Naprawa pompy ciepła po awarii",
    status: "in_progress",
    priority: "high",
    service_type: "repair",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    customer_id: "c2",
    site_id: "s2",
    device_id: "d2",
    technician_id: "t1",
    scheduled_start: new Date().toISOString(),
    scheduled_end: null,
    completed_date: null,
    estimated_duration: 120,
    notes: "Klient zgłasza hałas podczas pracy urządzenia",
    cost: null,
    payment_status: null,
    customers: {
      id: "c2",
      name: "Jan Kowalski",
    },
    sites: {
      id: "s2",
      name: "Dom jednorodzinny",
    },
    devices: {
      id: "d2",
      model: "Viessmann Vitocal 200-S",
      type: "Pompa ciepła",
    },
    technicians: {
      id: "t1",
      name: "Adam Nowak",
    },
  },
  {
    id: "SO-003",
    title: "Montaż klimatyzacji",
    description: "Montaż nowej klimatyzacji",
    status: "scheduled",
    priority: "medium",
    service_type: "installation",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    customer_id: "c3",
    site_id: "s3",
    device_id: "d3",
    technician_id: "t2",
    scheduled_start: new Date(Date.now() + 86400000).toISOString(),
    scheduled_end: null,
    completed_date: null,
    estimated_duration: 180,
    notes: null,
    cost: null,
    payment_status: null,
    customers: {
      id: "c3",
      name: "Anna Nowak",
    },
    sites: {
      id: "s3",
      name: "Mieszkanie",
    },
    devices: {
      id: "d3",
      model: "Mitsubishi MSZ-AP25VG",
      type: "Klimatyzator",
    },
    technicians: {
      id: "t2",
      name: "Piotr Wiśniewski",
    },
  }
]

export function ServiceOrdersKanban() {
  const handleDrop = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId);

    // Find the order in the current state
    const orderToMove = serviceOrders.find(order => order.id === orderId);
    if (!orderToMove) {
      setUpdatingOrder(null);
      return;
    }

    // Get the original status before updating
    const originalStatus = orderToMove.status;

    // Optimistically update the order in the serviceOrders array
    const updatedServiceOrders = serviceOrders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: reverseStatusMapping[newStatus]
        };
      }
      return order;
    });

    // Update the state with the modified orders
    setServiceOrders(updatedServiceOrders);

    console.log(`Optimistically updated order ${orderId} status to ${newStatus}`);

    try {
      // Update in the database
      await updateServiceOrder(orderId, {
        status: reverseStatusMapping[newStatus],
        updated_at: new Date().toISOString()
      });

      toast.success(`Status zlecenia ${orderId} zmieniony na ${newStatus}`);
    } catch (error) {
      console.error('Error updating service order status:', error);
      toast.error("Błąd podczas aktualizacji statusu zlecenia");

      // Revert the state if the database update fails
      const revertedServiceOrders = serviceOrders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: originalStatus
          };
        }
        return order;
      });

      // Restore the original state
      setServiceOrders(revertedServiceOrders);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  // We'll use getFilteredOrdersByStatus() directly instead of maintaining this state
  // to avoid potential infinite loops

  // Pobieranie danych z API
  useEffect(() => {
    const fetchServiceOrders = async () => {
      try {
        const data = await getServiceOrders()
        // Ensure data matches ServiceOrder type, handle potential null statuses
        const formattedData: ServiceOrder[] = data.map(order => ({
           ...order,
           status: order.status ?? 'unknown', // Provide a default status if null
           // Add other default values for potentially null fields if necessary
        }));
        setServiceOrders(formattedData);
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
    const supabase = createClient() // Jedna deklaracja klienta

    // Subskrypcja na zmiany w tabeli service_orders
    if (!supabase) { // Dodane sprawdzenie null/undefined
      console.error("Supabase client is not initialized.");
      return; // Wychodzimy z useEffect jeśli klient nie jest dostępny
    }
    const serviceOrdersSubscription = supabase // Poprawne przypisanie subskrypcji
      .channel('service-orders-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'service_orders' },
        async (payload: any) => { // Użycie any dla payload, jeśli typowanie jest problemem, można doprecyzować później
          console.log('Zmiana w tabeli service_orders:', payload)
          // Odświeżenie danych po zmianie
          const data = await getServiceOrders()
           const formattedData: ServiceOrder[] = data.map(order => ({
              ...order,
              status: order.status ?? 'unknown', // Provide a default status if null
              // Add other default values for potentially null fields if necessary
           }));
          setServiceOrders(formattedData)
        }
      )
      .subscribe()

    // Czyszczenie subskrypcji przy odmontowaniu komponentu
    return () => {
      if (serviceOrdersSubscription && supabase) { // Dodane sprawdzenie null/undefined
        supabase.removeChannel(serviceOrdersSubscription) // Poprawne użycie removeChannel
      }
    }
  }, []) // Pusta tablica zależności, aby efekt uruchamiał się tylko raz

  // Filtrowanie zleceń
  const filteredOrders = serviceOrders.filter(
    (order) =>
      order.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customers?.name && order.customers.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.devices?.model && order.devices.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // We'll use getFilteredOrdersByStatus instead of this useEffect
  // to avoid potential infinite loops


  // Filter options for priority, technician, and service type
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [technicianFilter, setTechnicianFilter] = useState<string | null>(null);
  const [serviceTypeTab, setServiceTypeTab] = useState<string>("all"); // "all", "service", "installation", "inspection"

  // Service type mapping for better display
  const serviceTypeMapping: Record<string, string> = {
    "all": "Wszystkie",
    "service": "Serwisowe",
    "maintenance": "Przeglądy",
    "installation": "Montażowe",
    "inspection": "Oględziny"
  };

  // Filter orders by priority, technician, and service type
  const getFilteredOrdersByStatus = () => {
    let filtered = filteredOrders;

    if (priorityFilter) {
      filtered = filtered.filter(order => order.priority === priorityFilter);
    }

    if (technicianFilter) {
      filtered = filtered.filter(order => order.technician_id === technicianFilter);
    }

    // Filter by service type if not "all"
    if (serviceTypeTab !== "all") {
      filtered = filtered.filter(order => order.service_type === serviceTypeTab);
    }

    return {
      new: filtered.filter((o) => statusMapping[o.status] === "new"),
      "in-progress": filtered.filter((o) => statusMapping[o.status] === "in-progress"),
      scheduled: filtered.filter((o) => statusMapping[o.status] === "scheduled"),
      completed: filtered.filter((o) => statusMapping[o.status] === "completed"),
      cancelled: filtered.filter((o) => statusMapping[o.status] === "cancelled"),
    };
  };

  const filteredOrdersByStatus = getFilteredOrdersByStatus();

  return (
    <div className="space-y-4">
      {/* Tabs for different service types */}
      <Tabs defaultValue="all" value={serviceTypeTab} onValueChange={setServiceTypeTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">
            Wszystkie
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
              {filteredOrders.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="service">
            Serwisowe
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
              {filteredOrders.filter(o => o.service_type === 'service').length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            Przeglądy
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
              {filteredOrders.filter(o => o.service_type === 'maintenance').length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="installation">
            Montażowe
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
              {filteredOrders.filter(o => o.service_type === 'installation').length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="inspection">
            Oględziny
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
              {filteredOrders.filter(o => o.service_type === 'inspection').length}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Szukaj zlecenia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="priority-filter" className="text-xs text-muted-foreground">Priorytet</label>
            <select
              id="priority-filter"
              aria-label="Filtruj według priorytetu"
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={priorityFilter || ''}
              onChange={(e) => setPriorityFilter(e.target.value || null)}
            >
              <option value="">Wszystkie priorytety</option>
              <option value="high">Wysoki</option>
              <option value="medium">Średni</option>
              <option value="low">Niski</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="technician-filter" className="text-xs text-muted-foreground">Technik</label>
            <select
              id="technician-filter"
              aria-label="Filtruj według technika"
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={technicianFilter || ''}
              onChange={(e) => setTechnicianFilter(e.target.value || null)}
            >
              <option value="">Wszyscy technicy</option>
              {/* Dynamically generate options from available technicians */}
              {Array.from(new Set(serviceOrders.map(order => order.technician_id))).filter(Boolean).map(techId => {
                const tech = serviceOrders.find(order => order.technician_id === techId)?.technicians;
                return tech ? (
                  <option key={techId} value={techId}>{tech.name}</option>
                ) : null;
              })}
            </select>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              setPriorityFilter(null);
              setTechnicianFilter(null);
              setSearchQuery('');
              setServiceTypeTab("all");
            }}
          >
            Wyczyść filtry
          </Button>
        </div>
      </div>

      {/* Display current service type as title */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Zlecenia {serviceTypeTab !== 'all' ? serviceTypeMapping[serviceTypeTab] : ''}
        </h2>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nowe zlecenie
        </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
          {Object.entries(filteredOrdersByStatus).map(([status, orders]) => (
            <KanbanColumn
              key={status}
              status={status}
              orders={orders}
              loading={loading}
              updatingOrderId={updatingOrder}
              handleDrop={handleDrop}
            />
          ))}
        </div>
      )}
    </div>
  )
}
