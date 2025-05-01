"use client"

import { useState, useEffect } from "react"
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
import { Skeleton } from "@/components/ui/skeleton"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

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

// Funkcja pomocnicza do generowania inicjałów
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Funkcja pomocnicza do formatowania czasu
function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}min`;
}

export function TechnicianPerformance() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("week")
  const [technicians, setTechnicians] = useState<TechnicianData[]>([])
  const [stats, setStats] = useState({
    totalCompleted: 0,
    avgTime: "0h 0min",
    avgRating: 0
  })
  const { toast } = useToast()

  // Funkcja do pobierania danych
  const fetchData = async () => {
    setIsRefreshing(true)

    try {
      const supabase = createClient()
      if (!supabase) {
        throw new Error("Nie można połączyć z bazą danych")
      }

      // Określ zakres dat na podstawie wybranego zakresu czasu
      const now = new Date()
      let startDate = new Date()

      if (timeRange === "day") {
        startDate.setHours(0, 0, 0, 0) // Początek dzisiejszego dnia
      } else if (timeRange === "week") {
        startDate.setDate(now.getDate() - 7) // 7 dni wstecz
      } else if (timeRange === "month") {
        startDate.setMonth(now.getMonth() - 1) // 1 miesiąc wstecz
      }

      // Pobierz techników
      const { data: technicianData, error: technicianError } = await supabase
        .from('technicians')
        .select('id, name, specialization, status')

      if (technicianError) {
        throw new Error(`Błąd podczas pobierania techników: ${technicianError.message}`)
      }

      // Dla każdego technika pobierz dodatkowe dane
      const technicianPromises = technicianData?.map(async (tech) => {
        // Pobierz ukończone zlecenia
        const { data: completedOrders, error: completedError } = await supabase
          .from('service_orders')
          .select('id, created_at, completed_at')
          .eq('technician_id', tech.id)
          .eq('status', 'completed')
          .gte('created_at', startDate.toISOString())

        // Pobierz oczekujące zlecenia
        const { data: pendingOrders, error: pendingError } = await supabase
          .from('service_orders')
          .select('id')
          .eq('technician_id', tech.id)
          .in('status', ['scheduled', 'in-progress'])

        // Oblicz średni czas realizacji
        let avgCompletionTime = "0h 0min"
        let totalMinutes = 0

        if (completedOrders && completedOrders.length > 0) {
          const completionTimes = completedOrders
            .filter(order => order.completed_at) // Filtruj tylko zlecenia z datą zakończenia
            .map(order => {
              const startTime = new Date(order.created_at)
              const endTime = new Date(order.completed_at!)
              return (endTime.getTime() - startTime.getTime()) / (1000 * 60) // Czas w minutach
            })

          if (completionTimes.length > 0) {
            totalMinutes = Math.round(completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length)
            avgCompletionTime = formatTime(totalMinutes)
          }
        }

        // Pobierz oceny technika
        const { data: ratings, error: ratingsError } = await supabase
          .from('technician_ratings')
          .select('rating')
          .eq('technician_id', tech.id)
          .gte('created_at', startDate.toISOString())

        // Oblicz średnią ocenę
        let rating = 0
        if (ratings && ratings.length > 0) {
          rating = parseFloat((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1))
        }

        // Oblicz wydajność (na podstawie czasu realizacji i liczby zleceń)
        let efficiency = 0
        if (completedOrders && completedOrders.length > 0) {
          // Prosta formuła: im więcej zleceń i krótszy czas, tym wyższa wydajność
          // Maksymalna wydajność to 100%
          const baseEfficiency = Math.min(completedOrders.length * 5, 100) // 5% za każde zlecenie, max 100%
          const timeBonus = totalMinutes < 180 ? 10 : totalMinutes < 240 ? 5 : 0 // Bonus za szybkość
          efficiency = Math.min(baseEfficiency + timeBonus, 100)
        }

        // Określ status
        let status: "available" | "busy" | "off-duty" = "available"
        if (tech.status === "busy") status = "busy"
        else if (tech.status === "off-duty") status = "off-duty"

        return {
          id: tech.id,
          name: tech.name,
          avatar: "", // Brak avatarów w bazie danych
          initials: getInitials(tech.name),
          completedOrders: completedOrders?.length || 0,
          pendingOrders: pendingOrders?.length || 0,
          avgCompletionTime,
          rating: rating || 4.0, // Domyślna ocena jeśli brak danych
          efficiency,
          specialization: tech.specialization || "Ogólny",
          status
        }
      }) || []

      // Poczekaj na wszystkie zapytania
      const technicianResults = await Promise.all(technicianPromises)

      // Oblicz statystyki ogólne
      const totalCompleted = technicianResults.reduce((sum, tech) => sum + tech.completedOrders, 0)

      // Średni czas realizacji
      const validTimes = technicianResults.filter(tech => tech.avgCompletionTime !== "0h 0min")
      let avgTime = "0h 0min"

      if (validTimes.length > 0) {
        const avgMinutes = Math.round(
          validTimes
            .map(tech => {
              const [hours, minutes] = tech.avgCompletionTime.split('h ').map(part => parseInt(part))
              return (hours * 60) + (minutes || 0)
            })
            .reduce((sum, minutes) => sum + minutes, 0) / validTimes.length
        )
        avgTime = formatTime(avgMinutes)
      }

      // Średnia ocena
      const avgRating = technicianResults.length > 0
        ? parseFloat((technicianResults.reduce((sum, tech) => sum + tech.rating, 0) / technicianResults.length).toFixed(1))
        : 0

      setTechnicians(technicianResults)
      setStats({
        totalCompleted,
        avgTime,
        avgRating
      })

    } catch (error) {
      console.error('Error fetching technician data:', error)
      toast({
        title: "Błąd",
        description: error instanceof Error ? error.message : "Nie udało się pobrać danych techników",
        variant: "destructive"
      })

      // Ustaw przykładowe dane w przypadku błędu
      setTechnicians([
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
        }
      ])

      setStats({
        totalCompleted: 33,
        avgTime: "2h 40m",
        avgRating: 4.8
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // Pobierz dane przy pierwszym renderowaniu i zmianie zakresu czasu
  useEffect(() => {
    fetchData()
  }, [timeRange])

  // Obsługa odświeżania
  const handleRefresh = () => {
    fetchData()
  }

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
                {isLoading ? (
                  <Skeleton className="h-7 w-12 mb-1" />
                ) : (
                  <div className="text-xl font-bold">
                    {stats.totalCompleted}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">Ukończone zlecenia</div>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-3 flex flex-col items-center justify-center">
                <Clock className="h-4 w-4 text-blue-500 mb-1" />
                {isLoading ? (
                  <Skeleton className="h-7 w-12 mb-1" />
                ) : (
                  <div className="text-xl font-bold">{stats.avgTime}</div>
                )}
                <div className="text-xs text-muted-foreground">Średni czas realizacji</div>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-3 flex flex-col items-center justify-center">
                <Star className="h-4 w-4 text-amber-500 mb-1" />
                {isLoading ? (
                  <Skeleton className="h-7 w-12 mb-1" />
                ) : (
                  <div className="text-xl font-bold">{stats.avgRating.toFixed(1)}</div>
                )}
                <div className="text-xs text-muted-foreground">Średnia ocena</div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <div className="space-y-4">
            {isLoading ? (
              // Skeleton loader dla techników
              Array(2).fill(0).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                    <Skeleton className="h-1.5 w-full" />
                  </div>

                  <div className="flex justify-between items-center">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))
            ) : technicians.length === 0 ? (
              // Komunikat o braku techników
              <div className="text-center py-6">
                <p className="text-muted-foreground">Brak danych o technikach</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Dodaj technika
                </Button>
              </div>
            ) : (
              // Lista techników
              technicians.map((tech) => (
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
              ))
            )}
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
