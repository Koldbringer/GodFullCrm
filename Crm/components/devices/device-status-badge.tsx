import { Badge } from "@/components/ui/badge"

interface DeviceStatusBadgeProps {
  status: string
}

export function DeviceStatusBadge({ status }: DeviceStatusBadgeProps) {
  let variant: "default" | "outline" | "secondary" | "destructive" = "default"

  switch (status) {
    case "Aktywne":
      variant = "default"
      break
    case "W naprawie":
      variant = "outline"
      break
    case "Nieaktywne":
      variant = "secondary"
      break
  }

  return <Badge variant={variant}>{status}</Badge>
}
