import type { Metadata } from 'next'
import { Wrench } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Technicy - HVAC CRM ERP',
  description: 'Zarządzanie technikami w systemie HVAC CRM ERP',
}

export default function TechniciansLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <Wrench className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Technicy</h1>
          <p className="text-muted-foreground">Zarządzaj technikami i ich przydziałami</p>
        </div>
      </div>
      {children}
    </div>
  )
}
