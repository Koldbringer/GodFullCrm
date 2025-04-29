"use client"

import { useState } from "react"
import { StatusBadge } from "@/components/atoms/status-badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, ChevronDown } from "lucide-react"

type StatusFilterProps = {
  onStatusChange: (status: string | null) => void
  selectedStatus: string | null
}

export function StatusFilter({ onStatusChange, selectedStatus }: StatusFilterProps) {
  const statuses = [
    { value: "open", label: "Otwarte" },
    { value: "in_progress", label: "W trakcie" },
    { value: "scheduled", label: "Zaplanowane" },
    { value: "closed", label: "Zamknięte" },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          Status
          {selectedStatus && (
            <>
              <span>:</span>
              <StatusBadge status={selectedStatus} size="sm" />
            </>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem onClick={() => onStatusChange(null)}>
          <span className="flex items-center gap-2">
            Wszystkie
            {selectedStatus === null && <Check className="h-4 w-4 ml-auto" />}
          </span>
        </DropdownMenuItem>
        {statuses.map((status) => (
          <DropdownMenuItem key={status.value} onClick={() => onStatusChange(status.value)}>
            <span className="flex items-center gap-2 w-full">
              <StatusBadge status={status.value} size="sm" />
              {selectedStatus === status.value && <Check className="h-4 w-4 ml-auto" />}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
