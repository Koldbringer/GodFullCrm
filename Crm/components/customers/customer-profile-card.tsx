'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  User, Building, MapPin, Phone, Mail, Calendar, 
  CreditCard, FileText, BarChart, Edit, Star, 
  Clock, AlertTriangle, CheckCircle
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Customer } from '@/lib/api'

interface CustomerProfileCardProps {
  customerId: string
  initialData?: Customer
}

export function CustomerProfileCard({ customerId, initialData }: CustomerProfileCardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  
  // Fetch customer data with real-time updates
  const { data: customer, isLoading, error, refresh } = useRealtimeData({
    table: 'customers',
    filter: `id=eq.${customerId}`,
    fetchData: async () => {
      // This would be replaced with your actual API call
      const response = await fetch(`/api/customers/${customerId}?include=all`)
      if (!response.ok) throw new Error('Failed to fetch customer')
      return response.json()
    },
    cacheKey: `customer:${customerId}:full`,
    showNotifications: true,
    notifications: {
      onUpdate: () => 'Customer profile updated',
      onError: () => 'Failed to load customer profile'
    },
    deps: [customerId]
  })
  
  // Use initial data while loading
  const customerData = isLoading && initialData ? initialData : customer
  
  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="bg-destructive/10">
          <CardTitle className="text-destructive">Error Loading Customer Profile</CardTitle>
          <CardDescription>{error.message}</CardDescription>
        </CardHeader>
        <CardFooter className="pt-4">
          <Button onClick={refresh} variant="outline">Retry</Button>
        </CardFooter>
      </Card>
    )
  }
  
  if (isLoading && !initialData) {
    return (
      <Card className="w-full">
        <CardHeader className="animate-pulse bg-muted/50">
          <div className="h-7 w-1/3 bg-muted rounded"></div>
          <div className="h-5 w-1/2 bg-muted rounded mt-2"></div>
        </CardHeader>
        <CardContent className="animate-pulse">
          <div className="space-y-4">
            <div className="h-5 w-full bg-muted rounded"></div>
            <div className="h-5 w-full bg-muted rounded"></div>
            <div className="h-5 w-2/3 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  if (!customerData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Customer Not Found</CardTitle>
          <CardDescription>The requested customer profile could not be found.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/customers">
            <Button variant="outline">Back to Customers</Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }
  
  // Calculate customer metrics
  const totalOrders = customerData.service_orders?.length || 0
  const totalSpent = customerData.invoices?.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0) || 0
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0
  const lastOrderDate = customerData.service_orders?.length 
    ? new Date(Math.max(...customerData.service_orders.map(o => new Date(o.created_at || 0).getTime())))
    : null
  
  // Determine customer status
  const getCustomerStatus = () => {
    if (!customerData.status) return 'inactive'
    return customerData.status.toLowerCase()
  }
  
  const getStatusBadge = () => {
    const status = getCustomerStatus()
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>
      case 'lead':
        return <Badge className="bg-blue-500">Lead</Badge>
      case 'prospect':
        return <Badge className="bg-purple-500">Prospect</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }
  
  // Determine customer value
  const getCustomerValueIndicator = () => {
    const value = customerData.wealth_assessment || 1
    
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    )
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              {customerData.name}
              {getStatusBadge()}
            </CardTitle>
            <CardDescription className="text-base mt-1">
              {customerData.type || 'Customer'} • Added {formatDate(customerData.created_at || '')}
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/customers/${customerId}/edit`}>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Edit Customer</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-4">
          <TabsContent value="overview" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{customerData.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{customerData.phone || 'No phone provided'}</span>
                </div>
                {customerData.nip && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>NIP: {customerData.nip}</span>
                  </div>
                )}
                {customerData.sites && customerData.sites.length > 0 && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{customerData.sites[0].name}, {customerData.sites[0].city}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Customer Value</span>
                  {getCustomerValueIndicator()}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Orders</span>
                  <Badge variant="outline">{totalOrders}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Spent</span>
                  <Badge variant="outline">{formatCurrency(totalSpent)}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Order</span>
                  <Badge variant="outline">
                    {lastOrderDate ? formatDate(lastOrderDate.toISOString()) : 'Never'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href={`/customers/${customerId}/service-orders`} className="w-full">
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Service Orders
                </Button>
              </Link>
              <Link href={`/customers/${customerId}/invoices`} className="w-full">
                <Button variant="outline" className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Invoices
                </Button>
              </Link>
              <Link href={`/customers/${customerId}/analytics`} className="w-full">
                <Button variant="outline" className="w-full">
                  <BarChart className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
              </Link>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="m-0">
            <div className="space-y-4">
              {/* Customer details content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Basic Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customer Type</span>
                      <span>{customerData.type || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created At</span>
                      <span>{formatDate(customerData.created_at || '')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Updated At</span>
                      <span>{formatDate(customerData.updated_at || '')}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Additional Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sites</span>
                      <span>{customerData.sites?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Devices</span>
                      <span>{customerData.devices?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contacts</span>
                      <span>{customerData.customer_contacts?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sites section */}
              {customerData.sites && customerData.sites.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Sites</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customerData.sites.map((site) => (
                      <div key={site.id} className="border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{site.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {site.street}, {site.city} {site.zip_code}
                            </div>
                          </div>
                          <Badge variant={site.status === 'active' ? 'default' : 'outline'}>
                            {site.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="m-0">
            <div className="space-y-4">
              {/* Recent activity */}
              <div>
                <h3 className="text-sm font-medium mb-2">Recent Activity</h3>
                {customerData.service_orders && customerData.service_orders.length > 0 ? (
                  <div className="space-y-3">
                    {customerData.service_orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-start gap-3 border-b pb-3">
                        <div className="mt-0.5">
                          {order.status === 'completed' ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : order.status === 'cancelled' ? (
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <Link href={`/service-orders/${order.id}`} className="font-medium hover:underline">
                              {order.title}
                            </Link>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(order.created_at || '')}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {order.service_type} • {order.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No recent activity found
                  </div>
                )}
              </div>
              
              {/* Upcoming appointments */}
              {customerData.service_orders && customerData.service_orders.some(o => o.scheduled_start && new Date(o.scheduled_start) > new Date()) && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Upcoming Appointments</h3>
                  <div className="space-y-3">
                    {customerData.service_orders
                      .filter(o => o.scheduled_start && new Date(o.scheduled_start) > new Date())
                      .sort((a, b) => new Date(a.scheduled_start!).getTime() - new Date(b.scheduled_start!).getTime())
                      .slice(0, 3)
                      .map((order) => (
                        <div key={order.id} className="flex items-start gap-3 border-b pb-3">
                          <div className="mt-0.5">
                            <Calendar className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <Link href={`/service-orders/${order.id}`} className="font-medium hover:underline">
                                {order.title}
                              </Link>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(order.scheduled_start || '')}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {order.service_type} • {order.status}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="financial" className="m-0">
            <div className="space-y-4">
              {/* Financial summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4">
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                  <div className="text-2xl font-bold mt-1">{formatCurrency(totalSpent)}</div>
                </div>
                <div className="border rounded-md p-4">
                  <div className="text-sm text-muted-foreground">Average Order Value</div>
                  <div className="text-2xl font-bold mt-1">{formatCurrency(averageOrderValue)}</div>
                </div>
                <div className="border rounded-md p-4">
                  <div className="text-sm text-muted-foreground">Outstanding Balance</div>
                  <div className="text-2xl font-bold mt-1">
                    {formatCurrency(
                      customerData.invoices
                        ?.filter(i => i.status === 'unpaid')
                        .reduce((sum, i) => sum + (i.total_amount || 0), 0) || 0
                    )}
                  </div>
                </div>
              </div>
              
              {/* Recent invoices */}
              {customerData.invoices && customerData.invoices.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Recent Invoices</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Invoice #
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        {customerData.invoices.slice(0, 5).map((invoice) => (
                          <tr key={invoice.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <Link href={`/invoices/${invoice.id}`} className="hover:underline">
                                {invoice.invoice_number}
                              </Link>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                              {formatDate(invoice.created_at || '')}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {formatCurrency(invoice.total_amount || 0)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <Badge 
                                variant={invoice.status === 'paid' ? 'default' : 
                                        invoice.status === 'overdue' ? 'destructive' : 'outline'}
                              >
                                {invoice.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" onClick={refresh}>Refresh</Button>
        <Link href={`/customers/${customerId}/service-orders/new`}>
          <Button>New Service Order</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
