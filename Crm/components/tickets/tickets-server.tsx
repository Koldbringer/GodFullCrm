import { createServerClient } from "@/lib/supabase"
import { TicketsList } from "@/components/tickets/tickets-list"
import { TicketsStats } from "@/components/tickets/tickets-stats"
import { TicketsKanban } from "@/components/tickets/tickets-kanban"

// Przykładowe dane zgłoszeń na wypadek błędu API
export const fallbackTicketsData = [
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
  try {
    // Pobieranie danych bezpośrednio z Supabase w komponencie serwerowym
    const supabase = await createServerClient()
    
    console.log("Pobieranie zgłoszeń z Supabase")
    
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customer:customer_id(id, name),
        site:site_id(id, name),
        device:device_id(id, type, model),
        technician:technician_id(id, name)
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error("Error fetching tickets:", error)
      return {
        TicketsListComponent: () => <TicketsList initialTickets={fallbackTicketsData} />,
        TicketsStatsComponent: () => <TicketsStats initialTickets={fallbackTicketsData} />,
        TicketsKanbanComponent: () => <TicketsKanban initialTickets={fallbackTicketsData} />
      }
    }
    
    console.log(`Pobrano ${tickets.length} zgłoszeń`)
    
    // Używamy danych z API lub danych zastępczych, jeśli API zwróci pusty wynik
    const ticketsData = tickets.length > 0 ? tickets : fallbackTicketsData
    
    return {
      TicketsListComponent: () => <TicketsList initialTickets={ticketsData} />,
      TicketsStatsComponent: () => <TicketsStats initialTickets={ticketsData} />,
      TicketsKanbanComponent: () => <TicketsKanban initialTickets={ticketsData} />
    }
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return {
      TicketsListComponent: () => <TicketsList initialTickets={fallbackTicketsData} />,
      TicketsStatsComponent: () => <TicketsStats initialTickets={fallbackTicketsData} />,
      TicketsKanbanComponent: () => <TicketsKanban initialTickets={fallbackTicketsData} />
    }
  }
}
