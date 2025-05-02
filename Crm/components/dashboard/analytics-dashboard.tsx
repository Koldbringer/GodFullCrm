'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { formatCurrency, formatNumber } from '@/lib/utils'

// Dashboard colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d')
  const [activeTab, setActiveTab] = useState('overview')
  
  // Fetch dashboard data with real-time updates
  const { data: dashboardData, isLoading, error, refresh } = useRealtimeData({
    table: 'dashboard_stats',
    fetchData: async () => {
      // This would be replaced with your actual API call
      const response = await fetch(`/api/dashboard/stats?timeRange=${timeRange}`)
      if (!response.ok) throw new Error('Failed to fetch dashboard data')
      return response.json()
    },
    cacheKey: `dashboard:${timeRange}`,
    deps: [timeRange]
  })
  
  // Mock data for development
  const mockData = {
    kpis: {
      totalRevenue: 125000,
      totalOrders: 87,
      averageOrderValue: 1436.78,
      completionRate: 92.5,
      customerSatisfaction: 4.7
    },
    revenueByMonth: [
      { month: 'Jan', revenue: 12500 },
      { month: 'Feb', revenue: 15000 },
      { month: 'Mar', revenue: 18000 },
      { month: 'Apr', revenue: 16000 },
      { month: 'May', revenue: 21000 },
      { month: 'Jun', revenue: 19500 },
      { month: 'Jul', revenue: 22000 },
      { month: 'Aug', revenue: 25000 },
      { month: 'Sep', revenue: 23000 },
      { month: 'Oct', revenue: 27000 },
      { month: 'Nov', revenue: 29000 },
      { month: 'Dec', revenue: 32000 }
    ],
    ordersByType: [
      { type: 'Installation', value: 35 },
      { type: 'Maintenance', value: 25 },
      { type: 'Repair', value: 20 },
      { type: 'Inspection', value: 15 },
      { type: 'Other', value: 5 }
    ],
    topTechnicians: [
      { name: 'John Doe', completedOrders: 24, revenue: 35000 },
      { name: 'Jane Smith', completedOrders: 22, revenue: 32000 },
      { name: 'Mike Johnson', completedOrders: 18, revenue: 27000 },
      { name: 'Sarah Williams', completedOrders: 15, revenue: 22000 },
      { name: 'David Brown', completedOrders: 12, revenue: 18000 }
    ],
    customerAcquisition: [
      { month: 'Jan', newCustomers: 5, churnedCustomers: 1 },
      { month: 'Feb', newCustomers: 7, churnedCustomers: 2 },
      { month: 'Mar', newCustomers: 9, churnedCustomers: 1 },
      { month: 'Apr', newCustomers: 6, churnedCustomers: 3 },
      { month: 'May', newCustomers: 8, churnedCustomers: 2 },
      { month: 'Jun', newCustomers: 10, churnedCustomers: 1 },
      { month: 'Jul', newCustomers: 12, churnedCustomers: 2 },
      { month: 'Aug', newCustomers: 9, churnedCustomers: 3 },
      { month: 'Sep', newCustomers: 11, churnedCustomers: 2 },
      { month: 'Oct', newCustomers: 14, churnedCustomers: 1 },
      { month: 'Nov', newCustomers: 12, churnedCustomers: 2 },
      { month: 'Dec', newCustomers: 15, churnedCustomers: 3 }
    ]
  }
  
  // Use mock data for development or when loading
  const data = dashboardData || mockData
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive overview of your business performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={refresh}>Refresh</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.kpis.totalRevenue)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              +12.5% from previous period
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data.kpis.totalOrders)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              +8.2% from previous period
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.kpis.averageOrderValue)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              +3.7% from previous period
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.kpis.completionRate}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              +1.2% from previous period
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.revenueByMonth}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#0088FE" 
                        activeDot={{ r: 8 }} 
                        name="Revenue"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Orders by Type</CardTitle>
                <CardDescription>Distribution of service orders by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.ordersByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {data.ordersByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatNumber(value as number)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Technicians</CardTitle>
              <CardDescription>Based on completed orders and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.topTechnicians}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="completedOrders" name="Completed Orders" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-4 mt-4">
          {/* Revenue-specific charts and metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Revenue by service type and customer segment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                {/* Revenue breakdown charts would go here */}
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Revenue breakdown charts will be implemented here
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4 mt-4">
          {/* Orders-specific charts and metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Order Metrics</CardTitle>
              <CardDescription>Detailed order performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                {/* Order metrics charts would go here */}
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Order metrics charts will be implemented here
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Acquisition & Retention</CardTitle>
              <CardDescription>New and churned customers over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data.customerAcquisition}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="newCustomers" 
                      stroke="#0088FE" 
                      name="New Customers"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="churnedCustomers" 
                      stroke="#FF8042" 
                      name="Churned Customers"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
