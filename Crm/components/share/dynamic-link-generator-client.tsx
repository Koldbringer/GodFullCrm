'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check, Copy, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DynamicLinkType } from '@/lib/services/dynamic-links-client';

const formSchema = z.object({
  linkType: z.string(),
  resourceId: z.string().optional(),
  title: z.string().min(3, { message: 'Tytuł musi mieć co najmniej 3 znaki' }),
  description: z.string().optional(),
  expiresInDays: z.number().min(1).max(365),
  passwordProtected: z.boolean().default(false),
  password: z.string().optional(),
  customSlug: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface DynamicLinkGeneratorProps {
  defaultLinkType?: DynamicLinkType;
  defaultResourceId?: string;
  defaultTitle?: string;
  defaultDescription?: string;
}

export function DynamicLinkGeneratorClient({
  defaultLinkType = 'custom',
  defaultResourceId = '',
  defaultTitle = '',
  defaultDescription = '',
}: DynamicLinkGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      linkType: defaultLinkType,
      resourceId: defaultResourceId,
      title: defaultTitle,
      description: defaultDescription,
      expiresInDays: 14,
      passwordProtected: false,
      password: '',
      customSlug: '',
    },
  });

  const passwordProtected = form.watch('passwordProtected');

  async function onSubmit(data: FormData) {
    setIsGenerating(true);
    try {
      // Use API endpoint instead of direct function call
      const response = await fetch('/api/dynamic-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          linkType: data.linkType,
          resourceId: data.resourceId,
          title: data.title,
          description: data.description,
          expiresInDays: data.expiresInDays,
          password: data.passwordProtected ? data.password : undefined,
          customSlug: data.customSlug,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate link');
      }

      const result = await response.json();
      const fullUrl = `${window.location.origin}${result.url}`;
      setGeneratedUrl(fullUrl);
      toast.success('Link został wygenerowany!');
    } catch (error) {
      console.error('Error generating link:', error);
      toast.error('Wystąpił błąd podczas generowania linku');
    } finally {
      setIsGenerating(false);
    }
  }

  function copyToClipboard() {
    if (!generatedUrl) return;

    navigator.clipboard
      .writeText(generatedUrl)
      .then(() => {
        setIsCopied(true);
        toast.success('Link skopiowany do schowka!');
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        toast.error('Nie udało się skopiować linku');
      });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generator linków</CardTitle>
        <CardDescription>
          Utwórz bezpieczny link do udostępnienia klientowi lub współpracownikowi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="linkType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Typ linku</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz typ linku" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="offer">Oferta</SelectItem>
                        <SelectItem value="contract">Umowa</SelectItem>
                        <SelectItem value="report">Raport</SelectItem>
                        <SelectItem value="invoice">Faktura</SelectItem>
                        <SelectItem value="form">Formularz</SelectItem>
                        <SelectItem value="service_order">Zlecenie serwisowe</SelectItem>
                        <SelectItem value="customer_portal">Portal klienta</SelectItem>
                        <SelectItem value="document">Dokument</SelectItem>
                        <SelectItem value="custom">Niestandardowy</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resourceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID zasobu (opcjonalnie)</FormLabel>
                    <FormControl>
                      <Input placeholder="ID powiązanego zasobu" {...field} />
                    </FormControl>
                    <FormDescription>
                      ID oferty, umowy lub innego zasobu, do którego odnosi się link
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tytuł</FormLabel>
                  <FormControl>
                    <Input placeholder="Tytuł linku" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opis (opcjonalnie)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Opis zawartości linku" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiresInDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ważność (dni)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={365}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customSlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niestandardowy URL (opcjonalnie)</FormLabel>
                    <FormControl>
                      <Input placeholder="np. oferta-dla-klienta" {...field} />
                    </FormControl>
                    <FormDescription>
                      Pozostaw puste, aby wygenerować automatycznie
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="passwordProtected"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Ochrona hasłem</FormLabel>
                    <FormDescription>
                      Wymagaj hasła do otwarcia linku
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

            {passwordProtected && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hasło</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Wprowadź hasło" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" disabled={isGenerating} className="w-full">
              {isGenerating ? 'Generowanie...' : 'Wygeneruj link'}
            </Button>
          </form>
        </Form>

        {generatedUrl && (
          <div className="mt-6 p-4 border rounded-md bg-muted">
            <p className="text-sm font-medium mb-2">Wygenerowany link:</p>
            <div className="flex items-center">
              <Input value={generatedUrl} readOnly className="font-mono text-xs" />
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                onClick={copyToClipboard}
                disabled={isCopied}
              >
                {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Link jest ważny przez {form.getValues().expiresInDays} dni.
              {form.getValues().passwordProtected && ' Link jest chroniony hasłem.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}