"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react" // Keep Plus for the "Nowe zlecenie" button
import { toast } from "sonner"
import "@/styles/kanban.css"

import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'; // Keep dropTargetForElements for column drop

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" // Keep Tabs components
import { getServiceOrders, updateServiceOrder } from "@/lib/api"
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription"
import { useRealtime } from "@/components/providers/RealtimeProvider"
import { KanbanColumn } from "./kanban-column" // Import the new KanbanColumn component
import { NewServiceOrderDialog } from "./new-service-order-dialog" // Import the new dialog component
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
    workflow_id: null,
    current_step: null,
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
    workflow_id: "wf1",
    current_step: 2,
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
    workflow_id: "wf2",
    current_step: 1,
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
  const [isMobile, setIsMobile] = useState(false)
  const [mobileViewStatus, setMobileViewStatus] = useState<string>("new")
  const [newOrderDialogOpen, setNewOrderDialogOpen] = useState(false)

  // Check if we're in mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile)

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Pobieranie danych z API
  useEffect(() => {
    const fetchServiceOrders = async () => {
      try {
        const data = await getServiceOrders()
        // Ensure data matches ServiceOrder type, handle potential null statuses
        if (Array.isArray(data)) {
          const formattedData: ServiceOrder[] = data.map((order: any) => {
            return {
              id: order.id || '',
              title: order.title || '',
              description: order.description || null,
              status: order.status || 'unknown',
              priority: order.priority || null,
              service_type: order.service_type || null,
              created_at: order.created_at || null,
              updated_at: order.updated_at || null,
              customer_id: order.customer_id || null,
              site_id: order.site_id || null,
              device_id: order.device_id || null,
              technician_id: order.technician_id || null,
              scheduled_start: order.scheduled_start || null,
              scheduled_end: order.scheduled_end || null,
              completed_date: null,
              estimated_duration: null,
              notes: null,
              cost: order.cost || null,
              payment_status: order.payment_status || null,
              workflow_id: order.workflow_id || null,
              current_step: order.current_step || null,
              customers: order.customers || undefined,
              sites: order.sites || undefined,
              devices: order.devices || undefined,
              technicians: order.technicians || undefined
            };
          });
          setServiceOrders(formattedData);
        }
      } catch (error) {
        console.error('Error fetching service orders:', error)
        setServiceOrders(fallbackServiceOrdersData)
        toast.error("Błąd podczas pobierania zleceń serwisowych")
      } finally {
        setLoading(false)
      }
    }

    fetchServiceOrders()
  }, []) // Pusta tablica zależności, aby efekt uruchamiał się tylko raz

  // Use our new real-time subscription hook
  useRealtime() // Initialize real-time context

  // Set up real-time subscription for service orders
  useRealtimeSubscription({
    table: 'service_orders',
    event: '*',
    onChange: async (payload) => {
      console.log('Zmiana w tabeli service_orders:', payload)

      try {
        // Refresh data when a change is detected
        const data = await getServiceOrders()
        if (Array.isArray(data)) {
          const formattedData: ServiceOrder[] = data.map((order: any) => {
            return {
              id: order.id || '',
              title: order.title || '',
              description: order.description || null,
              status: order.status || 'unknown',
              priority: order.priority || null,
              service_type: order.service_type || null,
              created_at: order.created_at || null,
              updated_at: order.updated_at || null,
              customer_id: order.customer_id || null,
              site_id: order.site_id || null,
              device_id: order.device_id || null,
              technician_id: order.technician_id || null,
              scheduled_start: order.scheduled_start || null,
              scheduled_end: order.scheduled_end || null,
              completed_date: null,
              estimated_duration: null,
              notes: null,
              cost: order.cost || null,
              payment_status: order.payment_status || null,
              workflow_id: order.workflow_id || null,
              current_step: order.current_step || null,
              customers: order.customers || undefined,
              sites: order.sites || undefined,
              devices: order.devices || undefined,
              technicians: order.technicians || undefined
            };
          });
          setServiceOrders(formattedData);
        }

        // Show a toast notification for the change
        const eventType = payload.eventType
        const orderTitle = payload.new?.title || 'Zlecenie'

        if (eventType === 'INSERT') {
          toast.success(`Nowe zlecenie: ${orderTitle}`)
        } else if (eventType === 'UPDATE') {
          toast.info(`Zaktualizowano zlecenie: ${orderTitle}`)
        } else if (eventType === 'DELETE') {
          toast.info(`Usunięto zlecenie`)
        }
      } catch (error) {
        console.error('Error refreshing service orders after real-time update:', error)
      }
    }
  })

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
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 mb-4">
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
          <TabsTrigger value="maintenance" className="hidden sm:flex">
            Przeglądy
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
              {filteredOrders.filter(o => o.service_type === 'maintenance').length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="installation" className="hidden sm:flex">
            Montażowe
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
              {filteredOrders.filter(o => o.service_type === 'installation').length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="inspection" className="hidden sm:flex">
            Oględziny
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
              {filteredOrders.filter(o => o.service_type === 'inspection').length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Mobile-only tabs for the remaining service types */}
        <TabsList className="grid grid-cols-3 mb-4 sm:hidden">
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

      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Szukaj zlecenia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setPriorityFilter(null);
              setTechnicianFilter(null);
              setSearchQuery('');
              setServiceTypeTab("all");
            }}
            title="Wyczyść filtry"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex flex-col gap-1 flex-1">
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

          <div className="flex flex-col gap-1 flex-1">
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
                  <option key={String(techId)} value={String(techId)}>{tech.name}</option>
                ) : null;
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Display current service type as title */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          Zlecenia {serviceTypeTab !== 'all' ? serviceTypeMapping[serviceTypeTab] : ''}
        </h2>
        <Button variant="outline" size="sm" onClick={() => setNewOrderDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Nowe zlecenie</span>
          <span className="sm:hidden">Nowe</span>
        </Button>
      </div>

      {/* Mobile view status selector */}
      {isMobile && (
        <div className="mb-4">
          <Tabs defaultValue="new" value={mobileViewStatus} onValueChange={setMobileViewStatus} className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="new">
                Nowe
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
                  {filteredOrdersByStatus["new"].length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="in-progress">
                W trakcie
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
                  {filteredOrdersByStatus["in-progress"].length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="scheduled">
                Zaplanowane
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
                  {filteredOrdersByStatus["scheduled"].length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="completed">
                Zakończone
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
                  {filteredOrdersByStatus["completed"].length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Anulowane
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
                  {filteredOrdersByStatus["cancelled"].length}
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Array.from({ length: isMobile ? 1 : 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-8" />
              </div>
              <div className="bg-muted/50 p-2 rounded-md min-h-[300px] md:min-h-[500px]">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-32 w-full mb-3" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Desktop view */}
          <div className="hidden md:grid md:grid-cols-5 gap-4 overflow-x-auto">
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

          {/* Mobile view - only show the selected status */}
          <div className="md:hidden">
            <KanbanColumn
              key={mobileViewStatus}
              status={mobileViewStatus}
              orders={filteredOrdersByStatus[mobileViewStatus as keyof typeof filteredOrdersByStatus] || []}
              loading={loading}
              updatingOrderId={updatingOrder}
              handleDrop={handleDrop}
              isMobileView={true}
            />
          </div>
        </>
      )}

      {/* New Service Order Dialog */}
      <NewServiceOrderDialog
        open={newOrderDialogOpen}
        onOpenChange={setNewOrderDialogOpen}
      />
    </div>
  )
}
