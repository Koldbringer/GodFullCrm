"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, CheckIcon, ChevronsUpDown, Laptop, MapPin, User, Wrench } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const eventTypes = [
  { value: "installation", label: "Instalacja" },
  { value: "service", label: "Serwis" },
  { value: "inspection", label: "Oględziny" },
]

const statusOptions = [
  { value: "planned", label: "Zaplanowany" },
  { value: "in-progress", label: "W trakcie" },
  { value: "completed", label: "Zakończony" },
  { value: "cancelled", label: "Anulowany" },
]

const formSchema = z.object({
  type: z.string({
    required_error: "Wybierz typ wydarzenia",
  }),
  title: z.string().min(3, {
    message: "Tytuł musi mieć co najmniej 3 znaki",
  }),
  startDate: z.date({
    required_error: "Data rozpoczęcia jest wymagana",
  }),
  endDate: z.date({
    required_error: "Data zakończenia jest wymagana",
  }).optional(),
  client: z.string().min(2, {
    message: "Nazwa klienta musi mieć co najmniej 2 znaki",
  }),
  technician: z.string().min(2, {
    message: "Imię technika musi mieć co najmniej 2 znaki",
  }),
  location: z.string().min(2, {
    message: "Lokalizacja musi mieć co najmniej 2 znaki",
  }),
  device: z.string().optional(),
  status: z.string(),
  description: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

const defaultValues = {
  type: "service",
  title: "",
  startDate: new Date(),
  endDate: undefined,
  client: "",
  technician: "",
  location: "",
  device: "",
  status: "planned",
  description: "",
}

const EventFormModal = ({ open, setOpen, onSubmit }: { open: boolean, setOpen: (v: boolean) => void, onSubmit: (data: FormData) => void }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  function handleSubmit(data: FormData) {
    onSubmit(data)
    setOpen(false)
    form.reset(defaultValues)
    toast({ title: "Dodano wydarzenie", description: data.title })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj nowe wydarzenie</DialogTitle>
          <DialogDescription>
            Wypełnij poniższy formularz, aby dodać nowe wydarzenie do kalendarza.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Typ wydarzenia</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz typ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventTypes.map((et) => (
                        <SelectItem key={et.value} value={et.value}>{et.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tytuł</FormLabel>
                  <FormControl>
                    <Input placeholder="Tytuł wydarzenia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Data rozpoczęcia</FormLabel>
                    <FormControl>
                      <Input type="date" value={field.value ? format(field.value, 'yyyy-MM-dd') : ''} onChange={e => field.onChange(new Date(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Data zakończenia</FormLabel>
                    <FormControl>
                      <Input type="date" value={field.value ? format(field.value, 'yyyy-MM-dd') : ''} onChange={e => field.onChange(new Date(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Klient</FormLabel>
                  <FormControl>
                    <Input placeholder="Nazwa klienta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="technician"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technik</FormLabel>
                  <FormControl>
                    <Input placeholder="Imię i nazwisko technika" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokalizacja</FormLabel>
                  <FormControl>
                    <Input placeholder="Adres lub opis lokalizacji" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="device"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Urządzenie</FormLabel>
                  <FormControl>
                    <Input placeholder="Model urządzenia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map((so) => (
                        <SelectItem key={so.value} value={so.value}>{so.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opis</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Dodatkowe informacje" className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>Opcjonalne - dodatkowe informacje dotyczące wydarzenia</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Anuluj
              </Button>
              <Button type="submit">Dodaj wydarzenie</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EventFormModal
