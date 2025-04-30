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

    // Optimistically update the state
    // Safely access status, provide a default if null/undefined
    const currentStatus = statusMapping[orderToMove.status ?? ''] || 'unknown';
    const sourceCol = Array.from(ordersByStatus[currentStatus] || []);
    const destCol = Array.from(ordersByStatus[newStatus] || []);


    const [movedOrder] = sourceCol.filter(order => order.id === orderId);
    const sourceColFiltered = sourceCol.filter(order => order.id !== orderId);

    if (movedOrder) { // Ensure movedOrder is found before updating status
      movedOrder.status = reverseStatusMapping[newStatus]; // Update status on the moved order object
      destCol.push(movedOrder); // Add to the new column
    }


    setOrdersByStatus({
      ...ordersByStatus,
      [currentStatus]: sourceColFiltered,
      [newStatus]: destCol,
    });

    // TODO: Implement database update
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
      // Safely access status, provide a default if null/undefined
      const revertedCurrentStatus = statusMapping[orderToMove.status ?? ''] || 'unknown';
       if (movedOrder) { // Ensure movedOrder exists before attempting to revert
         setOrdersByStatus({
           ...ordersByStatus,
           [newStatus]: destCol.filter(order => order.id !== orderId), // Remove from new column
           [revertedCurrentStatus]: [...sourceColFiltered, movedOrder], // Add back to original column
         });
       }
    } finally {
      setUpdatingOrder(null);
    }
  };

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


  return (
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
