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
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Dziękujemy za zatwierdzenie oferty!</CardTitle>
          <CardDescription>
            Skontaktujemy się z Tobą wkrótce, aby omówić szczegóły realizacji.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Wybrałeś opcję: <span className="font-semibold">{options.find(o => o.id === selectedOption)?.title}</span>
          </p>
          <p className="text-muted-foreground">
            Numer referencyjny: {token}
          </p>
        </CardContent>
      </Card>
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
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-1 md:grid-cols-3 h-auto">
              {options.map(option => (
                <TabsTrigger key={option.id} value={option.id} className="relative py-3">
                  {option.title}
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
                          <Card key={product.id} className="overflow-hidden">
                            <div className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-medium">{product.name}</h4>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {expandedProducts[product.id]
                                      ? product.description
                                      : `${product.description.substring(0, 100)}...`}
                                  </p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="px-0 text-xs"
                                    onClick={() => toggleProductExpand(product.id)}
                                  >
                                    {expandedProducts[product.id] ? (
                                      <>Zwiń <ChevronUp className="ml-1 h-3 w-3" /></>
                                    ) : (
                                      <>Rozwiń <ChevronDown className="ml-1 h-3 w-3" /></>
                                    )}
                                  </Button>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                  <div className="relative h-20 w-20 overflow-hidden rounded-md">
                                    <Image
                                      src={product.image || "/placeholder-product.jpg"}
                                      alt={product.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <p className="text-right font-medium mt-2">
                                    {product.price.toLocaleString()} zł
                                  </p>
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
                                <th className="text-right py-2">Cena</th>
                              </tr>
                            </thead>
                            <tbody>
                              {option.services.map(service => (
                                <tr key={service.id} className="border-b">
                                  <td className="py-2">{service.name}</td>
                                  <td className="text-right py-2">{service.price.toLocaleString()} zł</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Podsumowanie</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Łączna wartość urządzeń:</span>
                            <span>
                              {option.products.reduce((sum, p) => sum + p.price, 0).toLocaleString()} zł
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="font-medium">Łączna wartość usług:</span>
                            <span>
                              {option.services.reduce((sum, s) => sum + s.price, 0).toLocaleString()} zł
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-4 pt-4 border-t text-lg font-bold">
                            <span>Razem:</span>
                            <span>{option.totalPrice.toLocaleString()} zł</span>
                          </div>
                        </CardContent>
                      </Card>
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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Wybierz termin montażu</CardTitle>
            <CardDescription>
              Wybierz preferowany termin montażu z dostępnych opcji
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  {selectedDateId
                    ? `Wybrany termin: ${formatDate(
                        availableDates.find((d) => d.id === selectedDateId)?.date || ""
                      )}`
                    : "Wybierz termin montażu"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
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
                      <h3 className="font-medium mb-2 capitalize">{monthYear}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {dates.map((date) => (
                          <Button
                            key={date.id}
                            variant={selectedDateId === date.id ? "default" : "outline"}
                            className="justify-between"
                            onClick={() => setSelectedDateId(date.id)}
                          >
                            <span>{format(new Date(date.date), "EEEE, d MMMM", { locale: pl })}</span>
                            <Badge variant="secondary" className="ml-2">
                              {date.slots_available} / {date.slots_total}
                            </Badge>
                          </Button>
                        ))}
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
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={handleApprove}
              disabled={isApproving || !selectedOption || !selectedDateId}
              className="w-full sm:w-auto"
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
