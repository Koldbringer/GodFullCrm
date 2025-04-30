"use client";

import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { MoreHorizontal, Loader2, Calendar } from "lucide-react";
import Link from "next/link";
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/types/supabase";

// Typ dla zlecenia serwisowego (powtórzony dla niezależności komponentu, można zrefaktoryzować)
type ServiceOrder = Database['public']['Tables']['service_orders']['Row'] & {
  title: string;
  description: string | null;
  priority: string | null;
  service_type: string | null;
  scheduled_start: string | null;
  scheduled_end: string | null;
  cost: number | null;
  payment_status: string | null;
  customers?: {
    name: string;
  };
  sites?: {
    name: string;
  };
  devices?: {
    model: string;
    type: string; // Keep device type for display if needed
  };
  technicians?: {
    name: string;
  };
};

// Kolory dla priorytetów
const getPriorityColor = (priority: string | null) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

// Teksty dla priorytetów
const getPriorityText = (priority: string | null) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'Wysoki';
    case 'medium':
      return 'Średni';
    case 'low':
      return 'Niski';
    default:
      return 'Normalny';
  }
};

// Formatowanie daty
const formatDate = (dateString: string | null) => {
  if (!dateString) return "Nie zaplanowano";
  try {
    return format(new Date(dateString), "dd MMM yyyy", { locale: pl });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "Nieprawidłowa data";
  }
};


interface ServiceOrderCardProps {
  order: ServiceOrder;
  updatingOrderId: string | null;
}

export function ServiceOrderCard({ order, updatingOrderId }: ServiceOrderCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    return draggable({
      element: element,
      getInitialData: () => ({
        orderId: order.id,
        currentStatus: order.status,
        type: 'service-order',
      }),
    });
  }, [order.id, order.status]); // Include order.status in dependencies

  return (
    <Card ref={cardRef} className={`mb-3 ${updatingOrderId === order.id ? 'opacity-50' : ''} relative`}>
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
            <span>{formatDate(order.scheduled_start)}</span>
          </div>
          <div>
            <Badge variant="outline" className="text-xs">
              {order.service_type === "maintenance" ? "Przegląd" :
               order.service_type === "repair" ? "Naprawa" :
               order.service_type === "installation" ? "Montaż" :
               order.service_type}
            </Badge>
          </div>
        </div>

        {updatingOrderId === order.id && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}