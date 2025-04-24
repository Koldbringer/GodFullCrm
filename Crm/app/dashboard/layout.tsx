import type { Metadata } from 'next'
import { LayoutDashboard } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard - HVAC CRM ERP',
  description: 'Panel główny systemu HVAC CRM ERP',
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <LayoutDashboard className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Przegląd kluczowych wskaźników i statystyk</p>
        </div>
      </div>
      {children}
    </div>
  )
}
