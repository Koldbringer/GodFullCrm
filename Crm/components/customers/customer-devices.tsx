"use client"

import { Badge } from "@/components/ui/badge"

import Link from "next/link"
import { format } from "date-fns"
import { pl } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DeviceStatusBadge } from "@/components/devices/device-status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Przykładowe dane urządzeń
const devicesData = [
  {
    id: "DEV001",
    type: "Klimatyzator",
    model: "Mitsubishi Electric MSZ-AP25VG",
    serial_number: "ME2023051001",
    installation_date: "2023-05-10T09:30:00Z",
    site_name: "Biuro główne",
    site_id: "site1",
    customer_id: "c1",
    status: "Aktywne",
    last_service_date: "2023-09-15T14:00:00Z",
    warranty_end_date: "2025-05-10T00:00:00Z",
    next_service_date: "2024-03-15T00:00:00Z",
    efficiency: 95,
    energy_consumption: {
      last_month: 120,
      average: 135,
      trend: "down",
    },
  },
  {
    id: "DEV002",
    type: "Klimatyzator",
    model: "Daikin FTXM35N",
    serial_number: "DA2023062002",
    installation_date: "2023-06-20T11:45:00Z",
    site_name: "Sala konferencyjna",
    site_id: "site1",
    customer_id: "c1",
    status: "Aktywne",
    last_service_date: "2023-10-05T10:30:00Z",
    warranty_end_date: "2025-06-20T00:00:00Z",
    next_service_date: "2024-04-05T00:00:00Z",
    efficiency: 92,
    energy_consumption: {
      last_month: 145,
      average: 150,
      trend: "stable",
    },
  },
  {
    id: "DEV003",
    type: "Rekuperator",
    model: "Vents VUT 350 EH EC",
    serial_number: "VE2023030503",
    installation_date: "2023-03-05T13:20:00Z",
    site_name: "Biuro główne",
    site_id: "site1",
    customer_id: "c1",
    status: "W naprawie",
    last_service_date: "2023-10-12T09:15:00Z",
    warranty_end_date: "2025-03-05T00:00:00Z",
    next_service_date: "2023-11-12T00:00:00Z",
    efficiency: 78,
    energy_consumption: {
      last_month: 85,
      average: 90,
      trend: "down",
    },
  },
  {
    id: "DEV004",
    type: "Pompa ciepła",
    model: "Daikin Altherma 3 ERGA04DV",
    serial_number: "DA2023062002",
    installation_date: "2023-06-20T11:45:00Z",
    site_name: "Dom jednorodzinny",
    site_id: "site2",
    customer_id: "c2",
    status: "Aktywne",
    last_service_date: "2023-10-05T10:30:00Z",
    warranty_end_date: "2028-06-20T00:00:00Z",
    next_service_date: "2024-04-05T00:00:00Z",
    efficiency: 97,
    energy_consumption: {
      last_month: 320,
      average: 350,
      trend: "down",
    },
  },
  {
    id: "DEV005",
    type: "Klimatyzator",
    model: "Samsung AR09TXHQASINEU",
    serial_number: "SS2023041204",
    installation_date: "2023-04-12T10:15:00Z",
    site_name: "Dom jednorodzinny",
    site_id: "site2",
    customer_id: "c2",
    status: "Aktywne",
    last_service_date: "2023-08-20T11:30:00Z",
    warranty_end_date: "2025-04-12T00:00:00Z",
    next_service_date: "2024-02-20T00:00:00Z",
    efficiency: 91,
    energy_consumption: {
      last_month: 110,
      average: 125,
      trend: "down",
    },
  },
]

interface CustomerDevicesProps {
  customerId: string
}

export function CustomerDevices({ customerId }: CustomerDevicesProps) {
  // Filtrowanie urządzeń dla danego klienta
  const customerDevices = devicesData.filter((device) => device.customer_id === customerId)

  // Grupowanie urządzeń według lokalizacji
  const devicesByLocation = customerDevices.reduce(
    (acc, device) => {
      if (!acc[device.site_name]) {
        acc[device.site_name] = []
      }
      acc[device.site_name].push(device)
      return acc
    },
    {} as Record<string, typeof customerDevices>,
  )

  return (
    <Tabs defaultValue="grid" className="space-y-4">
      <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="grid">Karty</TabsTrigger>
          <TabsTrigger value="table">Tabela</TabsTrigger>
          <TabsTrigger value="locations">Według lokalizacji</TabsTrigger>
        </TabsList>
        <div className="text-sm text-muted-foreground">
          Łącznie urządzeń: <span className="font-medium">{customerDevices.length}</span>
        </div>
      </div>

      <TabsContent value="grid" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customerDevices.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-6 text-center">
                <p className="mb-4 text-muted-foreground">Brak urządzeń dla tego klienta.</p>
                <Button>Dodaj pierwsze urządzenie</Button>
              </CardContent>
            </Card>
          ) : (
            customerDevices.map((device) => (
              <Card key={device.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{device.type}</h4>
                      <DeviceStatusBadge status={device.status} />
                    </div>
                    <p className="text-sm font-medium">{device.model}</p>
                    <p className="text-xs text-muted-foreground">S/N: {device.serial_number}</p>

                    <div className="mt-4 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lokalizacja:</span>
                        <Link href={`/sites/${device.site_id}`} className="hover:underline">
                          {device.site_name}
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Instalacja:</span>
                        <span>{format(new Date(device.installation_date), "d MMM yyyy", { locale: pl })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ostatni serwis:</span>
                        <span>
                          {device.last_service_date
                            ? format(new Date(device.last_service_date), "d MMM yyyy", { locale: pl })
                            : "Brak"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Następny serwis:</span>
                        <span>
                          {device.next_service_date
                            ? format(new Date(device.next_service_date), "d MMM yyyy", { locale: pl })
                            : "Nie zaplanowano"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gwarancja do:</span>
                        <span>{format(new Date(device.warranty_end_date), "d MMM yyyy", { locale: pl })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-2 flex justify-end">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/devices/${device.id}`}>Szczegóły</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="table">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Typ</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Lokalizacja</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Instalacja</TableHead>
                <TableHead>Ostatni serwis</TableHead>
                <TableHead>Następny serwis</TableHead>
                <TableHead>Gwarancja do</TableHead>
                <TableHead>Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerDevices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    Brak urządzeń dla tego klienta.
                  </TableCell>
                </TableRow>
              ) : (
                customerDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>{device.type}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{device.model}</div>
                        <div className="text-xs text-muted-foreground">S/N: {device.serial_number}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link href={`/sites/${device.site_id}`} className="hover:underline">
                        {device.site_name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <DeviceStatusBadge status={device.status} />
                    </TableCell>
                    <TableCell>{format(new Date(device.installation_date), "d MMM yyyy", { locale: pl })}</TableCell>
                    <TableCell>
                      {device.last_service_date
                        ? format(new Date(device.last_service_date), "d MMM yyyy", { locale: pl })
                        : "Brak"}
                    </TableCell>
                    <TableCell>
                      {device.next_service_date
                        ? format(new Date(device.next_service_date), "d MMM yyyy", { locale: pl })
                        : "Nie zaplanowano"}
                    </TableCell>
                    <TableCell>{format(new Date(device.warranty_end_date), "d MMM yyyy", { locale: pl })}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/devices/${device.id}`}>Szczegóły</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="locations" className="space-y-4">
        {Object.keys(devicesByLocation).length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="mb-4 text-muted-foreground">Brak urządzeń dla tego klienta.</p>
              <Button>Dodaj pierwsze urządzenie</Button>
            </CardContent>
          </Card>
        ) : (
          Object.entries(devicesByLocation).map(([location, devices]) => (
            <Card key={location} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">{location}</h3>
                  <Badge variant="outline">{devices.length} urządzeń</Badge>
                </div>
                <div className="space-y-4">
                  {devices.map((device) => (
                    <div key={device.id} className="flex justify-between items-center p-2 border rounded-md">
                      <div>
                        <div className="font-medium">
                          {device.type}: {device.model}
                        </div>
                        <div className="text-sm text-muted-foreground">S/N: {device.serial_number}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DeviceStatusBadge status={device.status} />
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/devices/${device.id}`}>Szczegóły</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>
    </Tabs>
  )
}
