'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error)
  }, [error])

  return (
    <html lang="pl">
      <body className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">Krytyczny błąd aplikacji</h1>
            <p className="text-center text-muted-foreground mb-6">
              Przepraszamy, wystąpił krytyczny błąd. Spróbuj odświeżyć stronę lub skontaktuj się z administratorem.
            </p>
            <div className="bg-muted p-4 rounded-md text-sm overflow-auto max-h-40 mb-6">
              {error.message || 'Nieznany błąd aplikacji'}
              {error.digest && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <span className="font-mono">Kod błędu: {error.digest}</span>
                </div>
              )}
            </div>
            <Button className="w-full" onClick={reset}>
              Spróbuj ponownie
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
