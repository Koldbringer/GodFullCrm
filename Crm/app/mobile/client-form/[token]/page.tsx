import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ClientDataForm } from "@/components/mobile/client-data-form"
import { createServerClient } from "@/lib/supabase"

export const metadata: Metadata = {
  title: "Formularz danych klienta - HVAC CRM",
  description: "Formularz do zbierania danych klienta po rozmowie telefonicznej",
}

/**
 * Fetch client form data from Supabase using the token
 */
async function getFormData(token: string) {
  try {
    const supabase = await createServerClient()

    if (!supabase) {
      console.error("Failed to create Supabase client")
      return null
    }

    // Fetch the form data using the token
    const { data, error } = await supabase
      .from('client_form_tokens')
      .select('*')
      .eq('token', token)
      .eq('status', 'active')
      .single()

    if (error) {
      console.error("Error fetching client form data:", error)
      return null
    }

    if (!data) {
      console.error("Client form token not found or inactive")
      return null
    }

    // Check if the token has expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      console.error("Client form token has expired")
      return null
    }

    return {
      token: data.token,
      initial_data: data.initial_data || {
        name: "",
        email: "",
        phone: "",
      },
      status: data.status,
      created_at: data.created_at,
    }
  } catch (error) {
    console.error("Error in getFormData:", error)
    return null
  }
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
