import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContractsList } from "@/components/contracts/contracts-list"
import { ContractsStats } from "@/components/contracts/contracts-stats"
import { ContractsCalendar } from "@/components/contracts/contracts-calendar"
import { ContractsRenewal } from "@/components/contracts/contracts-renewal"

export const metadata: Metadata = {
  title: "Umowy serwisowe | HVAC CRM/ERP",
  description: "Zarządzanie umowami serwisowymi i gwarancjami",
}

export default function ContractsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Umowy serwisowe</h1>
        <p className="text-muted-foreground">Zarządzaj umowami serwisowymi, gwarancjami i harmonogramami przeglądów</p>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-auto">
          <TabsTrigger value="list">Lista umów</TabsTrigger>
          <TabsTrigger value="stats">Statystyki</TabsTrigger>
          <TabsTrigger value="calendar">Harmonogram</TabsTrigger>
          <TabsTrigger value="renewal">Odnowienia</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-4">
          <ContractsList />
        </TabsContent>
        <TabsContent value="stats" className="mt-4">
          <ContractsStats />
        </TabsContent>
        <TabsContent value="calendar" className="mt-4">
          <ContractsCalendar />
        </TabsContent>
        <TabsContent value="renewal" className="mt-4">
          <ContractsRenewal />
        </TabsContent>
      </Tabs>
    </div>
  )
}
