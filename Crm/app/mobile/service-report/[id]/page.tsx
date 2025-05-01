import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ServiceReportForm } from "@/components/mobile/service-report-form"

export const metadata: Metadata = {
  title: "Raport serwisowy - HVAC CRM",
  description: "Formularz raportu serwisowego dla techników",
}

// This is a mock function for now
// TODO: Replace with actual Supabase implementation
async function getServiceOrderData(id: string) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // For demo purposes, return mock data
  // In a real implementation, this would fetch data from Supabase
  return {
    id,
    title: `Serwis klimatyzacji #${id}`,
    customer: {
      name: "Jan Kowalski",
      address: "ul. Przykładowa 123, Warszawa",
      phone: "+48 123 456 789",
    },
    device: {
      id: "dev1",
      name: "Klimatyzator Mitsubishi MSZ-AP25VG",
      location: "Salon",
    },
    status: "in_progress",
    scheduled_date: "2024-05-15",
    scheduled_time: "10:00 - 12:00",
    type: "maintenance",
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
