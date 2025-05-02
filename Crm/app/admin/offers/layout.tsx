import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Generator ofert - HVAC CRM",
  description: "Tworzenie i zarządzanie dynamicznymi ofertami dla klientów",
}

export default function OffersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}