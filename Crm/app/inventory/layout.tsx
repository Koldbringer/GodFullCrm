import type { Metadata } from 'next'
import { Package } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Magazyn - HVAC CRM ERP',
  description: 'Zarządzanie magazynem w systemie HVAC CRM ERP',
}

export default function InventoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <Package className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Magazyn</h1>
          <p className="text-muted-foreground">Zarządzaj stanem magazynowym i częściami zamiennymi</p>
        </div>
      </div>
      {children}
    </div>
  )
}
