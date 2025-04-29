import type { Metadata } from 'next'
import './globals.css'
import { NextThemesProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { I18nProvider } from "@/components/i18n/i18n-provider"
import { Providers } from "@/components/providers/Providers"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { MsalClientProvider } from "@/components/providers/MsalClientProvider";
import { RegisterServiceWorker } from "./register-sw";

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
      <body>
        {/* Temporarily disabled MsalClientProvider due to crypto error */}
        {/* <MsalClientProvider> */}
          <Providers>
            <I18nProvider>
              <NextThemesProvider>
                <div className="layout-root" style={{ display: 'flex' }}>
                  <Sidebar className="sidebar" />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Header className="header" />
                    <main className="main-content">{children}</main>
                  </div>
                </div>
              </NextThemesProvider>
            </I18nProvider>
          </Providers>
          <Toaster />
          <RegisterServiceWorker />
        {/* </MsalClientProvider> */}
      </body>
    </html>
  )
}
