"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(2, "Imię i nazwisko musi mieć co najmniej 2 znaki"),
  email: z.string().email("Podaj prawidłowy adres email"),
  phone: z.string().min(9, "Podaj prawidłowy numer telefonu"),
  address: z.string().min(5, "Podaj prawidłowy adres"),
  city: z.string().min(2, "Podaj miasto"),
  postalCode: z.string().min(5, "Podaj prawidłowy kod pocztowy"),
  interestType: z.enum(["installation", "service", "consultation"]),
  deviceCount: z.number().min(1, "Podaj liczbę urządzeń").optional(),
  additionalInfo: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface ClientDataFormProps {
  token: string
  initialData?: Partial<FormData>
  onSuccess?: () => void
}

export function ClientDataForm({ token, initialData, onSuccess }: ClientDataFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      city: initialData?.city || "",
      postalCode: initialData?.postalCode || "",
      interestType: initialData?.interestType || "installation",
      deviceCount: initialData?.deviceCount || 1,
      additionalInfo: initialData?.additionalInfo || "",
    }
  })

  async function onSubmit(data: FormData) {
    setIsSubmitting(true)
    try {
      const supabase = createClient()

      // Save form data to Supabase
      const { error: tokenUpdateError } = await supabase
        .from('client_form_tokens')
        .update({
          status: 'submitted',
          updated_at: new Date().toISOString()
        })
        .eq('token', token)

      if (tokenUpdateError) {
        throw new Error(`Error updating token status: ${tokenUpdateError.message}`)
      }

      // Save the client data
      const { error: clientDataError } = await supabase
        .from('client_form_submissions')
        .insert({
          token,
          form_data: data,
          status: 'new',
          created_at: new Date().toISOString()
        })

      if (clientDataError) {
        throw new Error(`Error saving client data: ${clientDataError.message}`)
      }

      // Create a new customer record if needed
      const { error: customerError } = await supabase
        .from('customers')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          type: 'individual',
          status: 'lead',
          source: 'client_form',
          created_at: new Date().toISOString()
        })
        .select()

      if (customerError) {
        console.warn(`Warning: Could not create customer record: ${customerError.message}`)
        // Continue anyway - this is not critical
      }

      setIsSuccess(true)
      toast.success("Formularz został wysłany pomyślnie!")
      onSuccess?.()
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Dziękujemy!</CardTitle>
          <CardDescription>Twoje dane zostały pomyślnie zapisane.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Skontaktujemy się z Tobą wkrótce, aby omówić szczegóły.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Formularz danych klienta</CardTitle>
        <CardDescription>
          Prosimy o podanie danych potrzebnych do przygotowania oferty.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imię i nazwisko</FormLabel>
                  <FormControl>
                    <Input placeholder="Jan Kowalski" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="jan@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="123 456 789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adres</FormLabel>
                  <FormControl>
                    <Input placeholder="ul. Przykładowa 123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Miasto</FormLabel>
                    <FormControl>
                      <Input placeholder="Warszawa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kod pocztowy</FormLabel>
                    <FormControl>
                      <Input placeholder="00-000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="interestType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rodzaj usługi</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="installation">Montaż klimatyzacji</option>
                      <option value="service">Serwis</option>
                      <option value="consultation">Konsultacja</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("interestType") === "installation" && (
              <FormField
                control={form.control}
                name="deviceCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Liczba urządzeń</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dodatkowe informacje</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Dodatkowe informacje, które mogą być przydatne..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wysyłanie...
                </>
              ) : (
                "Wyślij formularz"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
