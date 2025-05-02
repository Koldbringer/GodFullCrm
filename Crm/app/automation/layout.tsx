import type { Metadata } from 'next'
import { Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Automatyzacja - HVAC CRM ERP',
  description: 'Automatyzacja procesów w systemie HVAC CRM ERP',
}

export default function AutomationLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <Zap className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Automatyzacja</h1>
          <p className="text-muted-foreground">Zarządzaj automatyzacją procesów i powiadomieniami</p>
        </div>
      </div>
      {children}
    </div>
  )
}
