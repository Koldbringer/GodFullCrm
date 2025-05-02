import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  Bot, 
  Zap, 
  Bell, 
  Calendar, 
  Mail, 
  MessageSquare, 
  FileText, 
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Automation Dashboard | GodLike CRM/ERP',
  description: 'Automation dashboard for the GodLike CRM/ERP system',
};

export default function AutomationDashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Aktywne automatyzacje</CardTitle>
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <CardDescription>Obecnie uruchomione procesy</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  {[
                    { name: 'Powiadomienia o przeglądach', status: 'active', type: 'notification' },
                    { name: 'Synchronizacja kalendarza', status: 'active', type: 'sync' },
                    { name: 'Raportowanie tygodniowe', status: 'active', type: 'report' },
                  ].map((automation, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        {automation.type === 'notification' && <Bell className="h-4 w-4 text-primary" />}
                        {automation.type === 'sync' && <Calendar className="h-4 w-4 text-primary" />}
                        {automation.type === 'report' && <FileText className="h-4 w-4 text-primary" />}
                        <span className="text-sm font-medium">{automation.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {automation.status === 'active' ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-amber-500 mr-1" />
                        )}
                        {automation.status === 'active' ? 'Aktywna' : 'Wstrzymana'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  Zarządzaj automatyzacjami
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Ostatnie wykonania</CardTitle>
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <CardDescription>Historia wykonanych automatyzacji</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  {[
                    { name: 'Powiadomienia o przeglądach', time: '2 godziny temu', status: 'success' },
                    { name: 'Synchronizacja kalendarza', time: '4 godziny temu', status: 'success' },
                    { name: 'Raportowanie tygodniowe', time: '1 dzień temu', status: 'warning' },
                  ].map((execution, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{execution.name}</span>
                          <Badge 
                            variant={execution.status === 'success' ? 'outline' : 'secondary'} 
                            className="text-xs"
                          >
                            {execution.status === 'success' ? (
                              <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                              <AlertCircle className="h-3 w-3 text-amber-500 mr-1" />
                            )}
                            {execution.status === 'success' ? 'Sukces' : 'Ostrzeżenie'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{execution.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  Pokaż historię
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Narzędzia AI</CardTitle>
              <CardDescription>Dostępne narzędzia AI do automatyzacji procesów</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2 border-primary/20 hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">Mastra Assistant</CardTitle>
                    </div>
                    <CardDescription>AI-powered assistant using Mastra MCP with OpenAI</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Inteligentny asystent AI, który pomaga w zarządzaniu klientami, zleceniami i generowaniu treści.
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button asChild className="w-full">
                      <Link href="/automation/mastra">
                        Otwórz Mastra Assistant
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border hover:border-primary/20 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-base">Automatyczne odpowiedzi</CardTitle>
                    </div>
                    <CardDescription>Automatyczne odpowiedzi na zapytania klientów</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Automatycznie generuj odpowiedzi na zapytania klientów na podstawie historii komunikacji.
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" className="w-full">
                      Wkrótce dostępne
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border hover:border-primary/20 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-base">Email AI</CardTitle>
                    </div>
                    <CardDescription>Automatyczne przetwarzanie i kategoryzacja emaili</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Automatycznie kategoryzuj i przetwarzaj emaile od klientów, przypisując je do odpowiednich zleceń.
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" className="w-full">
                      Wkrótce dostępne
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border hover:border-primary/20 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-base">AI Insights</CardTitle>
                    </div>
                    <CardDescription>Analiza danych i rekomendacje</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Analizuj dane klientów i zleceń, aby uzyskać rekomendacje dotyczące optymalizacji procesów.
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" className="w-full">
                      Wkrótce dostępne
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Szybkie akcje</CardTitle>
              <CardDescription>Najczęściej używane funkcje</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/automation/mastra">
                    <Bot className="mr-2 h-4 w-4" />
                    Otwórz Mastra Assistant
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Zap className="mr-2 h-4 w-4" />
                  Utwórz nową automatyzację
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="mr-2 h-4 w-4" />
                  Zarządzaj powiadomieniami
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Generuj raport
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statystyki</CardTitle>
              <CardDescription>Statystyki automatyzacji</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Aktywne automatyzacje</span>
                    <span className="font-medium">3/5</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Wykonane zadania (dzisiaj)</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sukces automatyzacji</span>
                    <span className="font-medium">95%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '95%' }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Wykorzystanie AI</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dokumentacja</CardTitle>
              <CardDescription>Przydatne materiały</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <div className="p-2 rounded-md hover:bg-muted/50">
                  <h3 className="text-sm font-medium">Mastra MCP Documentation</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Dokumentacja Mastra MCP z OpenAI integration
                  </p>
                </div>
                <div className="p-2 rounded-md hover:bg-muted/50">
                  <h3 className="text-sm font-medium">Automatyzacja procesów</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Przewodnik po automatyzacji procesów w CRM/ERP
                  </p>
                </div>
                <div className="p-2 rounded-md hover:bg-muted/50">
                  <h3 className="text-sm font-medium">Integracja AI</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Jak wykorzystać AI w codziennej pracy
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button variant="outline" size="sm" className="w-full">
                Pełna dokumentacja
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}