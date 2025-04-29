"use client"

import { useState } from "react"
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3, 
  Calendar, 
  Clock, 
  RefreshCw,
  Sparkles,
  Zap
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function AiInsightsPanel() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  return (
    <Card className="border-none shadow-md bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">AI Insights</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription>
          Zaawansowana analiza danych i predykcje AI
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <Tabs defaultValue="business" className="space-y-4">
          <TabsList className="grid grid-cols-3 h-9">
            <TabsTrigger value="business" className="text-xs">Biznes</TabsTrigger>
            <TabsTrigger value="technical" className="text-xs">Techniczne</TabsTrigger>
            <TabsTrigger value="predictions" className="text-xs">Predykcje</TabsTrigger>
          </TabsList>
          
          <TabsContent value="business" className="space-y-4 mt-2">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Wzrost efektywności</h4>
                  <p className="text-xs text-muted-foreground">
                    Czas realizacji zleceń skrócił się o 18% w porównaniu do poprzedniego kwartału.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Potencjalne opóźnienia</h4>
                  <p className="text-xs text-muted-foreground">
                    3 zlecenia mają wysokie ryzyko opóźnienia ze względu na dostępność części.
                  </p>
                  <Button variant="link" className="h-auto p-0 text-xs">Zobacz zlecenia</Button>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Optymalizacja tras</h4>
                  <p className="text-xs text-muted-foreground">
                    Zoptymalizowanie tras techników może zaoszczędzić do 12 godzin tygodniowo.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="technical" className="space-y-4 mt-2">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Potencjalne awarie</h4>
                  <p className="text-xs text-muted-foreground">
                    5 urządzeń wykazuje wzorce danych wskazujące na ryzyko awarii w ciągu 30 dni.
                  </p>
                  <div className="flex space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">Klimatyzator #A2103</Badge>
                    <Badge variant="outline" className="text-xs">Pompa #P5201</Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <BarChart3 className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Anomalie zużycia energii</h4>
                  <p className="text-xs text-muted-foreground">
                    3 lokalizacje wykazują nietypowe wzorce zużycia energii.
                  </p>
                  <div className="mt-1">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span>Biuro Główne</span>
                      <span className="text-red-500">+24%</span>
                    </div>
                    <Progress value={76} className="h-1.5" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Optymalne harmonogramy</h4>
                  <p className="text-xs text-muted-foreground">
                    AI sugeruje zmianę harmonogramu pracy dla 7 urządzeń w celu oszczędności energii.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="predictions" className="space-y-4 mt-2">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Prognoza obciążenia</h4>
                  <p className="text-xs text-muted-foreground">
                    Przewidywany 30% wzrost zleceń serwisowych w lipcu i sierpniu.
                  </p>
                  <div className="mt-1 grid grid-cols-5 gap-1">
                    {[45, 52, 80, 78, 60].map((value, i) => (
                      <div key={i} className="space-y-1">
                        <div className="h-10 bg-muted rounded-sm relative overflow-hidden">
                          <div 
                            className="absolute bottom-0 w-full bg-primary/70 rounded-sm"
                            style={{ height: `${value}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-muted-foreground block text-center">
                          {['Maj', 'Cze', 'Lip', 'Sie', 'Wrz'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Zap className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Zużycie energii</h4>
                  <p className="text-xs text-muted-foreground">
                    Przewidywany 15% wzrost kosztów energii w nadchodzącym kwartale.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Brain className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Rekomendacje AI</h4>
                  <p className="text-xs text-muted-foreground">
                    Zatrudnienie dodatkowego technika zwiększy wydajność o 22% w okresie letnim.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-1">
        <Button variant="link" className="h-auto p-0 text-xs w-full text-muted-foreground">
          Zobacz wszystkie insighty AI
        </Button>
      </CardFooter>
    </Card>
  )
}
