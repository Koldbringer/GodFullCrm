"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar, CalendarProps } from "react-day-picker"
import { Clock, MapPin, User, Wrench, CheckCircle, FileText, Building } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

interface EventFormProps {
  onSubmit?: (data: EventFormData) => void
  onCancel?: () => void
}

export interface EventFormData {
  type: "service" | "installation" | "inspection"
  title: string
  startDate: Date
  endDate: Date
  client: string
  technician: string
  location: string
  device: string
  status: "planned" | "in-progress" | "completed" | "cancelled"
  notes?: string
}

function EventForm({ onSubmit, onCancel }: EventFormProps) {
  const [startDate, setStartDate] = React.useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = React.useState<Date | undefined>(new Date())
  const [formData, setFormData] = React.useState<Partial<EventFormData>>({
    type: "service",
    title: "",
    client: "",
    technician: "",
    location: "",
    device: "",
    status: "planned",
    notes: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (startDate && endDate && formData.title && formData.client && formData.technician) {
      onSubmit?.({
        ...formData as EventFormData,
        startDate,
        endDate,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Typ zdarzenia</Label>
            <Select
              name="type"
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Wybierz typ zdarzenia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="service">Serwis</SelectItem>
                <SelectItem value="installation">Montaż</SelectItem>
                <SelectItem value="inspection">Oględziny</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Tytuł</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Wprowadź tytuł zdarzenia"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Data rozpoczęcia</Label>
            <div className="rounded-lg border border-border">
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                className="p-2 bg-background"
              />
              <div className="border-t border-border p-3">
                <div className="flex items-center gap-3">
                  <Label htmlFor="startTime" className="text-xs">
                    Godzina
                  </Label>
                  <div className="relative grow">
                    <Input
                      id="startTime"
                      type="time"
                      step="1"
                      defaultValue="09:00:00"
                      className="peer ps-9 [&::-webkit-calendar-picker-indicator]:hidden"
                    />
                    <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                      <Clock size={16} strokeWidth={2} aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Data zakończenia</Label>
            <div className="rounded-lg border border-border">
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                className="p-2 bg-background"
              />
              <div className="border-t border-border p-3">
                <div className="flex items-center gap-3">
                  <Label htmlFor="endTime" className="text-xs">
                    Godzina
                  </Label>
                  <div className="relative grow">
                    <Input
                      id="endTime"
                      type="time"
                      step="1"
                      defaultValue="10:00:00"
                      className="peer ps-9 [&::-webkit-calendar-picker-indicator]:hidden"
                    />
                    <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                      <Clock size={16} strokeWidth={2} aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client">Klient</Label>
            <div className="relative">
              <Input
                id="client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                placeholder="Wprowadź nazwę klienta"
                className="pl-10"
                required
              />
              <Building className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="technician">Technik</Label>
            <div className="relative">
              <Input
                id="technician"
                name="technician"
                value={formData.technician}
                onChange={handleChange}
                placeholder="Wprowadź imię i nazwisko technika"
                className="pl-10"
                required
              />
              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lokalizacja</Label>
            <div className="relative">
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Wprowadź adres"
                className="pl-10"
                required
              />
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="device">Urządzenie</Label>
            <div className="relative">
              <Input
                id="device"
                name="device"
                value={formData.device}
                onChange={handleChange}
                placeholder="Wprowadź nazwę urządzenia"
                className="pl-10"
                required
              />
              <Wrench className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              name="status"
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Wybierz status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Zaplanowane</SelectItem>
                <SelectItem value="in-progress">W trakcie</SelectItem>
                <SelectItem value="completed">Zakończone</SelectItem>
                <SelectItem value="cancelled">Anulowane</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notatki</Label>
            <div className="relative">
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Dodatkowe informacje..."
                className="min-h-[120px] pl-10 pt-8"
              />
              <FileText className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>
            Anuluj
          </Button>
        </DialogClose>
        <Button type="submit">Dodaj zdarzenie</Button>
      </DialogFooter>
    </form>
  )
}

function AddCalendarEvent() {
  const handleSubmit = (data: EventFormData) => {
    console.log("Event data:", data)
    // Here you would typically save the event to your database
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <CheckCircle size={16} strokeWidth={2} />
          <span>Dodaj zdarzenie</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Dodaj nowe zdarzenie do kalendarza</DialogTitle>
          <DialogDescription>
            Wypełnij formularz, aby dodać nowe zdarzenie do kalendarza.
          </DialogDescription>
        </DialogHeader>
        <EventForm />
      </DialogContent>
    </Dialog>
  )
}

export default function CalendarEventFormDemo() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <AddCalendarEvent />
    </div>
  )
}
