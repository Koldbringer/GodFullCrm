import type { Metadata } from "next"
import { PlusCircle, Filter } from "lucide-react"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { getTechnicians } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const metadata: Metadata = {
  title: "Technicy - HVAC CRM ERP",
  description: "Zarządzanie technikami w systemie HVAC CRM ERP",
}

// Dane zastępcze na wypadek błędu API
const fallbackData = [
  {
    id: "TECH001",
    name: "Piotr Nowak",
    email: "piotr.nowak@example.com",
    phone: "+48 123 456 789",
    specialization: "Klimatyzatory",
    status: "Dostępny",
    avatar_url: null,
  },
  {
    id: "TECH002",
    name: "Anna Wiśniewska",
    email: "anna.wisniewska@example.com",
    phone: "+48 987 654 321",
    specialization: "Pompy ciepła",
    status: "Zajęty",
    avatar_url: null,
  },
]

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

function getStatusColor(status: string) {
  switch (status) {
    case "Dostępny":
      return "bg-green-500"
    case "Zajęty":
      return "bg-yellow-500"
    case "Niedostępny":
      return "bg-red-500"
    case "Na urlopie":
      return "bg-blue-500"
    default:
      return "bg-gray-500"
  }
}

async function TechniciansGrid() {
  try {
    // Pobieranie danych z Supabase
    const technicians = await getTechnicians()
    
    // Używamy danych z API lub danych zastępczych, jeśli API zwróci pusty wynik
    const techData = technicians.length > 0 ? technicians : fallbackData
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {techData.map((tech) => (
          <Card key={tech.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{tech.name}</CardTitle>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(tech.status)}`} />
              </div>
              <CardDescription>{tech.specialization || "Brak specjalizacji"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={tech.avatar_url || ""} alt={tech.name} />
                  <AvatarFallback>{getInitials(tech.name)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm">{tech.email}</p>
                  <p className="text-sm text-muted-foreground">{tech.phone}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <Badge variant={tech.status === "Dostępny" ? "default" : "outline"}>{tech.status}</Badge>
                <Button variant="outline" size="sm">Szczegóły</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  } catch (error) {
    console.error("Error fetching technicians:", error)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {fallbackData.map((tech) => (
          <Card key={tech.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{tech.name}</CardTitle>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(tech.status)}`} />
              </div>
              <CardDescription>{tech.specialization || "Brak specjalizacji"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={tech.avatar_url || ""} alt={tech.name} />
                  <AvatarFallback>{getInitials(tech.name)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm">{tech.email}</p>
                  <p className="text-sm text-muted-foreground">{tech.phone}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <Badge variant={tech.status === "Dostępny" ? "default" : "outline"}>{tech.status}</Badge>
                <Button variant="outline" size="sm">Szczegóły</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
}

function TechniciansGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array(4).fill(0).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-3 w-3 rounded-full" />
            </div>
            <Skeleton className="h-4 w-24 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-8 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function TechniciansPage() {
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
          <h2 className="text-3xl font-bold tracking-tight">Technicy</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtry
            </Button>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Dodaj technika
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <Suspense fallback={<TechniciansGridSkeleton />}>
            <TechniciansGrid />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
