import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/components/providers/Providers"

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Providers>
      {children}
      <Toaster />
    </Providers>
  )
}
