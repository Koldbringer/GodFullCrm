"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  UserIcon, 
  ClipboardListIcon, 
  CalendarIcon, 
  MapPinIcon, 
  PhoneIcon, 
  MailIcon,
  CheckCircleIcon,
  ClockIcon
} from "lucide-react"

export function MobileProfile() {
  const [technicianData] = useState({
    id: "T-1001",
    name: "Jan Kowalski",
    email: "jan.kowalski@example.com",
    phone: "+48 123 456 789",
    position: "Technik HVAC",
    avatar: "/avatars/technician-1.jpg",
    status: "available",
    location: "Warszawa, Mazowieckie",
    completedOrders: 128,
    pendingOrders: 3,
    skills: ["Klimatyzacja", "Wentylacja", "Ogrzewanie", "Chłodnictwo"]
  })

  const [recentOrders] = useState([
    {
      id: "SO-1234",
      customer: "Biurowiec Centrum",
      date: "2023-11-15",
      status: "completed",
      type: "Naprawa"
    },
    {
      id: "SO-1235",
      customer: "Hotel Panorama",
      date: "2023-11-14",
      status: "completed",
      type: "Konserwacja"
    },
    {
      id: "SO-1236",
      customer: "Galeria Handlowa",
      date: "2023-11-12",
      status: "completed",
      type: "Instalacja"
    }
  ])

  const [upcomingOrders] = useState([
    {
      id: "SO-1237",
      customer: "Centrum Medyczne",
      date: "2023-11-16",
      time: "09:00 - 11:00",
      type: "Konserwacja",
      address: "ul. Zdrowia 10, Warszawa"
    },
    {
      id: "SO-1238",
      customer: "Restauracja Smaczna",
      date: "2023-11-17",
      time: "13:00 - 15:00",
      type: "Naprawa",
      address: "ul. Kulinarna 5, Warszawa"
    },
    {
      id: "SO-1239",
      customer: "Biurowiec Park",
      date: "2023-11-18",
      time: "10:00 - 12:00",
      type: "Przegląd",
      address: "ul. Biznesowa 15, Warszawa"
    }
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500">Dostępny</Badge>
      case "busy":
        return <Badge className="bg-yellow-500">Zajęty</Badge>
      case "offline":
        return <Badge className="bg-gray-500">Niedostępny</Badge>
      default:
        return <Badge>Nieznany</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={technicianData.avatar} alt={technicianData.name} />
              <AvatarFallback>
                <UserIcon className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{technicianData.name}</h2>
              <p className="text-sm text-muted-foreground">{technicianData.position}</p>
              <div className="flex items-center mt-1">
                {getStatusBadge(technicianData.status)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <PhoneIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{technicianData.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MailIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{technicianData.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPinIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{technicianData.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ClipboardListIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{technicianData.completedOrders} zleceń</span>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Umiejętności:</p>
            <div className="flex flex-wrap gap-2">
              {technicianData.skills.map((skill, index) => (
                <Badge key={index} variant="outline">{skill}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid grid-cols-2 h-auto">
          <TabsTrigger value="upcoming">Nadchodzące</TabsTrigger>
          <TabsTrigger value="completed">Ukończone</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {upcomingOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{order.customer}</h3>
                    <p className="text-sm text-muted-foreground">{order.type}</p>
                  </div>
                  <Badge>{order.id}</Badge>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="h-3 w-3 mr-2" />
                    <span>{new Date(order.date).toLocaleDateString()} | {order.time}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPinIcon className="h-3 w-3 mr-2" />
                    <span>{order.address}</span>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <Button size="sm" className="flex-1">Rozpocznij</Button>
                  <Button size="sm" variant="outline" className="flex-1">Szczegóły</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-4">
          {recentOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{order.customer}</h3>
                    <p className="text-sm text-muted-foreground">{order.type}</p>
                  </div>
                  <Badge>{order.id}</Badge>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="h-3 w-3 mr-2" />
                    <span>{new Date(order.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircleIcon className="h-3 w-3 mr-2 text-green-500" />
                    <span className="text-green-500">Ukończone</span>
                  </div>
                </div>
                <div className="mt-3">
                  <Button size="sm" variant="outline" className="w-full">Szczegóły</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
