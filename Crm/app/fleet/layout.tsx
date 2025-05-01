import type { Metadata } from 'next'
import { Car } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Flota - HVAC CRM ERP',
  description: 'Zarządzanie flotą pojazdów w systemie HVAC CRM ERP',
}

export default function FleetLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <Car className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Flota</h1>
          <p className="text-muted-foreground">Zarządzaj pojazdami firmowymi i ich przydziałami</p>
        </div>
      </div>
      {children}
    </div>
  )
}
