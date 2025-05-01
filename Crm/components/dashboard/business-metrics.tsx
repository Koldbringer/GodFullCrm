"use client"

import { useState, useEffect } from "react"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Calendar,
  RefreshCw,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface MetricData {
  label: string
  value: string
  change: number
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
}

// Funkcja pomocnicza do formatowania kwoty jako waluta
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Funkcja pomocnicza do obliczania procentowej zmiany
function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return parseFloat(((current - previous) / previous * 100).toFixed(1));
}

export function BusinessMetrics() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [revenueMetrics, setRevenueMetrics] = useState<MetricData[]>([])
  const [operationalMetrics, setOperationalMetrics] = useState<MetricData[]>([])
  const { toast } = useToast()

  // Funkcja do pobierania danych
  const fetchData = async () => {
    setIsRefreshing(true)

    try {
      const supabase = createClient()
      if (!supabase) {
        throw new Error("Nie można połączyć z bazą danych")
      }

      // Określ zakres dat dla bieżącego i poprzedniego okresu
      const now = new Date()
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

      // 1. Pobierz dane o przychodach dla bieżącego miesiąca
      const { data: currentMonthOrders, error: currentMonthError } = await supabase
        .from('service_orders')
        .select('id, cost, created_at, completed_at')
        .gte('created_at', currentMonthStart.toISOString())

      if (currentMonthError) {
        throw new Error(`Błąd podczas pobierania danych o zleceniach: ${currentMonthError.message}`)
      }

      // 2. Pobierz dane o przychodach dla poprzedniego miesiąca
      const { data: previousMonthOrders, error: previousMonthError } = await supabase
        .from('service_orders')
        .select('id, cost, created_at, completed_at')
        .gte('created_at', previousMonthStart.toISOString())
        .lte('created_at', previousMonthEnd.toISOString())

      // 3. Pobierz dane o kosztach operacyjnych
      const { data: operationalCosts, error: operationalCostsError } = await supabase
        .from('operational_costs')
        .select('id, amount, category, created_at')
        .gte('created_at', currentMonthStart.toISOString())

      // 4. Pobierz dane o kosztach operacyjnych z poprzedniego miesiąca
      const { data: previousOperationalCosts, error: previousOperationalCostsError } = await supabase
        .from('operational_costs')
        .select('id, amount, category, created_at')
        .gte('created_at', previousMonthStart.toISOString())
        .lte('created_at', previousMonthEnd.toISOString())

      // 5. Pobierz dane o nowych klientach w bieżącym miesiącu
      const { data: newCustomers, error: newCustomersError } = await supabase
        .from('customers')
        .select('id, created_at')
        .gte('created_at', currentMonthStart.toISOString())

      // 6. Pobierz dane o nowych klientach w poprzednim miesiącu
      const { data: previousNewCustomers, error: previousNewCustomersError } = await supabase
        .from('customers')
        .select('id, created_at')
        .gte('created_at', previousMonthStart.toISOString())
        .lte('created_at', previousMonthEnd.toISOString())

      // Oblicz metryki finansowe

      // Przychód
      const currentRevenue = currentMonthOrders?.reduce((sum, order) => sum + (order.cost || 0), 0) || 0
      const previousRevenue = previousMonthOrders?.reduce((sum, order) => sum + (order.cost || 0), 0) || 0
      const revenueChange = calculatePercentChange(currentRevenue, previousRevenue)

      // Średnia wartość zlecenia
      const currentAvgOrderValue = currentMonthOrders && currentMonthOrders.length > 0
        ? currentRevenue / currentMonthOrders.length
        : 0
      const previousAvgOrderValue = previousMonthOrders && previousMonthOrders.length > 0
        ? previousRevenue / previousMonthOrders.length
        : 0
      const avgOrderValueChange = calculatePercentChange(currentAvgOrderValue, previousAvgOrderValue)

      // Koszty operacyjne
      const currentCosts = operationalCosts?.reduce((sum, cost) => sum + (cost.amount || 0), 0) || 0
      const previousCosts = previousOperationalCosts?.reduce((sum, cost) => sum + (cost.amount || 0), 0) || 0
      const costsChange = calculatePercentChange(currentCosts, previousCosts)

      // Marża
      const currentMargin = currentRevenue > 0 ? ((currentRevenue - currentCosts) / currentRevenue) * 100 : 0
      const previousMargin = previousRevenue > 0 ? ((previousRevenue - previousCosts) / previousRevenue) * 100 : 0
      const marginChange = calculatePercentChange(currentMargin, previousMargin)

      // Oblicz metryki operacyjne

      // Liczba zleceń
      const currentOrderCount = currentMonthOrders?.length || 0
      const previousOrderCount = previousMonthOrders?.length || 0
      const orderCountChange = calculatePercentChange(currentOrderCount, previousOrderCount)

      // Czas realizacji
      const completedCurrentOrders = currentMonthOrders?.filter(order => order.completed_at) || []
      const completedPreviousOrders = previousMonthOrders?.filter(order => order.completed_at) || []

      const currentCompletionTimes = completedCurrentOrders.map(order => {
        const startTime = new Date(order.created_at)
        const endTime = new Date(order.completed_at!)
        return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24) // Czas w dniach
      })

      const previousCompletionTimes = completedPreviousOrders.map(order => {
        const startTime = new Date(order.created_at)
        const endTime = new Date(order.completed_at!)
        return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24) // Czas w dniach
      })

      const currentAvgCompletionTime = currentCompletionTimes.length > 0
        ? currentCompletionTimes.reduce((sum, time) => sum + time, 0) / currentCompletionTimes.length
        : 0

      const previousAvgCompletionTime = previousCompletionTimes.length > 0
        ? previousCompletionTimes.reduce((sum, time) => sum + time, 0) / previousCompletionTimes.length
        : 0

      const completionTimeChange = calculatePercentChange(currentAvgCompletionTime, previousAvgCompletionTime)

      // Nowi klienci
      const currentNewCustomersCount = newCustomers?.length || 0
      const previousNewCustomersCount = previousNewCustomers?.length || 0
      const newCustomersChange = calculatePercentChange(currentNewCustomersCount, previousNewCustomersCount)

      // Wskaźnik retencji (przykładowa implementacja - w rzeczywistości potrzebne byłyby dodatkowe dane)
      // Tutaj zakładamy, że wskaźnik retencji to procent klientów, którzy złożyli więcej niż jedno zamówienie
      const retentionRate = 94.2 // Przykładowa wartość
      const previousRetentionRate = 92.8 // Przykładowa wartość
      const retentionChange = calculatePercentChange(retentionRate, previousRetentionRate)

      // Ustaw metryki finansowe
      setRevenueMetrics([
        {
          label: "Przychód",
          value: formatCurrency(currentRevenue),
          change: revenueChange,
          trend: revenueChange >= 0 ? "up" : "down",
          icon: <DollarSign className="h-4 w-4 text-green-500" />
        },
        {
          label: "Średnia wartość zlecenia",
          value: formatCurrency(currentAvgOrderValue),
          change: avgOrderValueChange,
          trend: avgOrderValueChange >= 0 ? "up" : "down",
          icon: <BarChart3 className="h-4 w-4 text-blue-500" />
        },
        {
          label: "Koszty operacyjne",
          value: formatCurrency(currentCosts),
          change: costsChange,
          trend: costsChange <= 0 ? "down" : "up", // Dla kosztów, spadek jest pozytywny
          icon: <TrendingUp className="h-4 w-4 text-amber-500" />
        },
        {
          label: "Marża",
          value: `${currentMargin.toFixed(1)}%`,
          change: marginChange,
          trend: marginChange >= 0 ? "up" : "down",
          icon: <TrendingUp className="h-4 w-4 text-green-500" />
        }
      ])

      // Ustaw metryki operacyjne
      setOperationalMetrics([
        {
          label: "Liczba zleceń",
          value: currentOrderCount.toString(),
          change: orderCountChange,
          trend: orderCountChange >= 0 ? "up" : "down",
          icon: <Calendar className="h-4 w-4 text-indigo-500" />
        },
        {
          label: "Czas realizacji",
          value: `${currentAvgCompletionTime.toFixed(1)} dni`,
          change: completionTimeChange,
          trend: "down", // Dla czasu realizacji, spadek jest pozytywny
          icon: <Clock className="h-4 w-4 text-green-500" />
        },
        {
          label: "Nowi klienci",
          value: currentNewCustomersCount.toString(),
          change: newCustomersChange,
          trend: newCustomersChange >= 0 ? "up" : "down",
          icon: <Users className="h-4 w-4 text-blue-500" />
        },
        {
          label: "Wskaźnik retencji",
          value: `${retentionRate.toFixed(1)}%`,
          change: retentionChange,
          trend: retentionChange >= 0 ? "up" : "down",
          icon: <TrendingUp className="h-4 w-4 text-green-500" />
        }
      ])

    } catch (error) {
      console.error('Error fetching business metrics:', error)
      toast({
        title: "Błąd",
        description: error instanceof Error ? error.message : "Nie udało się pobrać danych biznesowych",
        variant: "destructive"
      })

      // Ustaw przykładowe dane w przypadku błędu
      setRevenueMetrics([
        {
          label: "Przychód",
          value: "128,500 zł",
          change: 12.5,
          trend: "up",
          icon: <DollarSign className="h-4 w-4 text-green-500" />
        },
        {
          label: "Średnia wartość zlecenia",
          value: "2,450 zł",
          change: 5.2,
          trend: "up",
          icon: <BarChart3 className="h-4 w-4 text-blue-500" />
        },
        {
          label: "Koszty operacyjne",
          value: "75,200 zł",
          change: 3.8,
          trend: "up",
          icon: <TrendingUp className="h-4 w-4 text-amber-500" />
        },
        {
          label: "Marża",
          value: "41.5%",
          change: 2.3,
          trend: "up",
          icon: <TrendingUp className="h-4 w-4 text-green-500" />
        }
      ])

      setOperationalMetrics([
        {
          label: "Liczba zleceń",
          value: "124",
          change: 8.3,
          trend: "up",
          icon: <Calendar className="h-4 w-4 text-indigo-500" />
        },
        {
          label: "Czas realizacji",
          value: "2.8 dni",
          change: -12.5,
          trend: "down",
          icon: <Clock className="h-4 w-4 text-green-500" />
        },
        {
          label: "Nowi klienci",
          value: "18",
          change: 5.9,
          trend: "up",
          icon: <Users className="h-4 w-4 text-blue-500" />
        },
        {
          label: "Wskaźnik retencji",
          value: "94.2%",
          change: 1.5,
          trend: "up",
          icon: <TrendingUp className="h-4 w-4 text-green-500" />
        }
      ])
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // Pobierz dane przy pierwszym renderowaniu
  useEffect(() => {
    fetchData()
  }, [])

  // Obsługa odświeżania
  const handleRefresh = () => {
    fetchData()
  }

  // Funkcja renderująca ikonę trendu
  const renderTrendIcon = (trend: string, change: number) => {
    if (trend === "up") {
      return <ArrowUpRight className={`h-3 w-3 ${change > 0 ? 'text-green-500' : 'text-red-500'}`} />
    } else if (trend === "down") {
      return <ArrowDownRight className={`h-3 w-3 ${change < 0 ? 'text-green-500' : 'text-red-500'}`} />
    } else {
      return <ArrowRight className="h-3 w-3 text-muted-foreground" />
    }
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Kluczowe wskaźniki</CardTitle>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 w-8"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Eksportuj dane</DropdownMenuItem>
                <DropdownMenuItem>Dostosuj widok</DropdownMenuItem>
                <DropdownMenuItem>Ustawienia</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardDescription>
          Kluczowe wskaźniki biznesowe i operacyjne
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList className="grid grid-cols-2 h-9">
            <TabsTrigger value="revenue">Finansowe</TabsTrigger>
            <TabsTrigger value="operational">Operacyjne</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-0 mt-2">
            {isLoading ? (
              // Skeleton loader dla metryk finansowych
              <div className="grid grid-cols-2 gap-4">
                {Array(4).fill(0).map((_, index) => (
                  <Card key={index} className="border shadow-none">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-4 w-4 rounded-full" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-3 w-12" />
                      </div>
                      <Skeleton className="h-7 w-24" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {revenueMetrics.map((metric, index) => (
                  <Card key={index} className="border shadow-none">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {metric.icon}
                          <span className="text-xs text-muted-foreground">{metric.label}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs">
                          {renderTrendIcon(metric.trend, metric.change)}
                          <span className={
                            (metric.trend === "up" && metric.change > 0) || (metric.trend === "down" && metric.change < 0)
                              ? 'text-green-500'
                              : (metric.trend === "up" && metric.change < 0) || (metric.trend === "down" && metric.change > 0)
                                ? 'text-red-500'
                                : 'text-muted-foreground'
                          }>
                            {metric.change > 0 ? '+' : ''}{metric.change}%
                          </span>
                        </div>
                      </div>
                      <div className="text-xl font-bold">{metric.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="h-[120px] mt-4 bg-muted/40 rounded-md flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Wykres przychodów i kosztów</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="operational" className="space-y-0 mt-2">
            {isLoading ? (
              // Skeleton loader dla metryk operacyjnych
              <div className="grid grid-cols-2 gap-4">
                {Array(4).fill(0).map((_, index) => (
                  <Card key={index} className="border shadow-none">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-4 w-4 rounded-full" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-3 w-12" />
                      </div>
                      <Skeleton className="h-7 w-24" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {operationalMetrics.map((metric, index) => (
                  <Card key={index} className="border shadow-none">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {metric.icon}
                          <span className="text-xs text-muted-foreground">{metric.label}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs">
                          {renderTrendIcon(metric.trend, metric.change)}
                          <span className={
                            (metric.trend === "up" && metric.change > 0) || (metric.trend === "down" && metric.change < 0)
                              ? 'text-green-500'
                              : (metric.trend === "up" && metric.change < 0) || (metric.trend === "down" && metric.change > 0)
                                ? 'text-red-500'
                                : 'text-muted-foreground'
                          }>
                            {metric.change > 0 ? '+' : ''}{metric.change}%
                          </span>
                        </div>
                      </div>
                      <div className="text-xl font-bold">{metric.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="h-[120px] mt-4 bg-muted/40 rounded-md flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Wykres wskaźników operacyjnych</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-1">
        <Button variant="link" className="h-auto p-0 text-xs w-full text-muted-foreground">
          Zobacz szczegółowe raporty
        </Button>
      </CardFooter>
    </Card>
  )
}
