import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileQuestion className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl text-center">Strona nie znaleziona</CardTitle>
          <CardDescription className="text-center">
            Przepraszamy, nie mogliśmy znaleźć strony, której szukasz.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>
            Strona mogła zostać przeniesiona, usunięta lub adres URL został niepoprawnie wpisany.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">
              Wróć do strony głównej
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
