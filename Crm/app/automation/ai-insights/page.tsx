import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Users, ClipboardList, Package, Calendar, ArrowRight, BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Insights | GodLike CRM/ERP',
  description: 'AI-powered insights for the GodLike CRM/ERP system',
};

export default function AIInsightsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Insights</h1>
        <p className="text-muted-foreground">
          AI-powered insights and recommendations for your business
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Przegląd</TabsTrigger>
          <TabsTrigger value="customers">Klienci</TabsTrigger>
          <TabsTrigger value="orders">Zlecenia</TabsTrigger>
          <TabsTrigger value="performance">Wydajność</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Kluczowe wskaźniki</CardTitle>
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <CardDescription>AI-generated insights based on your data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Wzrost liczby zleceń</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Liczba zleceń wzrosła o 15% w porównaniu do poprzedniego miesiąca. Największy wzrost zaobserwowano w kategorii "Instalacje".
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border bg-muted/30">
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Aktywność klientów</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          20% klientów nie miało żadnej aktywności w ciągu ostatnich 3 miesięcy. Rozważ kampanię przypominającą o przeglądach.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border bg-muted/30">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-purple-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Optymalizacja harmonogramu</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Analiza wskazuje, że możesz zoptymalizować harmonogram techników, grupując wizyty według lokalizacji, co może zaoszczędzić do 15% czasu.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Generuj pełny raport
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rekomendacje</CardTitle>
                  <CardDescription>Personalized recommendations for your business</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      title: 'Kampania przypominająca o przeglądach',
                      description: 'Wyślij przypomnienia do klientów, którzy nie mieli przeglądu w ciągu ostatnich 12 miesięcy.',
                      impact: 'high',
                      effort: 'medium',
                    },
                    {
                      title: 'Optymalizacja tras techników',
                      description: 'Zoptymalizuj trasy techników, aby zminimalizować czas podróży między zleceniami.',
                      impact: 'medium',
                      effort: 'high',
                    },
                    {
                      title: 'Automatyzacja powiadomień o statusie zlecenia',
                      description: 'Wdrożenie automatycznych powiadomień SMS/email o zmianie statusu zlecenia.',
                      impact: 'medium',
                      effort: 'low',
                    },
                  ].map((recommendation, i) => (
                    <div key={i} className="p-4 rounded-lg border">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium">{recommendation.title}</h3>
                        <div className="flex gap-2">
                          <Badge variant={recommendation.impact === 'high' ? 'default' : 'outline'}>
                            {recommendation.impact === 'high' ? 'Wysoki wpływ' : recommendation.impact === 'medium' ? 'Średni wpływ' : 'Niski wpływ'}
                          </Badge>
                          <Badge variant="outline">
                            {recommendation.effort === 'high' ? 'Duży wysiłek' : recommendation.effort === 'medium' ? 'Średni wysiłek' : 'Mały wysiłek'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {recommendation.description}
                      </p>
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm">
                          Wdrożenie
                          <ArrowRight className="ml-2 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trendy</CardTitle>
                  <CardDescription>Najważniejsze trendy w Twoim biznesie</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Zlecenia serwisowe</span>
                      <Badge variant="outline" className="flex items-center">
                        <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                        15%
                      </Badge>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '65%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Nowi klienci</span>
                      <Badge variant="outline" className="flex items-center">
                        <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                        8%
                      </Badge>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '58%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Przychód</span>
                      <Badge variant="outline" className="flex items-center">
                        <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                        12%
                      </Badge>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '62%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Czas realizacji</span>
                      <Badge variant="outline" className="flex items-center">
                        <TrendingUp className="mr-1 h-3 w-3 text-red-500 transform rotate-180" />
                        5%
                      </Badge>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Szczegółowa analiza
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nadchodzące wydarzenia</CardTitle>
                  <CardDescription>Ważne daty i wydarzenia</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { date: '15.06.2024', title: 'Szczyt sezonu klimatyzacyjnego', description: 'Przygotuj się na zwiększoną liczbę zleceń' },
                      { date: '30.06.2024', title: 'Koniec kwartału', description: 'Przygotuj raport kwartalny' },
                      { date: '10.07.2024', title: 'Szkolenie techników', description: 'Nowe modele klimatyzatorów' },
                    ].map((event, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="bg-primary/10 text-primary rounded p-1.5 text-xs font-medium h-fit">
                          {event.date}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">{event.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Generuj nowy insight</CardTitle>
                  <CardDescription>Wykorzystaj AI do analizy danych</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      Analiza klientów
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Analiza zleceń
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="mr-2 h-4 w-4" />
                      Analiza urządzeń
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analiza finansowa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analiza klientów</CardTitle>
              <CardDescription>AI-powered insights about your customers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Ta sekcja będzie zawierać szczegółową analizę klientów, segmentację, wzorce zachowań i rekomendacje.
              </p>
              <div className="flex items-center justify-center p-12 border rounded-md">
                <div className="text-center">
                  <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-medium">Funkcja w przygotowaniu</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ta funkcja będzie dostępna wkrótce.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analiza zleceń</CardTitle>
              <CardDescription>AI-powered insights about your service orders</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Ta sekcja będzie zawierać szczegółową analizę zleceń, trendy, wzorce i rekomendacje dotyczące optymalizacji.
              </p>
              <div className="flex items-center justify-center p-12 border rounded-md">
                <div className="text-center">
                  <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-medium">Funkcja w przygotowaniu</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ta funkcja będzie dostępna wkrótce.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analiza wydajności</CardTitle>
              <CardDescription>AI-powered insights about your business performance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Ta sekcja będzie zawierać szczegółową analizę wydajności biznesowej, KPI, trendy i rekomendacje dotyczące optymalizacji.
              </p>
              <div className="flex items-center justify-center p-12 border rounded-md">
                <div className="text-center">
                  <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-medium">Funkcja w przygotowaniu</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ta funkcja będzie dostępna wkrótce.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}