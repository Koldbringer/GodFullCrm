import type { Metadata } from "next"
import { PlusCircle } from "lucide-react"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { InventoryServer } from "@/components/inventory/inventory-server"
import { InventoryManagement } from "@/components/inventory/inventory-management"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Magazyn - HVAC CRM ERP",
  description: "Zarządzanie magazynem części i materiałów w systemie HVAC CRM ERP",
}

export default function InventoryPage() {
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
          <h2 className="text-3xl font-bold tracking-tight">Magazyn</h2>
          <div className="flex items-center space-x-2">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Dodaj produkt
            </Button>
          </div>
        </div>
        <Tabs defaultValue="classic" className="space-y-4">
          <TabsList>
            <TabsTrigger value="classic">Klasyczny widok</TabsTrigger>
            <TabsTrigger value="advanced">Zaawansowany widok</TabsTrigger>
          </TabsList>

          <TabsContent value="classic" className="space-y-4">
            <InventoryServer />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Suspense
              fallback={
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-96 w-full" />
                </div>
              }
            >
              <InventoryManagement />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
