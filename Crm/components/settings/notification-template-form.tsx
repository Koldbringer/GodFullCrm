'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Schema for notification template form validation
const templateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nazwa musi mieć co najmniej 2 znaki"),
  description: z.string().optional(),
  type: z.string().min(1, "Wybierz typ szablonu"),
  subject: z.string().min(2, "Temat musi mieć co najmniej 2 znaki"),
  body: z.string().min(10, "Treść musi mieć co najmniej 10 znaków"),
  variables: z.string().optional(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

interface NotificationTemplateFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<TemplateFormValues>;
}

export function NotificationTemplateForm({ isOpen, onClose, initialData }: NotificationTemplateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData?.id;

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      id: initialData?.id || undefined,
      name: initialData?.name || '',
      description: initialData?.description || '',
      type: initialData?.type || 'email',
      subject: initialData?.subject || '',
      body: initialData?.body || '',
      variables: initialData?.variables || '',
    },
  });

  async function onSubmit(data: TemplateFormValues) {
    try {
      setIsSubmitting(true);
      
      const method = isEditing ? 'PUT' : 'POST';
      const url = '/api/settings/automation';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          type: 'notifications', // This is for the API to know which table to use
        }),
      });

      if (!response.ok) {
        throw new Error('Nie udało się zapisać szablonu powiadomień');
      }

      toast({
        title: 'Sukces',
        description: isEditing 
          ? 'Szablon powiadomień został zaktualizowany' 
          : 'Szablon powiadomień został utworzony',
      });

      onClose();
      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      console.error('Error saving notification template:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się zapisać szablonu powiadomień',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edytuj szablon powiadomień' : 'Nowy szablon powiadomień'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Zaktualizuj szczegóły szablonu powiadomień' 
              : 'Utwórz nowy szablon powiadomień, który będzie używany do wysyłania powiadomień'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa szablonu</FormLabel>
                  <FormControl>
                    <Input placeholder="np. Powiadomienie o nowym zleceniu" {...field} />
                  </FormControl>
                  <FormDescription>
                    Nazwa szablonu używana wewnętrznie w systemie
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opis (opcjonalny)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Krótki opis szablonu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Typ powiadomienia</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz typ powiadomienia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="push">Powiadomienie push</SelectItem>
                      <SelectItem value="system">Powiadomienie systemowe</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Typ powiadomienia określa, w jaki sposób będzie ono dostarczane
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temat</FormLabel>
                  <FormControl>
                    <Input placeholder="np. Nowe zlecenie serwisowe" {...field} />
                  </FormControl>
                  <FormDescription>
                    Temat powiadomienia (dla emaili)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treść</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Treść powiadomienia. Możesz użyć zmiennych w formacie {{zmienna}}" 
                      className="min-h-[150px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Treść powiadomienia. Możesz użyć zmiennych w formacie {{zmienna}}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="variables"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dostępne zmienne (opcjonalne)</FormLabel>
                  <FormControl>
                    <Input placeholder="np. customer_name, order_id, date" {...field} />
                  </FormControl>
                  <FormDescription>
                    Lista dostępnych zmiennych, oddzielonych przecinkami
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Anuluj
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Zapisz zmiany' : 'Utwórz szablon'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
