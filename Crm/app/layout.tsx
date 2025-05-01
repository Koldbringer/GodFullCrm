import type { Metadata, Viewport } from 'next'
import './globals.css'
import { NextThemesProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { I18nProvider } from "@/components/i18n/i18n-provider"
import { Providers } from "@/components/providers/Providers"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { MsalClientProvider } from "@/components/providers/MsalClientProvider"
import { SkipLink } from "@/components/atoms/skip-link"
import { A11yProvider } from "@/components/a11y/a11y-context"
import { PWARegister } from "@/components/pwa/pwa-register";

export const metadata: Metadata = {
  title: 'GodLike HVAC CRM ERP',
  description: 'System zarządzania dla firm HVAC',
  generator: 'GodLike CRM',
  manifest: '/manifest.json',
  applicationName: 'GodLike CRM ERP',
  keywords: ['crm', 'erp', 'hvac', 'zarządzanie', 'serwis', 'klimatyzacja'],
  authors: [{ name: 'GodLike CRM Team' }],
  creator: 'GodLike CRM',
  publisher: 'GodLike CRM',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body>
        <MsalClientProvider>
          <Providers>
            <I18nProvider>
              <A11yProvider>
                <NextThemesProvider>
                  <SkipLink targetId="main-content" />
                  <div className="layout-root flex">
                    <Sidebar className="sidebar" />
                    <div className="flex flex-col flex-1">
                      <main id="main-content" className="main-content" tabIndex={-1}>
                        {children}
                      </main>
                    </div>
                  </div>
                </NextThemesProvider>
              </A11yProvider>
            </I18nProvider>
          </Providers>
          <Toaster />
          <PWARegister />
        </MsalClientProvider>
      </body>
    </html>
  )
}
