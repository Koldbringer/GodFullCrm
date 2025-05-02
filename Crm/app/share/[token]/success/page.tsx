import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage({ params }: { params: { token: string } }) {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Formularz wysłany pomyślnie!</CardTitle>
          <CardDescription className="text-center">
            Dziękujemy za wypełnienie formularza. Twoje zgłoszenie zostało przyjęte.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Skontaktujemy się z Tobą wkrótce. Jeśli masz jakiekolwiek pytania, prosimy o kontakt.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">Powrót do strony głównej</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
