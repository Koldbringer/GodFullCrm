"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const deviceTypes = [
  { value: "all", label: "Wszystkie typy" },
  { value: "klimatyzator", label: "Klimatyzator" },
  { value: "pompa-ciepla", label: "Pompa ciepła" },
  { value: "rekuperator", label: "Rekuperator" },
]

const deviceStatuses = [
  { value: "all", label: "Wszystkie statusy" },
  { value: "aktywne", label: "Aktywne" },
  { value: "w-naprawie", label: "W naprawie" },
  { value: "nieaktywne", label: "Nieaktywne" },
]

export function DeviceTypeFilter() {
  const [openType, setOpenType] = useState(false)
  const [valueType, setValueType] = useState("all")

  const [openStatus, setOpenStatus] = useState(false)
  const [valueStatus, setValueStatus] = useState("all")

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Typ urządzenia</CardTitle>
          <CardDescription>Filtruj urządzenia według typu</CardDescription>
        </CardHeader>
        <CardContent>
          <Popover open={openType} onOpenChange={setOpenType}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={openType} className="w-full justify-between">
                {valueType === "all" ? "Wszystkie typy" : deviceTypes.find((type) => type.value === valueType)?.label}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Szukaj typu..." />
                <CommandList>
                  <CommandEmpty>Nie znaleziono typu.</CommandEmpty>
                  <CommandGroup>
                    {deviceTypes.map((type) => (
                      <CommandItem
                        key={type.value}
                        value={type.value}
                        onSelect={(currentValue) => {
                          setValueType(currentValue === valueType ? "all" : currentValue)
                          setOpenType(false)
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", valueType === type.value ? "opacity-100" : "opacity-0")} />
                        {type.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Status</CardTitle>
          <CardDescription>Filtruj urządzenia według statusu</CardDescription>
        </CardHeader>
        <CardContent>
          <Popover open={openStatus} onOpenChange={setOpenStatus}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={openStatus} className="w-full justify-between">
                {valueStatus === "all"
                  ? "Wszystkie statusy"
                  : deviceStatuses.find((status) => status.value === valueStatus)?.label}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Szukaj statusu..." />
                <CommandList>
                  <CommandEmpty>Nie znaleziono statusu.</CommandEmpty>
                  <CommandGroup>
                    {deviceStatuses.map((status) => (
                      <CommandItem
                        key={status.value}
                        value={status.value}
                        onSelect={(currentValue) => {
                          setValueStatus(currentValue === valueStatus ? "all" : currentValue)
                          setOpenStatus(false)
                        }}
                      >
                        <Check
                          className={cn("mr-2 h-4 w-4", valueStatus === status.value ? "opacity-100" : "opacity-0")}
                        />
                        {status.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Urządzenia według typu</CardTitle>
          <CardDescription>Podział urządzeń w systemie</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Klimatyzatory</span>
              <span className="font-medium">5</span>
            </div>
            <div className="flex justify-between">
              <span>Pompy ciepła</span>
              <span className="font-medium">3</span>
            </div>
            <div className="flex justify-between">
              <span>Rekuperatory</span>
              <span className="font-medium">2</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Urządzenia według statusu</CardTitle>
          <CardDescription>Status urządzeń w systemie</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Aktywne</span>
              <span className="font-medium">7</span>
            </div>
            <div className="flex justify-between">
              <span>W naprawie</span>
              <span className="font-medium">2</span>
            </div>
            <div className="flex justify-between">
              <span>Nieaktywne</span>
              <span className="font-medium">1</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
