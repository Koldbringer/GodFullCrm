"use client"

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const customerSchema = z.object({
  name: z.string().min(2),
  tax_id: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(7),
  type: z.enum(['Biznesowy','Indywidualny']),
})

type CustomerForm = z.infer<typeof customerSchema>

interface EditCustomerFormProps {
  initialData: CustomerForm & { id: string }
}

export function EditCustomerForm({ initialData }: EditCustomerFormProps) {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: initialData.name,
      tax_id: initialData.tax_id || '',
      email: initialData.email,
      phone: initialData.phone,
      type: initialData.type as 'Biznesowy' | 'Indywidualny',
    }
  })

  async function onSubmit(data: CustomerForm) {
    try {
      const res = await fetch(`/api/customers/${initialData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Network error')
      toast.success('Dane klienta zaktualizowane')
      router.push(`/customers/${initialData.id}`)
    } catch (error) {
      console.error(error)
      toast.error('Aktualizacja nie powiodła się')
    }
  }

  return (
    <div className="p-8 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Edytuj klienta</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Imię i nazwisko / nazwa</Label>
          <Input {...register('name')} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <Label>NIP</Label>
          <Input {...register('tax_id')} />
          {errors.tax_id && <p className="text-red-500 text-sm">{errors.tax_id.message}</p>}
        </div>
        <div>
          <Label>Email</Label>
          <Input {...register('email')} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <Label>Telefon</Label>
          <Input {...register('phone')} />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>
        <div>
          <Label>Typ</Label>
          <select {...register('type')} className="block w-full border rounded p-2">
            <option value="Biznesowy">Biznesowy</option>
            <option value="Indywidualny">Indywidualny</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Aktualizuję...' : 'Zapisz zmiany'}</Button>
      </form>
    </div>
  )
}
