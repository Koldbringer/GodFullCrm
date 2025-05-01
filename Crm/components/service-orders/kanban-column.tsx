"use client";

import { useEffect, useRef, useState } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Clock, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceOrderCard } from "./service-order-card"; // Assuming ServiceOrderCard is in a separate file or will be moved

// Mapowanie statusów z UI na statusy w bazie danych
const statusMapping: Record<string, string> = {
  "new": "new",
  "in-progress": "in-progress",
  "scheduled": "scheduled",
  "completed": "completed",
  "cancelled": "cancelled"
};

// Import the ServiceOrder type from the types file
import { Database } from "@/types/supabase";

// Typ dla zlecenia serwisowego
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
    type: string;
  };
  technicians?: {
    name: string;
  };
};


interface KanbanColumnProps {
  status: string;
  orders: ServiceOrder[];
  loading: boolean;
  updatingOrderId: string | null;
  handleDrop: (orderId: string, newStatus: string) => void;
}

export function KanbanColumn({ status, orders, loading, updatingOrderId, handleDrop }: KanbanColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false); // State for visual feedback

  useEffect(() => {
    const element = columnRef.current;
    if (!element) return;

    return dropTargetForElements({
      element: element,
      getData: () => ({ newStatus: status, type: 'status-column' }),
      canDrop: ({ source }) => source.data.type === 'service-order',
      onDragEnter: () => setIsDraggedOver(true), // Set state on drag enter
      onDragLeave: () => setIsDraggedOver(false), // Set state on drag leave
      onDrop: ({ source }) => {
        setIsDraggedOver(false); // Reset state on drop
        const orderId = source.data.orderId as string;
        const newStatus = status as string;
        handleDrop(orderId, newStatus);
      },
      onDrag: ({ source }) => {
        // Optional: Add visual feedback while dragging over
      }
    });
  }, [status, handleDrop]); // Include handleDrop in dependencies

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "scheduled":
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusTitle = (status: string) => {
    switch (status) {
      case "new":
        return "Nowe";
      case "in-progress":
        return "W trakcie";
      case "scheduled":
        return "Zaplanowane";
      case "completed":
        return "Zakończone";
      case "cancelled":
        return "Anulowane";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div
      className={`space-y-2 transition-all duration-200`}
      key={status}
      ref={columnRef}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon(status)}
          <h3 className="font-medium">{getStatusTitle(status)}</h3>
        </div>
        <Badge variant="outline">{orders.length}</Badge>
      </div>
      <div
        className={`p-2 rounded-md min-h-[500px] relative transition-colors duration-200 ${
          isDraggedOver
            ? 'bg-primary/10 border-2 border-dashed border-primary/50'
            : 'bg-muted/50 border-2 border-transparent'
        }`}
      >
        {loading ? (
           Array.from({ length: 3 }).map((_, j) => (
             <Skeleton key={j} className="h-32 w-full mb-3" />
           ))
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-20 text-center text-muted-foreground">
            <p className="text-sm">Brak zleceń</p>
            {isDraggedOver && (
              <p className="text-xs mt-2 text-primary">Upuść tutaj, aby zmienić status</p>
            )}
          </div>
        ) : (
          <>
            {orders.map((order) => (
              <ServiceOrderCard order={order} key={order.id} updatingOrderId={updatingOrderId} />
            ))}
            {isDraggedOver && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="bg-primary/10 rounded-md p-2 text-primary text-sm font-medium">
                  Upuść tutaj, aby zmienić status na {getStatusTitle(status)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}