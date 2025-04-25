import type { Metadata } from 'next'
import './globals.css'
import { NextThemesProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { I18nProvider } from "@/components/i18n/i18n-provider"
import { Providers } from "@/components/providers/Providers"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export const metadata: Metadata = {
  title: 'GodLike HVAC CRM ERP',
  description: 'System zarządzania dla firm HVAC',
  generator: 'GodLike CRM',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className="min-h-screen bg-background">
        <Providers>
          <I18nProvider>
            <NextThemesProvider>
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-4 pt-6">{children}</main>
                </div>
              </div>
            </NextThemesProvider>
          </I18nProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
