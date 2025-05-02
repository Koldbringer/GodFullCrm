import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicLink } from '@/lib/services/dynamic-links';
import { formatDate } from '@/lib/utils';

interface InvoiceViewProps {
  link: DynamicLink;
}

export function InvoiceView({ link }: InvoiceViewProps) {
  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>{link.title}</CardTitle>
          <CardDescription>
            {link.description || 'Faktura'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Ta funkcjonalność jest w trakcie implementacji. Wkrótce będzie dostępny pełny podgląd faktury.
            </p>
            
            <div>
              <h3 className="text-lg font-medium">Informacje o linku</h3>
              <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                <div>Typ:</div>
                <div>Faktura</div>
                <div>Data utworzenia:</div>
                <div>{formatDate(link.created_at)}</div>
                <div>Wygasa:</div>
                <div>{formatDate(link.expires_at)}</div>
                <div>Liczba wyświetleń:</div>
                <div>{link.access_count}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
