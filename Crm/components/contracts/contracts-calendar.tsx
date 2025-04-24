"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Przykładowe dane przeglądów
const serviceEvents = [
  {
    id: "SVC-001",
    contractId: "CON-001",
    customer: "Centrum Handlowe Galeria",
    date: new Date(2023, 6, 15),
    type: "Przegląd kwartalny",
    technician: "Jan Kowalski",
    status: "scheduled",
  },
  {
    id: "SVC-002",
    contractId: "CON-002",
    customer: "Biurowiec Skyline",
    date: new Date(2023, 5, 1),
    type: "Przegląd kwartalny",
    technician: "Anna Nowak",
    status: "scheduled",
  },
  {
    id: "SVC-003",
    contractId: "CON-003",
    customer: "Hotel Panorama",
    date: new Date(2023, 7, 10),
    type: "Przegląd gwarancyjny",
    technician: "Piotr Wiśniewski",
    status: "scheduled",
  },
  {
    id: "SVC-004",
    contractId: "CON-004",
    customer: "Restauracja Smakosz",
    date: new Date(2023, 8, 15),
    type: "Przegląd półroczny",
    technician: "Marek Zieliński",
    status: "scheduled",
  },
  {
    id: "SVC-005",
    contractId: "CON-005",
    customer: "Szkoła Podstawowa nr 5",
    date: new Date(2023, 9, 1),
    type: "Przegląd kwartalny",
    technician: "Jan Kowalski",
    status: "scheduled",
  },
  {
    id: "SVC-006",
    contractId: "CON-001",
    customer: "Centrum Handlowe Galeria",
    date: new Date(2023, 9, 15),
    type: "Przegląd kwartalny",
    technician: "Anna Nowak",
    status: "scheduled",
  },
  {
    id: "SVC-007",
    contractId: "CON-002",
    customer: "Biurowiec Skyline",
    date: new Date(2023, 8, 1),
    type: "Przegląd kwartalny",
    technician: "Piotr Wiśniewski",
    status: "scheduled",
  },
  {
    id: "SVC-008",
    contractId: "CON-005",
    customer: "Szkoła Podstawowa nr 5",
    date: new Date(2023, 6, 1),
    type: "Przegląd kwartalny",
    technician: "Marek Zieliński",
    status: "scheduled",
  },
]

export function ContractsCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Funkcja do sprawdzania, czy data ma zaplanowane przeglądy
  const hasEvents = (day: Date) => {
    return serviceEvents.some(
      (event) =>
        event.date.getDate() === day.getDate() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear(),
    )
  }

  // Funkcja do pobierania wydarzeń dla wybranego dnia
  const getEventsForDay = (day: Date) => {
    return serviceEvents.filter(
      (event) =>
        event.date.getDate() === day.getDate() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear(),
    )
  }

  // Funkcja do formatowania daty
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pl-PL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // Funkcja do formatowania czasu
  const formatTime = (date: Date) => {
    const hour = "numeric" // Define the 'hour' variable
    return new Intl.DateTimeFormat("pl-PL", {
      hour: hour,
      minute: "numeric",
    }).format(date)
  }

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-x-4 p-4">
      {/* Kalendarz */}
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Kalendarz Przeglądów</CardTitle>
          <CardDescription>Wybierz datę, aby zobaczyć zaplanowane przeglądy.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            // @ts-ignore
            mark={() => {}}
            className="rounded-md border"
            modifiers={{
              highlight: (day: Date) => hasEvents(day),
            }}
          />
        </CardContent>
      </Card>

      {/* Lista wydarzeń dla wybranego dnia */}
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Przeglądy dla dnia: {date ? formatDate(date) : "Wybierz datę"}
          </CardTitle>
          <CardDescription>Szczegóły zaplanowanych przeglądów.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full">
            <div className="space-y-4">
              {date && getEventsForDay(date).length > 0 ? (
                getEventsForDay(date).map((event) => (
                  <div key={event.id} className="border rounded-md p-4">
                    <h3 className="font-semibold">{event.customer}</h3>
                    <p>Typ: {event.type}</p>
                    <p>Technik: {event.technician}</p>
                    <p>Godzina: {formatTime(event.date)}</p>
                    <Badge>{event.status}</Badge>
                  </div>
                ))
              ) : (
                <p>Brak zaplanowanych przeglądów na ten dzień.</p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
