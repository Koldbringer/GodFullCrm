"use client"
import Link from "next/link"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DeviceStatusBadge } from "@/components/devices/device-status-badge"
import { getDevicesBySiteId } from "@/lib/api"

// Przykładowe dane urządzeń do użycia, gdy nie ma danych z API
const fallbackDevicesData = [
  {
    id: "DEV001",
    type: "Klimatyzator",
    model: "Mitsubishi Electric MSZ-AP25VG",
    serial_number: "ME2023051001",
    installation_date: "2023-05-10T09:30:00Z",
    site_id: "site1",
    status: "Aktywne",
    last_service_date: "2023-09-15T14:00:00Z",
    warranty_end_date: "2025-05-10T00:00:00Z",
  },
  {
    id: "DEV002",
    type: "Pompa ciepła",
    model: "Daikin Altherma 3 ERGA04DV",
    serial_number: "DA2023062002",
    installation_date: "2023-06-20T11:45:00Z",
    site_id: "site1",
    status: "Aktywne",
    last_service_date: "2023-10-05T10:30:00Z",
    warranty_end_date: "2028-06-20T00:00:00Z",
  }
]

interface SiteDevicesProps {
  siteId: string
}

export function SiteDevices({ siteId }: SiteDevicesProps) {
  const [devices, setDevices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Pobieranie urządzeń z API
  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true)
      try {
        const data = await getDevicesBySiteId(siteId)
        setDevices(data.length > 0 ? data : fallbackDevicesData)
      } catch (error) {
        console.error(`Error fetching devices for site ${siteId}:`, error)
        setDevices(fallbackDevicesData)
      } finally {
        setLoading(false)
      }
    }

    fetchDevices()
  }, [siteId])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {loading ? (
        <Card className="col-span-full">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center items-center h-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <p className="text-muted-foreground">Ładowanie urządzeń...</p>
          </CardContent>
        </Card>
      ) : devices.length === 0 ? (
        <Card className="col-span-full">
          <CardContent className="p-6 text-center">
            <p className="mb-4 text-muted-foreground">Brak urządzeń w tej lokalizacji.</p>
            <Button>Dodaj pierwsze urządzenie</Button>
          </CardContent>
        </Card>
      ) : (
        devices.map((device) => (
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
                    <span className="text-muted-foreground">Gwarancja do:</span>
                    <span>
                      {device.warranty_end_date
                        ? format(new Date(device.warranty_end_date), "d MMM yyyy", { locale: pl })
                        : "Brak danych"}
                    </span>
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
  )
}
