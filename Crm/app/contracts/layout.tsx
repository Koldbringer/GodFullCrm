import type { Metadata } from 'next'
import { FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Umowy - HVAC CRM ERP',
  description: 'Zarządzanie umowami w systemie HVAC CRM ERP',
}

export default function ContractsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <FileText className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Umowy</h1>
          <p className="text-muted-foreground">Zarządzaj umowami serwisowymi i gwarancyjnymi</p>
        </div>
      </div>
      {children}
    </div>
  )
}
