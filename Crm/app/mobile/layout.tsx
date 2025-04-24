import type { Metadata } from 'next'
import { Smartphone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wersja Mobilna - HVAC CRM ERP',
  description: 'Wersja mobilna systemu HVAC CRM ERP',
}

export default function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col space-y-4 max-w-md mx-auto p-4">
      <div className="flex items-center justify-center gap-2 border-b pb-4">
        <Smartphone className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-xl font-bold tracking-tight">HVAC CRM Mobile</h1>
          <p className="text-xs text-muted-foreground">Wersja mobilna systemu</p>
        </div>
      </div>
      {children}
    </div>
  )
}
