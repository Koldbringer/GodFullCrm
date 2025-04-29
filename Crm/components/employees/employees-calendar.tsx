"use client"

import { useState } from "react"
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns"
import { pl } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, MoreHorizontal, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Przykładowe dane pracowników
const employeesData = [
  {
    id: "EMP001",
    name: "Piotr Nowak",
    avatar: "/placeholder-user.jpg",
    position: "Technik HVAC",
    status: "available",
  },
  {
    id: "EMP002",
    name: "Anna Wiśniewska",
    avatar: "/placeholder-user.jpg",
    position: "Technik HVAC",
    status: "busy",
  },
  {
    id: "EMP003",
    name: "Marek Kowalski",
    avatar: "/placeholder-user.jpg",
    position: "Technik HVAC",
    status: "unavailable",
  },
  {
    id: "EMP004",
    name: "Tomasz Zieliński",
    avatar: "/placeholder-user.jpg",
    position: "Technik HVAC",
    status: "available",
  },
  {
    id: "EMP005",
    name: "Karolina Dąbrowska",
    avatar: "/placeholder-user.jpg",
    position: "Technik HVAC",
    status: "available",
  },
]

// Przykładowe dane harmonogramu
const scheduleData = [
  {
    id: "SCH001",
    employeeId: "EMP001",
    title: "Przegląd klimatyzacji",
    customer: "Adam Bielecki",
    location: "ul. Warszawska 10, Warszawa",
    date: "2023-11-15T09:00:00Z",
    endDate: "2023-11-15T12:00:00Z",
    type: "service",
    status: "in-progress",
  },
  {
    id: "SCH002",
    employeeId: "EMP001",
    title: "Przegląd klimatyzacji",
    customer: "Firma XYZ",
    location: "ul. Puławska 300, Warszawa",
    date: "2023-11-15T13:30:00Z",
    endDate: "2023-11-15T15:30:00Z",
    type: "service",
    status: "scheduled",
  },
  {
    id: "SCH003",
    employeeId: "EMP001",
    title: "Naprawa pompy ciepła",
    customer: "Jan Kowalski",
    location: "ul. Mokotowska 15, Warszawa",
    date: "2023-11-16T10:00:00Z",
    endDate: "2023-11-16T13:00:00Z",
    type: "repair",
    status: "scheduled",
  },
  {
    id: "SCH004",
    employeeId: "EMP002",
    title: "Przegląd rekuperatora",
    customer: "Celina Dąbrowska",
    location: "ul. Kwiatowa 5, Kraków",
    date: "2023-11-15T10:00:00Z",
    endDate: "2023-11-15T12:00:00Z",
    type: "service",
    status: "in-progress",
  },
  {
    id: "SCH005",
    employeeId: "EMP002",
    title: "Instalacja klimatyzatora",
    customer: "Jan Kowalski",
    location: "ul. Długa 15, Kraków",
    date: "2023-11-15T13:00:00Z",
    endDate: "2023-11-15T17:00:00Z",
    type: "installation",
    status: "scheduled",
  },
  {
    id: "SCH006",
    employeeId: "EMP002",
    title: "Szkolenie wewnętrzne",
    customer: "Firma HVAC",
    location: "ul. Centralna 5, Kraków",
    date: "2023-11-17T09:00:00Z",
    endDate: "2023-11-17T16:00:00Z",
    type: "training",
    status: "scheduled",
  },
  {
    id: "SCH007",
    employeeId: "EMP004",
    title: "Przegląd klimatyzacji",
    customer: "Firma ABC",
    location: "ul. Bukowska 50, Poznań",
    date: "2023-11-15T14:00:00Z",
    endDate: "2023-11-15T16:00:00Z",
    type: "service",
    status: "scheduled",
  },
  {
    id: "SCH008",
    employeeId: "EMP005",
    title: "Naprawa klimatyzatora",
    customer: "Biuro Podróży",
    location: "ul. Morska 25, Gdańsk",
    date: "2023-11-15T12:00:00Z",
    endDate: "2023-11-15T14:00:00Z",
    type: "repair",
    status: "scheduled",
  },
  {
    id: "SCH009",
    employeeId: "EMP003",
    title: "Urlop",
    customer: "",
    location: "",
    date: "2023-11-15T00:00:00Z",
    endDate: "2023-11-19T23:59:59Z",
    type: "vacation",
    status: "approved",
  },
]

export function EmployeesCalendar() {
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState<"day" | "week">("week")
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)

  // Funkcja do określania koloru typu zadania
  const getEventColor = (type: string) => {
    switch (type) {
      case "service":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "repair":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "installation":
        return "bg-green-100 text-green-800 border-green-300"
      case "training":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "vacation":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  // Funkcja do określania koloru statusu
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-300"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "scheduled":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300"
      case "approved":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  // Funkcja do formatowania czasu
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm")
  }

  // Filtrowanie zadań dla wybranego pracownika i dnia
  const getFilteredEvents = () => {
    let filteredEvents = scheduleData

    if (selectedEmployee) {
      filteredEvents = filteredEvents.filter((event) => event.employeeId === selectedEmployee)
    }

    if (view === "day") {
      filteredEvents = filteredEvents.filter((event) => {
        const eventDate = new Date(event.date)
        return isSameDay(eventDate, date)
      })
    } else if (view === "week") {
      const start = startOfWeek(date, { weekStartsOn: 1 }) // Tydzień zaczyna się od poniedziałku
      const end = endOfWeek(date, { weekStartsOn: 1 })

      filteredEvents = filteredEvents.filter((event) => {
        const eventDate = new Date(event.date)
        return eventDate >= start && eventDate <= end
      })
    }

    return filteredEvents
  }

  // Przygotowanie dni tygodnia dla widoku tygodniowego
  const weekDays = eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  })

  // Grupowanie zadań według dni tygodnia
  const eventsByDay = weekDays.map((day) => {
    return {
      date: day,
      events: getFilteredEvents().filter((event) => isSameDay(new Date(event.date), day)),
    }
  })

  // Grupowanie zadań według pracowników
  const eventsByEmployee = employeesData.map((employee) => {
    return {
      employee,
      events: getFilteredEvents().filter((event) => event.employeeId === employee.id),
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP", { locale: pl })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => setDate(addDays(date, -7))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setDate(addDays(date, 7))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant={view === "day" ? "default" : "outline"} size="sm" onClick={() => setView("day")}>
            Dzień
          </Button>
          <Button variant={view === "week" ? "default" : "outline"} size="sm" onClick={() => setView("week")}>
            Tydzień
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {selectedEmployee
                  ? employeesData.find((emp) => emp.id === selectedEmployee)?.name || "Wszyscy"
                  : "Wszyscy pracownicy"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedEmployee(null)}>Wszyscy pracownicy</DropdownMenuItem>
              <DropdownMenuSeparator />
              {employeesData.map((employee) => (
                <DropdownMenuItem key={employee.id} onClick={() => setSelectedEmployee(employee.id)}>
                  {employee.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {view === "day" ? (
        <Card>
          <CardHeader>
            <CardTitle>{format(date, "EEEE, d MMMM yyyy", { locale: pl })}</CardTitle>
            <CardDescription>
              {selectedEmployee
                ? `Harmonogram dla: ${employeesData.find((emp) => emp.id === selectedEmployee)?.name}`
                : "Harmonogram dla wszystkich pracowników"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getFilteredEvents().length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Brak zaplanowanych zadań na ten dzień.</div>
              ) : (
                getFilteredEvents()
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getEventColor(event.type)} variant="outline">
                              {event.type === "service" && "Przegląd"}
                              {event.type === "repair" && "Naprawa"}
                              {event.type === "installation" && "Instalacja"}
                              {event.type === "training" && "Szkolenie"}
                              {event.type === "vacation" && "Urlop"}
                            </Badge>
                            <span className="font-medium">{event.title}</span>
                          </div>
                          <Badge className={getStatusColor(event.status)} variant="outline">
                            {event.status === "completed" && "Zakończone"}
                            {event.status === "in-progress" && "W trakcie"}
                            {event.status === "scheduled" && "Zaplanowane"}
                            {event.status === "cancelled" && "Anulowane"}
                            {event.status === "approved" && "Zatwierdzone"}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Clock className="h-4 w-4" />
                          <span>
                            {formatTime(event.date)} - {formatTime(event.endDate)}
                          </span>
                        </div>

                        {!selectedEmployee && (
                          <div className="flex items-center gap-2 mb-3">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={
                                  employeesData.find((emp) => emp.id === event.employeeId)?.avatar ||
                                  "/placeholder-user.jpg" ||
                                  "/placeholder.svg"
                                }
                                alt="Avatar"
                              />
                              <AvatarFallback>
                                {employeesData
                                  .find((emp) => emp.id === event.employeeId)
                                  ?.name.split(" ")
                                  .map((n) => n[0])
                                  .join("") || "??"}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {employeesData.find((emp) => emp.id === event.employeeId)?.name || "Nieznany pracownik"}
                            </span>
                          </div>
                        )}

                        {event.type !== "vacation" && (
                          <>
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{event.customer}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{event.location}</span>
                            </div>
                          </>
                        )}

                        <div className="flex justify-end mt-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                              <DropdownMenuItem>Szczegóły zadania</DropdownMenuItem>
                              <DropdownMenuItem>Edytuj</DropdownMenuItem>
                              <DropdownMenuItem>Zmień status</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Anuluj</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="byDay" className="space-y-4">
          <TabsList>
            <TabsTrigger value="byDay">Według dni</TabsTrigger>
            <TabsTrigger value="byEmployee" disabled={!!selectedEmployee}>
              Według pracowników
            </TabsTrigger>
          </TabsList>

          <TabsContent value="byDay">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {eventsByDay.map((day) => (
                <Card key={day.date.toISOString()} className="overflow-hidden">
                  <CardHeader className="p-3">
                    <CardTitle className="text-center text-sm">{format(day.date, "EEEE", { locale: pl })}</CardTitle>
                    <CardDescription className="text-center">
                      {format(day.date, "d MMM", { locale: pl })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-2 max-h-[500px] overflow-y-auto">
                    {day.events.length === 0 ? (
                      <div className="text-center py-4 text-xs text-muted-foreground">Brak zadań</div>
                    ) : (
                      <div className="space-y-2">
                        {day.events
                          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                          .map((event) => (
                            <div
                              key={event.id}
                              className={`p-2 rounded-md text-xs border ${getEventColor(event.type)}`}
                            >
                              <div className="font-medium truncate">{event.title}</div>
                              <div className="flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {formatTime(event.date)} - {formatTime(event.endDate)}
                                </span>
                              </div>
                              {!selectedEmployee && (
                                <div className="flex items-center gap-1 mt-1">
                                  <User className="h-3 w-3" />
                                  <span className="truncate">
                                    {employeesData.find((emp) => emp.id === event.employeeId)?.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="byEmployee">
            <div className="space-y-4">
              {eventsByEmployee.map(({ employee, events }) => (
                <Card key={employee.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                        <AvatarFallback>
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{employee.name}</CardTitle>
                        <CardDescription>{employee.position}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {events.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          Brak zaplanowanych zadań w tym tygodniu.
                        </div>
                      ) : (
                        weekDays.map((day) => {
                          const dayEvents = events.filter((event) => isSameDay(new Date(event.date), day))
                          if (dayEvents.length === 0) return null
                          return (
                            <div key={day.toISOString()} className="space-y-2">
                              <div className="font-medium">{format(day, "EEEE, d MMMM", { locale: pl })}</div>
                              {dayEvents
                                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                .map((event) => (
                                  <div
                                    key={event.id}
                                    className={`p-2 rounded-md text-sm border ${getEventColor(event.type)}`}
                                  >
                                    <div className="flex justify-between items-start">
                                      <span className="font-medium">{event.title}</span>
                                      <Badge className={getStatusColor(event.status)} variant="outline">
                                        {event.status === "completed" && "Zakończone"}
                                        {event.status === "in-progress" && "W trakcie"}
                                        {event.status === "scheduled" && "Zaplanowane"}
                                        {event.status === "cancelled" && "Anulowane"}
                                        {event.status === "approved" && "Zatwierdzone"}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1 text-sm">
                                      <Clock className="h-3 w-3" />
                                      <span>
                                        {formatTime(event.date)} - {formatTime(event.endDate)}
                                      </span>
                                    </div>
                                    {event.type !== "vacation" && (
                                      <div className="flex items-center gap-1 mt-1 text-sm">
                                        <MapPin className="h-3 w-3" />
                                        <span className="truncate">{event.location}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              <Separator className="my-2" />
                            </div>
                          )
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
