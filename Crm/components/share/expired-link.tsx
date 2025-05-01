import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { DynamicLink } from '@/lib/services/dynamic-links';
import { formatDate } from '@/lib/utils';

interface ExpiredLinkProps {
  link: DynamicLink;
}

export function ExpiredLink({ link }: ExpiredLinkProps) {
  const isExpired = new Date() > new Date(link.expires_at);
  const isInactive = !link.is_active;

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-destructive/10 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            {isExpired ? 'Link wygasł' : 'Link nieaktywny'}
          </CardTitle>
          <CardDescription className="text-center">
            {isExpired
              ? `Ten link wygasł ${formatDate(link.expires_at)}.`
              : 'Ten link został dezaktywowany przez nadawcę.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Skontaktuj się z osobą, która udostępniła Ci ten link, aby uzyskać nowy dostęp.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
