import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MobileDashboard } from "@/components/mobile/mobile-dashboard"
import { MobileOrders } from "@/components/mobile/mobile-orders"
import { MobileInventory } from "@/components/mobile/mobile-inventory"
import { MobileProfile } from "@/components/mobile/mobile-profile"

export const metadata: Metadata = {
  title: "Mobilny Interfejs",
  description: "Mobilny interfejs dla techników HVAC",
}

export default function MobilePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Mobilny Interfejs</h2>
        </div>
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid grid-cols-4 h-auto">
            <TabsTrigger value="dashboard">Pulpit</TabsTrigger>
            <TabsTrigger value="orders">Zlecenia</TabsTrigger>
            <TabsTrigger value="inventory">Magazyn</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mobilny Pulpit</CardTitle>
                <CardDescription>Podgląd dzisiejszych zadań i kluczowych informacji dla technika</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <MobileDashboard />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Zlecenia Serwisowe</CardTitle>
                <CardDescription>Zarządzaj zleceniami serwisowymi w terenie</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <MobileOrders />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mobilny Magazyn</CardTitle>
                <CardDescription>Zarządzaj częściami i materiałami w terenie</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <MobileInventory />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profil Technika</CardTitle>
                <CardDescription>Zarządzaj swoim profilem i ustawieniami</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <MobileProfile />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
