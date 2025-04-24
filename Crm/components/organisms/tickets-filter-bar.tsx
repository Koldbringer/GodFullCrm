"use client"

import { useState } from "react"
import { StatusFilter } from "@/components/molecules/status-filter"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

type TicketsFilterBarProps = {
  onFilterChange: (filters: { status: string | null; search: string }) => void
}

export function TicketsFilterBar({ onFilterChange }: TicketsFilterBarProps) {
  const [status, setStatus] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const handleStatusChange = (newStatus: string | null) => {
    setStatus(newStatus)
    onFilterChange({ status: newStatus, search })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onFilterChange({ status, search: e.target.value })
  }

  const handleClearFilters = () => {
    setStatus(null)
    setSearch("")
    onFilterChange({ status: null, search: "" })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Szukaj zgłoszeń..."
          value={search}
          onChange={handleSearchChange}
          className="pl-8"
        />
      </div>
      <div className="flex gap-2">
        <StatusFilter onStatusChange={handleStatusChange} selectedStatus={status} />
        
        {(status !== null || search !== "") && (
          <Button variant="ghost" size="icon" onClick={handleClearFilters} title="Wyczyść filtry">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
