import type { Metadata } from "next"
import { ArrowUpRight, BarChart3, ClipboardList, Package, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentOrders } from "@/components/recent-orders"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "HVAC CRM ERP",
  description: "System zarządzania dla firm HVAC",
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button>Nowe zlecenie</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Przegląd</TabsTrigger>
            <TabsTrigger value="analytics">Analityka</TabsTrigger>
            <TabsTrigger value="reports">Raporty</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
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
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">+3 w tym miesiącu</p>
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
                  <div className="text-2xl font-bold">45,231 zł</div>
                  <p className="text-xs text-muted-foreground">+20.1% od ostatniego miesiąca</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Przegląd</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Ostatnie zlecenia</CardTitle>
                  <CardDescription>Otrzymano 12 nowych zleceń w tym miesiącu.</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentOrders />
                </CardContent>
              </Card>
            </div>
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
                  <RecentOrders />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Raporty miesięczne</CardTitle>
                  <CardDescription>Podsumowanie działalności za ostatni miesiąc</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="font-medium">Raport serwisowy</div>
                      <Button variant="outline" size="sm">
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                        Pobierz
                      </Button>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="font-medium">Raport sprzedaży</div>
                      <Button variant="outline" size="sm">
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                        Pobierz
                      </Button>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="font-medium">Raport magazynowy</div>
                      <Button variant="outline" size="sm">
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                        Pobierz
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
