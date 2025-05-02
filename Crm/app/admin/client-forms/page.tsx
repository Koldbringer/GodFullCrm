import { Metadata } from "next"
import { ClientFormGenerator } from "@/components/mobile/client-form-generator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Formularze klientów - HVAC CRM",
  description: "Zarządzanie formularzami danych klientów",
}

export default function ClientFormsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Formularze klientów</h1>
      </div>
      
      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generator">Generator formularzy</TabsTrigger>
          <TabsTrigger value="submissions">Przesłane formularze</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="space-y-6">
          <ClientFormGenerator />
          
          <Card>
            <CardHeader>
              <CardTitle>Instrukcja</CardTitle>
              <CardDescription>Jak korzystać z generatora formularzy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">1. Wygeneruj link</h3>
                <p className="text-muted-foreground">
                  Wypełnij formularz powyżej, aby wygenerować unikalny link dla klienta.
                  Możesz opcjonalnie podać znane dane klienta, które zostaną wstępnie wypełnione w formularzu.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">2. Wyślij link do klienta</h3>
                <p className="text-muted-foreground">
                  Skopiuj wygenerowany link i wyślij go do klienta przez SMS, email lub komunikator.
                  Link jest ważny przez 7 dni.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">3. Klient wypełnia formularz</h3>
                <p className="text-muted-foreground">
                  Klient otwiera link i wypełnia formularz ze swoimi danymi.
                  Po przesłaniu formularza, dane są zapisywane w systemie.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">4. Przetwarzanie danych</h3>
                <p className="text-muted-foreground">
                  Przesłane dane możesz zobaczyć w zakładce "Przesłane formularze".
                  Możesz je przekonwertować na klienta w systemie lub wykorzystać do przygotowania oferty.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Przesłane formularze</CardTitle>
              <CardDescription>Lista formularzy wypełnionych przez klientów</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground py-8 text-center">
                Ta funkcjonalność zostanie zaimplementowana w przyszłości.
                Tutaj będzie wyświetlana lista formularzy przesłanych przez klientów.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
