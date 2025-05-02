"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  Calendar as CalendarIcon,
  CheckCircle,
  AlertCircle,
  Clock4,
  Loader2
} from "lucide-react"
import { format, isSameDay, addDays, subDays, parseISO } from "date-fns"
import { pl } from "date-fns/locale"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

// Define the event type
interface CalendarEvent {
  id: string
  title: string
  date: Date
  endDate: Date
  customer: string
  address: string
  type: string
  status: string
}

// Fallback events in case of error
const fallbackEvents: CalendarEvent[] = [
  {
    id: "evt1",
    title: "Montaż klimatyzacji",
    date: new Date(2024, 4, 15, 10, 0),
    endDate: new Date(2024, 4, 15, 13, 0),
    customer: "Jan Kowalski",
    address: "ul. Przykładowa 123, Warszawa",
    type: "installation",
    status: "scheduled"
  }
]

export default function MobileCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [calendarView, setCalendarView] = useState<"month" | "day">("day")
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      try {
        const supabase = createClient()

        // Get service orders with related data
        const { data, error } = await supabase
          .from('service_orders')
          .select(`
            id,
            title,
            description,
            status,
            service_type,
            scheduled_start,
            scheduled_end,
            customers (id, name),
            sites (id, name, street, city, zip_code)
          `)
          .not('status', 'in', '("completed","cancelled")')
          .order('scheduled_start', { ascending: true })

        if (error) {
          throw error
        }

        // Transform the data into calendar events
        const calendarEvents: CalendarEvent[] = data.map(order => ({
          id: order.id,
          title: order.title || `Zlecenie #${order.id}`,
          date: order.scheduled_start ? new Date(order.scheduled_start) : new Date(),
          endDate: order.scheduled_end ? new Date(order.scheduled_end) : new Date(new Date(order.scheduled_start).getTime() + 2 * 60 * 60 * 1000),
          customer: order.customers?.name || "Nieznany klient",
          address: order.sites ? `${order.sites.street}, ${order.sites.city}` : "Adres nieznany",
          type: order.service_type || "maintenance",
          status: order.status || "scheduled"
        }))

        setEvents(calendarEvents)
      } catch (error) {
        console.error("Error fetching calendar events:", error)
        toast.error("Nie udało się pobrać harmonogramu")
        setEvents(fallbackEvents)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date))
  }

  const hasEvents = (date: Date) => {
    return events.some(event => isSameDay(event.date, date))
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "installation":
        return "bg-blue-500"
      case "maintenance":
        return "bg-green-500"
      case "repair":
        return "bg-red-500"
      case "inspection":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "installation":
        return <CalendarIcon className="h-4 w-4" />
      case "maintenance":
        return <CheckCircle className="h-4 w-4" />
      case "repair":
        return <AlertCircle className="h-4 w-4" />
      case "inspection":
        return <Clock4 className="h-4 w-4" />
      default:
        return <CalendarIcon className="h-4 w-4" />
    }
  }

  const getEventTypeName = (type: string) => {
    switch (type) {
      case "installation":
        return "Montaż"
      case "maintenance":
        return "Przegląd"
      case "repair":
        return "Naprawa"
      case "inspection":
        return "Oględziny"
      default:
        return type
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kalendarz</h1>
        <div className="flex space-x-2">
          {isLoading && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
          <Button
            variant={calendarView === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => setCalendarView("day")}
            disabled={isLoading}
          >
            Dzień
          </Button>
          <Button
            variant={calendarView === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setCalendarView("month")}
            disabled={isLoading}
          >
            Miesiąc
          </Button>
        </div>
      </div>

      {calendarView === "month" ? (
        <Card>
          <CardContent className="p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md"
              modifiers={{
                hasEvents: hasEvents,
              }}
              modifiersClassNames={{
                hasEvents: "bg-primary/10 font-bold",
              }}
              locale={pl}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDate(subDays(selectedDate, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              onClick={() => setCalendarView("month")}
            >
              {format(selectedDate, "EEEE, d MMMM yyyy", { locale: pl })}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">Ładowanie wydarzeń...</p>
                </CardContent>
              </Card>
            ) : getEventsForDay(selectedDate).length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Brak zaplanowanych wydarzeń na ten dzień
                </CardContent>
              </Card>
            ) : (
              getEventsForDay(selectedDate).map(event => (
                <Card key={event.id} className="overflow-hidden">
                  <div className={`h-1 ${getEventTypeColor(event.type)}`} />
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{event.title}</h3>
                      <Badge variant="outline" className="ml-2">
                        {getEventTypeName(event.type)}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>
                          {format(event.date, "HH:mm")} - {format(event.endDate, "HH:mm")}
                        </span>
                      </div>

                      <div className="flex items-center text-muted-foreground">
                        <User className="mr-2 h-4 w-4" />
                        <span>{event.customer}</span>
                      </div>

                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{event.address}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t flex justify-between">
                      <Button variant="outline" size="sm">
                        Szczegóły
                      </Button>

                      <Button variant="default" size="sm">
                        Rozpocznij
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {calendarView === "month" && (
        <div className="space-y-3 mt-4">
          <h2 className="font-medium">
            Wydarzenia na {format(selectedDate, "d MMMM", { locale: pl })}:
          </h2>

          {isLoading ? (
            <div className="text-center py-4">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-muted-foreground">Ładowanie wydarzeń...</p>
            </div>
          ) : getEventsForDay(selectedDate).length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Brak zaplanowanych wydarzeń na ten dzień
            </p>
          ) : (
            getEventsForDay(selectedDate).map(event => (
              <div key={event.id} className="flex items-center p-2 border rounded-md">
                <div className={`h-10 w-1 rounded-full mr-3 ${getEventTypeColor(event.type)}`} />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-sm">{event.title}</h3>
                    <span className="text-xs text-muted-foreground">
                      {format(event.date, "HH:mm")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{event.customer}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
