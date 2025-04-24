"use client"

import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { FileText, MapPin, Package, User, Calendar, BarChart, Clock, Wrench } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface ReportTemplateProps {
  reportType: "status" | "service" | "energy" | "financial"
  entityType: "site" | "customer" | "device" | "service-order"
  entityData: any
  dateRange: string
  includeImages?: boolean
}

export function ReportTemplate({ reportType, entityType, entityData, dateRange, includeImages = true }: ReportTemplateProps) {
  const currentDate = new Date()
  const formattedDate = format(currentDate, "d MMMM yyyy", { locale: pl })
  
  // Funkcja do generowania tytułu raportu
  const getReportTitle = () => {
    const reportTypeNames = {
      "status": "Stan",
      "service": "Historia serwisowa",
      "energy": "Efektywność energetyczna",
      "financial": "Raport finansowy"
    }
    
    const entityTypeNames = {
      "site": "lokalizacji",
      "customer": "klienta",
      "device": "urządzenia",
      "service-order": "zlecenia serwisowego"
    }
    
    return `${reportTypeNames[reportType]} ${entityTypeNames[entityType]}`
  }
  
  // Funkcja do generowania zakresu dat
  const getDateRangeText = () => {
    switch (dateRange) {
      case "last-month":
        return "Ostatni miesiąc"
      case "last-quarter":
        return "Ostatni kwartał"
      case "last-year":
        return "Ostatni rok"
      case "all-time":
        return "Cały okres"
      default:
        return "Nieokreślony zakres"
    }
  }
  
  // Funkcja do renderowania nagłówka raportu
  const renderReportHeader = () => {
    return (
      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{getReportTitle()}</h1>
            <p className="text-muted-foreground">Wygenerowano: {formattedDate}</p>
            <p className="text-muted-foreground">Zakres danych: {getDateRangeText()}</p>
          </div>
          <div className="text-right">
            <h2 className="font-bold">{entityData.name}</h2>
            {entityType === "site" && (
              <p className="text-sm text-muted-foreground flex items-center justify-end gap-1">
                <MapPin className="h-3 w-3" /> {entityData.address}
              </p>
            )}
            {entityType === "customer" && (
              <p className="text-sm text-muted-foreground flex items-center justify-end gap-1">
                <User className="h-3 w-3" /> {entityData.email}
              </p>
            )}
            {entityType === "device" && (
              <p className="text-sm text-muted-foreground flex items-center justify-end gap-1">
                <Package className="h-3 w-3" /> {entityData.model}
              </p>
            )}
          </div>
        </div>
        <Separator />
      </div>
    )
  }
  
  // Funkcja do renderowania zawartości raportu w zależności od typu
  const renderReportContent = () => {
    switch (reportType) {
      case "status":
        return renderStatusReport()
      case "service":
        return renderServiceReport()
      case "energy":
        return renderEnergyReport()
      case "financial":
        return renderFinancialReport()
      default:
        return <p>Nieznany typ raportu</p>
    }
  }
  
  // Raport stanu
  const renderStatusReport = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Podsumowanie</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Liczba urządzeń</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{entityData.devices_count || 5}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Stan techniczny</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">Dobry</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Następny przegląd</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {entityData.next_visit 
                    ? format(new Date(entityData.next_visit), "d MMM yyyy", { locale: pl })
                    : "15 Lip 2024"}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Lista urządzeń</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nazwa</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Nr seryjny</TableHead>
                <TableHead>Data instalacji</TableHead>
                <TableHead>Stan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">Klimatyzator {i}</TableCell>
                  <TableCell>AC-{1000 + i}</TableCell>
                  <TableCell>SN-{10000 + i * 123}</TableCell>
                  <TableCell>{format(new Date(2023, i-1, 10), "d MMM yyyy", { locale: pl })}</TableCell>
                  <TableCell>
                    <Badge variant={i % 3 === 0 ? "outline" : i % 2 === 0 ? "secondary" : "default"}>
                      {i % 3 === 0 ? "Wymaga serwisu" : i % 2 === 0 ? "Dobry" : "Bardzo dobry"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {includeImages && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Dokumentacja zdjęciowa</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-md p-2">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-2">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">Zdjęcie urządzenia {i}</p>
                  <p className="text-xs text-muted-foreground">Dodano: {format(new Date(2023, i+5, i*3), "d MMM yyyy", { locale: pl })}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Zalecenia</h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-2 list-disc pl-5">
                <li>Zalecany przegląd klimatyzatora 3 w ciągu najbliższych 30 dni</li>
                <li>Wymiana filtrów w urządzeniach 1, 2 i 4</li>
                <li>Kontrola szczelności instalacji chłodniczej</li>
                <li>Czyszczenie wymienników ciepła w urządzeniach zewnętrznych</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  // Raport serwisowy
  const renderServiceReport = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Podsumowanie serwisowe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Liczba wizyt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">W wybranym okresie</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Średni czas naprawy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.5h</div>
                <p className="text-xs text-muted-foreground">W wybranym okresie</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Najczęstszy problem</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">Wymiana filtrów</div>
                <p className="text-xs text-muted-foreground">5 przypadków</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Historia serwisowa</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Typ wizyty</TableHead>
                <TableHead>Urządzenie</TableHead>
                <TableHead>Opis</TableHead>
                <TableHead>Technik</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>{format(new Date(2023, 11-i, 10+i*2), "d MMM yyyy", { locale: pl })}</TableCell>
                  <TableCell>
                    <Badge variant={i % 3 === 0 ? "destructive" : i % 2 === 0 ? "outline" : "default"}>
                      {i % 3 === 0 ? "Awaria" : i % 2 === 0 ? "Przegląd" : "Konserwacja"}
                    </Badge>
                  </TableCell>
                  <TableCell>Klimatyzator {i % 3 + 1}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {i % 3 === 0 
                      ? "Naprawa wycieku czynnika chłodniczego" 
                      : i % 2 === 0 
                        ? "Rutynowy przegląd i czyszczenie filtrów" 
                        : "Wymiana filtrów i kontrola parametrów"}
                  </TableCell>
                  <TableCell>Jan Kowalski</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Zużyte części</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Część</TableHead>
                <TableHead>Ilość</TableHead>
                <TableHead>Urządzenie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4].map((i) => (
                <TableRow key={i}>
                  <TableCell>{format(new Date(2023, 11-i, 10+i*2), "d MMM yyyy", { locale: pl })}</TableCell>
                  <TableCell>
                    {i === 1 ? "Filtr powietrza" : i === 2 ? "Czynnik chłodniczy R32" : i === 3 ? "Czujnik temperatury" : "Zawór rozprężny"}
                  </TableCell>
                  <TableCell>{i === 2 ? "0.5kg" : i === 1 ? "2 szt." : "1 szt."}</TableCell>
                  <TableCell>Klimatyzator {i}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Planowane wizyty</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Typ wizyty</TableHead>
                <TableHead>Urządzenie</TableHead>
                <TableHead>Opis</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2].map((i) => (
                <TableRow key={i}>
                  <TableCell>{format(new Date(2024, i+1, 10+i*5), "d MMM yyyy", { locale: pl })}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Przegląd</Badge>
                  </TableCell>
                  <TableCell>Wszystkie urządzenia</TableCell>
                  <TableCell>Rutynowy przegląd {i === 1 ? "wiosenny" : "letni"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }
  
  // Raport efektywności energetycznej
  const renderEnergyReport = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Podsumowanie zużycia energii</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Średnie zużycie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245 kWh</div>
                <p className="text-xs text-muted-foreground">Miesięcznie</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Szczytowe zużycie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">410 kWh</div>
                <p className="text-xs text-muted-foreground">Lipiec 2023</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Potencjał oszczędności</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">15%</div>
                <p className="text-xs text-muted-foreground">Po optymalizacji</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Wykres zużycia energii</h2>
          <div className="h-[300px] w-full bg-muted rounded-md border flex items-center justify-center">
            <BarChart className="h-16 w-16 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">Miesięczne zużycie energii w kWh</p>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Efektywność urządzeń</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Urządzenie</TableHead>
                <TableHead>Klasa energetyczna</TableHead>
                <TableHead>Średnie zużycie</TableHead>
                <TableHead>Efektywność</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">Klimatyzator {i}</TableCell>
                  <TableCell>{String.fromCharCode(64 + (i % 3 + 1))}</TableCell>
                  <TableCell>{40 + i * 10} kWh/miesiąc</TableCell>
                  <TableCell>
                    <Badge variant={i % 3 === 0 ? "destructive" : i % 2 === 0 ? "secondary" : "default"}>
                      {i % 3 === 0 ? "Niska" : i % 2 === 0 ? "Średnia" : "Wysoka"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Rekomendacje oszczędności energii</h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-2 list-disc pl-5">
                <li>Wymiana klimatyzatora 3 na model o wyższej klasie energetycznej (potencjalna oszczędność: 20%)</li>
                <li>Optymalizacja harmonogramu pracy urządzeń (potencjalna oszczędność: 10%)</li>
                <li>Instalacja czujników obecności do automatycznego wyłączania urządzeń (potencjalna oszczędność: 15%)</li>
                <li>Regularne czyszczenie filtrów i wymienników (potencjalna oszczędność: 5%)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  // Raport finansowy
  const renderFinancialReport = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Podsumowanie finansowe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Całkowity koszt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,450 zł</div>
                <p className="text-xs text-muted-foreground">W wybranym okresie</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Koszty serwisowe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4,250 zł</div>
                <p className="text-xs text-muted-foreground">W wybranym okresie</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Koszty energii</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,200 zł</div>
                <p className="text-xs text-muted-foreground">W wybranym okresie</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Wykres kosztów</h2>
          <div className="h-[300px] w-full bg-muted rounded-md border flex items-center justify-center">
            <BarChart className="h-16 w-16 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">Miesięczne koszty w złotych</p>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Szczegółowe koszty serwisowe</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Typ usługi</TableHead>
                <TableHead>Urządzenie</TableHead>
                <TableHead>Koszt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>{format(new Date(2023, 11-i, 10+i*2), "d MMM yyyy", { locale: pl })}</TableCell>
                  <TableCell>
                    {i % 3 === 0 ? "Naprawa awarii" : i % 2 === 0 ? "Przegląd okresowy" : "Konserwacja"}
                  </TableCell>
                  <TableCell>Klimatyzator {i % 3 + 1}</TableCell>
                  <TableCell>{i % 3 === 0 ? "1,200 zł" : i % 2 === 0 ? "450 zł" : "350 zł"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Prognoza kosztów</h2>
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Okres</TableHead>
                    <TableHead>Koszty serwisowe</TableHead>
                    <TableHead>Koszty energii</TableHead>
                    <TableHead>Razem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"].map((quarter, i) => (
                    <TableRow key={quarter}>
                      <TableCell className="font-medium">{quarter}</TableCell>
                      <TableCell>{900 + i * 100} zł</TableCell>
                      <TableCell>{1800 + i * 200} zł</TableCell>
                      <TableCell className="font-bold">{2700 + i * 300} zł</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Rekomendacje oszczędności</h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-2 list-disc pl-5">
                <li>Zawarcie umowy serwisowej (potencjalna oszczędność: 15% kosztów serwisowych)</li>
                <li>Wymiana starszych urządzeń (potencjalna oszczędność: 25% kosztów energii)</li>
                <li>Optymalizacja harmonogramu pracy (potencjalna oszczędność: 10% kosztów energii)</li>
                <li>Regularne przeglądy prewencyjne (redukcja ryzyka kosztownych awarii)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  // Stopka raportu
  const renderReportFooter = () => {
    return (
      <div className="mt-8 pt-4 border-t text-sm text-muted-foreground">
        <p>Raport wygenerowany automatycznie przez system HVAC CRM ERP</p>
        <p>© {new Date().getFullYear()} GodLike CRM - Wszelkie prawa zastrzeżone</p>
      </div>
    )
  }
  
  return (
    <div className="p-8 max-w-[210mm] mx-auto bg-background">
      {renderReportHeader()}
      {renderReportContent()}
      {renderReportFooter()}
    </div>
  )
}
