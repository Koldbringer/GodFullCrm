'use client';

import { useEffect } from 'react'; // Import useEffect
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const generalSettingsFormSchema = z.object({
  id: z.string().optional(), // Dodaj pole ID, opcjonalne przy tworzeniu
  system_name: z
    .string()
    .min(2, {
      message: 'Nazwa aplikacji musi mieć co najmniej 2 znaki.',
    })
    .max(255, {
      message: 'Nazwa aplikacji nie może przekraczać 255 znaków.',
    }),
  logo_url: z.string().url({ message: "Nieprawidłowy format URL logo." }).optional().or(z.literal('')),
  primary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Nieprawidłowy format koloru HEX.',
  }).optional().or(z.literal('')),
  secondary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Nieprawidłowy format koloru HEX.',
  }).optional().or(z.literal('')),
  default_language: z.string().min(2).max(10, {
    message: 'Kod języka musi mieć od 2 do 10 znaków.'
  }),
  date_format: z.string().min(2).max(50, {
    message: 'Format daty musi mieć od 2 do 50 znaków.'
  }),
  currency_format: z.string().min(1).max(50, {
    message: 'Format waluty musi mieć od 1 do 50 znaków.'
  }),
  decimal_places: z.number().int().min(0).max(10, {
    message: 'Liczba miejsc po przecinku musi być liczbą całkowitą od 0 do 10.'
  }),
  unit_of_measure: z.string().min(1).max(50, {
    message: 'Jednostka miary musi mieć od 1 do 50 znaków.'
  }),
  // Pola związane z bezpieczeństwem - będą zarządzane w sekcji Bezpieczeństwo,
  // ale są częścią tego samego schematu bazy danych. Możemy je tutaj uwzględnić jako opcjonalne
  // lub pominąć i zarządzać tylko przez API bezpieczeństwa. Na razie je pomijam,
  // skupiając się na polach z sekcji Ogólne.
  // two_factor_auth_enabled: z.boolean().optional(),
  // gdpr_compliance_settings: z.any().optional(), // Użyj z.object lub z.record jeśli znasz strukturę
  // vulnerability_scanning_schedule: z.any().optional(), // Użyj z.object lub z.record jeśli znasz strukturę
});

type GeneralSettingsFormValues = z.infer<typeof generalSettingsFormSchema>;

export function GeneralSettingsForm() {
  const form = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsFormSchema),
    // defaultValues będą ładowane z API
    mode: 'onChange',
  });

  // Ładowanie danych z API przy montowaniu komponentu
  useEffect(() => {
    async function fetchSettings() {
      const response = await fetch('/api/settings/app');
      if (response.ok) {
        const data = await response.json();
        // Zakładamy, że API zwraca tablicę, a my potrzebujemy pierwszego elementu
        if (data && data.length > 0) {
          form.reset(data[0]); // Ustawienie domyślnych wartości formularza
        } else {
           // Jeśli brak ustawień w bazie, ustaw wartości domyślne zdefiniowane lokalnie
           form.reset({
             system_name: 'GodLike CRM/ERP',
             logo_url: '',
             primary_color: '#000000',
             secondary_color: '#ffffff',
             default_language: 'pl',
             date_format: 'YYYY-MM-DD',
             currency_format: 'PLN',
             decimal_places: 2,
             unit_of_measure: 'szt.',
           });
        }
      } else {
        toast({
          title: 'Błąd',
          description: 'Nie udało się pobrać ustawień ogólnych.',
          variant: 'destructive',
        });
      }
    }
    fetchSettings();
  }, [form]); // Dodaj form do zależności useEffect

  async function onSubmit(data: GeneralSettingsFormValues) {
    // Sprawdź, czy istnieje ID ustawień (czy aktualizujemy, czy tworzymy)
    const method = data.id ? 'PUT' : 'POST';
    const url = '/api/settings/app';

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const updatedSettings = await response.json();
      // Zaktualizuj ID w formularzu, jeśli tworzono nowe ustawienie
      if (method === 'POST' && updatedSettings && updatedSettings.length > 0) {
         form.setValue('id', updatedSettings[0].id);
      }
      toast({
        title: 'Sukces',
        description: 'Ustawienia ogólne zostały zapisane.',
      });
    } else {
      const errorData = await response.json();
      toast({
        title: 'Błąd',
        description: `Nie udało się zapisać ustawień ogólnych: ${errorData.error || response.statusText}`,
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="system_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa Aplikacji</FormLabel>
              <FormControl>
                <Input placeholder="Nazwa Twojej aplikacji" {...field} />
              </FormControl>
              <FormDescription>
                Nazwa wyświetlana w nagłówku i tytułach.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Logo</FormLabel>
              <FormControl>
                <Input placeholder="https://twoje-logo.png" {...field} />
              </FormControl>
              <FormDescription>
                Adres URL do pliku logo aplikacji.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="primary_color"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Kolor Główny</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormDescription>
                    Główny kolor brandingu aplikacji.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="secondary_color"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Kolor Dodatkowy</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormDescription>
                    Dodatkowy kolor brandingu aplikacji.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
         </div>
         <FormField
          control={form.control}
          name="default_language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domyślny Język</FormLabel>
              <FormControl>
                {/* Tutaj można użyć komponentu Select dla wyboru języka */}
                <Input placeholder="np. pl" {...field} />
              </FormControl>
              <FormDescription>
                Domyślny język interfejsu użytkownika.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_format"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Format Daty</FormLabel>
              <FormControl>
                <Input placeholder="np. YYYY-MM-DD" {...field} />
              </FormControl>
              <FormDescription>
                Domyślny format wyświetlania dat.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="currency_format"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Format Waluty</FormLabel>
              <FormControl>
                <Input placeholder="np. PLN" {...field} />
              </FormControl>
              <FormDescription>
                Domyślny format wyświetlania walut.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="decimal_places"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Miejsca po Przecinku</FormLabel>
              <FormControl>
                <Input type="number" placeholder="np. 2" {...field} onChange={event => field.onChange(+event.target.value)} />
              </FormControl>
              <FormDescription>
                Domyślna liczba miejsc po przecinku dla wartości numerycznych.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="unit_of_measure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jednostka Miary</FormLabel>
              <FormControl>
                <Input placeholder="np. szt." {...field} />
              </FormControl>
              <FormDescription>
                Domyślna jednostka miary dla produktów/usług.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Zapisz zmiany</Button>
      </form>
    </Form>
  );
}