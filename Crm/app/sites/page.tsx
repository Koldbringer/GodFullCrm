import type { Metadata } from "next"
import { PlusCircle, Map, List, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { SitesView } from "@/components/sites/sites-view"
import { AdvancedMapView } from "@/components/sites/advanced-map-view"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Lokalizacje - HVAC CRM ERP",
  description: "Zarządzanie lokalizacjami klientów w systemie HVAC CRM ERP",
}

export default function SitesPage() {
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
          <h2 className="text-3xl font-bold tracking-tight">Lokalizacje</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtry
            </Button>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Dodaj lokalizację
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <Tabs defaultValue="list" className="space-y-4">
            <TabsList>
              <TabsTrigger value="list" className="flex items-center">
                <List className="mr-2 h-4 w-4" />
                Lista
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center">
                <Map className="mr-2 h-4 w-4" />
                Mapa
              </TabsTrigger>
            </TabsList>
            <TabsContent value="list" className="space-y-4">
              <SitesView />
            </TabsContent>
            <TabsContent value="map" className="space-y-4">
              <AdvancedMapView />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
