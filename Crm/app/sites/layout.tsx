import type { Metadata } from 'next'
import { MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Lokalizacje - HVAC CRM ERP',
  description: 'Zarządzanie lokalizacjami klientów w systemie HVAC CRM ERP',
}

export default function SitesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <MapPin className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lokalizacje</h1>
          <p className="text-muted-foreground">Zarządzaj lokalizacjami klientów i ich adresami</p>
        </div>
      </div>
      {children}
    </div>
  )
}
