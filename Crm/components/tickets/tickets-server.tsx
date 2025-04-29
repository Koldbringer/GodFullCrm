// import { createServerClient } from "@/lib/supabase"
import { TicketsList } from "@/components/tickets/tickets-list"
import { TicketsStats } from "@/components/tickets/tickets-stats"
import { TicketsKanban } from "@/components/tickets/tickets-kanban"

// Static data for Docker build
export const staticTicketsData = [
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

export async function TicketsServer() {
  // In production, this would fetch from Supabase
  // For Docker build, we're using static data
  console.log("Using static tickets data for Docker build")
  
  return {
    TicketsListComponent: () => <TicketsList initialTickets={staticTicketsData} />,
    TicketsStatsComponent: () => <TicketsStats initialTickets={staticTicketsData} />,
    TicketsKanbanComponent: () => <TicketsKanban initialTickets={staticTicketsData} />
  }
}
