import type { Metadata } from "next"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { TicketsList } from "@/components/tickets/tickets-list"
import { TicketsStats } from "@/components/tickets/tickets-stats"
import { TicketsKanban } from "@/components/tickets/tickets-kanban"
import { ResponsiveContainer } from "@/components/responsive/responsive-container"
import { useTranslation } from "@/components/i18n/i18n-provider"

export const metadata: Metadata = {
  title: "Zgłoszenia serwisowe - HVAC CRM ERP",
  description: "Zarządzanie zgłoszeniami serwisowymi w systemie HVAC CRM ERP",
}

"use client"

export default function TicketsPage() {
  const { t } = useTranslation()

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
          <h1 className="text-3xl font-bold tracking-tight">{t('tickets.title')}</h1>
          <div className="flex items-center space-x-2">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
              {t('tickets.new_ticket')}
            </Button>
          </div>
        </div>
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList aria-label={t('tickets.view_options', 'Opcje widoku')}>
            <TabsTrigger value="list">{t('tickets.list_view')}</TabsTrigger>
            <TabsTrigger value="kanban">{t('tickets.kanban_view')}</TabsTrigger>
            <TabsTrigger value="stats">{t('tickets.stats_view')}</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="space-y-4" tabIndex={0}>
            <TicketsList />
          </TabsContent>
          <TabsContent value="kanban" className="space-y-4" tabIndex={0}>
            <TicketsKanban />
          </TabsContent>
          <TabsContent value="stats" className="space-y-4" tabIndex={0}>
            <TicketsStats />
          </TabsContent>
        </Tabs>
      </ResponsiveContainer>
    </div>
  )
}
