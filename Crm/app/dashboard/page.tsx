import type { Metadata } from "next"
import { ArrowUpRight, BarChart3, ClipboardList, Package, Users, Plus, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { AiInsightsPanel } from "@/components/dashboard/ai-insights-panel"
import { IotMonitoringPanel } from "@/components/dashboard/iot-monitoring-panel"
import { TechnicianPerformance } from "@/components/dashboard/technician-performance"
import { BusinessMetrics } from "@/components/dashboard/business-metrics"
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks"

export const metadata: Metadata = {
  title: "Dashboard - HVAC CRM ERP",
  description: "Zaawansowany dashboard dla systemu HVAC CRM ERP",
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <NotificationCenter />
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtry
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nowe zlecenie
            </Button>
          </div>
        </div>

        {/* Kluczowe wskaźniki */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktywne zlecenia</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 od wczoraj</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Klienci</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">145</div>
              <p className="text-xs text-muted-foreground">+4 w tym miesiącu</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urządzenia</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">312</div>
              <p className="text-xs text-muted-foreground">+8 w tym miesiącu</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Przychód</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128,500 zł</div>
              <div className="flex items-center text-xs text-green-500">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>12.5% więcej niż w zeszłym miesiącu</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Główne panele */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Kolumna 1 */}
          <div className="space-y-4">
            <AiInsightsPanel />
            <BusinessMetrics />
          </div>

          {/* Kolumna 2 */}
          <div className="space-y-4">
            <IotMonitoringPanel />
            <TechnicianPerformance />
          </div>

          {/* Kolumna 3 */}
          <div className="space-y-4">
            <UpcomingTasks />
          </div>
        </div>
      </div>
    </div>
  )
}
