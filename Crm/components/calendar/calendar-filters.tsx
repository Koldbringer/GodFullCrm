"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useState } from "react"

// Przykładowe dane dla filtrów
const technicians = [
  { value: "piotr-nowak", label: "Piotr Nowak" },
  { value: "marek-kowalski", label: "Marek Kowalski" },
  { value: "anna-wisniewska", label: "Anna Wiśniewska" },
]

const eventTypes = [
  { value: "przeglad", label: "Przegląd", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { value: "instalacja", label: "Instalacja", color: "bg-green-100 text-green-800 border-green-300" },
  { value: "naprawa", label: "Naprawa", color: "bg-red-100 text-red-800 border-red-300" },
  { value: "konserwacja", label: "Konserwacja", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  { value: "konsultacja", label: "Konsultacja", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { value: "konfiguracja", label: "Konfiguracja", color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
]

const statuses = [
  { value: "zaplanowana", label: "Zaplanowana" },
  { value: "w-trakcie", label: "W trakcie" },
  { value: "zakonczona", label: "Zakończona" },
  { value: "anulowana", label: "Anulowana" },
]

export function CalendarFilters() {
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  // Funkcja do przełączania wartości w tablicy
  const toggleArrayValue = (array: string[], value: string) => {
    return array.includes(value) ? array.filter((item) => item !== value) : [...array, value]
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Technicy</CardTitle>
          <CardDescription>Filtruj wydarzenia według techników</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {technicians.map((technician) => (
              <div key={technician.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`technician-${technician.value}`}
                  checked={selectedTechnicians.includes(technician.value)}
                  onChange={() => setSelectedTechnicians(toggleArrayValue(selectedTechnicians, technician.value))}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor={`technician-${technician.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {technician.label}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Typy wydarzeń</CardTitle>
          <CardDescription>Filtruj wydarzenia według typu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {eventTypes.map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`type-${type.value}`}
                  checked={selectedTypes.includes(type.value)}
                  onChange={() => setSelectedTypes(toggleArrayValue(selectedTypes, type.value))}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor={`type-${type.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <Badge className={cn("font-normal", type.color)} variant="outline">
                    {type.label}
                  </Badge>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Status</CardTitle>
          <CardDescription>Filtruj wydarzenia według statusu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {statuses.map((status) => (
              <div key={status.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`status-${status.value}`}
                  checked={selectedStatuses.includes(status.value)}
                  onChange={() => setSelectedStatuses(toggleArrayValue(selectedStatuses, status.value))}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor={`status-${status.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {status.label}
                </label>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedTechnicians([])
                setSelectedTypes([])
                setSelectedStatuses([])
              }}
            >
              Wyczyść filtry
            </Button>
            <Button size="sm">Zastosuj</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
