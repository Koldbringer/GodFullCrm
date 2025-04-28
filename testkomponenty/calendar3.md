"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, MapPin, User, Tool, Clock, Check } from "lucide-react"

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"

// Definicje typów
interface EventFormProps {
  onSubmit?: (data: EventFormData) => void
}

interface EventFormData {
  type: string
  title: string
  startDate: Date | undefined
  endDate: Date | undefined
  client: string
  technician: string
  location: string
  device: string
  status: string
}

function EventForm({ onSubmit }: EventFormProps) {
  const [formData, setFormData] = React.useState<EventFormData>({
    type: "",
    title: "",
    startDate: undefined,
    endDate: undefined,
    client: "",
    technician: "",
    location: "",
    device: "",
    status: "zaplanowane",
  })

  const handleChange = (field: keyof EventFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="type">Typ zdarzenia</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Wybierz typ zdarzenia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="serwis">Serwis</SelectItem>
              <SelectItem value="montaż">Montaż</SelectItem>
              <SelectItem value="oględziny">Oględziny</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="title">Tytuł</Label>
          <Input
            id="title"
            placeholder="Wprowadź tytuł zdarzenia"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="startDate">Data rozpoczęcia</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? (
                  format(formData.startDate, "PPP")
                ) : (
                  <span>Wybierz datę</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => handleChange("startDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="endDate">Data zakończenia</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? (
                  format(formData.endDate, "PPP")
                ) : (
                  <span>Wybierz datę</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => handleChange("endDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="client">Klient</Label>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <Input
              id="client"
              placeholder="Nazwa klienta"
              value={formData.client}
              onChange={(e) => handleChange("client", e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="technician">Technik</Label>
          <Select
            value={formData.technician}
            onValueChange={(value) => handleChange("technician", value)}
          >
            <SelectTrigger id="technician">
              <SelectValue placeholder="Wybierz technika" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jan-kowalski">Jan Kowalski</SelectItem>
              <SelectItem value="anna-nowak">Anna Nowak</SelectItem>
              <SelectItem value="piotr-wisniewski">Piotr Wiśniewski</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="location">Lokalizacja</Label>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Input
              id="location"
              placeholder="Adres"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="device">Urządzenie</Label>
          <div className="flex items-center space-x-2">
            <Tool className="h-4 w-4 text-muted-foreground" />
            <Input
              id="device"
              placeholder="Model urządzenia"
              value={formData.device}
              onChange={(e) => handleChange("device", e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Wybierz status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="zaplanowane">Zaplanowane</SelectItem>
              <SelectItem value="w-trakcie">W trakcie</SelectItem>
              <SelectItem value="zakonczone">Zakończone</SelectItem>
              <SelectItem value="anulowane">Anulowane</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Uwagi</Label>
        <Textarea id="notes" placeholder="Dodatkowe informacje" />
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Anuluj
          </Button>
        </DialogClose>
        <Button type="submit">Dodaj zdarzenie</Button>
      </DialogFooter>
    </form>
  )
}

function AddEventDialog() {
  const handleSubmit = (data: EventFormData) => {
    console.log("Submitted event data:", data)
    // Tutaj można dodać logikę zapisywania danych
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Clock className="h-4 w-4" />
          <span>Dodaj zdarzenie</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Dodaj nowe zdarzenie</DialogTitle>
          <DialogDescription>
            Wypełnij formularz, aby dodać nowe zdarzenie do kalendarza.
          </DialogDescription>
        </DialogHeader>
        <EventForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

export default function CalendarEventFormDemo() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <AddEventDialog />
    </div>
  )
}
