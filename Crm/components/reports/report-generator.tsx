"use client"

import { useState } from "react"
import { ArrowDownToLine, FileText, Mail, Printer } from "lucide-react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

interface ReportGeneratorProps {
  entityId: string
  entityType: "site" | "customer" | "device" | "service-order"
  entityName: string
}

export function ReportGenerator({ entityId, entityType, entityName }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<string>("status")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [reportGenerated, setReportGenerated] = useState<boolean>(false)
  const [emailSent, setEmailSent] = useState<boolean>(false)
  const [recipientEmail, setRecipientEmail] = useState<string>("")
  const [includeAttachments, setIncludeAttachments] = useState<boolean>(true)
  const [includeImages, setIncludeImages] = useState<boolean>(true)
  const [dateRange, setDateRange] = useState<string>("last-month")
  const [customMessage, setCustomMessage] = useState<string>("")

  // Symulacja generowania raportu
  const handleGenerateReport = () => {
    setIsGenerating(true)
    // Symulacja opóźnienia generowania raportu
    setTimeout(() => {
      setIsGenerating(false)
      setReportGenerated(true)
    }, 2000)
  }

  // Symulacja wysyłania raportu emailem
  const handleSendEmail = () => {
    if (!recipientEmail) return
    setIsGenerating(true)
    // Symulacja opóźnienia wysyłania emaila
    setTimeout(() => {
      setIsGenerating(false)
      setEmailSent(true)
      // Reset po 3 sekundach
      setTimeout(() => {
        setEmailSent(false)
      }, 3000)
    }, 1500)
  }

  // Pobieranie nazwy raportu na podstawie typu
  const getReportName = () => {
    const date = format(new Date(), "dd.MM.yyyy", { locale: pl })
    const entityTypeNames = {
      "site": "lokalizacji",
      "customer": "klienta",
      "device": "urządzenia",
      "service-order": "zlecenia"
    }
    
    const reportTypeNames = {
      "status": "Stan",
      "service": "Historia serwisowa",
      "energy": "Efektywność energetyczna",
      "financial": "Raport finansowy"
    }
    
    return `${reportTypeNames[reportType as keyof typeof reportTypeNames]} ${entityTypeNames[entityType]} - ${entityName} (${date})`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generator raportów</CardTitle>
        <CardDescription>
          Stwórz szczegółowy raport dla {entityType === "site" ? "lokalizacji" : 
                                        entityType === "customer" ? "klienta" : 
                                        entityType === "device" ? "urządzenia" : "zlecenia"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate" className="space-y-4">
          <TabsList>
            <TabsTrigger value="generate">Generuj raport</TabsTrigger>
            <TabsTrigger value="send">Wyślij emailem</TabsTrigger>
            <TabsTrigger value="schedule">Zaplanuj</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="report-type">Typ raportu</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Wybierz typ raportu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="status">Stan {entityType === "site" ? "lokalizacji" : 
                                                    entityType === "customer" ? "klienta" : 
                                                    entityType === "device" ? "urządzenia" : "zlecenia"}</SelectItem>
                    <SelectItem value="service">Historia serwisowa</SelectItem>
                    <SelectItem value="energy">Efektywność energetyczna</SelectItem>
                    <SelectItem value="financial">Raport finansowy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date-range">Zakres dat</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger id="date-range">
                    <SelectValue placeholder="Wybierz zakres dat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-month">Ostatni miesiąc</SelectItem>
                    <SelectItem value="last-quarter">Ostatni kwartał</SelectItem>
                    <SelectItem value="last-year">Ostatni rok</SelectItem>
                    <SelectItem value="all-time">Cały okres</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="include-images">Dołącz zdjęcia</Label>
                <Switch 
                  id="include-images" 
                  checked={includeImages} 
                  onCheckedChange={setIncludeImages} 
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="include-attachments">Dołącz załączniki</Label>
                <Switch 
                  id="include-attachments" 
                  checked={includeAttachments} 
                  onCheckedChange={setIncludeAttachments} 
                />
              </div>
            </div>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={handleGenerateReport} 
                disabled={isGenerating}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Generowanie...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generuj raport
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                disabled={!reportGenerated || isGenerating}
                className="flex-1"
              >
                <Printer className="mr-2 h-4 w-4" />
                Drukuj
              </Button>
              
              <Button 
                variant="secondary" 
                disabled={!reportGenerated || isGenerating}
                className="flex-1"
              >
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Pobierz PDF
              </Button>
            </div>
            
            {reportGenerated && (
              <div className="mt-4 p-4 border rounded-md bg-muted/50">
                <h3 className="font-medium mb-2">Raport wygenerowany</h3>
                <p className="text-sm text-muted-foreground mb-2">{getReportName()}</p>
                <div className="h-32 bg-muted rounded-md border flex items-center justify-center">
                  <p className="text-muted-foreground">Podgląd raportu</p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="send" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient-email">Adres email odbiorcy</Label>
              <Input 
                id="recipient-email" 
                type="email" 
                placeholder="adres@email.com" 
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="report-type-email">Typ raportu</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type-email">
                  <SelectValue placeholder="Wybierz typ raportu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status">Stan {entityType === "site" ? "lokalizacji" : 
                                                  entityType === "customer" ? "klienta" : 
                                                  entityType === "device" ? "urządzenia" : "zlecenia"}</SelectItem>
                  <SelectItem value="service">Historia serwisowa</SelectItem>
                  <SelectItem value="energy">Efektywność energetyczna</SelectItem>
                  <SelectItem value="financial">Raport finansowy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="custom-message">Wiadomość (opcjonalnie)</Label>
              <Textarea 
                id="custom-message" 
                placeholder="Wprowadź dodatkową wiadomość do emaila..." 
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="include-images-email">Dołącz zdjęcia</Label>
                <Switch 
                  id="include-images-email" 
                  checked={includeImages} 
                  onCheckedChange={setIncludeImages} 
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="include-attachments-email">Dołącz załączniki</Label>
                <Switch 
                  id="include-attachments-email" 
                  checked={includeAttachments} 
                  onCheckedChange={setIncludeAttachments} 
                />
              </div>
            </div>
            
            <Button 
              onClick={handleSendEmail} 
              disabled={isGenerating || !recipientEmail}
              className="w-full mt-2"
            >
              {isGenerating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Wysyłanie...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Wyślij raport
                </>
              )}
            </Button>
            
            {emailSent && (
              <div className="mt-2 p-2 bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 rounded-md text-sm text-center">
                Raport został wysłany na adres {recipientEmail}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-email">Adres email odbiorcy</Label>
              <Input 
                id="schedule-email" 
                type="email" 
                placeholder="adres@email.com" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schedule-report-type">Typ raportu</Label>
                <Select defaultValue="status">
                  <SelectTrigger id="schedule-report-type">
                    <SelectValue placeholder="Wybierz typ raportu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="status">Stan {entityType === "site" ? "lokalizacji" : 
                                                    entityType === "customer" ? "klienta" : 
                                                    entityType === "device" ? "urządzenia" : "zlecenia"}</SelectItem>
                    <SelectItem value="service">Historia serwisowa</SelectItem>
                    <SelectItem value="energy">Efektywność energetyczna</SelectItem>
                    <SelectItem value="financial">Raport finansowy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="schedule-frequency">Częstotliwość</Label>
                <Select defaultValue="monthly">
                  <SelectTrigger id="schedule-frequency">
                    <SelectValue placeholder="Wybierz częstotliwość" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Co tydzień</SelectItem>
                    <SelectItem value="monthly">Co miesiąc</SelectItem>
                    <SelectItem value="quarterly">Co kwartał</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="schedule-day">Dzień wysyłki</Label>
              <Select defaultValue="1">
                <SelectTrigger id="schedule-day">
                  <SelectValue placeholder="Wybierz dzień" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1. dzień miesiąca/tygodnia</SelectItem>
                  <SelectItem value="15">15. dzień miesiąca</SelectItem>
                  <SelectItem value="last">Ostatni dzień miesiąca/tygodnia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button className="w-full mt-2">
              Zaplanuj automatyczne raporty
            </Button>
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="font-medium mb-2">Zaplanowane raporty</h3>
              <div className="space-y-2">
                <div className="p-3 border rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium">Raport miesięczny</p>
                    <p className="text-sm text-muted-foreground">Co miesiąc, 1. dzień</p>
                  </div>
                  <Button variant="outline" size="sm">Anuluj</Button>
                </div>
                <div className="p-3 border rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium">Raport kwartalny</p>
                    <p className="text-sm text-muted-foreground">Co kwartał, ostatni dzień</p>
                  </div>
                  <Button variant="outline" size="sm">Anuluj</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
