'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DynamicLink } from '@/lib/services/dynamic-links';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface FormViewProps {
  link: DynamicLink;
}

export function FormView({ link }: FormViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const router = useRouter();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const supabase = createClient();
      
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }
      
      // Save form submission
      const { error } = await supabase.from('form_submissions').insert({
        link_id: link.id,
        form_data: formData,
        submitted_at: new Date().toISOString(),
      });
      
      if (error) throw error;
      
      toast.success('Formularz został wysłany pomyślnie!');
      
      // Show success message and reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
      
      // Redirect to success page
      router.push(`/share/${link.token}/success`);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Wystąpił błąd podczas wysyłania formularza');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>{link.title}</CardTitle>
          <CardDescription>
            {link.description || 'Wypełnij poniższy formularz'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Imię i nazwisko</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Adres e-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Numer telefonu</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Wiadomość</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Wysyłanie...' : 'Wyślij formularz'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
