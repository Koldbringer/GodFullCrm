import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { WifiOff } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <WifiOff className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <CardTitle className="text-xl text-center">Brak połączenia z internetem</CardTitle>
          <CardDescription className="text-center">
            Nie możemy połączyć się z serwerem. Sprawdź swoje połączenie internetowe.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>
            Niektóre funkcje aplikacji są dostępne offline, ale pełna funkcjonalność wymaga połączenia z internetem.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">
              Spróbuj ponownie
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
