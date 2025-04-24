import type { Metadata } from 'next'
import './globals.css'
import { SidebarProvider } from "@/components/ui/sidebar"
import { Sidebar } from "@/components/ui/sidebar"
import { Header } from "@/components/ui/header"
import { NextThemesProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { I18nProvider } from "@/components/i18n/i18n-provider"

export const metadata: Metadata = {
  title: 'GodLike CRM',
  description: 'System CRM/ERP',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl">
      <body className="min-h-screen bg-background">
        <I18nProvider>
          <NextThemesProvider>
            <SidebarProvider>
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-4">{children}</main>
                </div>
              </div>
            </SidebarProvider>
          </NextThemesProvider>
        </I18nProvider>
        <Toaster />
      </body>
    </html>
  )
}
