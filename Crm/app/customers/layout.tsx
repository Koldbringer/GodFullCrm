import type { Metadata } from 'next'
import { Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Klienci - HVAC CRM ERP',
  description: 'Zarządzanie klientami w systemie HVAC CRM ERP',
}

export default function CustomersLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <Users className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Klienci</h1>
          <p className="text-muted-foreground">Zarządzaj bazą klientów i ich danymi</p>
        </div>
      </div>
      {children}
    </div>
  )
}
