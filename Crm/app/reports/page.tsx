import type { Metadata } from "next"
import { ArrowDownToLine, FileText, BarChart3, Calendar, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { ReportGenerator } from "@/components/reports/report-generator"
import { ReportTemplate } from "@/components/reports/report-template"
import { ServiceReportForm } from "@/components/reports/service-report-form"

export const metadata: Metadata = {
  title: "Raporty - HVAC CRM ERP",
  description: "System generowania i zarządzania raportami",
}

export default function ReportsPage() {
  // Przykładowe dane dla demonstracji
  const sampleSiteData = {
    id: "site1",
    name: "Biuro główne",
    address: "ul. Warszawska 10, 00-001 Warszawa",
    customer_id: "c1",
    customer_name: "Firma XYZ",
    type: "Biuro",
    area: 120,
    devices_count: 5,
    coordinates: { lat: 52.2297, lng: 21.0122 },
    last_visit: "2023-09-15T14:00:00Z",
    next_visit: "2023-12-15T10:00:00Z",
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Raporty</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Ustawienia raportów
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Nowy raport
            </Button>
          </div>
        </div>

        <Tabs defaultValue="generator" className="space-y-4">
          <TabsList>
            <TabsTrigger value="generator">Generator raportów</TabsTrigger>
            <TabsTrigger value="templates">Szablony</TabsTrigger>
            <TabsTrigger value="scheduled">Zaplanowane</TabsTrigger>
            <TabsTrigger value="history">Historia</TabsTrigger>
            <TabsTrigger value="service-protocol">Protokół serwisowy</TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ReportGenerator 
                entityId="site1"
                entityType="site"
                entityName="Biuro główne"
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Podgląd raportu</CardTitle>
                  <CardDescription>Przykładowy wygląd raportu</CardDescription>
                </CardHeader>
                <CardContent className="p-0 max-h-[800px] overflow-y-auto">
                  <div className="border rounded-md">
                    <ReportTemplate 
                      reportType="status"
                      entityType="site"
                      entityData={sampleSiteData}
                      dateRange="last-month"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Raport stanu urządzeń</CardTitle>
                  <CardDescription>Szczegółowy raport o stanie wszystkich urządzeń</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Zawiera informacje o stanie technicznym, historii serwisowej i zaleceniach dla urządzeń.
                  </p>
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Użyj szablonu
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Raport serwisowy</CardTitle>
                  <CardDescription>Historia serwisowa i planowane wizyty</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Zawiera informacje o wykonanych pracach serwisowych, użytych częściach i planowanych wizytach.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    Użyj szablonu
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Raport efektywności</CardTitle>
                  <CardDescription>Analiza zużycia energii i rekomendacje</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Zawiera analizę zużycia energii, porównanie z normami i rekomendacje optymalizacji.
                  </p>
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Użyj szablonu
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Zaplanowane raporty</CardTitle>
                <CardDescription>Automatycznie generowane raporty</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">Miesięczny raport serwisowy</h3>
                      <p className="text-sm text-muted-foreground">Generowany 1. dnia każdego miesiąca</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        Anuluj
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">Kwartalny raport efektywności</h3>
                      <p className="text-sm text-muted-foreground">Generowany ostatniego dnia kwartału</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        Anuluj
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-4">
                    <div>
                      <h3 className="font-medium">Tygodniowy raport stanu urządzeń</h3>
                      <p className="text-sm text-muted-foreground">Generowany w każdy poniedziałek</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        Anuluj
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historia raportów</CardTitle>
                <CardDescription>Wcześniej wygenerowane raporty</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">Raport stanu urządzeń - Biuro główne</h3>
                      <p className="text-sm text-muted-foreground">Wygenerowano: 15 maja 2024</p>
                    </div>
                    <Button size="sm">
                      <ArrowDownToLine className="mr-2 h-4 w-4" />
                      Pobierz PDF
                    </Button>
                  </div>

                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">Raport serwisowy - Firma XYZ</h3>
                      <p className="text-sm text-muted-foreground">Wygenerowano: 1 maja 2024</p>
                    </div>
                    <Button size="sm">
                      <ArrowDownToLine className="mr-2 h-4 w-4" />
                      Pobierz PDF
                    </Button>
                  </div>

                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">Raport efektywności - Dom jednorodzinny</h3>
                      <p className="text-sm text-muted-foreground">Wygenerowano: 15 kwietnia 2024</p>
                    </div>
                    <Button size="sm">
                      <ArrowDownToLine className="mr-2 h-4 w-4" />
                      Pobierz PDF
                    </Button>
                  </div>

                  <div className="flex items-center justify-between pb-4">
                    <div>
                      <h3 className="font-medium">Raport finansowy - Apartament w Śródmieściu</h3>
                      <p className="text-sm text-muted-foreground">Wygenerowano: 1 kwietnia 2024</p>
                    </div>
                    <Button size="sm">
                      <ArrowDownToLine className="mr-2 h-4 w-4" />
                      Pobierz PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="service-protocol" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Nowy protokół konserwacji klimatyzacji</CardTitle>
                  <CardDescription>Wypełnij cyfrową wersję protokołu serwisowego</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Formularz protokołu serwisowego */}
                  <ServiceReportForm />
                </CardContent>
              </Card>
              {/* Tu będzie podgląd PDF po wypełnieniu */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
