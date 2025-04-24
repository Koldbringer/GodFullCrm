"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface EventFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultDate?: Date
}

export function EventForm({ open, onOpenChange, defaultDate }: EventFormProps) {
  const [date, setDate] = useState<Date | undefined>(defaultDate)
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Tutaj logika zapisywania wydarzenia
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Dodaj nowe wydarzenie</DialogTitle>
          <DialogDescription>Uzupełnij formularz, aby dodać nowe wydarzenie do kalendarza.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Tytuł</FormLabel>
              <Input id="title" placeholder="Nazwa wydarzenia" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Opis</FormLabel>
              <Textarea id="description" placeholder="Opis wydarzenia" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Data</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("col-span-3 justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: pl }) : <span>Wybierz datę</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={pl} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Czas rozpoczęcia</FormLabel>
              <div className="col-span-3 flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Czas zakończenia</FormLabel>
              <div className="col-span-3 flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Klient</FormLabel>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Wybierz klienta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adam-bielecki">Adam Bielecki</SelectItem>
                  <SelectItem value="celina-dabrowska">Celina Dąbrowska</SelectItem>
                  <SelectItem value="edward-fajkowski">Edward Fajkowski</SelectItem>
                  <SelectItem value="grazyna-holownia">Grażyna Hołownia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Technik</FormLabel>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Wybierz technika" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="piotr-nowak">Piotr Nowak</SelectItem>
                  <SelectItem value="marek-kowalski">Marek Kowalski</SelectItem>
                  <SelectItem value="anna-wisniewska">Anna Wiśniewska</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Typ</FormLabel>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Wybierz typ wydarzenia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="przeglad">Przegląd</SelectItem>
                  <SelectItem value="instalacja">Instalacja</SelectItem>
                  <SelectItem value="naprawa">Naprawa</SelectItem>
                  <SelectItem value="konserwacja">Konserwacja</SelectItem>
                  <SelectItem value="konsultacja">Konsultacja</SelectItem>
                  <SelectItem value="konfiguracja">Konfiguracja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Anuluj
            </Button>
            <Button type="submit">Zapisz</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
