"use client"

import { Smartphone, Home, ClipboardList, Package, User, Calendar } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto">
      <header className="flex items-center justify-center gap-2 border-b p-4">
        <Smartphone className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-xl font-bold tracking-tight">HVAC CRM Mobile</h1>
          <p className="text-xs text-muted-foreground">Wersja mobilna systemu</p>
        </div>
      </header>

      <main className="flex-1 p-4">
        {children}
      </main>

      <nav className="sticky bottom-0 border-t bg-background">
        <div className="grid grid-cols-5 h-16">
          <NavItem
            href="/mobile"
            icon={<Home className="h-5 w-5" />}
            label="Pulpit"
            isActive={pathname === '/mobile'}
          />
          <NavItem
            href="/mobile/orders"
            icon={<ClipboardList className="h-5 w-5" />}
            label="Zlecenia"
            isActive={pathname === '/mobile/orders'}
          />
          <NavItem
            href="/mobile/calendar"
            icon={<Calendar className="h-5 w-5" />}
            label="Kalendarz"
            isActive={pathname === '/mobile/calendar'}
          />
          <NavItem
            href="/mobile/inventory"
            icon={<Package className="h-5 w-5" />}
            label="Magazyn"
            isActive={pathname === '/mobile/inventory'}
          />
          <NavItem
            href="/mobile/profile"
            icon={<User className="h-5 w-5" />}
            label="Profil"
            isActive={pathname === '/mobile/profile'}
          />
        </div>
      </nav>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center text-xs font-medium transition-colors",
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <div className="mb-1">
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  )
}