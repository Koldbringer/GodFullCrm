"use client"

import { format } from "date-fns"
import { pl } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Definicja typu dla wydarzenia
interface CalendarEvent {
  id: string
  title: string
  description: string
  start: Date
  end: Date
  customer: string
  technician: string
  site: string
  device: string
  type: string
  status: string
}

interface DayScheduleProps {
  events: CalendarEvent[]
  date: Date
}

// Godziny wyświetlane w harmonogramie (od 7:00 do 19:00)
const hours = Array.from({ length: 13 }, (_, i) => i + 7)

export function DaySchedule({ events, date }: DayScheduleProps) {
  // Sortowanie wydarzeń według czasu rozpoczęcia
  const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime())

  // Funkcja do określania pozycji i wysokości wydarzenia w siatce
  const getEventPosition = (event: CalendarEvent) => {
    const startHour = event.start.getHours()
    const startMinute = event.start.getMinutes()
    const endHour = event.end.getHours()
    const endMinute = event.end.getMinutes()

    const top = (startHour - 7) * 60 + startMinute
    const height = (endHour - startHour) * 60 + (endMinute - startMinute)

    return {
      top: `${top}px`,
      height: `${height}px`,
    }
  }

  // Funkcja do określania koloru wydarzenia na podstawie typu
  const getEventColor = (type: string) => {
    switch (type) {
      case "Przegląd":
        return "bg-blue-100 border-blue-300 text-blue-800"
      case "Instalacja":
        return "bg-green-100 border-green-300 text-green-800"
      case "Naprawa":
        return "bg-red-100 border-red-300 text-red-800"
      case "Konserwacja":
        return "bg-yellow-100 border-yellow-300 text-yellow-800"
      case "Konsultacja":
        return "bg-purple-100 border-purple-300 text-purple-800"
      case "Konfiguracja":
        return "bg-indigo-100 border-indigo-300 text-indigo-800"
      default:
        return "bg-gray-100 border-gray-300 text-gray-800"
    }
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-[60px_1fr] h-[780px]">
        {/* Kolumna godzin */}
        <div className="flex flex-col">
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-[60px] border-t flex items-start justify-end pr-2 text-sm text-muted-foreground"
            >
              {hour}:00
            </div>
          ))}
        </div>

        {/* Siatka harmonogramu */}
        <div className="relative border-l">
          {hours.map((hour) => (
            <div key={hour} className="h-[60px] border-t" />
          ))}

          {/* Wydarzenia */}
          <div className="absolute inset-0">
            <TooltipProvider>
              {sortedEvents.map((event) => {
                const { top, height } = getEventPosition(event)
                const colorClass = getEventColor(event.type)

                return (
                  <Tooltip key={event.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "absolute left-1 right-1 p-2 rounded border overflow-hidden cursor-pointer",
                          colorClass,
                        )}
                        style={{ top, height }}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-xs truncate">
                          {format(event.start, "HH:mm", { locale: pl })} - {format(event.end, "HH:mm", { locale: pl })}
                        </div>
                        <div className="text-xs truncate">{event.customer}</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-md">
                      <div className="space-y-2">
                        <div className="font-bold">{event.title}</div>
                        <div>
                          <Badge variant="outline">{event.type}</Badge>
                        </div>
                        <div className="text-sm">{event.description}</div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                          <div className="text-muted-foreground">Klient:</div>
                          <div>{event.customer}</div>
                          <div className="text-muted-foreground">Technik:</div>
                          <div>{event.technician}</div>
                          <div className="text-muted-foreground">Lokalizacja:</div>
                          <div>{event.site}</div>
                          <div className="text-muted-foreground">Urządzenie:</div>
                          <div>{event.device}</div>
                          <div className="text-muted-foreground">Czas:</div>
                          <div>
                            {format(event.start, "HH:mm", { locale: pl })} -{" "}
                            {format(event.end, "HH:mm", { locale: pl })}
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-2">
                          <Button size="sm" variant="outline">
                            Edytuj
                          </Button>
                          <Button size="sm">Szczegóły</Button>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </TooltipProvider>
          </div>

          {/* Komunikat o braku wydarzeń */}
          {sortedEvents.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Card className="w-[300px]">
                <CardContent className="p-4 text-center">
                  <p className="mb-2">Brak zaplanowanych wydarzeń na ten dzień</p>
                  <Button size="sm">Dodaj wydarzenie</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
