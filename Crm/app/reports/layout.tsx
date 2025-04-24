import type { Metadata } from 'next'
import { BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Raporty - HVAC CRM ERP',
  description: 'Raporty i analizy w systemie HVAC CRM ERP',
}

export default function ReportsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <BarChart3 className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Raporty</h1>
          <p className="text-muted-foreground">Generuj i przeglądaj raporty oraz analizy</p>
        </div>
      </div>
      {children}
    </div>
  )
}
