'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CalendarIcon, Clock, MapPin, User, Wrench, FileText, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { createServiceOrder, updateServiceOrder, getServiceOrderById } from '@/lib/api'
import { useRealtimeData } from '@/hooks/useRealtimeData'

// Define the form schema with Zod
const serviceOrderSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().optional(),
  customer_id: z.string({ required_error: 'Please select a customer' }),
  site_id: z.string({ required_error: 'Please select a site' }),
  device_id: z.string().optional(),
  technician_id: z.string().optional(),
  service_type: z.enum(['maintenance', 'repair', 'installation', 'inspection']),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['new', 'in_progress', 'scheduled', 'completed', 'cancelled']),
  scheduled_start: z.date().optional(),
  scheduled_end: z.date().optional(),
  estimated_duration: z.number().min(0).optional(),
  notes: z.string().optional(),
  send_notifications: z.boolean().default(true),
  parts_required: z.array(z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number().min(1),
  })).optional(),
})

type ServiceOrderFormValues = z.infer<typeof serviceOrderSchema>

interface ServiceOrderFormProps {
  orderId?: string
  initialData?: any
}

export function ServiceOrderForm({ orderId, initialData }: ServiceOrderFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('basic')
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Fetch customers for dropdown
  const { data: customers, isLoading: isLoadingCustomers } = useRealtimeData({
    table: 'customers',
    fetchData: async () => {
      const response = await fetch('/api/customers?fields=id,name')
      if (!response.ok) throw new Error('Failed to fetch customers')
      return response.json()
    },
    cacheKey: 'customers:dropdown',
  })
  
  // Fetch sites for the selected customer
  const { data: sites, isLoading: isLoadingSites } = useRealtimeData({
    table: 'sites',
    fetchData: async () => {
      if (!selectedCustomer) return []
      const response = await fetch(`/api/customers/${selectedCustomer}/sites?fields=id,name`)
      if (!response.ok) throw new Error('Failed to fetch sites')
      return response.json()
    },
    cacheKey: `sites:customer:${selectedCustomer}`,
    deps: [selectedCustomer],
  })
  
  // Fetch devices for the selected site
  const [selectedSite, setSelectedSite] = useState<string | null>(null)
  const { data: devices, isLoading: isLoadingDevices } = useRealtimeData({
    table: 'devices',
    fetchData: async () => {
      if (!selectedSite) return []
      const response = await fetch(`/api/sites/${selectedSite}/devices?fields=id,name,model,type`)
      if (!response.ok) throw new Error('Failed to fetch devices')
      return response.json()
    },
    cacheKey: `devices:site:${selectedSite}`,
    deps: [selectedSite],
  })
  
  // Fetch technicians for dropdown
  const { data: technicians, isLoading: isLoadingTechnicians } = useRealtimeData({
    table: 'technicians',
    fetchData: async () => {
      const response = await fetch('/api/technicians?fields=id,name,specialization,status')
      if (!response.ok) throw new Error('Failed to fetch technicians')
      return response.json()
    },
    cacheKey: 'technicians:dropdown',
  })
  
  // Fetch service order data if editing
  const { data: serviceOrder, isLoading: isLoadingServiceOrder } = useRealtimeData({
    table: 'service_orders',
    filter: orderId ? `id=eq.${orderId}` : undefined,
    fetchData: async () => {
      if (!orderId) return null
      return getServiceOrderById(orderId)
    },
    cacheKey: orderId ? `service-order:${orderId}` : undefined,
    deps: [orderId],
  })
  
  // Initialize form with default values or existing service order data
  const form = useForm<ServiceOrderFormValues>({
    resolver: zodResolver(serviceOrderSchema),
    defaultValues: {
      title: '',
      description: '',
      service_type: 'maintenance',
      priority: 'medium',
      status: 'new',
      send_notifications: true,
    },
  })
  
  // Update form values when service order data is loaded
  useEffect(() => {
    if (serviceOrder) {
      // Set selected customer and site for cascading dropdowns
      setSelectedCustomer(serviceOrder.customer_id)
      setSelectedSite(serviceOrder.site_id)
      
      // Set form values
      form.reset({
        title: serviceOrder.title || '',
        description: serviceOrder.description || '',
        customer_id: serviceOrder.customer_id,
        site_id: serviceOrder.site_id,
        device_id: serviceOrder.device_id || undefined,
        technician_id: serviceOrder.technician_id || undefined,
        service_type: serviceOrder.service_type as any || 'maintenance',
        priority: serviceOrder.priority as any || 'medium',
        status: serviceOrder.status as any || 'new',
        scheduled_start: serviceOrder.scheduled_start ? new Date(serviceOrder.scheduled_start) : undefined,
        scheduled_end: serviceOrder.scheduled_end ? new Date(serviceOrder.scheduled_end) : undefined,
        estimated_duration: serviceOrder.estimated_duration || undefined,
        notes: serviceOrder.notes || '',
        send_notifications: true,
        parts_required: serviceOrder.parts_required || [],
      })
    } else if (initialData) {
      // Set initial data if provided (for creating from customer page, etc.)
      setSelectedCustomer(initialData.customer_id)
      if (initialData.site_id) {
        setSelectedSite(initialData.site_id)
      }
      
      form.reset({
        ...form.getValues(),
        ...initialData,
      })
    }
  }, [serviceOrder, initialData, form])
  
  // Handle form submission
  async function onSubmit(data: ServiceOrderFormValues) {
    try {
      setIsSubmitting(true)
      
      if (orderId) {
        // Update existing service order
        const updated = await updateServiceOrder(orderId, {
          ...data,
          updated_at: new Date().toISOString(),
        })
        
        if (updated) {
          toast({
            title: 'Service order updated',
            description: 'The service order has been updated successfully.',
          })
          router.push(`/service-orders/${orderId}`)
        } else {
          throw new Error('Failed to update service order')
        }
      } else {
        // Create new service order
        const created = await createServiceOrder({
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        
        if (created) {
          toast({
            title: 'Service order created',
            description: 'The service order has been created successfully.',
          })
          router.push(`/service-orders/${created.id}`)
        } else {
          throw new Error('Failed to create service order')
        }
      }
    } catch (error) {
      console.error('Error submitting service order:', error)
      toast({
        title: 'Error',
        description: 'There was an error saving the service order. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle customer change to update site options
  const handleCustomerChange = (customerId: string) => {
    setSelectedCustomer(customerId)
    form.setValue('customer_id', customerId)
    form.setValue('site_id', '') // Reset site when customer changes
    form.setValue('device_id', '') // Reset device when customer changes
    setSelectedSite(null)
  }
  
  // Handle site change to update device options
  const handleSiteChange = (siteId: string) => {
    setSelectedSite(siteId)
    form.setValue('site_id', siteId)
    form.setValue('device_id', '') // Reset device when site changes
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{orderId ? 'Edit Service Order' : 'Create Service Order'}</CardTitle>
        <CardDescription>
          {orderId 
            ? 'Update the details of an existing service order' 
            : 'Create a new service order for a customer'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="parts">Parts & Materials</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter service order title" {...field} />
                        </FormControl>
                        <FormDescription>
                          A clear, concise title for the service order
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter a detailed description of the service order" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Detailed description of the work to be performed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="service_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select service type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                              <SelectItem value="repair">Repair</SelectItem>
                              <SelectItem value="installation">Installation</SelectItem>
                              <SelectItem value="inspection">Inspection</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Type of service to be performed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Priority level for this service order
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Current status of the service order
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="scheduling" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="scheduled_start"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Scheduled Start</FormLabel>
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
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
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
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            When the service is scheduled to start
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="scheduled_end"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Scheduled End</FormLabel>
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
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
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
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            When the service is scheduled to end
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="estimated_duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter estimated duration in minutes"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormDescription>
                          Estimated time required to complete the service
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="technician_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned Technician</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select technician" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Not assigned</SelectItem>
                            {technicians?.map((technician: any) => (
                              <SelectItem key={technician.id} value={technician.id}>
                                {technician.name} ({technician.specialization})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Technician assigned to this service order
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="send_notifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Send Notifications</FormLabel>
                          <FormDescription>
                            Send notifications to the customer and technician about this service order
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="customer_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer</FormLabel>
                        <Select 
                          onValueChange={(value) => handleCustomerChange(value)} 
                          defaultValue={field.value}
                          value={field.value || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select customer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isLoadingCustomers ? (
                              <SelectItem value="loading" disabled>Loading customers...</SelectItem>
                            ) : customers?.length > 0 ? (
                              customers.map((customer: any) => (
                                <SelectItem key={customer.id} value={customer.id}>
                                  {customer.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>No customers found</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Customer for this service order
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="site_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site</FormLabel>
                        <Select 
                          onValueChange={(value) => handleSiteChange(value)} 
                          defaultValue={field.value}
                          value={field.value || ''}
                          disabled={!selectedCustomer}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={selectedCustomer ? "Select site" : "Select a customer first"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {!selectedCustomer ? (
                              <SelectItem value="none" disabled>Select a customer first</SelectItem>
                            ) : isLoadingSites ? (
                              <SelectItem value="loading" disabled>Loading sites...</SelectItem>
                            ) : sites?.length > 0 ? (
                              sites.map((site: any) => (
                                <SelectItem key={site.id} value={site.id}>
                                  {site.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>No sites found for this customer</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Site location for this service order
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="device_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Device</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value || ''}
                          disabled={!selectedSite}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={selectedSite ? "Select device" : "Select a site first"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">No specific device</SelectItem>
                            {!selectedSite ? (
                              <SelectItem value="none" disabled>Select a site first</SelectItem>
                            ) : isLoadingDevices ? (
                              <SelectItem value="loading" disabled>Loading devices...</SelectItem>
                            ) : devices?.length > 0 ? (
                              devices.map((device: any) => (
                                <SelectItem key={device.id} value={device.id}>
                                  {device.model} ({device.type})
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>No devices found for this site</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Device for this service order (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter any additional notes or instructions" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Additional notes or special instructions
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="parts" className="space-y-4 pt-4">
                <div className="border rounded-md p-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    Parts and materials required for this service order will be implemented in a future update.
                  </div>
                  
                  <div className="flex items-center p-4 border rounded-md bg-muted/50">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-sm">
                      Parts management functionality is coming soon. You'll be able to select parts from inventory, 
                      specify quantities, and track usage.
                    </span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : orderId ? 'Update Service Order' : 'Create Service Order'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
