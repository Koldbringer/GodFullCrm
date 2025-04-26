"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Filter, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface MapFiltersProps {
  districts: string[]
  siteTypes: string[]
  currentDistrict?: string
  currentLimit?: number
  currentSiteType?: string
  currentCustomerType?: string
  currentServiceStatus?: string
}

export function MapFilters({
  districts,
  siteTypes,
  currentDistrict = '',
  currentLimit = 100,
  currentSiteType = '',
  currentCustomerType = '',
  currentServiceStatus = ''
}: MapFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Local state for filters
  const [district, setDistrict] = useState(currentDistrict || 'all')
  const [limit, setLimit] = useState(currentLimit.toString())
  const [siteType, setSiteType] = useState(currentSiteType || 'all')
  const [customerType, setCustomerType] = useState(currentCustomerType || 'all')
  const [serviceStatus, setServiceStatus] = useState(currentServiceStatus || 'all')

  // Check if any filters are active
  const hasActiveFilters = !!(currentDistrict || currentSiteType || currentCustomerType || currentServiceStatus || currentLimit !== 100)

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams()

    if (district && district !== 'all') params.set('district', district)
    if (siteType && siteType !== 'all') params.set('siteType', siteType)
    if (customerType && customerType !== 'all') params.set('customerType', customerType)
    if (serviceStatus && serviceStatus !== 'all') params.set('serviceStatus', serviceStatus)
    if (limit && limit !== '100') params.set('limit', limit)

    router.push(`${pathname}?${params.toString()}`)
    setOpen(false)
  }

  // Clear all filters
  const clearFilters = () => {
    setDistrict('all')
    setLimit('100')
    setSiteType('all')
    setCustomerType('all')
    setServiceStatus('all')

    router.push(pathname)
    setOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={hasActiveFilters ? "default" : "outline"} className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtry
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 rounded-full px-1">
                {Object.entries({
                  district: currentDistrict,
                  siteType: currentSiteType,
                  customerType: currentCustomerType,
                  serviceStatus: currentServiceStatus,
                  limit: currentLimit !== 100 ? currentLimit : null
                }).filter(([_, value]) => !!value).length}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filtry mapy</DialogTitle>
            <DialogDescription>
              Dostosuj widok mapy według wybranych kryteriów
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="limit" className="text-right">
                Limit
              </Label>
              <Input
                id="limit"
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="col-span-3"
                min={10}
                max={500}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="district" className="text-right">
                Dzielnica
              </Label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger id="district" className="col-span-3">
                  <SelectValue placeholder="Wszystkie dzielnice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie dzielnice</SelectItem>
                  {districts.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="siteType" className="text-right">
                Typ lokalizacji
              </Label>
              <Select value={siteType} onValueChange={setSiteType}>
                <SelectTrigger id="siteType" className="col-span-3">
                  <SelectValue placeholder="Wszystkie typy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie typy</SelectItem>
                  {siteTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customerType" className="text-right">
                Typ klienta
              </Label>
              <Select value={customerType} onValueChange={setCustomerType}>
                <SelectTrigger id="customerType" className="col-span-3">
                  <SelectValue placeholder="Wszyscy klienci" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszyscy klienci</SelectItem>
                  <SelectItem value="Firma">Firma</SelectItem>
                  <SelectItem value="Osoba prywatna">Osoba prywatna</SelectItem>
                  <SelectItem value="Instytucja">Instytucja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serviceStatus" className="text-right">
                Status zlecenia
              </Label>
              <Select value={serviceStatus} onValueChange={setServiceStatus}>
                <SelectTrigger id="serviceStatus" className="col-span-3">
                  <SelectValue placeholder="Wszystkie statusy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie statusy</SelectItem>
                  <SelectItem value="new">Nowe</SelectItem>
                  <SelectItem value="in_progress">W realizacji</SelectItem>
                  <SelectItem value="completed">Zakończone</SelectItem>
                  <SelectItem value="cancelled">Anulowane</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={clearFilters} type="button">
              <X className="mr-2 h-4 w-4" />
              Wyczyść
            </Button>
            <Button onClick={applyFilters} type="submit">Zastosuj</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
          <X className="h-4 w-4" />
          <span className="sr-only">Wyczyść filtry</span>
        </Button>
      )}
    </div>
  )
}
