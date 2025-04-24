"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Download, FileText, Filter, MoreVertical, Plus, Search } from "lucide-react"

// Przykładowe dane umów
const contracts = [
  {
    id: "CON-001",
    customer: "Centrum Handlowe Galeria",
    type: "Pełny serwis",
    startDate: "2023-01-15",
    endDate: "2024-01-14",
    value: 12000,
    status: "active",
    nextService: "2023-07-15",
  },
  {
    id: "CON-002",
    customer: "Biurowiec Skyline",
    type: "Przeglądy kwartalne",
    startDate: "2023-03-01",
    endDate: "2025-02-28",
    value: 24000,
    status: "active",
    nextService: "2023-06-01",
  },
  {
    id: "CON-003",
    customer: "Hotel Panorama",
    type: "Gwarancja rozszerzona",
    startDate: "2022-11-10",
    endDate: "2023-11-09",
    value: 8500,
    status: "expiring",
    nextService: "2023-08-10",
  },
  {
    id: "CON-004",
    customer: "Restauracja Smakosz",
    type: "Przeglądy półroczne",
    startDate: "2022-09-15",
    endDate: "2023-09-14",
    value: 4800,
    status: "expiring",
    nextService: "2023-09-15",
  },
  {
    id: "CON-005",
    customer: "Szkoła Podstawowa nr 5",
    type: "Pełny serwis",
    startDate: "2023-04-01",
    endDate: "2026-03-31",
    value: 36000,
    status: "active",
    nextService: "2023-10-01",
  },
]

export function ContractsList() {
  const [searchTerm, setSearchTerm] = useState("")

  // Funkcja do formatowania daty
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pl-PL").format(date)
  }

  // Funkcja do określania koloru statusu
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "expiring":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "expired":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  // Funkcja do tłumaczenia statusu
  const translateStatus = (status: string) => {
    switch (status) {
      case "active":
        return "Aktywna"
      case "expiring":
        return "Wygasająca"
      case "expired":
        return "Wygasła"
      default:
        return status
    }
  }

  // Filtrowanie umów na podstawie wyszukiwania
  const filteredContracts = contracts.filter(
    (contract) =>
      contract.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center space-x-2 sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Szukaj umów..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Wszystkie umowy</DropdownMenuItem>
              <DropdownMenuItem>Aktywne</DropdownMenuItem>
              <DropdownMenuItem>Wygasające</DropdownMenuItem>
              <DropdownMenuItem>Wygasłe</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Eksportuj
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nowa umowa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Dodaj nową umowę serwisową</DialogTitle>
                <DialogDescription>Wprowadź dane nowej umowy serwisowej lub gwarancji</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="customer" className="text-sm font-medium">
                      Klient
                    </label>
                    <Select>
                      <SelectTrigger id="customer">
                        <SelectValue placeholder="Wybierz klienta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client1">Centrum Handlowe Galeria</SelectItem>
                        <SelectItem value="client2">Biurowiec Skyline</SelectItem>
                        <SelectItem value="client3">Hotel Panorama</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="type" className="text-sm font-medium">
                      Typ umowy
                    </label>
                    <Select>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Wybierz typ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Pełny serwis</SelectItem>
                        <SelectItem value="quarterly">Przeglądy kwartalne</SelectItem>
                        <SelectItem value="warranty">Gwarancja rozszerzona</SelectItem>
                        <SelectItem value="biannual">Przeglądy półroczne</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="startDate" className="text-sm font-medium">
                      Data rozpoczęcia
                    </label>
                    <Input type="date" id="startDate" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="endDate" className="text-sm font-medium">
                      Data zakończenia
                    </label>
                    <Input type="date" id="endDate" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="value" className="text-sm font-medium">
                      Wartość umowy (PLN)
                    </label>
                    <Input type="number" id="value" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="nextService" className="text-sm font-medium">
                      Data następnego przeglądu
                    </label>
                    <Input type="date" id="nextService" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Uwagi
                  </label>
                  <textarea
                    id="notes"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    rows={3}
                    placeholder="Dodatkowe informacje o umowie..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Anuluj</Button>
                <Button>Zapisz umowę</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nr umowy</TableHead>
              <TableHead>Klient</TableHead>
              <TableHead>Typ umowy</TableHead>
              <TableHead>Okres obowiązywania</TableHead>
              <TableHead>Wartość (PLN)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Następny przegląd</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContracts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Nie znaleziono umów
                </TableCell>
              </TableRow>
            ) : (
              filteredContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.id}</TableCell>
                  <TableCell>{contract.customer}</TableCell>
                  <TableCell>{contract.type}</TableCell>
                  <TableCell>
                    {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                  </TableCell>
                  <TableCell>{contract.value.toLocaleString("pl-PL")} zł</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(contract.status)}>{translateStatus(contract.status)}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(contract.nextService)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Szczegóły umowy
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          Harmonogram przeglądów
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Pobierz umowę
                        </DropdownMenuItem>
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
