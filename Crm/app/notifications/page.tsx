import type { Metadata } from "next"
import { Bell, Filter, CheckCircle, Clock } from "lucide-react"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerClient } from "@/lib/supabase"

export const metadata: Metadata = {
  title: "Powiadomienia - HVAC CRM ERP",
  description: "Zarządzanie powiadomieniami w systemie HVAC CRM ERP",
}

// Komponent ładowania dla listy powiadomień
function NotificationsListSkeleton() {
  return (
    <div className="space-y-4">
      {Array(5).fill(0).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-[70%]" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Komponent strony powiadomień
export default function NotificationsPage() {
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
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Powiadomienia</h2>
            <p className="text-muted-foreground">
              Zarządzaj wszystkimi powiadomieniami w systemie
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtry
            </Button>
            <Button>
              <CheckCircle className="mr-2 h-4 w-4" />
              Oznacz wszystkie jako przeczytane
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              Wszystkie
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              Nieprzeczytane
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Ostatnie
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <Suspense fallback={<NotificationsListSkeleton />}>
              <div className="text-center py-8">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-medium">Powiadomienia są dostępne w panelu</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Kliknij ikonę dzwonka w górnym pasku, aby zobaczyć swoje powiadomienia.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pełna strona powiadomień jest w trakcie implementacji.
                </p>
              </div>
            </Suspense>
          </TabsContent>
          
          <TabsContent value="unread" className="space-y-4">
            <Suspense fallback={<NotificationsListSkeleton />}>
              <div className="text-center py-8">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-medium">Powiadomienia są dostępne w panelu</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Kliknij ikonę dzwonka w górnym pasku, aby zobaczyć swoje powiadomienia.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pełna strona powiadomień jest w trakcie implementacji.
                </p>
              </div>
            </Suspense>
          </TabsContent>
          
          <TabsContent value="recent" className="space-y-4">
            <Suspense fallback={<NotificationsListSkeleton />}>
              <div className="text-center py-8">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-medium">Powiadomienia są dostępne w panelu</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Kliknij ikonę dzwonka w górnym pasku, aby zobaczyć swoje powiadomienia.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pełna strona powiadomień jest w trakcie implementacji.
                </p>
              </div>
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
