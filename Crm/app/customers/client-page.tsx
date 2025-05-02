"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Users, Building2, User, Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { columns } from "@/components/customers/columns"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CustomerFilterBar } from "@/components/customers/customer-filter-bar"
import { createClient } from "@/lib/supabase/client"
import { useSearchParams } from "next/navigation"

interface CustomerClientPageProps {
  initialData: any[]
  initialCount: number
}

export function CustomerClientPage({ initialData, initialCount }: CustomerClientPageProps) {
  const searchParams = useSearchParams()
  const [data, setData] = useState(initialData)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  
  // Get filter values from URL
  const search = searchParams.get("search") || ""
  const type = searchParams.get("type")
  const status = searchParams.get("status")
  
  // Fetch data when filters change
  useEffect(() => {
    const fetchFilteredData = async () => {
      setLoading(true)
      try {
        const supabase = createClient()
        
        // Build query
        let query = supabase
          .from('customers')
          .select('*', { count: 'exact' })
        
        // Apply filters
        if (search) {
          query = query.ilike('name', `%${search}%`)
        }
        
        if (type) {
          query = query.eq('type', type)
        }
        
        if (status) {
          query = query.eq('status', status)
        }
        
        // Add sorting and limits
        query = query.order('name', { ascending: true }).limit(100)
        
        // Execute query
        const { data: filteredData, error, count: filteredCount } = await query
        
        if (error) {
          console.error('Error fetching filtered customers:', error)
          return
        }
        
        setData(filteredData || [])
        setCount(filteredCount || 0)
      } catch (error) {
        console.error('Error in fetchFilteredData:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchFilteredData()
  }, [search, type, status])
  
  // Mapowanie danych do formatu oczekiwanego przez DataTable
  const tableData = data.map(customer => ({
    id: customer.id,
    name: customer.name,
    tax_id: customer.tax_id || "",
    email: customer.email,
    phone: customer.phone,
    type: customer.type,
    status: customer.status,
    created_at: customer.created_at,
  }))
  
  // Liczba klientów biznesowych i indywidualnych
  const businessCustomers = data.filter(c => c.type === "Biznesowy").length
  const individualCustomers = data.filter(c => c.type === "Indywidualny").length
  
  // Liczba nowych klientów (ostatnie 30 dni)
  const newCustomers = data.filter(c => {
    const date = new Date(c.created_at)
    const now = new Date()
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
    return date >= thirtyDaysAgo
  }).length
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Klienci</h1>
          <p className="text-muted-foreground">Zarządzaj klientami i ich danymi</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Download className="mr-2 h-4 w-4" />
            Eksportuj
          </Button>
          <Button asChild>
            <Link href="/customers/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Dodaj klienta
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30">
            <CardTitle className="text-sm font-medium">Wszyscy klienci</CardTitle>
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{count}</div>
            <p className="text-xs text-muted-foreground mt-1">Liczba klientów w systemie</p>
          </CardContent>
          <CardFooter className="p-2 border-t bg-muted/30">
            <Link href="/customers" className="text-xs text-muted-foreground hover:text-primary flex items-center w-full justify-end">
              Zarządzaj klientami
            </Link>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30">
            <CardTitle className="text-sm font-medium">Klienci biznesowi</CardTitle>
            <Building2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{businessCustomers}</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">Liczba klientów biznesowych</p>
              <Badge variant="outline" className="text-xs font-normal">
                {count > 0 ? Math.round((businessCustomers / count) * 100) : 0}%
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="p-2 border-t bg-muted/30">
            <Link href="/customers?type=Biznesowy" className="text-xs text-muted-foreground hover:text-primary flex items-center w-full justify-end">
              Pokaż klientów biznesowych
            </Link>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30">
            <CardTitle className="text-sm font-medium">Klienci indywidualni</CardTitle>
            <User className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{individualCustomers}</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">Liczba klientów indywidualnych</p>
              <Badge variant="outline" className="text-xs font-normal">
                {count > 0 ? Math.round((individualCustomers / count) * 100) : 0}%
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="p-2 border-t bg-muted/30">
            <Link href="/customers?type=Indywidualny" className="text-xs text-muted-foreground hover:text-primary flex items-center w-full justify-end">
              Pokaż klientów indywidualnych
            </Link>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30">
            <CardTitle className="text-sm font-medium">Nowi klienci</CardTitle>
            <Upload className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{newCustomers}</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">Dodani w ciągu ostatnich 30 dni</p>
              <Badge variant="outline" className="text-xs font-normal">
                {count > 0 ? Math.round((newCustomers / count) * 100) : 0}%
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="p-2 border-t bg-muted/30">
            <Link href="/customers?sort=created_at&order=desc" className="text-xs text-muted-foreground hover:text-primary flex items-center w-full justify-end">
              Pokaż nowych klientów
            </Link>
          </CardFooter>
        </Card>
      </div>

      <CustomerFilterBar className="mb-4" />

      <div className="space-y-4">
        <DataTable
          data={tableData}
          columns={columns}
          toolbar={false} // Disable the default toolbar since we're using our custom filter bar
        />
      </div>
    </div>
  )
}
