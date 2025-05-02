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
import { Loader2, Copy, Check, Plus, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"
import { v4 as uuidv4 } from "uuid"

// Form schema for validation
const formSchema = z.object({
  clientName: z.string().min(2, "Imię i nazwisko musi mieć co najmniej 2 znaki"),
  clientEmail: z.string().email("Podaj prawidłowy adres email"),
  validDays: z.number().min(1, "Oferta musi być ważna co najmniej 1 dzień").max(30, "Oferta może być ważna maksymalnie 30 dni"),
  options: z.array(
    z.object({
      title: z.string().min(2, "Tytuł opcji musi mieć co najmniej 2 znaki"),
      description: z.string().min(10, "Opis opcji musi mieć co najmniej 10 znaków"),
      recommended: z.boolean().default(false),
      products: z.array(
        z.object({
          name: z.string().min(2, "Nazwa produktu musi mieć co najmniej 2 znaki"),
          price: z.number().min(1, "Cena musi być większa od 0"),
          quantity: z.number().min(1, "Ilość musi być większa od 0"),
        })
      ).min(1, "Dodaj co najmniej jeden produkt"),
      services: z.array(
        z.object({
          name: z.string().min(2, "Nazwa usługi musi mieć co najmniej 2 znaki"),
          price: z.number().min(1, "Cena musi być większa od 0"),
        })
      ).min(1, "Dodaj co najmniej jedną usługę"),
    })
  ).min(1, "Dodaj co najmniej jedną opcję oferty"),
})

type FormData = z.infer<typeof formSchema>

export function DynamicOfferGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("option0")

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      validDays: 14,
      options: [
        {
          title: "Pakiet Podstawowy",
          description: "Ekonomiczne rozwiązanie dla małych pomieszczeń",
          recommended: false,
          products: [
            {
              name: "Klimatyzator 2,5kW",
              price: 3500,
              quantity: 1,
            }
          ],
          services: [
            {
              name: "Montaż standardowy",
              price: 1200,
            }
          ]
        }
      ]
    }
  })

  const { fields: optionFields, append: appendOption, remove: removeOption } = form.useFieldArray({
    name: "options",
  })

  const getProductsFieldArray = (optionIndex: number) => {
    return form.useFieldArray({
      name: `options.${optionIndex}.products`,
    })
  }

  const getServicesFieldArray = (optionIndex: number) => {
    return form.useFieldArray({
      name: `options.${optionIndex}.services`,
    })
  }

  async function onSubmit(data: FormData) {
    setIsGenerating(true)
    try {
      const supabase = createClient()

      // Generate a unique token for the offer
      const token = uuidv4().substring(0, 8)

      // Calculate the valid until date
      const validUntil = new Date()
      validUntil.setDate(validUntil.getDate() + data.validDays)

      // Check if customer exists, if not create a new one
      let customerId: string

      const { data: existingCustomers, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('email', data.clientEmail)
        .limit(1)

      if (customerError) {
        throw new Error(`Error checking customer: ${customerError.message}`)
      }

      if (existingCustomers.length === 0) {
        // Create a new customer
        const { data: newCustomer, error: createError } = await supabase
          .from('customers')
          .insert({
            name: data.clientName,
            email: data.clientEmail,
            type: 'individual',
            status: 'lead',
            source: 'offer_generator',
            created_at: new Date().toISOString()
          })
          .select('id')

        if (createError) {
          throw new Error(`Error creating customer: ${createError.message}`)
        }

        customerId = newCustomer[0].id
      } else {
        customerId = existingCustomers[0].id
      }

      // Save the offer to Supabase
      const { data: offerData, error: offerError } = await supabase
        .from('offers')
        .insert({
          title: `Oferta dla ${data.clientName}`,
          customer_id: customerId,
          token: token,
          status: 'pending',
          valid_until: validUntil.toISOString(),
          options: data.options,
          created_at: new Date().toISOString()
        })
        .select()

      if (offerError) {
        throw new Error(`Error saving offer: ${offerError.message}`)
      }

      // Generate the full URL for the offer
      const fullUrl = `${window.location.origin}/offers/${token}`

      setGeneratedUrl(fullUrl)
      toast.success("Oferta została wygenerowana!")
    } catch (error) {
      console.error("Error generating offer:", error)
      toast.error("Wystąpił błąd podczas generowania oferty")
    } finally {
      setIsGenerating(false)
    }
  }

  function copyToClipboard() {
    if (!generatedUrl) return

    navigator.clipboard.writeText(generatedUrl)
      .then(() => {
        setIsCopied(true)
        toast.success("Link skopiowany do schowka!")
        setTimeout(() => setIsCopied(false), 2000)
      })
      .catch(err => {
        console.error("Failed to copy:", err)
        toast.error("Nie udało się skopiować linku")
      })
  }

  const addNewOption = () => {
    appendOption({
      title: `Pakiet ${optionFields.length + 1}`,
      description: "Opis pakietu",
      recommended: false,
      products: [{ name: "", price: 0, quantity: 1 }],
      services: [{ name: "", price: 0 }]
    })

    // Switch to the new tab
    setActiveTab(`option${optionFields.length}`)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generator dynamicznej oferty</CardTitle>
        <CardDescription>
          Stwórz spersonalizowaną ofertę, którą możesz wysłać klientowi jako link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imię i nazwisko klienta</FormLabel>
                    <FormControl>
                      <Input placeholder="Jan Kowalski" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email klienta</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="jan@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="validDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ważność oferty (dni)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Liczba dni, przez które oferta będzie ważna od momentu wygenerowania.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Opcje oferty</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addNewOption}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Dodaj opcję
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  {optionFields.map((option, index) => (
                    <TabsTrigger key={option.id} value={`option${index}`}>
                      Opcja {index + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {optionFields.map((option, optionIndex) => {
                  const productsArray = getProductsFieldArray(optionIndex)
                  const servicesArray = getServicesFieldArray(optionIndex)

                  return (
                    <TabsContent key={option.id} value={`option${optionIndex}`}>
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">Opcja {optionIndex + 1}</CardTitle>
                            {optionFields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  removeOption(optionIndex)
                                  setActiveTab(`option${Math.max(0, optionIndex - 1)}`)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`options.${optionIndex}.title`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tytuł opcji</FormLabel>
                                  <FormControl>
                                    <Input placeholder="np. Pakiet Podstawowy" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`options.${optionIndex}.recommended`}
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel>Polecana opcja</FormLabel>
                                    <FormDescription>
                                      Oznacz tę opcję jako polecaną dla klienta
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name={`options.${optionIndex}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Opis opcji</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Krótki opis opcji..."
                                    className="resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium">Produkty</h4>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => productsArray.append({ name: "", price: 0, quantity: 1 })}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Dodaj produkt
                              </Button>
                            </div>

                            {productsArray.fields.map((product, productIndex) => (
                              <div key={product.id} className="grid grid-cols-12 gap-2 items-end">
                                <div className="col-span-6">
                                  <FormField
                                    control={form.control}
                                    name={`options.${optionIndex}.products.${productIndex}.name`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Nazwa</FormLabel>
                                        <FormControl>
                                          <Input placeholder="np. Klimatyzator 2,5kW" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <div className="col-span-2">
                                  <FormField
                                    control={form.control}
                                    name={`options.${optionIndex}.products.${productIndex}.quantity`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Ilość</FormLabel>
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
                                </div>

                                <div className="col-span-3">
                                  <FormField
                                    control={form.control}
                                    name={`options.${optionIndex}.products.${productIndex}.price`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Cena (zł)</FormLabel>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            min={0}
                                            step={0.01}
                                            {...field}
                                            onChange={e => field.onChange(parseFloat(e.target.value))}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <div className="col-span-1">
                                  {productsArray.fields.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => productsArray.remove(productIndex)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium">Usługi</h4>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => servicesArray.append({ name: "", price: 0 })}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Dodaj usługę
                              </Button>
                            </div>

                            {servicesArray.fields.map((service, serviceIndex) => (
                              <div key={service.id} className="grid grid-cols-12 gap-2 items-end">
                                <div className="col-span-8">
                                  <FormField
                                    control={form.control}
                                    name={`options.${optionIndex}.services.${serviceIndex}.name`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Nazwa</FormLabel>
                                        <FormControl>
                                          <Input placeholder="np. Montaż standardowy" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <div className="col-span-3">
                                  <FormField
                                    control={form.control}
                                    name={`options.${optionIndex}.services.${serviceIndex}.price`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Cena (zł)</FormLabel>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            min={0}
                                            step={0.01}
                                            {...field}
                                            onChange={e => field.onChange(parseFloat(e.target.value))}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <div className="col-span-1">
                                  {servicesArray.fields.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => servicesArray.remove(serviceIndex)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  )
                })}
              </Tabs>
            </div>

            <Button type="submit" className="w-full" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generowanie...
                </>
              ) : (
                "Wygeneruj ofertę"
              )}
            </Button>
          </form>
        </Form>

        {generatedUrl && (
          <div className="mt-6 p-4 border rounded-md bg-muted">
            <p className="text-sm font-medium mb-2">Wygenerowany link do oferty:</p>
            <div className="flex items-center">
              <Input
                value={generatedUrl}
                readOnly
                className="font-mono text-xs"
              />
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                onClick={copyToClipboard}
                disabled={isCopied}
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Link jest ważny przez {form.getValues().validDays} dni. Wyślij go klientowi, aby mógł zobaczyć i zatwierdzić ofertę.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
