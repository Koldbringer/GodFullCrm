import type { Metadata } from 'next'
import { TicketCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Zgłoszenia - HVAC CRM ERP',
  description: 'Zarządzanie zgłoszeniami serwisowymi w systemie HVAC CRM ERP',
}

export default function TicketsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <TicketCheck className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Zgłoszenia</h1>
          <p className="text-muted-foreground">Zarządzaj zgłoszeniami serwisowymi i ich statusami</p>
        </div>
      </div>
      {children}
    </div>
  )
}
