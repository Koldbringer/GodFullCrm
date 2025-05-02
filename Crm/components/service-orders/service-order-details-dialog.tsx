"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Package, 
  FileText, 
  Tag, 
  AlertTriangle,
  CheckCircle2,
  Loader2
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getServiceOrderById } from "@/lib/api"
import { ServiceOrder } from "@/lib/types"

interface ServiceOrderDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string | null
}

export function ServiceOrderDetailsDialog({
  open,
  onOpenChange,
  orderId,
}: ServiceOrderDetailsDialogProps) {
  const [serviceOrder, setServiceOrder] = useState<ServiceOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    async function fetchServiceOrder() {
      if (!orderId || !open) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const data = await getServiceOrderById(orderId)
        setServiceOrder(data)
      } catch (error) {
        console.error("Error fetching service order:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchServiceOrder()
  }, [orderId, open])

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nie określono"
    try {
      return format(new Date(dateString), "PPP", { locale: pl })
    } catch (error) {
      return "Nieprawidłowa data"
    }
  }

  // Get priority badge
  const getPriorityBadge = (priority: string | null) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return <Badge variant="destructive">Wysoki</Badge>
      case 'medium':
        return <Badge variant="default">Średni</Badge>
      case 'low':
        return <Badge variant="outline">Niski</Badge>
      default:
        return <Badge variant="secondary">Normalny</Badge>
    }
  }

  // Get service type badge
  const getServiceTypeBadge = (type: string | null) => {
    switch (type?.toLowerCase()) {
      case 'maintenance':
        return <Badge variant="secondary">Przegląd</Badge>
      case 'repair':
        return <Badge variant="destructive">Naprawa</Badge>
      case 'installation':
        return <Badge variant="default">Montaż</Badge>
      case 'inspection':
        return <Badge variant="outline">Oględziny</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  // Get status badge
  const getStatusBadge = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'new':
        return <Badge className="bg-yellow-500">Nowe</Badge>
      case 'in_progress':
        return <Badge className="bg-blue-500">W trakcie</Badge>
      case 'scheduled':
        return <Badge className="bg-purple-500">Zaplanowane</Badge>
      case 'completed':
        return <Badge className="bg-green-500">Zakończone</Badge>
      case 'cancelled':
        return <Badge className="bg-red-500">Anulowane</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !serviceOrder ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-medium">Nie znaleziono zlecenia</h3>
            <p className="text-muted-foreground mt-2">
              Nie udało się znaleźć zlecenia o podanym identyfikatorze.
            </p>
            <Button className="mt-4" onClick={() => onOpenChange(false)}>
              Zamknij
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl">{serviceOrder.title}</DialogTitle>
                <div className="flex items-center gap-2">
                  {getStatusBadge(serviceOrder.status)}
                  {getPriorityBadge(serviceOrder.priority)}
                </div>
              </div>
              <DialogDescription className="flex items-center gap-2 mt-2">
                <span className="text-sm font-medium">ID: {serviceOrder.id}</span>
                <span>•</span>
                <span className="text-sm">{getServiceTypeBadge(serviceOrder.service_type)}</span>
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="details">Szczegóły</TabsTrigger>
                <TabsTrigger value="history">Historia</TabsTrigger>
                <TabsTrigger value="documents">Dokumenty</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                {/* Customer and Site Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" /> Klient
                    </h3>
                    <p className="text-base">{serviceOrder.customers?.name || "Nieznany"}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Lokalizacja
                    </h3>
                    <p className="text-base">{serviceOrder.sites?.name || "Nieznana"}</p>
                  </div>
                </div>

                <Separator />

                {/* Device and Technician Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Package className="h-4 w-4" /> Urządzenie
                    </h3>
                    <p className="text-base">
                      {serviceOrder.devices ? (
                        <>
                          {serviceOrder.devices.model}
                          <span className="text-sm text-muted-foreground ml-2">
                            ({serviceOrder.devices.type})
                          </span>
                        </>
                      ) : (
                        "Nieznane"
                      )}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" /> Technik
                    </h3>
                    <p className="text-base">
                      {serviceOrder.technicians?.name || "Nieprzypisany"}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Data utworzenia
                    </h3>
                    <p className="text-base">{formatDate(serviceOrder.created_at)}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Planowana data
                    </h3>
                    <p className="text-base">{formatDate(serviceOrder.scheduled_start)}</p>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Opis
                  </h3>
                  <p className="text-base whitespace-pre-wrap">
                    {serviceOrder.description || "Brak opisu"}
                  </p>
                </div>

                {/* Workflow Progress */}
                {serviceOrder.workflow_id && serviceOrder.current_step && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" /> Postęp workflow
                      </h3>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ 
                            width: `${Math.min(100, (serviceOrder.current_step / 5) * 100)}%` 
                          }}
                        ></div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Krok {serviceOrder.current_step} z 5
                      </p>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Utworzono zlecenie</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(serviceOrder.created_at)}
                      </p>
                    </div>
                  </div>

                  {serviceOrder.technician_id && (
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Przypisano technika: {serviceOrder.technicians?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(serviceOrder.updated_at)}
                        </p>
                      </div>
                    </div>
                  )}

                  {serviceOrder.scheduled_start && (
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Zaplanowano na: {formatDate(serviceOrder.scheduled_start)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(serviceOrder.updated_at)}
                        </p>
                      </div>
                    </div>
                  )}

                  {serviceOrder.status === "completed" && (
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Zakończono zlecenie</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(serviceOrder.updated_at)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Brak dokumentów</h3>
                  <p className="text-muted-foreground mt-2">
                    Do tego zlecenia nie dodano jeszcze żadnych dokumentów.
                  </p>
                  <Button className="mt-4">
                    Dodaj dokument
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Edytuj
                </Button>
                <Button variant="outline" size="sm">
                  Przypisz technika
                </Button>
              </div>
              <Button onClick={() => onOpenChange(false)}>
                Zamknij
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
