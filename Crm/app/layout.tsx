import type { Metadata } from 'next'
import './globals.css'
import { NextThemesProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { I18nProvider } from "@/components/i18n/i18n-provider"
import { Providers } from "@/components/providers/Providers"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { MsalClientProvider } from "@/components/providers/MsalClientProvider"
import { SkipLink } from "@/components/atoms/skip-link"
import { A11yProvider } from "@/components/a11y/a11y-context";

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
        <MsalClientProvider>
          <Providers>
            <I18nProvider>
              <A11yProvider>
                <NextThemesProvider>
                  <SkipLink targetId="main-content" />
                  <div className="layout-root flex">
                    <Sidebar className="sidebar" />
                    <div className="flex flex-col flex-1">
                      <Header className="header" />
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
        </MsalClientProvider>
      </body>
    </html>
  )
}
