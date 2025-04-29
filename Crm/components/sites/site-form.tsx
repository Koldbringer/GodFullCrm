"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from 'next/dynamic'
import { createSite, updateSite } from "@/lib/api"

// Dynamically import the GeoSelector component with no SSR
const GeoSelector = dynamic(
  () => import('@/components/map/geo-selector').then(mod => mod.GeoSelector),
  { ssr: false }
)

// Schema for site form validation
const siteSchema = z.object({
  name: z.string().min(2, "Nazwa musi mieć co najmniej 2 znaki"),
  customer_id: z.string().min(1, "Wybierz klienta"),
  street: z.string().min(3, "Podaj ulicę i numer"),
  city: z.string().min(2, "Podaj miasto"),
  zip_code: z.string().min(5, "Podaj kod pocztowy"),
  type: z.string().min(1, "Wybierz typ lokalizacji"),
  status: z.string().default("active"),
  area: z.number().min(1, "Podaj powierzchnię").optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  notes: z.string().optional(),
})

type SiteFormValues = z.infer<typeof siteSchema>

interface SiteFormProps {
  customers: { id: string; name: string }[]
  initialData?: Partial<SiteFormValues> & { id?: string }
  onSuccess?: () => void
}

export function SiteForm({ customers, initialData, onSuccess }: SiteFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<SiteFormValues>({
    resolver: zodResolver(siteSchema),
    defaultValues: {
      name: initialData?.name || "",
      customer_id: initialData?.customer_id || "",
      street: initialData?.street || "",
      city: initialData?.city || "",
      zip_code: initialData?.zip_code || "",
      type: initialData?.type || "",
      status: initialData?.status || "active",
      area: initialData?.area || undefined,
      latitude: initialData?.latitude || undefined,
      longitude: initialData?.longitude || undefined,
      notes: initialData?.notes || "",
    }
  })
  
  // Watch for form values
  const watchCustomerId = watch("customer_id")
  const watchLatitude = watch("latitude")
  const watchLongitude = watch("longitude")
  
  // Handle location selection from map
  const handleLocationSelect = (location: { lat: number; lng: number; address?: string }) => {
    setValue("latitude", location.lat)
    setValue("longitude", location.lng)
    
    // If address is provided, try to parse it
    if (location.address) {
      // Simple address parsing - this could be improved
      const addressParts = location.address.split(",")
      if (addressParts.length >= 3) {
        // Try to extract street
        setValue("street", addressParts[0].trim())
        
        // Try to extract city and zip code
        const cityZipMatch = addressParts[1].match(/(\d{2}-\d{3})\s+(.+)/)
        if (cityZipMatch) {
          setValue("zip_code", cityZipMatch[1])
          setValue("city", cityZipMatch[2])
        } else {
          setValue("city", addressParts[1].trim())
        }
      }
    }
  }
  
  // Handle form submission
  const onSubmit = async (data: SiteFormValues) => {
    try {
      if (initialData?.id) {
        // Update existing site
        await updateSite(initialData.id, data)
        toast.success("Lokalizacja zaktualizowana")
      } else {
        // Create new site
        await createSite(data)
        toast.success("Lokalizacja dodana")
      }
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/sites")
      }
    } catch (error) {
      console.error("Error saving site:", error)
      toast.error("Nie udało się zapisać lokalizacji")
    }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="basic">Podstawowe informacje</TabsTrigger>
            <TabsTrigger value="location">Lokalizacja na mapie</TabsTrigger>
            <TabsTrigger value="additional">Dodatkowe informacje</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informacje podstawowe</CardTitle>
                <CardDescription>Wprowadź podstawowe dane lokalizacji</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nazwa lokalizacji <span className="text-destructive">*</span></Label>
                    <Input id="name" {...register("name")} />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customer_id">Klient <span className="text-destructive">*</span></Label>
                    <Select 
                      value={watchCustomerId} 
                      onValueChange={(value) => setValue("customer_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz klienta" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.customer_id && <p className="text-sm text-destructive">{errors.customer_id.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Typ lokalizacji <span className="text-destructive">*</span></Label>
                    <Select 
                      value={watch("type")} 
                      onValueChange={(value) => setValue("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz typ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Biuro">Biuro</SelectItem>
                        <SelectItem value="Dom">Dom</SelectItem>
                        <SelectItem value="Mieszkanie">Mieszkanie</SelectItem>
                        <SelectItem value="Lokal usługowy">Lokal usługowy</SelectItem>
                        <SelectItem value="Obiekt przemysłowy">Obiekt przemysłowy</SelectItem>
                        <SelectItem value="Inny">Inny</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={watch("status")} 
                      onValueChange={(value) => setValue("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Aktywny</SelectItem>
                        <SelectItem value="inactive">Nieaktywny</SelectItem>
                        <SelectItem value="pending">Oczekujący</SelectItem>
                        <SelectItem value="service-needed">Wymaga serwisu</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="area">Powierzchnia (m²)</Label>
                    <Input 
                      id="area" 
                      type="number" 
                      {...register("area", { valueAsNumber: true })} 
                    />
                    {errors.area && <p className="text-sm text-destructive">{errors.area.message}</p>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="street">Ulica i numer <span className="text-destructive">*</span></Label>
                  <Input id="street" {...register("street")} />
                  {errors.street && <p className="text-sm text-destructive">{errors.street.message}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Miasto <span className="text-destructive">*</span></Label>
                    <Input id="city" {...register("city")} />
                    {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zip_code">Kod pocztowy <span className="text-destructive">*</span></Label>
                    <Input id="zip_code" {...register("zip_code")} />
                    {errors.zip_code && <p className="text-sm text-destructive">{errors.zip_code.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle>Lokalizacja na mapie</CardTitle>
                <CardDescription>Wskaż dokładną lokalizację na mapie</CardDescription>
              </CardHeader>
              <CardContent>
                <GeoSelector 
                  onLocationSelect={handleLocationSelect}
                  initialLocation={
                    watchLatitude && watchLongitude 
                      ? { lat: watchLatitude, lng: watchLongitude } 
                      : undefined
                  }
                  height="500px"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="additional">
            <Card>
              <CardHeader>
                <CardTitle>Dodatkowe informacje</CardTitle>
                <CardDescription>Wprowadź dodatkowe informacje o lokalizacji</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notatki</Label>
                  <Textarea 
                    id="notes" 
                    {...register("notes")} 
                    rows={5}
                    placeholder="Wprowadź dodatkowe informacje o lokalizacji..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push("/sites")}
          >
            Anuluj
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Zapisywanie..." : initialData?.id ? "Aktualizuj" : "Dodaj lokalizację"}
          </Button>
        </div>
      </div>
    </form>
  )
}
