'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-xl text-center">Wystąpił błąd</CardTitle>
          <CardDescription className="text-center">
            Przepraszamy, wystąpił nieoczekiwany błąd podczas przetwarzania żądania.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-3 rounded-md text-sm overflow-auto max-h-32">
            {error.message || 'Nieznany błąd aplikacji'}
            {error.digest && (
              <div className="mt-2 text-xs text-muted-foreground">
                <span className="font-mono">Kod błędu: {error.digest}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={reset}>
            Spróbuj ponownie
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
