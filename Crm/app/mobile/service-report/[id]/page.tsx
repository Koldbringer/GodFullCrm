import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ServiceReportForm } from "@/components/mobile/service-report-form"
import { createServerClient } from "@/lib/supabase"

export const metadata: Metadata = {
  title: "Raport serwisowy - HVAC CRM",
  description: "Formularz raportu serwisowego dla techników",
}

/**
 * Fetch service order data from Supabase
 */
async function getServiceOrderData(id: string) {
  try {
    const supabase = await createServerClient()

    if (!supabase) {
      console.error("Failed to create Supabase client")
      return null
    }

    // Fetch service order with related data
    const { data, error } = await supabase
      .from('service_orders')
      .select(`
        *,
        customers (id, name, phone),
        sites (id, name, street, city, zip_code),
        devices (id, model, type, location)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error("Error fetching service order:", error)
      return null
    }

    if (!data) {
      console.error("Service order not found")
      return null
    }

    // Format the data for the component
    return {
      id: data.id,
      title: data.title || `Zlecenie serwisowe #${data.id}`,
      customer: {
        name: data.customers?.name || "Nieznany klient",
        address: data.sites ? `${data.sites.street}, ${data.sites.city}` : "Adres nieznany",
        phone: data.customers?.phone || "Brak numeru",
      },
      device: {
        id: data.devices?.id || "unknown",
        name: data.devices?.model || "Nieznane urządzenie",
        location: data.devices?.location || "Nieznana lokalizacja",
      },
      status: data.status || "new",
      scheduled_date: data.scheduled_start ? new Date(data.scheduled_start).toISOString().split('T')[0] : "",
      scheduled_time: data.scheduled_start ? new Date(data.scheduled_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
      type: data.service_type || "maintenance",
    }
  } catch (error) {
    console.error("Error in getServiceOrderData:", error)
    return null
  }
}

export default async function ServiceReportPage({ params }: { params: { id: string } }) {
  const serviceOrderData = await getServiceOrderData(params.id)

  if (!serviceOrderData) {
    notFound()
  }

  return (
    <div className="container mx-auto py-4 px-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold">{serviceOrderData.title}</h1>
        <p className="text-sm text-muted-foreground">
          Klient: {serviceOrderData.customer.name}
        </p>
        <p className="text-sm text-muted-foreground">
          Adres: {serviceOrderData.customer.address}
        </p>
      </div>

      <ServiceReportForm
        serviceOrderId={params.id}
        initialData={{
          deviceId: serviceOrderData.device.id,
          serviceType: serviceOrderData.type as any,
        }}
      />
    </div>
  )
}
