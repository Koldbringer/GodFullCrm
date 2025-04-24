"use client"

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Przykładowe dane dla wykresów
const monthlySpendingData = [
  { month: "Sty", amount: 0 },
  { month: "Lut", amount: 0 },
  { month: "Mar", amount: 0 },
  { month: "Kwi", amount: 0 },
  { month: "Maj", amount: 0 },
  { month: "Cze", amount: 1476 },
  { month: "Lip", amount: 147.6 },
  { month: "Sie", amount: 0 },
  { month: "Wrz", amount: 0 },
  { month: "Paź", amount: 430.5 },
  { month: "Lis", amount: 553.5 },
  { month: "Gru", amount: 0 },
]

const serviceTypeData = [
  { name: "Przegląd", value: 2 },
  { name: "Naprawa", value: 2 },
  { name: "Instalacja", value: 1 },
]

const deviceEfficiencyData = [
  { name: "Klimatyzator 1", efficiency: 95, consumption: 120 },
  { name: "Klimatyzator 2", efficiency: 92, consumption: 145 },
  { name: "Rekuperator", efficiency: 78, consumption: 85 },
]

const customerLifetimeData = [
  { year: "2023", revenue: 2607.6, services: 5 },
  { year: "2024", revenue: 0, services: 0 },
]

interface CustomerAnalyticsProps {
  customerId: string
}

export function CustomerAnalytics({ customerId }: CustomerAnalyticsProps) {
  return (
    <Tabs defaultValue="spending" className="space-y-4">
      <TabsList>
        <TabsTrigger value="spending">Wydatki</TabsTrigger>
        <TabsTrigger value="services">Usługi</TabsTrigger>
        <TabsTrigger value="devices">Urządzenia</TabsTrigger>
        <TabsTrigger value="lifetime">Wartość klienta</TabsTrigger>
      </TabsList>

      <TabsContent value="spending" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Miesięczne wydatki</CardTitle>
            <CardDescription>Wydatki klienta w bieżącym roku</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                amount: {
                  label: "Kwota (zł)",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlySpendingData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(value) => `${value} zł`} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                  <Bar dataKey="amount" fill="var(--color-amount)" radius={[4, 4, 0, 0]} className="fill-primary" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Wydatki według kategorii</CardTitle>
              <CardDescription>Podział wydatków na kategorie usług</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Przeglądy</span>
                  <span className="font-medium">780.5 zł</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: "30%" }}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span>Naprawy</span>
                  <span className="font-medium">701.1 zł</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: "27%" }}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span>Instalacje</span>
                  <span className="font-medium">1476 zł</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: "57%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statystyki płatności</CardTitle>
              <CardDescription>Informacje o płatnościach klienta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Średni czas płatności</p>
                    <p className="text-2xl font-bold">5 dni</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Terminowość</p>
                    <p className="text-2xl font-bold">100%</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Łączna wartość</p>
                    <p className="text-2xl font-bold">2607.6 zł</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Średnia faktura</p>
                    <p className="text-2xl font-bold">651.9 zł</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="services" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Rodzaje usług</CardTitle>
              <CardDescription>Podział usług według typu</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: {
                    label: "Liczba usług",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={serviceTypeData}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                    <Bar dataKey="value" fill="var(--color-value)" radius={[0, 4, 4, 0]} className="fill-primary" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Częstotliwość usług</CardTitle>
              <CardDescription>Liczba usług w czasie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Średnia liczba usług (miesięcznie)</span>
                    <span className="font-medium">0.42</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Ostatnia usługa</span>
                    <span className="font-medium">5 listopada 2023</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Następna planowana usługa</span>
                    <span className="font-medium">15 marca 2024</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Rozkład usług w roku</h4>
                  <div className="grid grid-cols-12 gap-1">
                    {monthlySpendingData.map((month, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className={`w-full h-10 rounded-sm ${
                            month.amount > 0 ? "bg-primary" : "bg-muted"
                          } flex items-end`}
                          style={{
                            opacity: month.amount > 0 ? 1 : 0.3,
                          }}
                        ></div>
                        <span className="text-xs mt-1">{month.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Szczegóły usług</CardTitle>
            <CardDescription>Informacje o wykonanych usługach</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 border rounded-lg p-4">
                  <h4 className="font-medium">Przeglądy</h4>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Liczba:</span>
                    <span>2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Średni koszt:</span>
                    <span>390.25 zł</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Częstotliwość:</span>
                    <span>Co 6 miesięcy</span>
                  </div>
                </div>

                <div className="space-y-2 border rounded-lg p-4">
                  <h4 className="font-medium">Naprawy</h4>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Liczba:</span>
                    <span>2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Średni koszt:</span>
                    <span>350.55 zł</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Najczęstszy problem:</span>
                    <span>Pilot</span>
                  </div>
                </div>

                <div className="space-y-2 border rounded-lg p-4">
                  <h4 className="font-medium">Instalacje</h4>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Liczba:</span>
                    <span>1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Średni koszt:</span>
                    <span>1476 zł</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Ostatnia instalacja:</span>
                    <span>Czerwiec 2023</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="devices" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Wydajność urządzeń</CardTitle>
            <CardDescription>Porównanie wydajności zainstalowanych urządzeń</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                efficiency: {
                  label: "Wydajność (%)",
                  color: "hsl(var(--chart-1))",
                },
                consumption: {
                  label: "Zużycie energii (kWh)",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={deviceEfficiencyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" orientation="left" tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                  <Bar
                    yAxisId="left"
                    dataKey="efficiency"
                    fill="var(--color-efficiency)"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="consumption"
                    fill="var(--color-consumption)"
                    radius={[4, 4, 0, 0]}
                    className="fill-secondary"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Stan urządzeń</CardTitle>
              <CardDescription>Informacje o stanie urządzeń klienta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Klimatyzator 1</span>
                    <span className="text-green-600 font-medium">Dobry</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: "95%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Klimatyzator 2</span>
                    <span className="text-green-600 font-medium">Dobry</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: "92%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Rekuperator</span>
                    <span className="text-yellow-600 font-medium">Wymaga naprawy</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-yellow-500 h-full rounded-full" style={{ width: "78%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Zużycie energii</CardTitle>
              <CardDescription>Miesięczne zużycie energii przez urządzenia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Łączne zużycie</p>
                    <p className="text-2xl font-bold">350 kWh</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Średnie zużycie</p>
                    <p className="text-2xl font-bold">116.7 kWh</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Trend</p>
                    <p className="text-2xl font-bold text-green-600">↓ 10%</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Efektywność</p>
                    <p className="text-2xl font-bold">88%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="lifetime" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Wartość klienta w czasie</CardTitle>
            <CardDescription>Przychody i liczba usług w poszczególnych latach</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Przychód (zł)",
                  color: "hsl(var(--chart-1))",
                },
                services: {
                  label: "Liczba usług",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={customerLifetimeData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="services"
                    stroke="var(--color-services)"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Wartość klienta</CardTitle>
              <CardDescription>Szacowana wartość klienta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Dotychczasowa wartość</span>
                  <span className="font-medium">2607.6 zł</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Przewidywana wartość (rok)</span>
                  <span className="font-medium">5200 zł</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Przewidywana wartość (5 lat)</span>
                  <span className="font-medium">26000 zł</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lojalność klienta</CardTitle>
              <CardDescription>Wskaźniki lojalności</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Czas współpracy</span>
                  <span className="font-medium">11 miesięcy</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Wskaźnik retencji</span>
                  <span className="font-medium">100%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Wskaźnik satysfakcji</span>
                  <span className="font-medium">Wysoki</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Potencjał wzrostu</CardTitle>
              <CardDescription>Możliwości rozwoju współpracy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Potencjał sprzedażowy</span>
                  <span className="font-medium">Wysoki</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Rekomendowane działania</span>
                  <span className="font-medium">Oferta wymiany</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Szansa na rozszerzenie</span>
                  <span className="font-medium">75%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
