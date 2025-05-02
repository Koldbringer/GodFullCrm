import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicLink } from '@/lib/services/dynamic-links';
import { formatDate } from '@/lib/utils';

interface CustomViewProps {
  link: DynamicLink;
}

export function CustomView({ link }: CustomViewProps) {
  // For custom links, we display the metadata if available
  const metadata = link.metadata || {};

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>{link.title}</CardTitle>
          <CardDescription>
            {link.description || 'Niestandardowa zawartość'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Informacje o linku</h3>
              <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                <div>Typ:</div>
                <div>Niestandardowy</div>
                <div>Data utworzenia:</div>
                <div>{formatDate(link.created_at)}</div>
                <div>Wygasa:</div>
                <div>{formatDate(link.expires_at)}</div>
                <div>Liczba wyświetleń:</div>
                <div>{link.access_count}</div>
              </div>
            </div>

            {Object.keys(metadata).length > 0 && (
              <div>
                <h3 className="text-lg font-medium">Dodatkowe informacje</h3>
                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                  {Object.entries(metadata).map(([key, value]) => (
                    <React.Fragment key={key}>
                      <div>{key}:</div>
                      <div>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm text-muted-foreground">
                Ta zawartość jest dostępna poprzez niestandardowy link. Jeśli potrzebujesz więcej informacji, skontaktuj się z osobą, która udostępniła Ci ten link.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
