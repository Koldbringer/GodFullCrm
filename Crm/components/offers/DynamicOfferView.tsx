"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Download,
  ThumbsUp,
  Calendar as CalendarIcon,
  Clock,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Product {
  id: string
  name: string
  description: string
  image: string
  price: number
  features: string[]
  quantity: number
  stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock'
  discount_percentage?: number
  original_price?: number
}

interface Service {
  id: string
  name: string
  price: number
}

interface OfferOption {
  id: string
  title: string
  description: string
  products: Product[]
  services: Service[]
  totalPrice: number
  recommended?: boolean
}

interface InstallationDate {
  id: string
  date: string
  slots_available: number
  slots_total: number
}

interface DynamicOfferViewProps {
  token: string
  clientName: string
  offerDate: string
  validUntil: string
  options: OfferOption[]
  status?: string
  availableDates?: InstallationDate[]
  onApprove?: (optionId: string, dateId?: string) => Promise<void>
}

export function DynamicOfferView({
  token,
  clientName,
  offerDate,
  validUntil,
  options,
  status = "pending",
  availableDates = [],
  onApprove
}: DynamicOfferViewProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    options.find(o => o.recommended)?.id || options[0]?.id || null
  )
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({})
  const [isApproving, setIsApproving] = useState(false)
  const [isApproved, setIsApproved] = useState(status === "approved")
  const [isExpired, setIsExpired] = useState(status === "expired")
  const [selectedDateId, setSelectedDateId] = useState<string | null>(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const toggleProductExpand = (productId: string) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }))
  }

  // Format dates for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: pl });
  };

  // Check if offer is expired
  const isOfferExpired = new Date(validUntil) < new Date() || isExpired;

  // Group available dates by month for better display
  const groupedDates: Record<string, InstallationDate[]> = {};
  availableDates.forEach((date) => {
    const monthYear = format(new Date(date.date), "MMMM yyyy", { locale: pl });
    if (!groupedDates[monthYear]) {
      groupedDates[monthYear] = [];
    }
    groupedDates[monthYear].push(date);
  });

  const handleApprove = async () => {
    if (!selectedOption) return

    // Check if we need date selection
    if (availableDates.length > 0 && !selectedDateId) {
      toast.error("Wybierz termin montażu")
      return
    }

    setIsApproving(true)
    try {
      if (onApprove) {
        await onApprove(selectedOption, selectedDateId || undefined)
      } else {
        // Mock implementation
        await new Promise(resolve => setTimeout(resolve, 1500))
      }

      setIsApproved(true)
      toast.success("Oferta została zatwierdzona!")
    } catch (error) {
      console.error("Error approving offer:", error)
      toast.error("Wystąpił błąd podczas zatwierdzania oferty")
    } finally {
      setIsApproving(false)
    }
  }

  if (isApproved) {
    const selectedOptionData = options.find(o => o.id === selectedOption);
    const selectedDate = availableDates.find(d => d.id === selectedDateId);

    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="mb-8 overflow-hidden">
          <div className="bg-green-50 dark:bg-green-900 py-8 px-4 flex flex-col items-center">
            <div className="mx-auto mb-4 bg-white dark:bg-green-800 rounded-full p-4 w-20 h-20 flex items-center justify-center shadow-md">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-300" />
            </div>
            <CardTitle className="text-2xl text-green-800 dark:text-green-100">Dziękujemy za zatwierdzenie oferty!</CardTitle>
            <CardDescription className="text-green-700 dark:text-green-200 mt-2 text-center max-w-md">
              Skontaktujemy się z Tobą wkrótce, aby potwierdzić szczegóły realizacji.
            </CardDescription>
          </div>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Szczegóły zamówienia</h3>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Wybrany pakiet</span>
                    <span className="font-semibold">{selectedOptionData?.title}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Wartość zamówienia</span>
                    <span className="font-semibold">{selectedOptionData?.totalPrice.toLocaleString()} zł</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Numer referencyjny</span>
                    <span className="font-mono bg-muted px-2 py-1 rounded text-sm">{token}</span>
                  </div>
                </div>
              </div>

              {selectedDate && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Termin montażu</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                      <span className="font-semibold">
                        {format(new Date(selectedDate.date), "EEEE, d MMMM yyyy", { locale: pl })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Dokładna godzina montażu zostanie potwierdzona telefonicznie dzień przed wizytą.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-medium mb-3">Co dalej?</h3>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground font-medium text-sm">1</div>
                  <div>
                    <p className="font-medium">Potwierdzenie telefoniczne</p>
                    <p className="text-sm text-muted-foreground">Nasz konsultant skontaktuje się z Tobą w ciągu 24 godzin, aby potwierdzić szczegóły zamówienia.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground font-medium text-sm">2</div>
                  <div>
                    <p className="font-medium">Przygotowanie do montażu</p>
                    <p className="text-sm text-muted-foreground">Otrzymasz od nas wiadomość email z instrukcjami dotyczącymi przygotowania miejsca montażu.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground font-medium text-sm">3</div>
                  <div>
                    <p className="font-medium">Realizacja montażu</p>
                    <p className="text-sm text-muted-foreground">Nasi technicy pojawią się w wybranym terminie i przeprowadzą profesjonalny montaż.</p>
                  </div>
                </li>
              </ol>
            </div>
          </CardContent>

          <CardFooter className="bg-muted/20 border-t p-6 flex flex-col sm:flex-row gap-4 justify-between">
            <Button variant="outline" onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4" />
              Pobierz potwierdzenie
            </Button>

            <div className="text-sm text-muted-foreground text-right">
              <p>Masz pytania? Zadzwoń do nas: 123 456 789</p>
              <p>lub napisz: kontakt@godlike-hvac.pl</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Status banner */}
      {isApproved && (
        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-4 rounded-lg mb-6 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>Oferta została zatwierdzona. Dziękujemy za wybór naszych usług!</span>
        </div>
      )}

      {isOfferExpired && !isApproved && (
        <div className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 p-4 rounded-lg mb-6 flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          <span>Ta oferta wygasła. Prosimy o kontakt, aby otrzymać aktualną ofertę.</span>
        </div>
      )}

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Oferta dla: {clientName}</CardTitle>
              <CardDescription>
                Data utworzenia: {formatDate(offerDate)} | Ważna do: {formatDate(validUntil)}
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">GodLike HVAC</p>
              <p className="text-xs text-muted-foreground">ul. Przykładowa 123, Warszawa</p>
              <p className="text-xs text-muted-foreground">tel. 123 456 789</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            Szanowny Kliencie, przygotowaliśmy dla Ciebie kilka opcji instalacji klimatyzacji.
            Każda z nich została dopasowana do Twoich potrzeb, które omówiliśmy podczas rozmowy.
            Wybierz opcję, która najbardziej Ci odpowiada.
          </p>

          <Tabs
            value={selectedOption || undefined}
            onValueChange={setSelectedOption}
            className="space-y-6"
          >
            <div className="mb-2 text-center">
              <h3 className="text-lg font-medium mb-1">Wybierz pakiet, który najlepiej odpowiada Twoim potrzebom:</h3>
              <p className="text-sm text-muted-foreground">Porównaj opcje i wybierz najlepszą dla siebie</p>
            </div>

            <TabsList className="grid grid-cols-1 md:grid-cols-3 h-auto gap-2 p-1 bg-transparent">
              {options.map(option => (
                <TabsTrigger
                  key={option.id}
                  value={option.id}
                  className="relative py-4 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-input shadow-sm hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                >
                  <div className="flex flex-col items-center">
                    <span className="font-medium">{option.title}</span>
                    <span className="text-sm mt-1">{option.totalPrice.toLocaleString()} zł</span>
                  </div>

                  {option.recommended && (
                    <Badge className="absolute -top-2 -right-2 bg-green-600">Polecana</Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {options.map(option => (
              <TabsContent key={option.id} value={option.id} className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Urządzenia</h3>
                      <div className="space-y-4">
                        {option.products.map(product => (
                          <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                            <div className="p-4">
                              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-lg">{product.name}</h4>
                                    {product.stock_status && (
                                      <Badge variant={
                                        product.stock_status === 'in_stock' ? 'success' :
                                        product.stock_status === 'low_stock' ? 'warning' : 'destructive'
                                      }>
                                        {product.stock_status === 'in_stock' ? 'Dostępny' :
                                         product.stock_status === 'low_stock' ? 'Mała ilość' : 'Niedostępny'}
                                      </Badge>
                                    )}
                                  </div>

                                  <p className="text-sm text-muted-foreground mb-2">
                                    {expandedProducts[product.id]
                                      ? product.description
                                      : `${product.description.substring(0, 100)}...`}
                                  </p>

                                  {product.quantity > 1 && (
                                    <p className="text-sm font-medium mb-2">
                                      Ilość: {product.quantity} szt.
                                    </p>
                                  )}

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="px-0 text-xs"
                                    onClick={() => toggleProductExpand(product.id)}
                                  >
                                    {expandedProducts[product.id] ? (
                                      <>Zwiń szczegóły <ChevronUp className="ml-1 h-3 w-3" /></>
                                    ) : (
                                      <>Pokaż szczegóły <ChevronDown className="ml-1 h-3 w-3" /></>
                                    )}
                                  </Button>
                                </div>

                                <div className="md:ml-4 flex-shrink-0 w-full md:w-auto">
                                  <div className="relative h-40 md:h-32 w-full md:w-32 overflow-hidden rounded-md">
                                    <Image
                                      src={product.image || "/placeholder-product.jpg"}
                                      alt={product.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>

                                  <div className="flex flex-col items-end mt-2">
                                    {product.discount_percentage ? (
                                      <>
                                        <p className="text-sm line-through text-muted-foreground">
                                          {product.original_price?.toLocaleString() || (product.price * (1 + product.discount_percentage/100)).toLocaleString()} zł
                                        </p>
                                        <div className="flex items-center gap-2">
                                          <Badge variant="destructive" className="font-bold">-{product.discount_percentage}%</Badge>
                                          <p className="text-right font-bold text-lg">
                                            {product.price.toLocaleString()} zł
                                          </p>
                                        </div>
                                      </>
                                    ) : (
                                      <p className="text-right font-bold text-lg">
                                        {product.price.toLocaleString()} zł
                                      </p>
                                    )}

                                    {product.quantity > 1 && (
                                      <p className="text-right text-sm text-muted-foreground">
                                        Razem: {(product.price * product.quantity).toLocaleString()} zł
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {expandedProducts[product.id] && (
                                <div className="mt-4 pt-4 border-t">
                                  <h5 className="font-medium mb-2">Cechy produktu:</h5>
                                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {product.features.map((feature, index) => (
                                      <li key={index} className="flex items-center text-sm">
                                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                        {feature}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Usługi</h3>
                      <Card>
                        <CardContent className="p-4">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2">Nazwa</th>
                                <th className="text-center py-2 hidden md:table-cell">Opis</th>
                                <th className="text-right py-2">Cena</th>
                              </tr>
                            </thead>
                            <tbody>
                              {option.services.map(service => (
                                <tr key={service.id} className="border-b hover:bg-muted/50 transition-colors">
                                  <td className="py-3 font-medium">{service.name}</td>
                                  <td className="py-3 text-sm text-muted-foreground text-center hidden md:table-cell">
                                    {service.description || "Standardowa usługa montażowa"}
                                  </td>
                                  <td className="text-right py-3 font-bold">{service.price.toLocaleString()} zł</td>
                                </tr>
                              ))}
                              <tr className="bg-muted/20">
                                <td colSpan={2} className="py-3 font-medium text-right">Razem za usługi:</td>
                                <td className="text-right py-3 font-bold">
                                  {option.services.reduce((sum, s) => sum + s.price, 0).toLocaleString()} zł
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Podsumowanie</h3>
                      <Card className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="grid grid-cols-1 divide-y">
                            <div className="p-4 flex justify-between items-center bg-muted/30">
                              <span className="font-medium">Łączna wartość urządzeń:</span>
                              <span className="font-semibold">
                                {option.products.reduce((sum, p) => sum + (p.price * (p.quantity || 1)), 0).toLocaleString()} zł
                              </span>
                            </div>
                            <div className="p-4 flex justify-between items-center">
                              <span className="font-medium">Łączna wartość usług:</span>
                              <span className="font-semibold">
                                {option.services.reduce((sum, s) => sum + s.price, 0).toLocaleString()} zł
                              </span>
                            </div>

                            {/* Dodatkowe informacje o zniżkach, jeśli są */}
                            {option.products.some(p => p.discount_percentage) && (
                              <div className="p-4 flex justify-between items-center bg-muted/30">
                                <span className="font-medium">Oszczędzasz:</span>
                                <span className="font-semibold text-green-600">
                                  {option.products
                                    .filter(p => p.discount_percentage)
                                    .reduce((sum, p) => {
                                      const originalPrice = p.original_price || (p.price * (1 + p.discount_percentage!/100));
                                      return sum + ((originalPrice - p.price) * (p.quantity || 1));
                                    }, 0)
                                    .toLocaleString()} zł
                                </span>
                              </div>
                            )}

                            <div className="p-5 flex justify-between items-center bg-primary text-primary-foreground">
                              <span className="font-bold text-lg">Razem do zapłaty:</span>
                              <span className="font-bold text-xl">{option.totalPrice.toLocaleString()} zł</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>Cena zawiera podatek VAT. Oferta ważna do {formatDate(validUntil)}.</p>
                        <p>Czas realizacji: 2-3 tygodnie od momentu zatwierdzenia oferty.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Pobierz ofertę PDF
          </Button>
          {!isApproved && !isOfferExpired && availableDates.length === 0 && (
            <Button
              className="w-full sm:w-auto"
              onClick={handleApprove}
              disabled={!selectedOption || isApproving}
            >
              {isApproving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Zatwierdzanie...
                </>
              ) : (
                <>
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Zatwierdzam ofertę
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>

      {!isApproved && !isOfferExpired && availableDates.length > 0 && (
        <Card className="mb-8 overflow-hidden border-2 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Wybierz termin montażu</CardTitle>
                <CardDescription>
                  Wybierz preferowany termin montażu z dostępnych opcji
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {selectedDateId ? (
              <div className="mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">Wybrany termin:</p>
                    <p className="text-lg font-bold">
                      {format(new Date(availableDates.find((d) => d.id === selectedDateId)?.date || ""), "EEEE, d MMMM yyyy", { locale: pl })}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsCalendarOpen(true)}>
                    Zmień termin
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center mb-4">
                <p className="mb-2 text-muted-foreground">Nie wybrano jeszcze terminu montażu</p>
                <Button onClick={() => setIsCalendarOpen(true)} variant="outline" className="w-full sm:w-auto">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Wybierz termin montażu
                </Button>
              </div>
            )}

            <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Wybierz termin montażu</DialogTitle>
                  <DialogDescription>
                    Poniżej znajdują się dostępne terminy montażu. Wybierz dogodny dla Ciebie
                    termin.
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[400px] overflow-y-auto py-4">
                  {Object.entries(groupedDates).map(([monthYear, dates]) => (
                    <div key={monthYear} className="mb-6">
                      <h3 className="font-medium mb-3 capitalize flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                        {monthYear}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {dates.map((date) => {
                          const dateObj = new Date(date.date);
                          const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
                          const availability = date.slots_available / date.slots_total;

                          return (
                            <Button
                              key={date.id}
                              variant={selectedDateId === date.id ? "default" : "outline"}
                              className={`justify-between h-auto py-3 ${isWeekend ? 'border-amber-200 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950 dark:hover:bg-amber-900' : ''}`}
                              onClick={() => setSelectedDateId(date.id)}
                            >
                              <div className="flex flex-col items-start">
                                <span className="font-medium">{format(dateObj, "EEEE", { locale: pl })}</span>
                                <span className="text-sm">{format(dateObj, "d MMMM yyyy", { locale: pl })}</span>
                              </div>
                              <Badge
                                variant={
                                  availability > 0.5 ? "success" :
                                  availability > 0.2 ? "warning" :
                                  "destructive"
                                }
                                className="ml-2"
                              >
                                {date.slots_available} / {date.slots_total}
                              </Badge>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => setIsCalendarOpen(false)}
                    disabled={!selectedDateId}
                  >
                    Potwierdź wybór
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="mt-6 border-t pt-6">
              <div className="flex flex-col space-y-2">
                <h4 className="font-medium">Informacje dodatkowe:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Montaż trwa zazwyczaj od 4 do 8 godzin w zależności od wybranego pakietu</li>
                  <li>• Dokładna godzina montażu zostanie ustalona telefonicznie dzień przed wizytą</li>
                  <li>• W przypadku złych warunków atmosferycznych termin może ulec zmianie</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end bg-muted/20 border-t">
            <Button
              onClick={handleApprove}
              disabled={isApproving || !selectedOption || !selectedDateId}
              className="w-full sm:w-auto"
              size="lg"
            >
              {isApproving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Zatwierdzanie...
                </>
              ) : (
                <>
                  <ThumbsUp className="mr-2 h-5 w-5" />
                  Zatwierdzam ofertę
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="text-center text-xs text-muted-foreground">
        <p>Oferta nr: {token} | Wygenerowano automatycznie przez system GodLike HVAC CRM</p>
        <p className="mt-1">
          Wszystkie ceny są cenami brutto i zawierają podatek VAT.
          Oferta jest ważna do {formatDate(validUntil)}.
        </p>
      </div>
    </div>
  )
}
