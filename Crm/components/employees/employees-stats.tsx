"use client"

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Przykładowe dane dla wykresów
const monthlyOrdersData = [
  { month: "Sty", orders: 120, completed: 118, efficiency: 98.3 },
  { month: "Lut", orders: 132, completed: 130, efficiency: 98.5 },
  { month: "Mar", orders: 145, completed: 142, efficiency: 97.9 },
  { month: "Kwi", orders: 140, completed: 138, efficiency: 98.6 },
  { month: "Maj", orders: 158, completed: 155, efficiency: 98.1 },
  { month: "Cze", orders: 170, completed: 168, efficiency: 98.8 },
  { month: "Lip", orders: 190, completed: 187, efficiency: 98.4 },
  { month: "Sie", orders: 185, completed: 182, efficiency: 98.4 },
  { month: "Wrz", orders: 165, completed: 162, efficiency: 98.2 },
  { month: "Paź", orders: 150, completed: 147, efficiency: 98.0 },
  { month: "Lis", orders: 142, completed: 140, efficiency: 98.6 },
  { month: "Gru", orders: 130, completed: 128, efficiency: 98.5 },
]

const employeePerformanceData = [
  { name: "Piotr Nowak", orders: 156, rating: 4.8, efficiency: 95 },
  { name: "Anna Wiśniewska", orders: 203, rating: 4.9, efficiency: 98 },
  { name: "Marek Kowalski", orders: 134, rating: 4.6, efficiency: 92 },
  { name: "Tomasz Zieliński", orders: 178, rating: 4.7, efficiency: 94 },
  { name: "Karolina Dąbrowska", orders: 192, rating: 4.9, efficiency: 97 },
]

const serviceTypeData = [
  { type: "Przegląd", count: 450, avgTime: 110 },
  { type: "Naprawa", count: 320, avgTime: 150 },
  { type: "Instalacja", count: 180, avgTime: 240 },
  { type: "Konsultacja", count: 120, avgTime: 60 },
  { type: "Wymiana", count: 90, avgTime: 180 },
]

// Dane o technikach
const techniciansData = [
  {
    id: "EMP001",
    name: "Piotr Nowak",
    avatar: "/placeholder-user.jpg",
    position: "Technik HVAC",
    completedOrders: 156,
    rating: 4.8,
    efficiency: 95,
    avgCompletionTime: 115,
    customerSatisfaction: 4.7,
    skillsRating: {
      klimatyzacja: 95,
      wentylacja: 90,
      pompyCiepla: 85,
    },
  },
  {
    id: "EMP002",
    name: "Anna Wiśniewska",
    avatar: "/placeholder-user.jpg",
    position: "Technik HVAC",
    completedOrders: 203,
    rating: 4.9,
    efficiency: 98,
    avgCompletionTime: 105,
    customerSatisfaction: 4.9,
    skillsRating: {
      klimatyzacja: 98,
      rekuperacja: 95,
      chlodnictwo: 90,
    },
  },
  {
    id: "EMP003",
    name: "Marek Kowalski",
    avatar: "/placeholder-user.jpg",
    position: "Technik HVAC",
    completedOrders: 134,
    rating: 4.6,
    efficiency: 92,
    avgCompletionTime: 125,
    customerSatisfaction: 4.5,
    skillsRating: {
      klimatyzacja: 90,
      ogrzewanie: 95,
      pompyCiepla: 92,
    },
  },
  {
    id: "EMP004",
    name: "Tomasz Zieliński",
    avatar: "/placeholder-user.jpg",
    position: "Technik HVAC",
    completedOrders: 178,
    rating: 4.7,
    efficiency: 94,
    avgCompletionTime: 110,
    customerSatisfaction: 4.6,
    skillsRating: {
      klimatyzacja: 92,
      wentylacja: 94,
      automatyka: 96,
    },
  },
  {
    id: "EMP005",
    name: "Karolina Dąbrowska",
    avatar: "/placeholder-user.jpg",
    position: "Technik HVAC",
    completedOrders: 192,
    rating: 4.9,
    efficiency: 97,
    avgCompletionTime: 100,
    customerSatisfaction: 4.8,
    skillsRating: {
      klimatyzacja: 96,
      rekuperacja: 94,
      pompyCiepla: 97,
    },
  },
]

export function EmployeesStats() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Przegląd</TabsTrigger>
        <TabsTrigger value="performance">Wydajność</TabsTrigger>
        <TabsTrigger value="skills">Umiejętności</TabsTrigger>
        <TabsTrigger value="satisfaction">Satysfakcja klientów</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Łączna liczba zleceń</CardTitle>
              <CardDescription>Wszystkie zlecenia w tym roku</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,827</div>
              <p className="text-xs text-muted-foreground">+12% w porównaniu do poprzedniego roku</p>
              <div className="mt-4 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyOrdersData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Średnia wydajność</CardTitle>
              <CardDescription>Wydajność pracowników</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">98.3%</div>
              <p className="text-xs text-muted-foreground">+0.5% w porównaniu do poprzedniego roku</p>
              <div className="mt-4 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyOrdersData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[95, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="efficiency" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Typy zleceń</CardTitle>
              <CardDescription>Podział zleceń według typu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5 typów</div>
              <p className="text-xs text-muted-foreground">Przeglądy stanowią 39% wszystkich zleceń</p>
              <div className="mt-4 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={serviceTypeData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="type" type="category" />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Najlepsi pracownicy</CardTitle>
            <CardDescription>Ranking pracowników według wydajności</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                orders: {
                  label: "Liczba zleceń",
                  color: "hsl(var(--chart-1))",
                },
                rating: {
                  label: "Ocena",
                  color: "hsl(var(--chart-2))",
                },
                efficiency: {
                  label: "Wydajność (%)",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={employeePerformanceData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar yAxisId="left" dataKey="orders" fill="var(--color-orders)" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="efficiency" fill="var(--color-efficiency)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="performance" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {techniciansData.map((technician) => (
            <Card key={technician.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={technician.avatar || "/placeholder.svg"} alt={technician.name} />
                      <AvatarFallback>
                        {technician.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{technician.name}</CardTitle>
                      <CardDescription>{technician.position}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-primary/10">
                    {technician.completedOrders} zleceń
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Wydajność</span>
                      <span className="font-medium">{technician.efficiency}%</span>
                    </div>
                    <Progress value={technician.efficiency} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ocena klientów</span>
                      <span className="font-medium">{technician.rating}/5</span>
                    </div>
                    <Progress value={(technician.rating / 5) * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Satysfakcja klientów</span>
                      <span className="font-medium">{technician.customerSatisfaction}/5</span>
                    </div>
                    <Progress value={(technician.customerSatisfaction / 5) * 100} className="h-2" />
                  </div>

                  <div className="pt-2 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-2xl font-bold">{technician.completedOrders}</div>
                      <div className="text-xs text-muted-foreground">Ukończone zlecenia</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{technician.avgCompletionTime} min</div>
                      <div className="text-xs text-muted-foreground">Średni czas</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{technician.rating}</div>
                      <div className="text-xs text-muted-foreground">Ocena</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="skills" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {techniciansData.map((technician) => (
            <Card key={technician.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={technician.avatar || "/placeholder.svg"} alt={technician.name} />
                    <AvatarFallback>
                      {technician.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{technician.name}</CardTitle>
                    <CardDescription>{technician.position}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(technician.skillsRating).map(([skill, rating]) => (
                    <div key={skill} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{skill.replace(/([A-Z])/g, " $1").trim()}</span>
                        <span className="font-medium">{rating}%</span>
                      </div>
                      <Progress value={rating} className="h-2" />
                    </div>
                  ))}

                  <div className="pt-2">
                    <div className="text-sm text-muted-foreground mb-2">Certyfikaty i uprawnienia:</div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">F-gazy</Badge>
                      <Badge variant="outline">SEP</Badge>
                      {technician.name === "Piotr Nowak" && (
                        <>
                          <Badge variant="outline">Daikin</Badge>
                          <Badge variant="outline">Mitsubishi</Badge>
                        </>
                      )}
                      {technician.name === "Anna Wiśniewska" && (
                        <>
                          <Badge variant="outline">Mitsubishi</Badge>
                          <Badge variant="outline">Rekuperatory</Badge>
                        </>
                      )}
                      {technician.name === "Marek Kowalski" && (
                        <>
                          <Badge variant="outline">Vaillant</Badge>
                          <Badge variant="outline">Viessmann</Badge>
                        </>
                      )}
                      {technician.name === "Tomasz Zieliński" && (
                        <>
                          <Badge variant="outline">Toshiba</Badge>
                          <Badge variant="outline">Automatyka</Badge>
                        </>
                      )}
                      {technician.name === "Karolina Dąbrowska" && (
                        <>
                          <Badge variant="outline">LG</Badge>
                          <Badge variant="outline">Samsung</Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="satisfaction" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Satysfakcja klientów</CardTitle>
            <CardDescription>Oceny klientów dla poszczególnych techników</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {techniciansData.map((technician) => (
                <div key={technician.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={technician.avatar || "/placeholder.svg"} alt={technician.name} />
                        <AvatarFallback>
                          {technician.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{technician.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{technician.customerSatisfaction}/5</span>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(technician.customerSatisfaction)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300 fill-gray-300"
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Progress value={(technician.customerSatisfaction / 5) * 100} className="h-2" />
                  <div className="grid grid-cols-3 text-center text-sm">
                    <div>
                      <div className="font-medium">{technician.completedOrders}</div>
                      <div className="text-xs text-muted-foreground">Ukończone zlecenia</div>
                    </div>
                    <div>
                      <div className="font-medium">{technician.rating}</div>
                      <div className="text-xs text-muted-foreground">Ocena techniczna</div>
                    </div>
                    <div>
                      <div className="font-medium">{technician.efficiency}%</div>
                      <div className="text-xs text-muted-foreground">Wydajność</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Najczęstsze komentarze pozytywne</CardTitle>
              <CardDescription>Co klienci chwalą najbardziej</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Profesjonalizm</span>
                  <span className="font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />

                <div className="flex justify-between items-center">
                  <span>Punktualność</span>
                  <span className="font-medium">72%</span>
                </div>
                <Progress value={72} className="h-2" />

                <div className="flex justify-between items-center">
                  <span>Jakość wykonania</span>
                  <span className="font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />

                <div className="flex justify-between items-center">
                  <span>Czystość po pracy</span>
                  <span className="font-medium">68%</span>
                </div>
                <Progress value={68} className="h-2" />

                <div className="flex justify-between items-center">
                  <span>Komunikacja</span>
                  <span className="font-medium">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Najczęstsze komentarze negatywne</CardTitle>
              <CardDescription>Obszary do poprawy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Czas oczekiwania</span>
                  <span className="font-medium">12%</span>
                </div>
                <Progress value={12} className="h-2" />

                <div className="flex justify-between items-center">
                  <span>Cena usługi</span>
                  <span className="font-medium">8%</span>
                </div>
                <Progress value={8} className="h-2" />

                <div className="flex justify-between items-center">
                  <span>Brak wyjaśnień</span>
                  <span className="font-medium">5%</span>
                </div>
                <Progress value={5} className="h-2" />

                <div className="flex justify-between items-center">
                  <span>Opóźnienia</span>
                  <span className="font-medium">7%</span>
                </div>
                <Progress value={7} className="h-2" />

                <div className="flex justify-between items-center">
                  <span>Problemy po naprawie</span>
                  <span className="font-medium">3%</span>
                </div>
                <Progress value={3} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
