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
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Schema for notification channel form validation
const channelSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nazwa musi mieć co najmniej 2 znaki"),
  description: z.string().optional(),
  type: z.string().min(1, "Wybierz typ kanału"),
  config: z.record(z.string(), z.any()).optional(),
  is_active: z.boolean().default(true),
  // Specific fields for different channel types
  smtp_host: z.string().optional(),
  smtp_port: z.string().optional(),
  smtp_username: z.string().optional(),
  smtp_password: z.string().optional(),
  smtp_from_email: z.string().optional(),
  sms_api_key: z.string().optional(),
  sms_sender_id: z.string().optional(),
  webhook_url: z.string().optional(),
});

type ChannelFormValues = z.infer<typeof channelSchema>;

interface NotificationChannelFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<ChannelFormValues>;
}

export function NotificationChannelForm({ isOpen, onClose, initialData }: NotificationChannelFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [channelType, setChannelType] = useState(initialData?.type || 'email');
  const isEditing = !!initialData?.id;

  const form = useForm<ChannelFormValues>({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      id: initialData?.id || undefined,
      name: initialData?.name || '',
      description: initialData?.description || '',
      type: initialData?.type || 'email',
      is_active: initialData?.is_active !== undefined ? initialData.is_active : true,
      // Email specific fields
      smtp_host: initialData?.smtp_host || '',
      smtp_port: initialData?.smtp_port || '587',
      smtp_username: initialData?.smtp_username || '',
      smtp_password: initialData?.smtp_password || '',
      smtp_from_email: initialData?.smtp_from_email || '',
      // SMS specific fields
      sms_api_key: initialData?.sms_api_key || '',
      sms_sender_id: initialData?.sms_sender_id || '',
      // Webhook specific fields
      webhook_url: initialData?.webhook_url || '',
    },
  });

  // Handle channel type change
  const handleChannelTypeChange = (value: string) => {
    setChannelType(value);
    form.setValue('type', value);
  };

  async function onSubmit(data: ChannelFormValues) {
    try {
      setIsSubmitting(true);
      
      // Prepare config object based on channel type
      let config: Record<string, any> = {};
      
      if (data.type === 'email') {
        config = {
          smtp_host: data.smtp_host,
          smtp_port: data.smtp_port,
          smtp_username: data.smtp_username,
          smtp_password: data.smtp_password,
          smtp_from_email: data.smtp_from_email,
        };
      } else if (data.type === 'sms') {
        config = {
          sms_api_key: data.sms_api_key,
          sms_sender_id: data.sms_sender_id,
        };
      } else if (data.type === 'webhook') {
        config = {
          webhook_url: data.webhook_url,
        };
      }
      
      const method = isEditing ? 'PUT' : 'POST';
      const url = '/api/settings/automation';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: data.id,
          name: data.name,
          description: data.description,
          type: data.type,
          config: JSON.stringify(config),
          is_active: data.is_active,
          type_api: 'channels', // This is for the API to know which table to use
        }),
      });

      if (!response.ok) {
        throw new Error('Nie udało się zapisać kanału powiadomień');
      }

      toast({
        title: 'Sukces',
        description: isEditing 
          ? 'Kanał powiadomień został zaktualizowany' 
          : 'Kanał powiadomień został utworzony',
      });

      onClose();
      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      console.error('Error saving notification channel:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się zapisać kanału powiadomień',
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
          <DialogTitle>{isEditing ? 'Edytuj kanał powiadomień' : 'Nowy kanał powiadomień'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Zaktualizuj szczegóły kanału powiadomień' 
              : 'Utwórz nowy kanał powiadomień, który będzie używany do wysyłania powiadomień'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa kanału</FormLabel>
                  <FormControl>
                    <Input placeholder="np. Email firmowy" {...field} />
                  </FormControl>
                  <FormDescription>
                    Nazwa kanału używana wewnętrznie w systemie
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
                    <Textarea placeholder="Krótki opis kanału" {...field} />
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
                  <FormLabel>Typ kanału</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleChannelTypeChange(value);
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz typ kanału" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="email">Email (SMTP)</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="webhook">Webhook</SelectItem>
                      <SelectItem value="push">Powiadomienia push</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Typ kanału określa, w jaki sposób będą dostarczane powiadomienia
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Aktywny</FormLabel>
                    <FormDescription>
                      Określa, czy kanał jest aktywny i może być używany do wysyłania powiadomień
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
            
            {/* Conditional fields based on channel type */}
            {channelType === 'email' && (
              <>
                <FormField
                  control={form.control}
                  name="smtp_host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serwer SMTP</FormLabel>
                      <FormControl>
                        <Input placeholder="np. smtp.gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="smtp_port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Port SMTP</FormLabel>
                      <FormControl>
                        <Input placeholder="np. 587" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="smtp_username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nazwa użytkownika SMTP</FormLabel>
                      <FormControl>
                        <Input placeholder="np. user@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="smtp_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hasło SMTP</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Hasło" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="smtp_from_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adres nadawcy</FormLabel>
                      <FormControl>
                        <Input placeholder="np. noreply@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {channelType === 'sms' && (
              <>
                <FormField
                  control={form.control}
                  name="sms_api_key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Klucz API</FormLabel>
                      <FormControl>
                        <Input placeholder="Klucz API dostawcy SMS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sms_sender_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID nadawcy</FormLabel>
                      <FormControl>
                        <Input placeholder="np. GodLikeCRM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {channelType === 'webhook' && (
              <FormField
                control={form.control}
                name="webhook_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Webhooka</FormLabel>
                    <FormControl>
                      <Input placeholder="np. https://example.com/webhook" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Anuluj
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Zapisz zmiany' : 'Utwórz kanał'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
