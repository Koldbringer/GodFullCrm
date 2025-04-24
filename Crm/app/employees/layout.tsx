import type { Metadata } from 'next'
import { Users2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pracownicy - HVAC CRM ERP',
  description: 'Zarządzanie pracownikami w systemie HVAC CRM ERP',
}

export default function EmployeesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <Users2 className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pracownicy</h1>
          <p className="text-muted-foreground">Zarządzaj pracownikami i ich harmonogramami</p>
        </div>
      </div>
      {children}
    </div>
  )
}
