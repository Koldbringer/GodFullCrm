import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { SiteForm } from "@/components/sites/site-form"
import { createServerClient } from "@/lib/supabase"

export const metadata: Metadata = {
  title: "Nowa lokalizacja - HVAC CRM ERP",
  description: "Dodaj nową lokalizację klienta w systemie HVAC CRM ERP",
}

// Fetch customers for the form
async function getCustomers() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('customers')
    .select('id, name')
    .order('name')

  if (error) {
    console.error("Error fetching customers:", error)
    return []
  }

  return data || []
}

export default async function NewSitePage() {
  const customers = await getCustomers()

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <NotificationCenter />
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/sites">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Powrót</span>
              </Link>
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">Nowa lokalizacja</h2>
          </div>
        </div>

        <SiteForm customers={customers} />
      </div>
    </div>
  )
}
