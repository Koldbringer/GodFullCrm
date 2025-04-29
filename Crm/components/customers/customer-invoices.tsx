"use client"

import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { ArrowDownToLine, Check, Clock, FileText, MoreHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

// Przykładowe dane faktur
const invoicesData = [
  {
    id: "INV123",
    customer_id: "c1",
    number: "FV/2023/123",
    date: "2023-10-16T14:00:00Z",
    due_date: "2023-10-30T23:59:59Z",
    amount: 350,
    tax: 80.5,
    total: 430.5,
    status: "paid",
    payment_date: "2023-10-20T10:15:00Z",
    payment_method: "przelew",
    items: [
      {
        name: "Przegląd klimatyzacji",
        quantity: 1,
        unit_price: 350,
        tax_rate: 23,
        total: 430.5,
      },
    ],
    related_service: "SH001",
    notes: "Faktura za przegląd klimatyzacji w biurze głównym.",
  },
  {
    id: "INV098",
    customer_id: "c1",
    number: "FV/2023/098",
    date: "2023-07-20T15:30:00Z",
    due_date: "2023-08-03T23:59:59Z",
    amount: 120,
    tax: 27.6,
    total: 147.6,
    status: "paid",
    payment_date: "2023-07-25T09:45:00Z",
    payment_method: "przelew",
    items: [
      {
        name: "Naprawa pilota",
        quantity: 1,
        unit_price: 100,
        tax_rate: 23,
        total: 123,
      },
      {
        name: "Baterie AAA",
        quantity: 2,
        unit_price: 10,
        tax_rate: 23,
        total: 24.6,
      },
    ],
    related_service: "SH002",
    notes: "Faktura za naprawę pilota i wymianę baterii.",
  },
  {
    id: "INV087",
    customer_id: "c1",
    number: "FV/2023/087",
    date: "2023-06-05T16:00:00Z",
    due_date: "2023-06-19T23:59:59Z",
    amount: 1200,
    tax: 276,
    total: 1476,
    status: "paid",
    payment_date: "2023-06-15T14:20:00Z",
    payment_method: "przelew",
    items: [
      {
        name: "Instalacja klimatyzatora",
        quantity: 1,
        unit_price: 800,
        tax_rate: 23,
        total: 984,
      },
      {
        name: "Materiały montażowe",
        quantity: 1,
        unit_price: 400,
        tax_rate: 23,
        total: 492,
      },
    ],
    related_service: "SH003",
    notes: "Faktura za instalację klimatyzatora w sali konferencyjnej.",
  },
  {
    id: "INV145",
    customer_id: "c1",
    number: "FV/2023/145",
    date: "2023-11-05T12:00:00Z",
    due_date: "2023-11-19T23:59:59Z",
    amount: 450,
    tax: 103.5,
    total: 553.5,
    status: "pending",
    payment_date: null,
    payment_method: null,
    items: [
      {
        name: "Naprawa wentylatora",
        quantity: 1,
        unit_price: 300,
        tax_rate: 23,
        total: 369,
      },
      {
        name: "Części zamienne",
        quantity: 1,
        unit_price: 150,
        tax_rate: 23,
        total: 184.5,
      },
    ],
    related_service: "SH004",
    notes: "Faktura za naprawę wentylatora w rekuperatorze.",
  },
]

interface CustomerInvoicesProps {
  customerId: string
}

export function CustomerInvoices({ customerId }: CustomerInvoicesProps) {
  // Filtrowanie faktur dla danego klienta
  const customerInvoices = invoicesData.filter((invoice) => invoice.customer_id === customerId)

  // Obliczanie statystyk
  const totalInvoices = customerInvoices.length
  const totalAmount = customerInvoices.reduce((sum, invoice) => sum + invoice.total, 0)
  const paidInvoices = customerInvoices.filter((invoice) => invoice.status === "paid")
  const paidAmount = paidInvoices.reduce((sum, invoice) => sum + invoice.total, 0)
  const pendingInvoices = customerInvoices.filter((invoice) => invoice.status === "pending")
  const pendingAmount = pendingInvoices.reduce((sum, invoice) => sum + invoice.total, 0)

  // Funkcja do określania statusu faktury
  const getInvoiceStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <Check className="mr-1 h-3 w-3" />
            Opłacona
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="mr-1 h-3 w-3" />
            Oczekująca
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            <X className="mr-1 h-3 w-3" />
            Zaległa
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-2">
              <span className="text-sm text-muted-foreground">Łączna wartość faktur</span>
              <span className="text-2xl font-bold">{totalAmount.toLocaleString()} zł</span>
              <div className="flex justify-between text-sm">
                <span>Liczba faktur:</span>
                <span>{totalInvoices}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-2">
              <span className="text-sm text-muted-foreground">Opłacone faktury</span>
              <span className="text-2xl font-bold">{paidAmount.toLocaleString()} zł</span>
              <div className="flex justify-between text-sm">
                <span>Liczba opłaconych:</span>
                <span>{paidInvoices.length}</span>
              </div>
              <Progress value={(paidAmount / totalAmount) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-2">
              <span className="text-sm text-muted-foreground">Oczekujące płatności</span>
              <span className="text-2xl font-bold">{pendingAmount.toLocaleString()} zł</span>
              <div className="flex justify-between text-sm">
                <span>Liczba oczekujących:</span>
                <span>{pendingInvoices.length}</span>
              </div>
              <Progress value={(pendingAmount / totalAmount) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numer</TableHead>
              <TableHead>Data wystawienia</TableHead>
              <TableHead>Termin płatności</TableHead>
              <TableHead>Kwota</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data płatności</TableHead>
              <TableHead>Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Brak faktur dla tego klienta.
                </TableCell>
              </TableRow>
            ) : (
              customerInvoices
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell>{format(new Date(invoice.date), "d MMM yyyy", { locale: pl })}</TableCell>
                    <TableCell>{format(new Date(invoice.due_date), "d MMM yyyy", { locale: pl })}</TableCell>
                    <TableCell>{invoice.total.toLocaleString()} zł</TableCell>
                    <TableCell>{getInvoiceStatusBadge(invoice.status)}</TableCell>
                    <TableCell>
                      {invoice.payment_date
                        ? format(new Date(invoice.payment_date), "d MMM yyyy", { locale: pl })
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Otwórz menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(invoice.id)}>
                            Kopiuj ID
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Podgląd faktury
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ArrowDownToLine className="mr-2 h-4 w-4" />
                            Pobierz PDF
                          </DropdownMenuItem>
                          {invoice.status === "pending" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Oznacz jako opłacona</DropdownMenuItem>
                              <DropdownMenuItem>Wyślij przypomnienie</DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
