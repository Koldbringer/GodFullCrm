// Crm/app/mobile/client-form/[token]/page.tsx
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ClientDataForm } from "@/components/mobile/client-data-form"
import { createServerClient } from "@/lib/supabase"

export const metadata: Metadata = {
  title: "Formularz danych klienta - HVAC CRM",
  description: "Formularz do zbierania danych klienta po rozmowie telefonicznej",
}

async function getFormData(token: string) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('client_form_tokens')
    .select('*')
    .eq('token', token)
    .single()
  
  if (error || !data) {
    return null
  }
  
  return data
}

export default async function ClientFormPage({ params }: { params: { token: string } }) {
  const formData = await getFormData(params.token)
  
  if (!formData) {
    notFound()
  }
  
  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <ClientDataForm token={params.token} initialData={formData.initial_data} />
    </div>
  )
}