"use client"

import { useState } from "react"
import { addDays, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from "date-fns"
import { pl } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { DaySchedule } from "@/components/calendar/day-schedule"
import { CalendarFilters } from "@/components/calendar/calendar-filters"
import { Badge } from "@/components/ui/badge"

// Przykładowe dane wydarzeń
const events = [
  {
    id: "evt1",
    title: "Przegląd klimatyzacji",
    description: "Przegląd okresowy klimatyzatora Mitsubishi",
    start: new Date(2023, 10, 15, 9, 0),
    end: new Date(2023, 10, 15, 11, 0),
    customer: "Adam Bielecki",
    technician: "Piotr Nowak",
    site: "Biuro główne",
    device: "Mitsubishi Electric MSZ-AP25VG",
    type: "Przegląd",
    status: "Zaplanowana",
  },
  {
    id: "evt2",
    title: "Instalacja pompy ciepła",
    description: "Montaż nowej pompy ciepła Daikin",
    start: new Date(2023, 10, 15, 12, 0),
    end: new Date(2023, 10, 15, 16, 0),
    customer: "Celina Dąbrowska",
    technician: "Marek Kowalski",
    site: "Dom jednorodzinny",
    device: "Daikin Altherma 3 ERGA04DV",
    type: "Instalacja",
    status: "Zaplanowana",
  },
  {
    id: "evt3",
    title: "Naprawa rekuperatora",
    description: "Naprawa uszkodzonego wentylatora",
    start: new Date(2023, 10, 16, 10, 0),
    end: new Date(2023, 10, 16, 12, 30),
    customer: "Edward Fajkowski",
    technician: "Anna Wiśniewska",
    site: "Mieszkanie",
    device: "Vents VUT 350 EH EC",
    type: "Naprawa",
    status: "Zaplanowana",
  },
  {
    id: "evt4",
    title: "Wymiana filtrów",
    description: "Wymiana filtrów w klimatyzatorze",
    start: new Date(2023, 10, 17, 14, 0),
    end: new Date(2023, 10, 17, 15, 0),
    customer: "Grażyna Hołownia",
    technician: "Piotr Nowak",
    site: "Sklep",
    device: "Samsung AR09TXHQASINEU",
    type: "Konserwacja",
    status: "Zaplanowana",
  },
  {
    id: "evt5",
    title: "Konsultacja techniczna",
    description: "Omówienie opcji modernizacji systemu",
    start: new Date(2023, 10, 20, 11, 0),
    end: new Date(2023, 10, 20, 12, 0),
    customer: "Irena Jastrzębska",
    technician: "Marek Kowalski",
    site: "Biuro",
    device: "LG Artcool AC12BQ",
    type: "Konsultacja",
    status: "Zaplanowana",
  },
  {
    id: "evt6",
    title: "Przegląd gwarancyjny",
    description: "Pierwszy przegląd gwarancyjny pompy ciepła",
    start: new Date(2023, 10, 22, 9, 0),
    end: new Date(2023, 10, 22, 11, 0),
    customer: "Krzysztof Lis",
    technician: "Anna Wiśniewska",
    site: "Dom jednorodzinny",
    device: "Viessmann Vitocal 200-S",
    type: "Przegląd",
    status: "Zaplanowana",
  },
  {
    id: "evt7",
    title: "Naprawa klimatyzatora",
    description: "Naprawa wycieku czynnika chłodniczego",
    start: new Date(2023, 10, 25, 13, 0),
    end: new Date(2023, 10, 25, 15, 0),
    customer: "Monika Nowak",
    technician: "Piotr Nowak",
    site: "Mieszkanie",
    device: "Fujitsu ASYG12LMCA",
    type: "Naprawa",
    status: "Zaplanowana",
  },
  {
    id: "evt8",
    title: "Konfiguracja rekuperatora",
    description: "Dostosowanie ustawień do potrzeb klienta",
    start: new Date(2023, 10, 28, 10, 0),
    end: new Date(2023, 10, 28, 11, 30),
    customer: "Olgierd Piotrowski",
    technician: "Marek Kowalski",
    site: "Restauracja",
    device: "Zehnder ComfoAir Q350",
    type: "Konfiguracja",
    status: "Zaplanowana",
  },
]

// Funkcja pomocnicza do ustawienia aktualnej daty jeśli nie jest wybrana
const useCurrentDate = (date?: Date) => {
  const today = new Date()
  return date || today
}

export function CalendarView() {
  const [date, setDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // Filtrowanie wydarzeń dla wybranego dnia
  const selectedDayEvents = events.filter((event) => isSameDay(event.start, selectedDate))

  // Funkcja do sprawdzania, czy dzień ma wydarzenia
  const hasEvents = (day: Date) => {
    return events.some((event) => isSameDay(event.start, day))
  }

  // Funkcja do nawigacji między miesiącami
  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(date)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setDate(newDate)
  }

  // Funkcja do nawigacji między dniami
  const navigateDay = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate)
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 1)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setSelectedDate(newDate)
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "LLLL yyyy", { locale: pl })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(day) => {
                  if (day) {
                    setSelectedDate(day)
                  }
                }}
                month={date}
                onMonthChange={setDate}
                modifiers={{
                  hasEvents: (day) => hasEvents(day),
                }}
                modifiersClassNames={{
                  hasEvents: "bg-primary/10 font-bold",
                }}
                locale={pl}
              />
            </PopoverContent>
          </Popover>

          <div className="flex items-center space-x-1">
            <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
            <Filter className="mr-2 h-4 w-4" />
            Filtry
          </Button>
        </div>
      </div>

      {isFiltersOpen && <CalendarFilters />}

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }).map((_, i) => {
                const day = startOfWeek(startOfMonth(date), { locale: pl })
                const currentDay = addDays(day, i)
                return (
                  <div key={i} className="text-center text-sm font-medium py-1">
                    {format(currentDay, "EEEEEE", { locale: pl })}
                  </div>
                )
              })}

              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(day) => {
                  if (day) {
                    setSelectedDate(day)
                  }
                }}
                month={date}
                onMonthChange={setDate}
                modifiers={{
                  hasEvents: (day) => hasEvents(day),
                }}
                modifiersClassNames={{
                  hasEvents: "bg-primary/10 font-bold",
                }}
                className="w-full"
                locale={pl}
                styles={{
                  head_cell: { width: "100%" },
                  cell: { width: "100%" },
                  button: { width: "100%" },
                  nav_button_previous: { display: "none" },
                  nav_button_next: { display: "none" },
                  caption: { display: "none" },
                }}
              />
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <h3 className="font-medium">Nadchodzące wydarzenia</h3>
              <div className="space-y-2">
                {events
                  .filter((event) => event.start > new Date())
                  .sort((a, b) => a.start.getTime() - b.start.getTime())
                  .slice(0, 5)
                  .map((event) => (
                    <div key={event.id} className="flex flex-col space-y-1 p-2 border rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{event.title}</span>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(event.start, "d MMMM, HH:mm", { locale: pl })}
                      </div>
                      <div className="text-sm">{event.customer}</div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-1">
                <Button variant="outline" size="icon" onClick={() => navigateDay("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="px-2 font-medium">{format(selectedDate, "EEEE, d MMMM yyyy", { locale: pl })}</div>
                <Button variant="outline" size="icon" onClick={() => navigateDay("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  const today = new Date()
                  setSelectedDate(today)
                  if (!isSameMonth(today, date)) {
                    setDate(today)
                  }
                }}
              >
                Dzisiaj
              </Button>
            </div>

            <DaySchedule events={selectedDayEvents} date={selectedDate} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
