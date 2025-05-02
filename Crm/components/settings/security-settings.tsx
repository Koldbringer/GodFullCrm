'use client';

import { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, AlertTriangle, Lock, Key } from 'lucide-react';

const securitySettingsSchema = z.object({
  two_factor_auth_enabled: z.boolean().default(false),
  password_policy: z.object({
    min_length: z.number().min(8).max(32),
    require_uppercase: z.boolean(),
    require_lowercase: z.boolean(),
    require_numbers: z.boolean(),
    require_special_chars: z.boolean(),
    password_expiry_days: z.number().min(0).max(365),
  }),
  session_timeout_minutes: z.number().min(5).max(1440),
  ip_restriction_enabled: z.boolean().default(false),
  allowed_ip_addresses: z.string().optional(),
  gdpr_compliance_enabled: z.boolean().default(false),
  data_retention_period_days: z.number().min(30).max(3650),
  vulnerability_scanning_enabled: z.boolean().default(false),
  vulnerability_scanning_schedule: z.enum(['daily', 'weekly', 'monthly']),
});

type SecuritySettingsValues = z.infer<typeof securitySettingsSchema>;

export function SecuritySettings() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SecuritySettingsValues>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      two_factor_auth_enabled: false,
      password_policy: {
        min_length: 8,
        require_uppercase: true,
        require_lowercase: true,
        require_numbers: true,
        require_special_chars: true,
        password_expiry_days: 90,
      },
      session_timeout_minutes: 30,
      ip_restriction_enabled: false,
      allowed_ip_addresses: '',
      gdpr_compliance_enabled: true,
      data_retention_period_days: 365,
      vulnerability_scanning_enabled: false,
      vulnerability_scanning_schedule: 'weekly',
    },
  });

  useEffect(() => {
    async function fetchSecuritySettings() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/settings/security');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            form.reset(data);
          }
        } else {
          toast({
            title: 'Błąd',
            description: 'Nie udało się pobrać ustawień bezpieczeństwa.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error fetching security settings:', error);
        toast({
          title: 'Błąd',
          description: 'Wystąpił problem podczas pobierania ustawień bezpieczeństwa.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchSecuritySettings();
  }, [form]);

  async function onSubmit(data: SecuritySettingsValues) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/settings/security', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: 'Sukces',
          description: 'Ustawienia bezpieczeństwa zostały zaktualizowane.',
        });
      } else {
        const errorData = await response.json();
        toast({
          title: 'Błąd',
          description: `Nie udało się zaktualizować ustawień bezpieczeństwa: ${errorData.error || response.statusText}`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating security settings:', error);
      toast({
        title: 'Błąd',
        description: 'Wystąpił problem podczas aktualizacji ustawień bezpieczeństwa.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Tabs defaultValue="authentication" className="space-y-6">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="authentication">Uwierzytelnianie</TabsTrigger>
        <TabsTrigger value="data-protection">Ochrona danych</TabsTrigger>
        <TabsTrigger value="monitoring">Monitorowanie</TabsTrigger>
      </TabsList>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <TabsContent value="authentication" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5" />
                  Uwierzytelnianie dwuskładnikowe
                </CardTitle>
                <CardDescription>
                  Włącz uwierzytelnianie dwuskładnikowe, aby zwiększyć bezpieczeństwo kont użytkowników.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="two_factor_auth_enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Uwierzytelnianie dwuskładnikowe</FormLabel>
                        <FormDescription>
                          Wymagaj od użytkowników dodatkowego potwierdzenia tożsamości podczas logowania.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="mr-2 h-5 w-5" />
                  Polityka haseł
                </CardTitle>
                <CardDescription>
                  Skonfiguruj wymagania dotyczące haseł użytkowników.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="password_policy.min_length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimalna długość hasła</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Minimalna liczba znaków wymagana w haśle.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password_policy.require_uppercase"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Wielkie litery</FormLabel>
                          <FormDescription>
                            Wymagaj co najmniej jednej wielkiej litery.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password_policy.require_lowercase"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Małe litery</FormLabel>
                          <FormDescription>
                            Wymagaj co najmniej jednej małej litery.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password_policy.require_numbers"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Cyfry</FormLabel>
                          <FormDescription>
                            Wymagaj co najmniej jednej cyfry.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password_policy.require_special_chars"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Znaki specjalne</FormLabel>
                          <FormDescription>
                            Wymagaj co najmniej jednego znaku specjalnego.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="password_policy.password_expiry_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Okres ważności hasła (dni)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Liczba dni, po których użytkownik będzie musiał zmienić hasło. Ustaw 0, aby wyłączyć wygasanie haseł.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="session_timeout_minutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limit czasu sesji (minuty)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Czas bezczynności, po którym sesja użytkownika zostanie automatycznie zakończona.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Ograniczenia IP
                </CardTitle>
                <CardDescription>
                  Ogranicz dostęp do systemu tylko do określonych adresów IP.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="ip_restriction_enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Ograniczenia IP</FormLabel>
                        <FormDescription>
                          Włącz ograniczenia dostępu na podstawie adresów IP.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch('ip_restriction_enabled') && (
                  <FormField
                    control={form.control}
                    name="allowed_ip_addresses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dozwolone adresy IP</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="np. 192.168.1.1, 10.0.0.0/24"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Lista dozwolonych adresów IP lub zakresów CIDR, oddzielonych przecinkami.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data-protection" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Zgodność z RODO
                </CardTitle>
                <CardDescription>
                  Skonfiguruj ustawienia zgodności z przepisami o ochronie danych osobowych.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="gdpr_compliance_enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Zgodność z RODO</FormLabel>
                        <FormDescription>
                          Włącz funkcje zgodności z RODO, takie jak zgody użytkowników i zarządzanie danymi osobowymi.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data_retention_period_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Okres przechowywania danych (dni)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Liczba dni, przez które dane osobowe będą przechowywane przed automatycznym usunięciem lub anonimizacją.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Uwaga</AlertTitle>
              <AlertDescription>
                Upewnij się, że ustawienia zgodności z RODO są zgodne z lokalnymi przepisami o ochronie danych osobowych.
                Skonsultuj się z ekspertem prawnym przed wprowadzeniem zmian.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Skanowanie podatności
                </CardTitle>
                <CardDescription>
                  Skonfiguruj automatyczne skanowanie podatności bezpieczeństwa.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="vulnerability_scanning_enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Skanowanie podatności</FormLabel>
                        <FormDescription>
                          Włącz automatyczne skanowanie podatności bezpieczeństwa.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch('vulnerability_scanning_enabled') && (
                  <FormField
                    control={form.control}
                    name="vulnerability_scanning_schedule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harmonogram skanowania</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Wybierz harmonogram" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">Codziennie</SelectItem>
                            <SelectItem value="weekly">Co tydzień</SelectItem>
                            <SelectItem value="monthly">Co miesiąc</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Częstotliwość automatycznego skanowania podatności.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Zapisywanie...' : 'Zapisz ustawienia'}
          </Button>
        </form>
      </Form>
    </Tabs>
  );
}