import type { Metadata } from "next"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { EmployeesList } from "@/components/employees/employees-list"
import { EmployeesMap } from "@/components/employees/employees-map"
import { EmployeesStats } from "@/components/employees/employees-stats"
import { EmployeesCalendar } from "@/components/employees/employees-calendar"

export const metadata: Metadata = {
  title: "Pracownicy - HVAC CRM ERP",
  description: "Zarządzanie pracownikami i technikami w systemie HVAC CRM ERP",
}

export default function EmployeesPage() {
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
          <h2 className="text-3xl font-bold tracking-tight">Pracownicy</h2>
          <div className="flex items-center space-x-2">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Dodaj pracownika
            </Button>
          </div>
        </div>
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Lista pracowników</TabsTrigger>
            <TabsTrigger value="map">Mapa terenowa</TabsTrigger>
            <TabsTrigger value="stats">Statystyki</TabsTrigger>
            <TabsTrigger value="calendar">Harmonogram pracy</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="space-y-4">
            <EmployeesList />
          </TabsContent>
          <TabsContent value="map" className="space-y-4">
            <EmployeesMap />
          </TabsContent>
          <TabsContent value="stats" className="space-y-4">
            <EmployeesStats />
          </TabsContent>
          <TabsContent value="calendar" className="space-y-4">
            <EmployeesCalendar />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
