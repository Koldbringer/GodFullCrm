'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';

// Form schema
const formSchema = z.object({
  title: z.string().min(3, 'Tytuł musi mieć co najmniej 3 znaki'),
  customerId: z.string().optional(),
  customerName: z.string().min(2, 'Nazwa klienta jest wymagana'),
  technicianId: z.string().optional(),
  technicianName: z.string().min(2, 'Nazwa technika jest wymagana'),
  deviceId: z.string().optional(),
  deviceName: z.string().min(2, 'Nazwa urządzenia jest wymagana'),
  location: z.string().min(2, 'Lokalizacja jest wymagana'),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string().optional(),
  scheduledDate: z.date()
});

export default function CreateServiceJobModal({ open, onOpenChange }) {
  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      customerId: '',
      customerName: '',
      technicianId: '',
      technicianName: '',
      deviceId: '',
      deviceName: '',
      location: '',
      status: 'scheduled',
      priority: 'medium',
      description: '',
      scheduledDate: new Date()
    }
  });
  
  // Fetch customers, technicians, and devices when the modal opens
  useEffect(() => {
    if (open) {
      fetchCustomers();
      fetchTechnicians();
      fetchDevices();
    }
  }, [open]);
  
  // Fetch customers
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // This would be replaced with a real API call
      const mockCustomers = [
        { id: '1', name: 'Jan Kowalski' },
        { id: '2', name: 'Anna Nowak' },
        { id: '3', name: 'Firma XYZ Sp. z o.o.' }
      ];
      setCustomers(mockCustomers);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch technicians
  const fetchTechnicians = async () => {
    setLoading(true);
    try {
      // This would be replaced with a real API call
      const mockTechnicians = [
        { id: '1', name: 'Adam Serwisant' },
        { id: '2', name: 'Piotr Technik' },
        { id: '3', name: 'Marek Instalator' }
      ];
      setTechnicians(mockTechnicians);
    } catch (err) {
      console.error('Error fetching technicians:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch devices
  const fetchDevices = async () => {
    setLoading(true);
    try {
      // This would be replaced with a real API call to fetch devices
      const mockDevices = [
        { id: '1', name: 'Klimatyzator Samsung AR09', customer_id: '1' },
        { id: '2', name: 'Pompa ciepła Daikin Altherma', customer_id: '2' },
        { id: '3', name: 'Klimatyzator LG Artcool', customer_id: '3' }
      ];
      setDevices(mockDevices);
    } catch (err) {
      console.error('Error fetching devices:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle customer selection
  const handleCustomerChange = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      form.setValue('customerId', customerId);
      form.setValue('customerName', customer.name);
      
      // Filter devices by customer
      const customerDevices = devices.filter(d => d.customer_id === customerId);
      if (customerDevices.length > 0) {
        form.setValue('deviceId', customerDevices[0].id);
        form.setValue('deviceName', customerDevices[0].name);
      }
    }
  };
  
  // Handle technician selection
  const handleTechnicianChange = (technicianId) => {
    const technician = technicians.find(t => t.id === technicianId);
    if (technician) {
      form.setValue('technicianId', technicianId);
      form.setValue('technicianName', technician.name);
    }
  };
  
  // Handle device selection
  const handleDeviceChange = (deviceId) => {
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      form.setValue('deviceId', deviceId);
      form.setValue('deviceName', device.name);
    }
  };
  
  // Handle form submission
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/service-management/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Error creating service job: ${response.status}`);
      }
      
      // Close the modal and reset the form
      onOpenChange(false);
      form.reset();
      
      // Optionally, you could refresh the jobs list here
    } catch (err) {
      console.error('Error creating service job:', err);
      alert(`Błąd podczas tworzenia zlecenia: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nowe zlecenie serwisowe</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tytuł zlecenia</FormLabel>
                  <FormControl>
                    <Input placeholder="Np. Naprawa klimatyzacji" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Klient</FormLabel>
                    <Select
                      onValueChange={handleCustomerChange}
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz klienta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="technicianId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technik</FormLabel>
                    <Select
                      onValueChange={handleTechnicianChange}
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz technika" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {technicians.map((technician) => (
                          <SelectItem key={technician.id} value={technician.id}>
                            {technician.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="deviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urządzenie</FormLabel>
                    <Select
                      onValueChange={handleDeviceChange}
                      defaultValue={field.value}
                      disabled={loading || !form.getValues('customerId')}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz urządzenie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {devices
                          .filter(device => device.customer_id === form.getValues('customerId'))
                          .map((device) => (
                            <SelectItem key={device.id} value={device.id}>
                              {device.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokalizacja</FormLabel>
                    <FormControl>
                      <Input placeholder="Adres serwisu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scheduled">Zaplanowane</SelectItem>
                        <SelectItem value="in_progress">W trakcie</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priorytet</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz priorytet" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Niski</SelectItem>
                        <SelectItem value="medium">Średni</SelectItem>
                        <SelectItem value="high">Wysoki</SelectItem>
                        <SelectItem value="critical">Krytyczny</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="scheduledDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data zaplanowana</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: pl })
                          ) : (
                            <span>Wybierz datę</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opis</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Opis zlecenia serwisowego"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Anuluj
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Zapisywanie...
                  </>
                ) : (
                  'Utwórz zlecenie'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}