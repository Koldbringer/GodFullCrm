"use client"

import { useState } from "react"
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

export function UpcomingTasks() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  // Przykładowe dane zadań
  const tasks: Task[] = [
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
    },
    {
      id: "T1003",
      title: "Instalacja klimatyzatora",
      type: "installation",
      priority: "medium",
      status: "scheduled",
      customer: {
        name: "Jan Kowalczyk",
        initials: "JK"
      },
      location: "ul. Nowy Świat 15, Warszawa",
      device: "Klimatyzator AC-3001",
      scheduledFor: "Pojutrze, 12:00"
    }
  ]

  // Przykładowe dane alertów
  const alerts: Alert[] = [
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
    },
    {
      id: "A1003",
      title: "Nowe zlecenie serwisowe",
      type: "info",
      message: "Przydzielono nowe zlecenie serwisowe #T1004.",
      source: "System zleceń",
      timestamp: "2 godz. temu",
      isRead: true
    }
  ]

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
            {tasks.map((task) => (
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
            ))}
          </TabsContent>
          
          <TabsContent value="alerts" className="space-y-4 mt-2">
            {alerts.map((alert) => (
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
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      Oznacz jako przeczytane
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Szczegóły
                    </Button>
                  </div>
                </div>
              </div>
            ))}
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
