import type { Metadata } from 'next'
import { FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Oferty - HVAC CRM ERP',
  description: 'Zarządzanie ofertami w systemie HVAC CRM ERP',
}

export default function QuotesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <FileText className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Oferty</h1>
          <p className="text-muted-foreground">Zarządzaj ofertami dla klientów</p>
        </div>
      </div>
      {children}
    </div>
  )
}
