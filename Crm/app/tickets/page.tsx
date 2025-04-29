import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { ResponsiveContainer } from "@/components/responsive/responsive-container"
import { TicketsServer } from "@/components/tickets/tickets-server"

// Metadata is defined in layout.tsx

export default async function TicketsPage() {
  // Pobierz komponenty z serwera
  const { TicketsListComponent, TicketsStatsComponent, TicketsKanbanComponent } = await TicketsServer()

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
      <ResponsiveContainer className="flex-1 space-y-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Zgłoszenia</h1>
          <div className="flex items-center space-x-2">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
              Nowe zgłoszenie
            </Button>
          </div>
        </div>
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList aria-label="Opcje widoku">
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="stats">Statystyki</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="space-y-4" tabIndex={0}>
            <TicketsListComponent />
          </TabsContent>
          <TabsContent value="kanban" className="space-y-4" tabIndex={0}>
            <TicketsKanbanComponent />
          </TabsContent>
          <TabsContent value="stats" className="space-y-4" tabIndex={0}>
            <TicketsStatsComponent />
          </TabsContent>
        </Tabs>
      </ResponsiveContainer>
    </div>
  )
}
