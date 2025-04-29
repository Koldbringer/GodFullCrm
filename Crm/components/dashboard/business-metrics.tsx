"use client"

import { useState } from "react"
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

interface MetricData {
  label: string
  value: string
  change: number
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
}

export function BusinessMetrics() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  // Przykładowe dane metryk
  const revenueMetrics: MetricData[] = [
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
  ]

  const operationalMetrics: MetricData[] = [
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
  ]

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
                        <span className={metric.change > 0 ? 'text-green-500' : metric.change < 0 ? 'text-red-500' : 'text-muted-foreground'}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                      </div>
                    </div>
                    <div className="text-xl font-bold">{metric.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="h-[120px] mt-4 bg-muted/40 rounded-md flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Wykres przychodów i kosztów</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="operational" className="space-y-0 mt-2">
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
