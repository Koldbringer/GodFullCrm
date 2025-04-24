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

export default function NewCustomerPage() {
  const router = useRouter()
  const { register, handleSubmit, formState:{ errors, isSubmitting } } = useForm<CustomerForm>({ resolver: zodResolver(customerSchema) })

  async function onSubmit(data: CustomerForm) {
    try {
      const res = await fetch('/api/customers', { method: 'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(data) })
      if (!res.ok) throw new Error('Network response was not ok')
      toast.success('Klient dodany')
      router.push('/customers')
    } catch (error) {
      console.error(error)
      toast.error('Nie udało się dodać klienta')
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Nowy klient</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div>
          <Label>Nazwa</Label>
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
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Tworzenie...' : 'Utwórz klienta'}</Button>
      </form>
    </div>
  )
}
