"use client"

import { useState, useEffect } from "react"
import {
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  MapPin,
  Package,
  RefreshCw,
  ChevronRight,
  Bell,
  Filter
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import { pl } from "date-fns/locale"

interface Task {
  id: string
  title: string
  type: "service" | "installation" | "maintenance" | "repair"
  priority: "low" | "medium" | "high" | "urgent"
  status: "scheduled" | "in-progress" | "completed" | "delayed"
  customer: {
    name: string
    avatar?: string
    initials: string
  }
  location: string
  device?: string
  scheduledFor: string
  assignedTo?: {
    name: string
    avatar?: string
    initials: string
  }
}

interface Alert {
  id: string
  title: string
  type: "warning" | "error" | "info"
  message: string
  source: string
  timestamp: string
  isRead: boolean
}

// Funkcja pomocnicza do formatowania daty
function formatDate(dateString: string | null): string {
  if (!dateString) return "Nie zaplanowano";

  const date = new Date(dateString);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Sprawdź, czy data jest dzisiaj
  if (date.toDateString() === now.toDateString()) {
    return `Dziś, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  // Sprawdź, czy data jest jutro
  if (date.toDateString() === tomorrow.toDateString()) {
    return `Jutro, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  // W przeciwnym razie zwróć pełną datę
  return `${date.toLocaleDateString('pl-PL')}, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
}

// Funkcja pomocnicza do generowania inicjałów
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function UpcomingTasks() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const { toast } = useToast()

  // Funkcja do pobierania danych
  const fetchData = async () => {
    setIsRefreshing(true)

    try {
      const supabase = createClient()
      if (!supabase) {
        throw new Error("Nie można połączyć z bazą danych")
      }

      // Pobierz nadchodzące zlecenia serwisowe
      const { data: serviceOrders, error: serviceOrdersError } = await supabase
        .from('service_orders')
        .select(`
          id,
          title,
          description,
          status,
          service_type,
          priority,
          scheduled_start,
          customers (id, name),
          sites (id, name, street, city),
          devices (id, model, type),
          technicians (id, name)
        `)
        .not('status', 'in', '("completed","cancelled")')
        .order('scheduled_start', { ascending: true })
        .limit(5)

      if (serviceOrdersError) {
        throw new Error(`Błąd podczas pobierania zleceń: ${serviceOrdersError.message}`)
      }

      // Pobierz powiadomienia
      const { data: notifications, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (notificationsError) {
        throw new Error(`Błąd podczas pobierania powiadomień: ${notificationsError.message}`)
      }

      // Przekształć dane zleceń do formatu Task
      const formattedTasks: Task[] = serviceOrders?.map(order => {
        // Określ typ zlecenia na podstawie service_type
        let taskType: "service" | "installation" | "maintenance" | "repair" = "service";
        if (order.service_type === "installation") taskType = "installation";
        else if (order.service_type === "maintenance") taskType = "maintenance";
        else if (order.service_type === "repair") taskType = "repair";

        // Określ priorytet
        let taskPriority: "low" | "medium" | "high" | "urgent" = "medium";
        if (order.priority === "low") taskPriority = "low";
        else if (order.priority === "high") taskPriority = "high";
        else if (order.priority === "urgent") taskPriority = "urgent";

        // Określ status
        let taskStatus: "scheduled" | "in-progress" | "completed" | "delayed" = "scheduled";
        if (order.status === "in-progress") taskStatus = "in-progress";
        else if (order.status === "completed") taskStatus = "completed";
        else if (order.status === "delayed") taskStatus = "delayed";

        // Formatuj lokalizację
        const location = order.sites
          ? `${order.sites.street || ''}, ${order.sites.city || ''}`
          : 'Brak lokalizacji';

        return {
          id: order.id,
          title: order.title || `Zlecenie #${order.id}`,
          type: taskType,
          priority: taskPriority,
          status: taskStatus,
          customer: {
            name: order.customers?.name || 'Nieznany klient',
            initials: getInitials(order.customers?.name || 'NK')
          },
          location: location,
          device: order.devices?.model ? `${order.devices.type} ${order.devices.model}` : undefined,
          scheduledFor: formatDate(order.scheduled_start),
          assignedTo: order.technicians ? {
            name: order.technicians.name,
            initials: getInitials(order.technicians.name)
          } : undefined
        };
      }) || [];

      // Przekształć dane powiadomień do formatu Alert
      const formattedAlerts: Alert[] = notifications?.map(notification => {
        // Określ typ alertu
        let alertType: "warning" | "error" | "info" = "info";
        if (notification.type === "warning") alertType = "warning";
        else if (notification.type === "error") alertType = "error";

        // Formatuj czas
        const timestamp = notification.created_at
          ? formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: pl })
          : 'Nieznany czas';

        return {
          id: notification.id,
          title: notification.title || 'Powiadomienie',
          type: alertType,
          message: notification.message || '',
          source: notification.source || 'System',
          timestamp: timestamp,
          isRead: notification.is_read || false
        };
      }) || [];

      setTasks(formattedTasks)
      setAlerts(formattedAlerts)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast({
        title: "Błąd",
        description: error instanceof Error ? error.message : "Nie udało się pobrać danych",
        variant: "destructive"
      })

      // Ustaw przykładowe dane w przypadku błędu
      setTasks([
        {
          id: "T1001",
          title: "Przegląd klimatyzacji",
          type: "maintenance",
          priority: "medium",
          status: "scheduled",
          customer: {
            name: "Firma XYZ",
            initials: "XYZ"
          },
          location: "ul. Warszawska 10, Warszawa",
          device: "Klimatyzator AC-1001",
          scheduledFor: "Dziś, 14:30",
          assignedTo: {
            name: "Jan Kowalski",
            initials: "JK"
          }
        },
        {
          id: "T1002",
          title: "Naprawa pompy ciepła",
          type: "repair",
          priority: "high",
          status: "scheduled",
          customer: {
            name: "Anna Nowak",
            initials: "AN"
          },
          location: "ul. Puławska 143, Warszawa",
          device: "Pompa ciepła HP-2001",
          scheduledFor: "Jutro, 10:00",
          assignedTo: {
            name: "Piotr Wiśniewski",
            initials: "PW"
          }
        }
      ])

      setAlerts([
        {
          id: "A1001",
          title: "Wysoka temperatura urządzenia",
          type: "warning",
          message: "Klimatyzator AC-1001 zgłasza wysoką temperaturę pracy.",
          source: "IoT Monitoring",
          timestamp: "10 min temu",
          isRead: false
        },
        {
          id: "A1002",
          title: "Brak części zamiennych",
          type: "error",
          message: "Brak filtrów F7 w magazynie. Wymagane do 3 zaplanowanych przeglądów.",
          source: "System magazynowy",
          timestamp: "1 godz. temu",
          isRead: false
        }
      ])
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // Pobierz dane przy pierwszym renderowaniu
  useEffect(() => {
    fetchData()
  }, [])

  // Obsługa odświeżania
  const handleRefresh = () => {
    fetchData()
  }

  // Funkcja zwracająca kolor dla priorytetu
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-blue-500"
      case "medium":
        return "bg-amber-500"
      case "high":
        return "bg-orange-500"
      case "urgent":
        return "bg-red-500"
      default:
        return "bg-muted"
    }
  }

  // Funkcja zwracająca kolor dla typu alertu
  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case "warning":
        return "text-amber-500"
      case "error":
        return "text-red-500"
      case "info":
        return "text-blue-500"
      default:
        return "text-muted-foreground"
    }
  }

  // Funkcja zwracająca ikonę dla typu alertu
  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "info":
        return <Bell className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Nadchodzące zadania</CardTitle>
          </div>
          <div className="flex items-center space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtruj zadania</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Przeglądy</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Naprawy</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Instalacje</DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Priorytet</DropdownMenuLabel>
                <DropdownMenuCheckboxItem checked>Wysoki</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Średni</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Niski</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 w-8"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        <CardDescription>
          Zaplanowane zadania i alerty systemowe
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList className="grid grid-cols-2 h-9">
            <TabsTrigger value="tasks">Zadania</TabsTrigger>
            <TabsTrigger value="alerts">
              Alerty
              {alerts.filter(a => !a.isRead).length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 px-1.5">
                  {alerts.filter(a => !a.isRead).length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4 mt-2">
            {isLoading ? (
              // Skeleton loader dla zadań
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="flex items-start space-x-3 pb-4 last:pb-0 border-b last:border-0">
                  <Skeleton className="h-2 w-2 rounded-full mt-0.5" />
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                    <Skeleton className="h-3 w-3/4" />
                    <div className="flex items-center justify-between mt-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                </div>
              ))
            ) : tasks.length === 0 ? (
              // Komunikat o braku zadań
              <div className="text-center py-6">
                <p className="text-muted-foreground">Brak nadchodzących zadań</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Utwórz nowe zadanie
                </Button>
              </div>
            ) : (
              // Lista zadań
              tasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-3 pb-4 last:pb-0 border-b last:border-0">
                  <div className={`mt-0.5 h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-sm">{task.title}</div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-[10px] h-4">
                            {task.type === "maintenance" ? "Przegląd" :
                             task.type === "repair" ? "Naprawa" :
                             task.type === "installation" ? "Instalacja" : "Serwis"}
                          </Badge>
                          <span>#{task.id}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-xs">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{task.scheduledFor}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{task.customer.name}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{task.location}</span>
                      </div>
                    </div>

                    {task.device && (
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Package className="h-3 w-3" />
                        <span>{task.device}</span>
                      </div>
                    )}

                    {task.assignedTo && (
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">Przypisano do:</span>
                        <div className="flex items-center space-x-1">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={task.assignedTo.avatar} alt={task.assignedTo.name} />
                            <AvatarFallback className="text-[10px]">{task.assignedTo.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{task.assignedTo.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4 mt-2">
            {isLoading ? (
              // Skeleton loader dla alertów
              Array(2).fill(0).map((_, index) => (
                <div key={index} className="flex items-start space-x-3 pb-4 last:pb-0 border-b last:border-0">
                  <Skeleton className="h-4 w-4 rounded-full mt-0.5" />
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Skeleton className="h-4 w-40 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-5 w-12" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                    <div className="flex justify-end space-x-2 mt-2">
                      <Skeleton className="h-7 w-32" />
                      <Skeleton className="h-7 w-20" />
                    </div>
                  </div>
                </div>
              ))
            ) : alerts.length === 0 ? (
              // Komunikat o braku alertów
              <div className="text-center py-6">
                <p className="text-muted-foreground">Brak nowych alertów</p>
                <CheckCircle2 className="h-8 w-8 mx-auto mt-2 text-green-500" />
              </div>
            ) : (
              // Lista alertów
              alerts.map((alert) => (
                <div key={alert.id} className={`flex items-start space-x-3 pb-4 last:pb-0 border-b last:border-0 ${!alert.isRead ? 'bg-muted/30 -mx-4 px-4 py-2 rounded-md' : ''}`}>
                  <div className="mt-0.5">
                    {getAlertTypeIcon(alert.type)}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-sm">{alert.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {alert.source} • {alert.timestamp}
                        </div>
                      </div>
                      {!alert.isRead && (
                        <Badge variant="outline" className="text-[10px] h-5">
                          Nowy
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs mt-1">{alert.message}</p>

                    <div className="flex justify-end space-x-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          // Tutaj można dodać logikę oznaczania jako przeczytane
                          toast({
                            title: "Oznaczono jako przeczytane",
                            description: "Alert został oznaczony jako przeczytany",
                          })
                        }}
                      >
                        Oznacz jako przeczytane
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Szczegóły
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-1">
        <Button variant="outline" size="sm" className="w-full text-xs">
          <span>Zobacz wszystkie zadania</span>
          <ChevronRight className="ml-1 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  )
}
