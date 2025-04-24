import type { Metadata } from 'next'
import { Cpu } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Urządzenia - HVAC CRM ERP',
  description: 'Zarządzanie urządzeniami HVAC w systemie CRM ERP',
}

export default function DevicesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <Cpu className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Urządzenia</h1>
          <p className="text-muted-foreground">Zarządzaj urządzeniami HVAC i ich parametrami</p>
        </div>
      </div>
      {children}
    </div>
  )
}
