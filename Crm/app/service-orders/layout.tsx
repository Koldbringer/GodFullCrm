import type { Metadata } from 'next'
import { ClipboardList } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Zlecenia Serwisowe - HVAC CRM ERP',
  description: 'Zarządzanie zleceniami serwisowymi w systemie HVAC CRM ERP',
}

export default function ServiceOrdersLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <ClipboardList className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Zlecenia Serwisowe</h1>
          <p className="text-muted-foreground">Zarządzaj zleceniami serwisowymi i ich statusami</p>
        </div>
      </div>
      {children}
    </div>
  )
}
