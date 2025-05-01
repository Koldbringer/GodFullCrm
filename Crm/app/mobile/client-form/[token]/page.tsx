import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ClientDataForm } from "@/components/mobile/client-data-form"

export const metadata: Metadata = {
  title: "Formularz danych klienta - HVAC CRM",
  description: "Formularz do zbierania danych klienta po rozmowie telefonicznej",
}

// This is a mock function for now
// TODO: Replace with actual Supabase implementation
async function getFormData(token: string) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // For demo purposes, return mock data
  // In a real implementation, this would fetch data from Supabase
  return {
    token,
    initial_data: {
      name: "",
      email: "",
      phone: "",
    },
    status: "active",
    created_at: new Date().toISOString(),
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
