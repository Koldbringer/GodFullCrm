'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay, parseISO } from 'date-fns'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, User, Clock, MapPin, Tool, AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { useRealtimeData } from '@/hooks/useRealtimeData'

export function TechnicianScheduler() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentWeek, setCurrentWeek] = useState<Date[]>([])
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null)
  
  // Fetch technicians with real-time updates
  const { data: technicians, isLoading: isLoadingTechnicians, error: techniciansError } = useRealtimeData({
    table: 'technicians',
    fetchData: async () => {
      // This would be replaced with your actual API call
      const response = await fetch('/api/technicians')
      if (!response.ok) throw new Error('Failed to fetch technicians')
      return response.json()
    },
    cacheKey: 'technicians:all',
  })
  
  // Fetch service orders for the selected week
  const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 }) // Start on Monday
  const endDate = endOfWeek(selectedDate, { weekStartsOn: 1 }) // End on Sunday
  
  const { data: serviceOrders, isLoading: isLoadingOrders, error: ordersError, refresh } = useRealtimeData({
    table: 'service_orders',
    fetchData: async () => {
      // This would be replaced with your actual API call
      const start = format(startDate, 'yyyy-MM-dd')
      const end = format(endDate, 'yyyy-MM-dd')
      const techFilter = selectedTechnician ? `&technician_id=${selectedTechnician}` : ''
      
      const response = await fetch(`/api/service-orders?start=${start}&end=${end}${techFilter}`)
      if (!response.ok) throw new Error('Failed to fetch service orders')
      return response.json()
    },
    cacheKey: `service-orders:week:${format(startDate, 'yyyy-MM-dd')}:${selectedTechnician || 'all'}`,
    deps: [startDate.toISOString(), selectedTechnician],
    showNotifications: true,
    notifications: {
      onInsert: (data) => `New service order scheduled: ${data.title}`,
      onUpdate: (data) => `Service order updated: ${data.title}`,
      onDelete: () => 'Service order removed from schedule',
      onError: () => 'Failed to load schedule data'
    }
  })
  
  // Mock data for development
  const mockTechnicians = [
    {
      id: 't1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+48 123 456 789',
      specialization: 'HVAC Installation',
      status: 'available',
      avatar_url: null,
      color: '#4f46e5'
    },
    {
      id: 't2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+48 234 567 890',
      specialization: 'Refrigeration',
      status: 'busy',
      avatar_url: null,
      color: '#0891b2'
    },
    {
      id: 't3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+48 345 678 901',
      specialization: 'Heating Systems',
      status: 'available',
      avatar_url: null,
      color: '#16a34a'
    },
    {
      id: 't4',
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      phone: '+48 456 789 012',
      specialization: 'Air Conditioning',
      status: 'on_leave',
      avatar_url: null,
      color: '#dc2626'
    }
  ]
  
  const mockServiceOrders = [
    {
      id: 'so1',
      title: 'AC Installation',
      description: 'Install new air conditioning unit',
      status: 'scheduled',
      priority: 'medium',
      service_type: 'installation',
      scheduled_start: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
      scheduled_end: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
      estimated_duration: 180,
      technician_id: 't1',
      customer_id: 'c1',
      site_id: 's1',
      customers: {
        name: 'Acme Corp'
      },
      sites: {
        name: 'Headquarters',
        street: '123 Main St',
        city: 'Warsaw'
      }
    },
    {
      id: 'so2',
      title: 'Heating System Maintenance',
      description: 'Annual maintenance check',
      status: 'scheduled',
      priority: 'low',
      service_type: 'maintenance',
      scheduled_start: new Date(addDays(new Date(), 1).setHours(9, 0, 0, 0)).toISOString(),
      scheduled_end: new Date(addDays(new Date(), 1).setHours(11, 0, 0, 0)).toISOString(),
      estimated_duration: 120,
      technician_id: 't3',
      customer_id: 'c2',
      site_id: 's2',
      customers: {
        name: 'XYZ Industries'
      },
      sites: {
        name: 'Factory',
        street: '456 Industrial Ave',
        city: 'Krakow'
      }
    },
    {
      id: 'so3',
      title: 'Refrigerator Repair',
      description: 'Fix cooling issue',
      status: 'scheduled',
      priority: 'high',
      service_type: 'repair',
      scheduled_start: new Date(addDays(new Date(), 2).setHours(14, 0, 0, 0)).toISOString(),
      scheduled_end: new Date(addDays(new Date(), 2).setHours(16, 0, 0, 0)).toISOString(),
      estimated_duration: 120,
      technician_id: 't2',
      customer_id: 'c3',
      site_id: 's3',
      customers: {
        name: 'Restaurant ABC'
      },
      sites: {
        name: 'Main Location',
        street: '789 Food St',
        city: 'Gdansk'
      }
    }
  ]
  
  // Use mock data for development or when loading
  const techniciansList = technicians || mockTechnicians
  const ordersList = serviceOrders || mockServiceOrders
  
  // Update current week when selected date changes
  useEffect(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 })
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 })
    const days = eachDayOfInterval({ start, end })
    setCurrentWeek(days)
  }, [selectedDate])
  
  // Navigate to previous week
  const goToPreviousWeek = () => {
    setSelectedDate(addDays(startDate, -7))
  }
  
  // Navigate to next week
  const goToNextWeek = () => {
    setSelectedDate(addDays(startDate, 7))
  }
  
  // Get service orders for a specific day and technician
  const getOrdersForDayAndTechnician = (day: Date, technicianId: string) => {
    return ordersList.filter(order => {
      const orderDate = parseISO(order.scheduled_start)
      return isSameDay(orderDate, day) && order.technician_id === technicianId
    })
  }
  
  // Get technician status badge
  const getTechnicianStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Available</Badge>
      case 'busy':
        return <Badge className="bg-amber-500">Busy</Badge>
      case 'on_leave':
        return <Badge className="bg-red-500">On Leave</Badge>
      case 'off_duty':
        return <Badge variant="outline">Off Duty</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }
  
  // Get service order priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500">High</Badge>
      case 'medium':
        return <Badge className="bg-amber-500">Medium</Badge>
      case 'low':
        return <Badge className="bg-green-500">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }
  
  // Get technician initials for avatar
  const getTechnicianInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Technician Scheduler</h2>
          <p className="text-muted-foreground">
            Schedule and manage technician appointments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {format(selectedDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" onClick={() => router.push('/service-orders/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={goToPreviousWeek}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous Week
        </Button>
        <h3 className="text-lg font-medium">
          {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
        </h3>
        <Button variant="outline" onClick={goToNextWeek}>
          Next Week
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Technicians</CardTitle>
            <CardDescription>
              Select a technician to view their schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTechnicians ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : techniciansError ? (
              <div className="flex items-center justify-center p-4 text-destructive">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>Error loading technicians. Please try again.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {techniciansList.map((technician) => (
                  <div 
                    key={technician.id} 
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-md cursor-pointer transition-colors",
                      selectedTechnician === technician.id 
                        ? "bg-primary/10 border border-primary/20" 
                        : "hover:bg-muted"
                    )}
                    onClick={() => setSelectedTechnician(
                      selectedTechnician === technician.id ? null : technician.id
                    )}
                  >
                    <Avatar className="h-10 w-10 border" style={{ borderColor: technician.color }}>
                      <AvatarImage src={technician.avatar_url || ''} alt={technician.name} />
                      <AvatarFallback style={{ backgroundColor: technician.color, color: 'white' }}>
                        {getTechnicianInitials(technician.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{technician.name}</div>
                      <div className="text-sm text-muted-foreground">{technician.specialization}</div>
                    </div>
                    {getTechnicianStatusBadge(technician.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full" onClick={() => router.push('/technicians')}>
              Manage Technicians
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
            <CardDescription>
              {selectedTechnician 
                ? `Schedule for ${techniciansList.find(t => t.id === selectedTechnician)?.name}` 
                : 'Select a technician to view their schedule'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedTechnician ? (
              <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                <User className="h-12 w-12 mb-4 opacity-50" />
                <p>Select a technician from the list to view their schedule</p>
              </div>
            ) : isLoadingOrders ? (
              <div className="space-y-4">
                {currentWeek.map((day, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <Skeleton className="h-5 w-[100px] mb-2" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ))}
              </div>
            ) : ordersError ? (
              <div className="flex items-center justify-center p-4 text-destructive">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>Error loading schedule. Please try again.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {currentWeek.map((day, index) => {
                  const ordersForDay = getOrdersForDayAndTechnician(day, selectedTechnician)
                  
                  return (
                    <div key={index} className="border rounded-md p-3">
                      <div className="font-medium mb-2">
                        {format(day, 'EEEE, MMM d')}
                      </div>
                      
                      {ordersForDay.length === 0 ? (
                        <div className="text-sm text-muted-foreground py-4 text-center">
                          No appointments scheduled
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {ordersForDay.map((order) => (
                            <div 
                              key={order.id} 
                              className="border rounded-md p-3 hover:bg-muted/50 cursor-pointer"
                              onClick={() => router.push(`/service-orders/${order.id}`)}
                            >
                              <div className="flex justify-between items-start">
                                <div className="font-medium">{order.title}</div>
                                {getPriorityBadge(order.priority)}
                              </div>
                              
                              <div className="mt-2 space-y-1 text-sm">
                                <div className="flex items-center text-muted-foreground">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  {format(parseISO(order.scheduled_start), 'h:mm a')} - 
                                  {format(parseISO(order.scheduled_end), 'h:mm a')}
                                </div>
                                <div className="flex items-center text-muted-foreground">
                                  <User className="h-3.5 w-3.5 mr-1" />
                                  {order.customers.name}
                                </div>
                                <div className="flex items-center text-muted-foreground">
                                  <MapPin className="h-3.5 w-3.5 mr-1" />
                                  {order.sites.name}, {order.sites.city}
                                </div>
                                <div className="flex items-center text-muted-foreground">
                                  <Tool className="h-3.5 w-3.5 mr-1" />
                                  {order.service_type}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full" onClick={refresh}>
              Refresh Schedule
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
