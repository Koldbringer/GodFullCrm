"use client"

import { useState } from "react"
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  Battery, 
  RefreshCw,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DeviceStatus {
  id: string
  name: string
  location: string
  status: "online" | "offline" | "warning"
  temperature: number
  humidity: number
  pressure: number
  airflow: number
  battery: number
  lastUpdate: string
}

export function IotMonitoringPanel() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  // Przykładowe dane urządzeń
  const devices: DeviceStatus[] = [
    {
      id: "AC-1001",
      name: "Klimatyzator główny",
      location: "Biuro główne",
      status: "online",
      temperature: 22.5,
      humidity: 45,
      pressure: 1013,
      airflow: 85,
      battery: 100,
      lastUpdate: "2 min temu"
    },
    {
      id: "AC-1002",
      name: "Klimatyzator sala konferencyjna",
      location: "Biuro główne",
      status: "warning",
      temperature: 26.8,
      humidity: 60,
      pressure: 1010,
      airflow: 65,
      battery: 80,
      lastUpdate: "5 min temu"
    },
    {
      id: "AC-2001",
      name: "Split jednostka wewnętrzna",
      location: "Apartament w Śródmieściu",
      status: "offline",
      temperature: 0,
      humidity: 0,
      pressure: 0,
      airflow: 0,
      battery: 15,
      lastUpdate: "2 godz. temu"
    },
    {
      id: "AC-3001",
      name: "Klimatyzator sypialnia",
      location: "Dom na Mokotowie",
      status: "online",
      temperature: 21.2,
      humidity: 42,
      pressure: 1015,
      airflow: 75,
      battery: 90,
      lastUpdate: "1 min temu"
    }
  ]

  // Funkcja zwracająca kolor dla statusu
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-500"
      case "warning":
        return "text-amber-500"
      case "offline":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  // Funkcja zwracająca ikonę dla statusu
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "offline":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wifi className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Monitoring IoT</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription>
          Monitorowanie urządzeń HVAC w czasie rzeczywistym
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-md">
              <div className="text-2xl font-bold">{devices.filter(d => d.status === "online").length}</div>
              <div className="text-xs text-muted-foreground">Online</div>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-md">
              <div className="text-2xl font-bold">{devices.filter(d => d.status === "warning").length}</div>
              <div className="text-xs text-muted-foreground">Ostrzeżenia</div>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-md">
              <div className="text-2xl font-bold">{devices.filter(d => d.status === "offline").length}</div>
              <div className="text-xs text-muted-foreground">Offline</div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between py-2">
                <div className="flex items-start space-x-3">
                  <div className={`mt-0.5 ${getStatusColor(device.status)}`}>
                    {getStatusIcon(device.status)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{device.name}</div>
                    <div className="text-xs text-muted-foreground">{device.location}</div>
                    <div className="flex items-center space-x-3 mt-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center space-x-1">
                              <Thermometer className="h-3 w-3 text-rose-500" />
                              <span className="text-xs">
                                {device.status !== "offline" ? `${device.temperature}°C` : "—"}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Temperatura</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center space-x-1">
                              <Droplets className="h-3 w-3 text-blue-500" />
                              <span className="text-xs">
                                {device.status !== "offline" ? `${device.humidity}%` : "—"}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Wilgotność</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center space-x-1">
                              <Wind className="h-3 w-3 text-cyan-500" />
                              <span className="text-xs">
                                {device.status !== "offline" ? `${device.airflow}%` : "—"}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Przepływ powietrza</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="flex items-center space-x-1 mb-1">
                    <Battery className={`h-3.5 w-3.5 ${device.battery < 20 ? 'text-red-500' : 'text-green-500'}`} />
                    <span className="text-xs">{device.battery}%</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{device.lastUpdate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        <Button variant="outline" size="sm" className="w-full text-xs">
          <span>Pełny monitoring</span>
          <ChevronRight className="ml-1 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  )
}
