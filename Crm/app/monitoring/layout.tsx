import type { Metadata } from 'next'
import { Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Monitoring - HVAC CRM ERP',
  description: 'Monitoring urządzeń i systemów w systemie HVAC CRM ERP',
}

export default function MonitoringLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <Activity className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Monitoring</h1>
          <p className="text-muted-foreground">Monitoruj stan urządzeń i systemów HVAC</p>
        </div>
      </div>
      {children}
    </div>
  )
}
