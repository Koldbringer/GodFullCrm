import type { Metadata } from 'next'
import { CalendarIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kalendarz - HVAC CRM ERP',
  description: 'Zarządzanie harmonogramem wizyt i spotkań w systemie HVAC CRM ERP',
}

export default function CalendarLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <CalendarIcon className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kalendarz</h1>
          <p className="text-muted-foreground">Zarządzaj harmonogramem wizyt i spotkań</p>
        </div>
      </div>
      {children}
    </div>
  )
}
