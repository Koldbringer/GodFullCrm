"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon, PhoneIcon, ClipboardListIcon } from "lucide-react"

export function MobileOrders() {
  const [activeTab, setActiveTab] = useState("pending")

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 h-auto">
          <TabsTrigger value="pending">Oczekujące</TabsTrigger>
          <TabsTrigger value="inprogress">W trakcie</TabsTrigger>
          <TabsTrigger value="completed">Ukończone</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-4">
          {[1, 2].map((i) => (
            <OrderCard
              key={i}
              id={`ZS-${2023100 + i}`}
              title={`Serwis klimatyzacji ${i}`}
              date={new Date().toLocaleDateString()}
              time={`${10 + i}:00 - ${11 + i}:00`}
              address={`ul. Przykładowa ${i * 15}, Warszawa`}
              customer={`Klient Testowy ${i}`}
              phone={`+48 ${500000000 + i}`}
              type={i % 2 === 0 ? "Przegląd" : "Naprawa"}
              status="pending"
            />
          ))}
        </TabsContent>

        <TabsContent value="inprogress" className="space-y-4 mt-4">
          {[3, 4].map((i) => (
            <OrderCard
              key={i}
              id={`ZS-${2023100 + i}`}
              title={`Serwis klimatyzacji ${i}`}
              date={new Date().toLocaleDateString()}
              time={`${8 + i}:00 - ${9 + i}:00`}
              address={`ul. Przykładowa ${i * 12}, Warszawa`}
              customer={`Klient Testowy ${i}`}
              phone={`+48 ${500000000 + i}`}
              type={i % 2 === 0 ? "Przegląd" : "Naprawa"}
              status="inprogress"
            />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-4">
          {[5, 6].map((i) => (
            <OrderCard
              key={i}
              id={`ZS-${2023100 + i}`}
              title={`Serwis klimatyzacji ${i}`}
              date={new Date(Date.now() - 86400000).toLocaleDateString()}
              time={`${8 + i}:00 - ${9 + i}:00`}
              address={`ul. Przykładowa ${i * 8}, Warszawa`}
              customer={`Klient Testowy ${i}`}
              phone={`+48 ${500000000 + i}`}
              type={i % 2 === 0 ? "Przegląd" : "Naprawa"}
              status="completed"
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface OrderCardProps {
  id: string
  title: string
  date: string
  time: string
  address: string
  customer: string
  phone: string
  type: string
  status: "pending" | "inprogress" | "completed"
}

function OrderCard({ id, title, date, time, address, customer, phone, type, status }: OrderCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-xs text-muted-foreground">{id}</p>
          </div>
          <Badge variant={status === "completed" ? "success" : status === "inprogress" ? "default" : "secondary"}>
            {status === "completed" ? "Ukończone" : status === "inprogress" ? "W trakcie" : "Oczekujące"}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 opacity-70" />
            <span className="text-sm">{date}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-2 opacity-70" />
            <span className="text-sm">{time}</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 mr-2 opacity-70" />
            <span className="text-sm">{address}</span>
          </div>
          <div className="flex items-center">
            <UserIcon className="h-4 w-4 mr-2 opacity-70" />
            <span className="text-sm">{customer}</span>
          </div>
          <div className="flex items-center">
            <PhoneIcon className="h-4 w-4 mr-2 opacity-70" />
            <span className="text-sm">{phone}</span>
          </div>
          <div className="flex items-center">
            <ClipboardListIcon className="h-4 w-4 mr-2 opacity-70" />
            <span className="text-sm">{type}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          {status === "pending" && (
            <>
              <Button className="flex-1">Rozpocznij</Button>
              <Button variant="outline" className="flex-1">
                Szczegóły
              </Button>
            </>
          )}

          {status === "inprogress" && (
            <>
              <Button className="flex-1">Zakończ</Button>
              <Button variant="outline" className="flex-1">
                Raport
              </Button>
            </>
          )}

          {status === "completed" && (
            <>
              <Button variant="outline" className="flex-1">
                Raport
              </Button>
              <Button variant="outline" className="flex-1">
                Historia
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
