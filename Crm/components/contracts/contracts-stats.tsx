"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Dane do wykresu kołowego statusów umów
const statusData = [
  { name: "Aktywne", value: 65, color: "#22c55e" },
  { name: "Wygasające", value: 25, color: "#eab308" },
  { name: "Wygasłe", value: 10, color: "#ef4444" },
]

// Dane do wykresu słupkowego typów umów
const typeData = [
  { name: "Pełny serwis", value: 42 },
  { name: "Przeglądy kwartalne", value: 28 },
  { name: "Gwarancja rozszerzona", value: 18 },
  { name: "Przeglądy półroczne", value: 12 },
]

// Dane do wykresu wartości umów miesięcznie
const monthlyData = [
  { name: "Sty", value: 12000 },
  { name: "Lut", value: 15000 },
  { name: "Mar", value: 18000 },
  { name: "Kwi", value: 22000 },
  { name: "Maj", value: 19000 },
  { name: "Cze", value: 24000 },
  { name: "Lip", value: 28000 },
  { name: "Sie", value: 26000 },
  { name: "Wrz", value: 30000 },
  { name: "Paź", value: 27000 },
  { name: "Lis", value: 32000 },
  { name: "Gru", value: 35000 },
]

export function ContractsStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Status umów</CardTitle>
          <CardDescription>Podział umów według statusu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, "Udział"]}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Typy umów</CardTitle>
          <CardDescription>Podział umów według typu</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Liczba umów",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Kluczowe wskaźniki</CardTitle>
          <CardDescription>Podsumowanie umów serwisowych</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Aktywne umowy</p>
              <p className="text-2xl font-bold">127</p>
            </div>
            <div className="space-y-2 rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Wygasające w ciągu 30 dni</p>
              <p className="text-2xl font-bold">18</p>
            </div>
            <div className="space-y-2 rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Średnia wartość</p>
              <p className="text-2xl font-bold">8 450 zł</p>
            </div>
            <div className="space-y-2 rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Przychód roczny</p>
              <p className="text-2xl font-bold">1.2M zł</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Wartość umów miesięcznie</CardTitle>
          <CardDescription>Przychód z umów serwisowych w ciągu roku</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Wartość (PLN)",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
