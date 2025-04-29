import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function RecentOrders() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Adam Bielecki</p>
          <p className="text-sm text-muted-foreground">Naprawa klimatyzacji</p>
        </div>
        <div className="ml-auto font-medium">
          <Badge>W trakcie</Badge>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
          <AvatarFallback>CD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Celina Dąbrowska</p>
          <p className="text-sm text-muted-foreground">Instalacja pompy ciepła</p>
        </div>
        <div className="ml-auto font-medium">
          <Badge variant="outline">Zaplanowane</Badge>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
          <AvatarFallback>EF</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Edward Fajkowski</p>
          <p className="text-sm text-muted-foreground">Przegląd okresowy</p>
        </div>
        <div className="ml-auto font-medium">
          <Badge variant="secondary">Zakończone</Badge>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
          <AvatarFallback>GH</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Grażyna Hołownia</p>
          <p className="text-sm text-muted-foreground">Wymiana filtrów</p>
        </div>
        <div className="ml-auto font-medium">
          <Badge variant="secondary">Zakończone</Badge>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
          <AvatarFallback>IJ</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Irena Jastrzębska</p>
          <p className="text-sm text-muted-foreground">Konserwacja rekuperatora</p>
        </div>
        <div className="ml-auto font-medium">
          <Badge>W trakcie</Badge>
        </div>
      </div>
    </div>
  )
}
