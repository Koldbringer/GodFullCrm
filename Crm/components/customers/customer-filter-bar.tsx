"use client"

import { useState, useEffect } from "react"
import { Search, X, Filter, Building2, User, CheckCircle, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

interface CustomerFilterBarProps {
  onFilterChange?: (filters: {
    search: string;
    type: string | null;
    status: string | null;
  }) => void;
  className?: string;
}

export function CustomerFilterBar({ onFilterChange, className = "" }: CustomerFilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Get initial values from URL
  const initialSearch = searchParams.get("search") || ""
  const initialType = searchParams.get("type")
  const initialStatus = searchParams.get("status")
  
  const [search, setSearch] = useState(initialSearch)
  const [type, setType] = useState<string | null>(initialType)
  const [status, setStatus] = useState<string | null>(initialStatus)
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }
    
    if (type) {
      params.set("type", type)
    } else {
      params.delete("type")
    }
    
    if (status) {
      params.set("status", status)
    } else {
      params.delete("status")
    }
    
    // Only update if filters have changed
    if (params.toString() !== searchParams.toString()) {
      router.push(`${pathname}?${params.toString()}`)
    }
    
    // Notify parent component if callback provided
    if (onFilterChange) {
      onFilterChange({ search, type, status })
    }
  }, [search, type, status, router, pathname, searchParams, onFilterChange])
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }
  
  const handleTypeChange = (newType: string | null) => {
    setType(type === newType ? null : newType)
  }
  
  const handleStatusChange = (newStatus: string | null) => {
    setStatus(status === newStatus ? null : newStatus)
  }
  
  const handleClearFilters = () => {
    setSearch("")
    setType(null)
    setStatus(null)
  }
  
  const hasActiveFilters = search !== "" || type !== null || status !== null
  
  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      <div className="flex-1 relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Szukaj klientów..."
          value={search}
          onChange={handleSearchChange}
          className="pl-8"
        />
      </div>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10">
              <Filter className="mr-2 h-4 w-4" />
              Filtruj
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 px-1 py-0 h-5 min-w-5 flex items-center justify-center">
                  {(type ? 1 : 0) + (status ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filtry</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Typ klienta
              </DropdownMenuLabel>
              <DropdownMenuItem 
                className={`flex items-center justify-between ${type === "Biznesowy" ? "bg-primary/10" : ""}`}
                onClick={() => handleTypeChange("Biznesowy")}
              >
                <div className="flex items-center">
                  <Building2 className="mr-2 h-4 w-4" />
                  <span>Biznesowy</span>
                </div>
                {type === "Biznesowy" && <CheckCircle className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`flex items-center justify-between ${type === "Indywidualny" ? "bg-primary/10" : ""}`}
                onClick={() => handleTypeChange("Indywidualny")}
              >
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Indywidualny</span>
                </div>
                {type === "Indywidualny" && <CheckCircle className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Status
              </DropdownMenuLabel>
              <DropdownMenuItem 
                className={`flex items-center justify-between ${status === "Aktywny" ? "bg-primary/10" : ""}`}
                onClick={() => handleStatusChange("Aktywny")}
              >
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span>Aktywny</span>
                </div>
                {status === "Aktywny" && <CheckCircle className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`flex items-center justify-between ${status === "Nieaktywny" ? "bg-primary/10" : ""}`}
                onClick={() => handleStatusChange("Nieaktywny")}
              >
                <div className="flex items-center">
                  <XCircle className="mr-2 h-4 w-4 text-red-500" />
                  <span>Nieaktywny</span>
                </div>
                {status === "Nieaktywny" && <CheckCircle className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              className="flex items-center justify-center text-center"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
            >
              <X className="mr-2 h-4 w-4" />
              <span>Wyczyść filtry</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={handleClearFilters} title="Wyczyść filtry">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
