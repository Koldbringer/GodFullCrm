"use client"

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Przykładowe dane dla wykresów
const monthlyTicketsData = [
  { month: "Sty", total: 45, open: 5, closed: 40, avgResolutionTime: 48 },
  { month: "Lut", total: 52, open: 7, closed: 45, avgResolutionTime: 45 },
  { month: "Mar", total: 58, open: 8, closed: 50, avgResolutionTime: 42 },
  { month: "Kwi", total: 63, open: 10, closed: 53, avgResolutionTime: 40 },
  { month: "Maj", total: 70, open: 12, closed: 58, avgResolutionTime: 38 },
  { month: "Cze", total: 75, open: 15, closed: 60, avgResolutionTime: 36 },
  { month: "Lip", total: 80, open: 18, closed: 62, avgResolutionTime: 35 },
  { month: "Sie", total: 75, open: 15, closed: 60, avgResolutionTime: 37 },
  { month: "Wrz", total: 68, open: 13, closed: 55, avgResolutionTime: 39 },
  { month: "Paź", total: 60, open: 10, closed: 50, avgResolutionTime: 41 },
  { month: "Lis", total: 55, open: 8, closed: 47, avgResolutionTime: 43 },
  { month: "Gru", total: 50, open: 5, closed: 45, avgResolutionTime: 44 },
]

const ticketTypeData = [
  { type: "Awaria klimatyzacji", count: 120, avgResolutionTime: 36 },
  { type: "Awaria pompy ciepła", count: 85, avgResolutionTime: 48 },
  { type: "Przegląd okresowy", count: 210, avgResolutionTime: 24 },
  { type: "Instalacja", count: 65, avgResolutionTime: 72 },
  { type: "Konsultacja", count: 45, avgResolutionTime: 12 },
  { type: "Inne", count: 25, avgResolutionTime: 30 },
]

const priorityData = [
  { priority: "Wysoki", count: 95, percentage: 17.3 },
  { priority: "Średni", count: 285, percentage: 51.8 },
  { priority: "Niski", count: 170, percentage: 30.9 },
]

const customerSatisfactionData = [
  { month: "Sty", satisfaction: 4.5 },
  { month: "Lut", satisfaction: 4.6 },
  { month: "Mar", satisfaction: 4.7 },
  { month: "Kwi", satisfaction: 4.6 },
  { month: "Maj", satisfaction: 4.8 },
  { month: "Cze", satisfaction: 4.7 },
  { month: "Lip", satisfaction: 4.9 },
  { month: "Sie", satisfaction: 4.8 },
  { month: "Wrz", satisfaction: 4.7 },
  { month: "Paź", satisfaction: 4.6 },
  { month: "Lis", satisfaction: 4.7 },
  { month: "Gru", satisfaction: 4.8 },
]

export function TicketsStats() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Przegląd</TabsTrigger>
        <TabsTrigger value="resolution">Czas rozwiązania</TabsTrigger>
        <TabsTrigger value="types">Typy zgłoszeń</TabsTrigger>
        <TabsTrigger value="satisfaction">Satysfakcja klientów</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Łączna liczba zgłoszeń</CardTitle>
              <CardDescription>W tym roku</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">550</div>
              <p className="text-xs text-muted-foreground">+8% w porównaniu do poprzedniego roku</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Otwarte zgłoszenia</CardTitle>
              <CardDescription>Aktualnie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">5.1% wszystkich zgłoszeń</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Średni czas rozwiązania</CardTitle>
              <CardDescription>W godzinach</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">38.5</div>
              <p className="text-xs text-muted-foreground">-12% w porównaniu do poprzedniego roku</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Satysfakcja klientów</CardTitle>
              <CardDescription>Średnia ocena (1-5)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4.7</div>
              <p className="text-xs text-muted-foreground">+0.2 w porównaniu do poprzedniego roku</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Zgłoszenia miesięcznie</CardTitle>
            <CardDescription>Liczba zgłoszeń w podziale na miesiące</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                total: {
                  label: "Wszystkie zgłoszenia",
                  color: "hsl(var(--chart-1))",
                },
                open: {
                  label: "Otwarte",
                  color: "hsl(var(--chart-2))",
                },
                closed: {
                  label: "Zamknięte",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyTicketsData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="closed" fill="var(--color-closed)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="open" fill="var(--color-open)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Zgłoszenia według priorytetu</CardTitle>
              <CardDescription>Podział zgłoszeń według priorytetu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {priorityData.map((item) => (
                  <div key={item.priority} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            item.priority === "Wysoki"
                              ? "bg-red-100 text-red-800 border-red-300"
                              : item.priority === "Średni"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                : "bg-green-100 text-green-800 border-green-300"
                          }
                        >
                          {item.priority}
                        </Badge>
                        <span>{item.count} zgłoszeń</span>
                      </div>
                      <span className="font-medium">{item.percentage}%</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Najczęstsze typy zgłoszeń</CardTitle>
              <CardDescription>Top 5 typów zgłoszeń</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ticketTypeData
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)
                  .map((item, index) => (
                    <div key={item.type} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>{item.type}</span>
                        <span className="font-medium">{item.count}</span>
                      </div>
                      <Progress value={(item.count / ticketTypeData[0].count) * 100} className="h-2" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="resolution" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Średni czas rozwiązania</CardTitle>
            <CardDescription>Czas rozwiązania zgłoszeń w godzinach</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                avgResolutionTime: {
                  label: "Średni czas rozwiązania (h)",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyTicketsData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="avgResolutionTime"
                    stroke="var(--color-avgResolutionTime)"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Czas rozwiązania według typu</CardTitle>
              <CardDescription>Średni czas rozwiązania według typu zgłoszenia</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  avgResolutionTime: {
                    label: "Średni czas rozwiązania (h)",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ticketTypeData}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="type" type="category" width={150} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="avgResolutionTime" fill="var(--color-avgResolutionTime)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statystyki czasu rozwiązania</CardTitle>
              <CardDescription>Szczegółowe statystyki czasów rozwiązania</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Najszybsze rozwiązanie</span>
                    <span className="font-medium">1.5h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Najdłuższe rozwiązanie</span>
                    <span className="font-medium">120h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Mediana</span>
                    <span className="font-medium">36h</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Rozkład czasów rozwiązania</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Do 24h</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">24-48h</span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">48-72h</span>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Powyżej 72h</span>
                      <span className="text-sm font-medium">5%</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="types" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Typy zgłoszeń</CardTitle>
            <CardDescription>Liczba zgłoszeń według typu</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Liczba zgłoszeń",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ticketTypeData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="satisfaction" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Satysfakcja klientów</CardTitle>
            <CardDescription>Średnia ocena satysfakcji klientów w czasie</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                satisfaction: {
                  label: "Satysfakcja",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={customerSatisfactionData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="satisfaction"
                    stroke="var(--color-satisfaction)"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
