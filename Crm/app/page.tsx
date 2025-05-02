"use client"

import {
  ArrowUpRight,
  BarChart3,
  ClipboardList,
  Package,
  Users,
  Calendar,
  AlertTriangle,
  Clock,
  TrendingUp,
  Wrench,
  MapPin,
  Plus,
  ArrowRight
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentOrders } from "@/components/recent-orders"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Witaj, Jan! Oto przegląd Twojej działalności.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/service-orders/new">
              <Plus className="mr-2 h-4 w-4" />
              Nowe zlecenie
            </Link>
          </Button>
        </div>
      </div>

      {/* Karty KPI */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30">
            <CardTitle className="text-sm font-medium">Aktywne zlecenia</CardTitle>
            <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">24</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">+2 od wczoraj</p>
              <Badge variant="outline" className="text-xs font-normal">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                8.2%
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="p-2 border-t bg-muted/30">
            <Link href="/service-orders" className="text-xs text-muted-foreground hover:text-primary flex items-center w-full justify-end">
              Zarządzaj zleceniami
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30">
            <CardTitle className="text-sm font-medium">Zaplanowane wizyty</CardTitle>
            <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">8</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">Na najbliższe 7 dni</p>
              <Badge variant="outline" className="text-xs font-normal">
                Dziś: 2
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="p-2 border-t bg-muted/30">
            <Link href="/calendar" className="text-xs text-muted-foreground hover:text-primary flex items-center w-full justify-end">
              Przejdź do kalendarza
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30">
            <CardTitle className="text-sm font-medium">Pilne zgłoszenia</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">3</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">Wymagają uwagi</p>
              <Badge variant="destructive" className="text-xs font-normal">
                Pilne
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="p-2 border-t bg-muted/30">
            <Link href="/tickets?priority=high" className="text-xs text-muted-foreground hover:text-primary flex items-center w-full justify-end">
              Przejdź do zgłoszeń
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30">
            <CardTitle className="text-sm font-medium">Przychód miesięczny</CardTitle>
            <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">45 231 zł</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">Czerwiec 2024</p>
              <Badge variant="outline" className="text-xs font-normal">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                20.1%
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="p-2 border-t bg-muted/30">
            <Link href="/reports/finance" className="text-xs text-muted-foreground hover:text-primary flex items-center w-full justify-end">
              Raporty finansowe
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Przegląd</TabsTrigger>
          <TabsTrigger value="tasks">Zadania</TabsTrigger>
          <TabsTrigger value="analytics">Analityka</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Dzisiejsze wizyty */}
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Dzisiejsze wizyty</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Zaplanowane na dziś</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  {[
                    {
                      time: "09:00",
                      customer: "Firma ABC",
                      address: "ul. Przykładowa 1, Warszawa",
                      type: "Przegląd",
                      tech: { name: "Jan Kowalski", avatar: "/placeholder-user.jpg" }
                    },
                    {
                      time: "11:30",
                      customer: "Restauracja XYZ",
                      address: "ul. Smaczna 15, Warszawa",
                      type: "Naprawa",
                      tech: { name: "Anna Nowak", avatar: "" }
                    }
                  ].map((visit, i) => (
                    <div key={i} className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted/50">
                      <div className="bg-primary/10 text-primary rounded p-1.5 text-xs font-medium">
                        {visit.time}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{visit.customer}</p>
                          <Badge variant="outline" className="text-xs">{visit.type}</Badge>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="mr-1 h-3 w-3" />
                          {visit.address}
                        </div>
                        <div className="flex items-center text-xs">
                          <Avatar className="h-4 w-4 mr-1">
                            <AvatarImage src={visit.tech.avatar} alt={visit.tech.name} />
                            <AvatarFallback className="text-[8px]">
                              {visit.tech.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {visit.tech.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/calendar">
                    Pokaż wszystkie wizyty
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Ostatnie zlecenia */}
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Ostatnie zlecenia</CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Ostatnio utworzone zlecenia</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  <RecentOrders />
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/service-orders">
                    Pokaż wszystkie zlecenia
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Urządzenia wymagające serwisu */}
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Urządzenia do serwisu</CardTitle>
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Zbliżające się przeglądy</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  {[
                    {
                      device: "Klimatyzator Samsung WindFree",
                      customer: "Firma ABC",
                      daysLeft: 5,
                      progress: 85
                    },
                    {
                      device: "System wentylacji Daikin VRV IV",
                      customer: "Restauracja XYZ",
                      daysLeft: 12,
                      progress: 60
                    },
                    {
                      device: "Pompa ciepła Viessmann Vitocal",
                      customer: "Jan Nowak",
                      daysLeft: 15,
                      progress: 50
                    }
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{item.device}</p>
                        <Badge variant={item.daysLeft <= 7 ? "destructive" : "outline"} className="text-xs">
                          {item.daysLeft} dni
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.customer}</p>
                      <Progress value={item.progress} className="h-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/devices?filter=service">
                    Pokaż wszystkie urządzenia
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Przegląd sprzedaży</CardTitle>
                <CardDescription>Porównanie z poprzednim okresem</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Aktywność techników</CardTitle>
                <CardDescription>Liczba zleceń w tym miesiącu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Jan Kowalski", count: 18, percent: 85 },
                    { name: "Anna Nowak", count: 15, percent: 70 },
                    { name: "Piotr Wiśniewski", count: 12, percent: 60 },
                    { name: "Katarzyna Kowalczyk", count: 10, percent: 50 }
                  ].map((tech, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>
                              {tech.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{tech.name}</span>
                        </div>
                        <span className="text-sm">{tech.count}</span>
                      </div>
                      <Progress value={tech.percent} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Zadania do wykonania</CardTitle>
              <CardDescription>Twoje bieżące zadania i przypomnienia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Przygotować ofertę dla Firma XYZ", priority: "high", dueDate: "Dziś", completed: false },
                  { title: "Zamówić części do naprawy klimatyzatora", priority: "medium", dueDate: "Jutro", completed: false },
                  { title: "Skontaktować się z klientem w sprawie reklamacji", priority: "high", dueDate: "Dziś", completed: false },
                  { title: "Przygotować raport miesięczny", priority: "medium", dueDate: "28.06.2024", completed: false },
                  { title: "Zaktualizować cennik usług", priority: "low", dueDate: "30.06.2024", completed: true }
                ].map((task, i) => (
                  <div key={i} className={`flex items-start space-x-3 p-3 rounded-md ${task.completed ? 'bg-muted/30 line-through text-muted-foreground' : 'hover:bg-muted/50'}`}>
                    <div className={`shrink-0 rounded-full w-2 h-2 mt-2 ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{task.title}</p>
                        <Badge variant={
                          task.dueDate === 'Dziś' ? 'destructive' :
                          task.dueDate === 'Jutro' ? 'outline' : 'secondary'
                        } className="text-xs">
                          {task.dueDate}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Dodaj nowe zadanie
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Analityka sprzedaży</CardTitle>
                <CardDescription>Porównanie sprzedaży z poprzednim rokiem</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Popularne urządzenia</CardTitle>
                <CardDescription>Najczęściej serwisowane urządzenia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Klimatyzator Samsung WindFree", count: 28, percent: 85 },
                    { name: "System wentylacji Daikin VRV IV", count: 22, percent: 70 },
                    { name: "Pompa ciepła Viessmann Vitocal", count: 18, percent: 60 },
                    { name: "Klimatyzator LG Artcool", count: 15, percent: 50 }
                  ].map((device, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{device.name}</span>
                        <span className="text-sm">{device.count}</span>
                      </div>
                      <Progress value={device.percent} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}