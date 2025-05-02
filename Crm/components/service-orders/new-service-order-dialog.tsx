"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { createServiceOrder } from "@/lib/api"
import { getCustomers, getSites, getDevices, getTechnicians } from "@/lib/api"

// Define the form schema with Zod
const formSchema = z.object({
  title: z.string().min(3, {
    message: "Tytuł musi mieć co najmniej 3 znaki",
  }),
  description: z.string().optional(),
  customer_id: z.string({
    required_error: "Wybierz klienta",
  }),
  site_id: z.string({
    required_error: "Wybierz lokalizację",
  }),
  device_id: z.string().optional(),
  technician_id: z.string().optional(),
  service_type: z.enum(["maintenance", "repair", "installation", "inspection"], {
    required_error: "Wybierz typ zlecenia",
  }),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Wybierz priorytet",
  }),
  scheduled_start: z.date().optional(),
  status: z.string().default("new"),
})

type FormValues = z.infer<typeof formSchema>

interface NewServiceOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewServiceOrderDialog({
  open,
  onOpenChange,
}: NewServiceOrderDialogProps) {
  // State for loading data
  const [isLoading, setIsLoading] = useState(false)
  const [customers, setCustomers] = useState<any[]>([])
  const [sites, setSites] = useState<any[]>([])
  const [devices, setDevices] = useState<any[]>([])
  const [technicians, setTechnicians] = useState<any[]>([])
  const [filteredSites, setFilteredSites] = useState<any[]>([])
  const [filteredDevices, setFilteredDevices] = useState<any[]>([])

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      service_type: "maintenance",
      priority: "medium",
      status: "new",
    },
  })

  // Watch for customer_id and site_id changes to filter related data
  const watchCustomerId = form.watch("customer_id")
  const watchSiteId = form.watch("site_id")

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        // Load customers
        const customersData = await getCustomers()
        setCustomers(customersData.data || [])

        // Load all sites
        const sitesData = await getSites()
        setSites(sitesData || [])

        // Load all devices
        const devicesData = await getDevices()
        setDevices(devicesData || [])

        // Load technicians
        const techniciansData = await getTechnicians()
        setTechnicians(techniciansData || [])
      } catch (error) {
        console.error("Error loading data:", error)
        toast.error("Błąd podczas ładowania danych")
      }
    }

    if (open) {
      loadData()
    }
  }, [open])

  // Filter sites when customer changes
  useEffect(() => {
    if (watchCustomerId) {
      const filtered = sites.filter(site => site.customer_id === watchCustomerId)
      setFilteredSites(filtered)
      
      // Reset site_id if the current selection doesn't belong to the selected customer
      const currentSiteId = form.getValues("site_id")
      if (currentSiteId && !filtered.some(site => site.id === currentSiteId)) {
        form.setValue("site_id", "")
      }
    } else {
      setFilteredSites([])
    }
  }, [watchCustomerId, sites, form])

  // Filter devices when site changes
  useEffect(() => {
    if (watchSiteId) {
      const filtered = devices.filter(device => device.site_id === watchSiteId)
      setFilteredDevices(filtered)
      
      // Reset device_id if the current selection doesn't belong to the selected site
      const currentDeviceId = form.getValues("device_id")
      if (currentDeviceId && !filtered.some(device => device.id === currentDeviceId)) {
        form.setValue("device_id", "")
      }
    } else {
      setFilteredDevices([])
    }
  }, [watchSiteId, devices, form])

  // Form submission handler
  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    
    try {
      // Format the date for the API
      const formattedValues = {
        ...values,
        scheduled_start: values.scheduled_start ? values.scheduled_start.toISOString() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      // Create the service order
      const result = await createServiceOrder(formattedValues)
      
      if (result) {
        toast.success("Zlecenie serwisowe zostało utworzone")
        form.reset()
        onOpenChange(false)
      } else {
        toast.error("Błąd podczas tworzenia zlecenia serwisowego")
      }
    } catch (error) {
      console.error("Error creating service order:", error)
      toast.error("Błąd podczas tworzenia zlecenia serwisowego")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nowe zlecenie serwisowe</DialogTitle>
          <DialogDescription>
            Wypełnij formularz, aby utworzyć nowe zlecenie serwisowe.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tytuł zlecenia</FormLabel>
                  <FormControl>
                    <Input placeholder="Np. Przegląd klimatyzacji" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opis</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Szczegółowy opis zlecenia"
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Service Type */}
            <FormField
              control={form.control}
              name="service_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Typ zlecenia</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz typ zlecenia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="maintenance">Przegląd</SelectItem>
                      <SelectItem value="repair">Naprawa</SelectItem>
                      <SelectItem value="installation">Montaż</SelectItem>
                      <SelectItem value="inspection">Oględziny</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Priority */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priorytet</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz priorytet" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Niski</SelectItem>
                      <SelectItem value="medium">Średni</SelectItem>
                      <SelectItem value="high">Wysoki</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Customer */}
            <FormField
              control={form.control}
              name="customer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Klient</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz klienta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Site */}
            <FormField
              control={form.control}
              name="site_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokalizacja</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!watchCustomerId}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={watchCustomerId ? "Wybierz lokalizację" : "Najpierw wybierz klienta"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredSites.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Device */}
            <FormField
              control={form.control}
              name="device_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Urządzenie</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""} disabled={!watchSiteId}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={watchSiteId ? "Wybierz urządzenie" : "Najpierw wybierz lokalizację"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredDevices.map((device) => (
                        <SelectItem key={device.id} value={device.id}>
                          {device.model} ({device.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Opcjonalne - wybierz urządzenie, którego dotyczy zlecenie
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Technician */}
            <FormField
              control={form.control}
              name="technician_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technik</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz technika" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {technicians.map((technician) => (
                        <SelectItem key={technician.id} value={technician.id}>
                          {technician.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Opcjonalne - przypisz technika do zlecenia
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Scheduled Date */}
            <FormField
              control={form.control}
              name="scheduled_start"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Planowana data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: pl })
                          ) : (
                            <span>Wybierz datę</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Opcjonalne - wybierz planowaną datę realizacji
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Anuluj
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Tworzenie..." : "Utwórz zlecenie"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
