"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { Loader2, Copy, Check } from "lucide-react"
// TODO: Implement this function in lib/api/client-form.ts
// For now, we'll mock it
const createClientFormToken = async (formData: any) => {
  // Simulate API call
  console.log("Form data:", formData)
  await new Promise(resolve => setTimeout(resolve, 1000))
  return `/mobile/client-form/${Math.random().toString(36).substring(2, 15)}`
}

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Podaj prawidłowy adres email").optional(),
  phone: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export function ClientFormGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    }
  })

  async function onSubmit(data: FormData) {
    setIsGenerating(true)
    try {
      const formUrl = await createClientFormToken(data)
      const fullUrl = `${window.location.origin}${formUrl}`
      setGeneratedUrl(fullUrl)
      toast.success("Link do formularza został wygenerowany!")
    } catch (error) {
      console.error("Error generating form link:", error)
      toast.error("Wystąpił błąd podczas generowania linku")
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generator formularza dla klienta</CardTitle>
        <CardDescription>
          Wygeneruj link do formularza, który możesz wysłać klientowi po rozmowie telefonicznej.
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
                  <FormLabel>Imię i nazwisko (opcjonalnie)</FormLabel>
                  <FormControl>
                    <Input placeholder="Jan Kowalski" {...field} />
                  </FormControl>
                  <FormDescription>
                    Jeśli znasz dane klienta, możesz je wstępnie wypełnić.
                  </FormDescription>
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
                    <FormLabel>Email (opcjonalnie)</FormLabel>
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
                    <FormLabel>Telefon (opcjonalnie)</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="123 456 789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generowanie...
                </>
              ) : (
                "Wygeneruj link do formularza"
              )}
            </Button>
          </form>
        </Form>

        {generatedUrl && (
          <div className="mt-6 p-4 border rounded-md bg-muted">
            <p className="text-sm font-medium mb-2">Wygenerowany link:</p>
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
              Link jest ważny przez 7 dni. Wyślij go klientowi, aby mógł wypełnić formularz.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}