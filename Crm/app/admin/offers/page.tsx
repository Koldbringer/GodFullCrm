import { Metadata } from "next"
import { DynamicOfferGenerator } from "@/components/offers/DynamicOfferGenerator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Generator ofert - HVAC CRM",
  description: "Tworzenie i zarządzanie dynamicznymi ofertami dla klientów",
}

export default function OffersPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Generator ofert</h1>
      </div>
      
      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generator">Generator ofert</TabsTrigger>
          <TabsTrigger value="history">Historia ofert</TabsTrigger>
          <TabsTrigger value="templates">Szablony</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="space-y-6">
          <DynamicOfferGenerator />
          
          <Card>
            <CardHeader>
              <CardTitle>Instrukcja</CardTitle>
              <CardDescription>Jak korzystać z generatora ofert</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">1. Wprowadź dane klienta</h3>
                <p className="text-muted-foreground">
                  Podaj imię i nazwisko oraz email klienta. Te dane będą widoczne w wygenerowanej ofercie.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">2. Skonfiguruj opcje oferty</h3>
                <p className="text-muted-foreground">
                  Dodaj różne opcje oferty, każda z własnym zestawem produktów i usług.
                  Możesz oznaczyć jedną z opcji jako rekomendowaną.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">3. Wygeneruj i wyślij link</h3>
                <p className="text-muted-foreground">
                  Po wygenerowaniu oferty, otrzymasz unikalny link, który możesz wysłać klientowi.
                  Klient zobaczy elegancką stronę z ofertą i możliwością jej zatwierdzenia.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">4. Śledź status oferty</h3>
                <p className="text-muted-foreground">
                  W zakładce "Historia ofert" możesz śledzić status wysłanych ofert
                  i zobaczyć, które zostały zatwierdzone przez klientów.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historia ofert</CardTitle>
              <CardDescription>Lista wygenerowanych ofert</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground py-8 text-center">
                Ta funkcjonalność zostanie zaimplementowana w przyszłości.
                Tutaj będzie wyświetlana lista wygenerowanych ofert z ich statusami.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Szablony ofert</CardTitle>
              <CardDescription>Zapisane szablony do szybkiego generowania ofert</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground py-8 text-center">
                Ta funkcjonalność zostanie zaimplementowana w przyszłości.
                Tutaj będzie możliwość tworzenia i zarządzania szablonami ofert.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
