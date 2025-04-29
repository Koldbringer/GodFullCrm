"use client"

import { AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type StatusBadgeProps = {
  status: string
  size?: "sm" | "md" | "lg"
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const sizeClasses = {
    sm: "text-xs py-0 px-1.5",
    md: "text-xs py-0.5 px-2",
    lg: "text-sm py-1 px-2.5",
  }

  switch (status) {
    case "open":
      return (
        <Badge variant="outline" className={`bg-yellow-50 text-yellow-700 border-yellow-200 ${sizeClasses[size]}`}>
          <AlertCircle className="mr-1 h-3 w-3" /> Otwarte
        </Badge>
      )
    case "in_progress":
      return (
        <Badge variant="outline" className={`bg-blue-50 text-blue-700 border-blue-200 ${sizeClasses[size]}`}>
          <Clock className="mr-1 h-3 w-3" /> W trakcie
        </Badge>
      )
    case "scheduled":
      return (
        <Badge variant="outline" className={`bg-purple-50 text-purple-700 border-purple-200 ${sizeClasses[size]}`}>
          <Clock className="mr-1 h-3 w-3" /> Zaplanowane
        </Badge>
      )
    case "closed":
      return (
        <Badge variant="outline" className={`bg-green-50 text-green-700 border-green-200 ${sizeClasses[size]}`}>
          <CheckCircle2 className="mr-1 h-3 w-3" /> Zamknięte
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className={`bg-gray-50 text-gray-700 border-gray-200 ${sizeClasses[size]}`}>
          {status}
        </Badge>
      )
  }
}
