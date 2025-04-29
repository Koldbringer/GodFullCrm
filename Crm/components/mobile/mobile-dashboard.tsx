"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ClockIcon, MapPinIcon, WrenchIcon } from "lucide-react"

export function MobileDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Dzisiejsze Zadania</CardTitle>
            <CardDescription>Masz 4 zaplanowane wizyty na dziś</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start space-x-4 rounded-md border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <WrenchIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Serwis klimatyzacji {i}</p>
                    <div className="flex items-center pt-2">
                      <CalendarIcon className="mr-1 h-3 w-3 opacity-70" />
                      <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</span>
                      <ClockIcon className="ml-3 mr-1 h-3 w-3 opacity-70" />
                      <span className="text-xs text-muted-foreground">{`${8 + i}:00 - ${9 + i}:00`}</span>
                    </div>
                    <div className="flex items-center pt-1">
                      <MapPinIcon className="mr-1 h-3 w-3 opacity-70" />
                      <span className="text-xs text-muted-foreground">ul. Przykładowa {i * 10}, Warszawa</span>
                    </div>
                    <div className="pt-2">
                      <Badge variant={i % 2 === 0 ? "default" : "secondary"} className="text-xs">
                        {i % 2 === 0 ? "Przegląd" : "Naprawa"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Statystyki Dzienne</CardTitle>
            <CardDescription>Twoje dzisiejsze postępy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center rounded-md border p-4">
                <span className="text-2xl font-bold">2/4</span>
                <span className="text-xs text-muted-foreground">Ukończone wizyty</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-md border p-4">
                <span className="text-2xl font-bold">3</span>
                <span className="text-xs text-muted-foreground">Części użyte</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-md border p-4">
                <span className="text-2xl font-bold">45km</span>
                <span className="text-xs text-muted-foreground">Przejechane</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-md border p-4">
                <span className="text-2xl font-bold">4.8</span>
                <span className="text-xs text-muted-foreground">Ocena klientów</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
