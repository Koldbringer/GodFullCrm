'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  FileText, 
  BarChart, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { formatCurrency, formatNumber } from '@/lib/utils'

export function InventoryManagement() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  // Fetch inventory items with real-time updates
  const { data: inventoryItems, isLoading, error, refresh } = useRealtimeData({
    table: 'inventory_items',
    fetchData: async () => {
      // This would be replaced with your actual API call
      const response = await fetch('/api/inventory')
      if (!response.ok) throw new Error('Failed to fetch inventory items')
      return response.json()
    },
    cacheKey: 'inventory:all',
    showNotifications: true,
    notifications: {
      onInsert: (data) => `New item added: ${data.name}`,
      onUpdate: (data) => `Item updated: ${data.name}`,
      onDelete: () => 'Item removed from inventory',
      onError: () => 'Failed to load inventory data'
    }
  })
  
  // Mock data for development
  const mockItems = [
    {
      id: '1',
      name: 'Air Conditioner Filter',
      sku: 'ACF-001',
      category: 'Filters',
      quantity: 45,
      unit_price: 29.99,
      location: 'Warehouse A',
      status: 'in_stock',
      supplier: 'HVAC Supplies Inc.',
      reorder_point: 10,
      last_ordered: '2023-09-15T10:30:00Z',
      created_at: '2023-01-10T08:00:00Z',
      updated_at: '2023-10-05T14:20:00Z'
    },
    {
      id: '2',
      name: 'Refrigerant R410A',
      sku: 'REF-R410A',
      category: 'Refrigerants',
      quantity: 12,
      unit_price: 89.50,
      location: 'Warehouse B',
      status: 'in_stock',
      supplier: 'Cool Solutions Ltd.',
      reorder_point: 5,
      last_ordered: '2023-08-20T09:15:00Z',
      created_at: '2023-02-15T10:30:00Z',
      updated_at: '2023-09-10T11:45:00Z'
    },
    {
      id: '3',
      name: 'Copper Tubing 1/2"',
      sku: 'CT-050',
      category: 'Piping',
      quantity: 200,
      unit_price: 3.75,
      location: 'Warehouse A',
      status: 'in_stock',
      supplier: 'Metal Works Co.',
      reorder_point: 50,
      last_ordered: '2023-07-05T14:20:00Z',
      created_at: '2023-03-20T09:00:00Z',
      updated_at: '2023-08-15T16:30:00Z'
    },
    {
      id: '4',
      name: 'Compressor 2.5 Ton',
      sku: 'COMP-25T',
      category: 'Compressors',
      quantity: 5,
      unit_price: 450.00,
      location: 'Warehouse C',
      status: 'low_stock',
      supplier: 'HVAC Supplies Inc.',
      reorder_point: 3,
      last_ordered: '2023-06-10T11:00:00Z',
      created_at: '2023-04-05T13:45:00Z',
      updated_at: '2023-07-20T10:15:00Z'
    },
    {
      id: '5',
      name: 'Thermostat Digital',
      sku: 'THERM-DIG',
      category: 'Controls',
      quantity: 0,
      unit_price: 75.25,
      location: 'Warehouse B',
      status: 'out_of_stock',
      supplier: 'Smart Controls Inc.',
      reorder_point: 10,
      last_ordered: '2023-05-15T08:30:00Z',
      created_at: '2023-05-10T15:20:00Z',
      updated_at: '2023-06-25T09:40:00Z'
    }
  ]
  
  // Use mock data for development or when loading
  const items = inventoryItems || mockItems
  
  // Get unique categories for filter
  const categories = Array.from(new Set(items.map(item => item.category)))
  
  // Filter items based on search query and filters
  const filteredItems = items.filter(item => {
    // Filter by search query
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Filter by category
    const matchesCategory = !categoryFilter || item.category === categoryFilter
    
    // Filter by status
    const matchesStatus = !statusFilter || item.status === statusFilter
    
    // Filter by tab
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'low_stock' && item.quantity <= item.reorder_point) ||
      (activeTab === 'out_of_stock' && item.quantity === 0)
    
    return matchesSearch && matchesCategory && matchesStatus && matchesTab
  })
  
  // Handle item deletion
  const handleDeleteItem = (item: any) => {
    setSelectedItem(item)
    setIsDeleteDialogOpen(true)
  }
  
  // Confirm item deletion
  const confirmDeleteItem = async () => {
    try {
      // This would be replaced with your actual API call
      // await fetch(`/api/inventory/${selectedItem.id}`, { method: 'DELETE' })
      
      toast({
        title: 'Item deleted',
        description: `${selectedItem.name} has been removed from inventory.`,
      })
      
      // Close dialog and refresh data
      setIsDeleteDialogOpen(false)
      setSelectedItem(null)
      refresh()
    } catch (error) {
      console.error('Error deleting item:', error)
      toast({
        title: 'Error',
        description: 'There was an error deleting the item. Please try again.',
        variant: 'destructive',
      })
    }
  }
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <Badge className="bg-green-500">In Stock</Badge>
      case 'low_stock':
        return <Badge className="bg-amber-500">Low Stock</Badge>
      case 'out_of_stock':
        return <Badge className="bg-red-500">Out of Stock</Badge>
      case 'discontinued':
        return <Badge variant="outline">Discontinued</Badge>
      case 'on_order':
        return <Badge className="bg-blue-500">On Order</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
          <p className="text-muted-foreground">
            Manage your inventory items, track stock levels, and monitor usage
          </p>
        </div>
        <Button onClick={() => router.push('/inventory/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Category
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setCategoryFilter(null)}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuItem 
                  key={category} 
                  onClick={() => setCategoryFilter(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter('in_stock')}>
                In Stock
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('low_stock')}>
                Low Stock
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('out_of_stock')}>
                Out of Stock
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('on_order')}>
                On Order
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('discontinued')}>
                Discontinued
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="ghost" 
            onClick={() => {
              setSearchQuery('')
              setCategoryFilter(null)
              setStatusFilter(null)
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            All Items
            <Badge variant="outline" className="ml-2">
              {items.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="low_stock">
            Low Stock
            <Badge variant="outline" className="ml-2">
              {items.filter(item => item.quantity > 0 && item.quantity <= item.reorder_point).length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="out_of_stock">
            Out of Stock
            <Badge variant="outline" className="ml-2">
              {items.filter(item => item.quantity === 0).length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-xl">
                {activeTab === 'all' ? 'All Inventory Items' : 
                 activeTab === 'low_stock' ? 'Low Stock Items' : 
                 'Out of Stock Items'}
              </CardTitle>
              <CardDescription>
                {activeTab === 'all' ? 'View and manage all inventory items' : 
                 activeTab === 'low_stock' ? 'Items that need to be reordered soon' : 
                 'Items that are currently out of stock'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center p-8 text-destructive">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <span>Error loading inventory data. Please try again.</span>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                  <div className="mb-4">No items found matching your criteria.</div>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery('')
                    setCategoryFilter(null)
                    setStatusFilter(null)
                  }}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Item Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.sku}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="text-right">
                            <span className={
                              item.quantity === 0 ? 'text-destructive' :
                              item.quantity <= item.reorder_point ? 'text-amber-500' :
                              ''
                            }>
                              {formatNumber(item.quantity)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => router.push(`/inventory/${item.id}`)}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/inventory/${item.id}/edit`)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Item
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push(`/inventory/${item.id}/transactions`)}>
                                  <BarChart className="h-4 w-4 mr-2" />
                                  View Transactions
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteItem(item)}
                                  className="text-destructive"
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  Delete Item
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {filteredItems.length} of {items.length} items
              </div>
              <Button variant="outline" onClick={refresh}>
                Refresh
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteItem}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
