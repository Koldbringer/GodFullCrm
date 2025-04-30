import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

export function AutomationStatusPanel() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Status Automatyzacji</CardTitle>
          <Bot className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>Przegląd aktywnych automatyzacji i alertów</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-sm font-medium">Automatyczne przypisywanie zleceń</p>
          </div>
          <span className="text-xs text-muted-foreground">Aktywne</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <p className="text-sm font-medium">Generowanie raportów miesięcznych</p>
          </div>
          <span className="text-xs text-muted-foreground">Aktywne</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
            <p className="text-sm font-medium">Monitorowanie prognoz pogody</p>
          </div>
          <span className="text-xs text-muted-foreground">Ostrzeżenie: API niedostępne</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            <p className="text-sm font-medium">Synchronizacja z systemem księgowym</p>
          </div>
          <span className="text-xs text-muted-foreground">Błąd: Nieudane połączenie</span>
        </div>
      </CardContent>
    </Card>
  );
}