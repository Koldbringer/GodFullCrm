"use client"

import { useState } from "react"
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  Star, 
  TrendingUp, 
  BarChart, 
  RefreshCw,
  ChevronRight,
  Award,
  Timer
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface TechnicianData {
  id: string
  name: string
  avatar: string
  initials: string
  completedOrders: number
  pendingOrders: number
  avgCompletionTime: string
  rating: number
  efficiency: number
  specialization: string
  status: "available" | "busy" | "off-duty"
}

export function TechnicianPerformance() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("week")
  
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  // Przykładowe dane techników
  const technicians: TechnicianData[] = [
    {
      id: "T1",
      name: "Jan Kowalski",
      avatar: "/placeholder-user.jpg",
      initials: "JK",
      completedOrders: 18,
      pendingOrders: 3,
      avgCompletionTime: "2h 15min",
      rating: 4.8,
      efficiency: 92,
      specialization: "Klimatyzacje",
      status: "busy"
    },
    {
      id: "T2",
      name: "Anna Nowak",
      avatar: "/placeholder-user.jpg",
      initials: "AN",
      completedOrders: 15,
      pendingOrders: 2,
      avgCompletionTime: "2h 45min",
      rating: 4.9,
      efficiency: 88,
      specialization: "Pompy ciepła",
      status: "available"
    },
    {
      id: "T3",
      name: "Piotr Wiśniewski",
      avatar: "/placeholder-user.jpg",
      initials: "PW",
      completedOrders: 12,
      pendingOrders: 0,
      avgCompletionTime: "3h 10min",
      rating: 4.6,
      efficiency: 85,
      specialization: "Wentylacja",
      status: "off-duty"
    }
  ]

  // Funkcja zwracająca kolor dla statusu
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "busy":
        return "bg-amber-500"
      case "off-duty":
        return "bg-slate-500"
      default:
        return "bg-muted"
    }
  }

  // Funkcja zwracająca tekst dla statusu
  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Dostępny"
      case "busy":
        return "Zajęty"
      case "off-duty":
        return "Poza służbą"
      default:
        return "Nieznany"
    }
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Wydajność techników</CardTitle>
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
        <CardDescription className="flex items-center justify-between">
          <span>Analiza wydajności zespołu technicznego</span>
          <div className="flex items-center space-x-1">
            <Button 
              variant={timeRange === "day" ? "secondary" : "ghost"} 
              size="xs" 
              onClick={() => setTimeRange("day")}
              className="h-7 text-xs"
            >
              Dzień
            </Button>
            <Button 
              variant={timeRange === "week" ? "secondary" : "ghost"} 
              size="xs" 
              onClick={() => setTimeRange("week")}
              className="h-7 text-xs"
            >
              Tydzień
            </Button>
            <Button 
              variant={timeRange === "month" ? "secondary" : "ghost"} 
              size="xs" 
              onClick={() => setTimeRange("month")}
              className="h-7 text-xs"
            >
              Miesiąc
            </Button>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Card className="border shadow-none">
              <CardContent className="p-3 flex flex-col items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mb-1" />
                <div className="text-xl font-bold">
                  {technicians.reduce((sum, tech) => sum + tech.completedOrders, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Ukończone zlecenia</div>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-3 flex flex-col items-center justify-center">
                <Clock className="h-4 w-4 text-blue-500 mb-1" />
                <div className="text-xl font-bold">2h 40m</div>
                <div className="text-xs text-muted-foreground">Średni czas realizacji</div>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-3 flex flex-col items-center justify-center">
                <Star className="h-4 w-4 text-amber-500 mb-1" />
                <div className="text-xl font-bold">4.8</div>
                <div className="text-xs text-muted-foreground">Średnia ocena</div>
              </CardContent>
            </Card>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            {technicians.map((tech) => (
              <div key={tech.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={tech.avatar} alt={tech.name} />
                        <AvatarFallback>{tech.initials}</AvatarFallback>
                      </Avatar>
                      <div 
                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(tech.status)}`}
                      ></div>
                    </div>
                    <div>
                      <div className="font-medium text-sm flex items-center">
                        {tech.name}
                        {tech.efficiency > 90 && (
                          <Badge variant="outline" className="ml-2 h-5 text-[10px]">
                            <Award className="h-3 w-3 mr-0.5 text-amber-500" />
                            Top performer
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center space-x-2">
                        <span>{tech.specialization}</span>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground"></span>
                        <span>{getStatusText(tech.status)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{tech.completedOrders} zleceń</div>
                    <div className="text-xs text-muted-foreground flex items-center justify-end">
                      <Timer className="h-3 w-3 mr-1" />
                      <span>Śr. {tech.avgCompletionTime}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span>Wydajność</span>
                    <span className="font-medium">{tech.efficiency}%</span>
                  </div>
                  <Progress value={tech.efficiency} className="h-1.5" />
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-amber-500" />
                    <span>{tech.rating}/5.0</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-muted-foreground">Oczekujące:</span>
                    <span>{tech.pendingOrders}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        <Button variant="outline" size="sm" className="w-full text-xs">
          <span>Szczegółowa analiza wydajności</span>
          <ChevronRight className="ml-1 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  )
}
