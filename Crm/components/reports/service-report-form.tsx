"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

const checklist = [
  'czyszczenie filtrów jednostek wewnętrznych',
  'czyszczenie i dezynfekcja parowników klimatyzatorów',
  'czyszczenie jednostek zewnętrznych',
  'sprawdzenie parametrów pracy urządzenia',
  'sprawdzenie szczelności instalacji skroplin',
  'sprawdzenie drożności odpływu skroplin',
  'sprawdzenie połączeń elektrycznych',
  'sprawdzenie izolacji cieplnej układów chłodniczych',
  'sprawdzenie temperatury powietrza wylotowego',
  'sprawdzenie elementów konstrukcyjnych',
]

const extraChecklist = [
  'czyszczenie tuby wentylatora',
  'czyszczenie zewnętrznej obudowy',
  'czyszczenie tacki skroplin',
]

const paymentTypes = ['przelew', 'gotówka-pobrano kwotę']

const schema = z.object({
  date: z.string(),
  object: z.string(),
  device: z.string(),
  checklist: z.array(z.string()),
  extraChecklist: z.array(z.string()),
  notes: z.string().optional(),
  worker: z.string(),
  certPersonal: z.string(),
  certCompany: z.string(),
  serviceTime: z.string(),
  customerName: z.string(),
  customerAddress: z.string(),
  customerNip: z.string(),
  customerPhone: z.string(),
  customerEmail: z.string(),
  paymentType: z.string(),
})

type ServiceReportFormType = z.infer<typeof schema>

export function ServiceReportForm({ onSave }: { onSave?: (data: ServiceReportFormType) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<ServiceReportFormType>({
    resolver: zodResolver(schema),
    defaultValues: { checklist: [], extraChecklist: [] }
  })

  const onCheck = (field: 'checklist' | 'extraChecklist', value: string, checked: boolean) => {
    const arr = watch(field) || []
    if (checked) setValue(field, [...arr, value])
    else setValue(field, arr.filter((v: string) => v !== value))
  }

  async function onSubmit(data: ServiceReportFormType) {
    try {
      // TODO: zapisz do bazy
      toast.success('Raport zapisany!')
      onSave?.(data)
    } catch (e) {
      toast.error('Błąd zapisu')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-2">Protokół konserwacji klimatyzacji</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Data</Label>
          <Input type="date" {...register('date')} />
          {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
        </div>
        <div>
          <Label>Obiekt (adres)</Label>
          <Input {...register('object')} />
        </div>
        <div>
          <Label>Urządzenie</Label>
          <Input {...register('device')} />
        </div>
      </div>

      <div>
        <Label>Zakres prac serwisowych</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {checklist.map(item => (
            <label key={item} className="flex items-center gap-2">
              <Checkbox checked={watch('checklist').includes(item)} onCheckedChange={v => onCheck('checklist', item, !!v)} />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label>Dodatkowe czynności</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {extraChecklist.map(item => (
            <label key={item} className="flex items-center gap-2">
              <Checkbox checked={watch('extraChecklist').includes(item)} onCheckedChange={v => onCheck('extraChecklist', item, !!v)} />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label>Zalecenia i uwagi</Label>
        <Textarea {...register('notes')} rows={3} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Prace wykonane przez</Label>
          <Input {...register('worker')} />
        </div>
        <div>
          <Label>Czas usługi</Label>
          <Input {...register('serviceTime')} />
        </div>
        <div>
          <Label>Certyfikat personalny</Label>
          <Input {...register('certPersonal')} />
        </div>
        <div>
          <Label>Certyfikat przedsiębiorcy</Label>
          <Input {...register('certCompany')} />
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <h2 className="font-semibold mb-2">Dane klienta do faktury</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nazwa</Label>
            <Input {...register('customerName')} />
          </div>
          <div>
            <Label>Adres</Label>
            <Input {...register('customerAddress')} />
          </div>
          <div>
            <Label>NIP</Label>
            <Input {...register('customerNip')} />
          </div>
          <div>
            <Label>Telefon</Label>
            <Input {...register('customerPhone')} />
          </div>
          <div>
            <Label>E-mail</Label>
            <Input {...register('customerEmail')} />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Label>Rodzaj płatności za usługę</Label>
        <select {...register('paymentType')} className="block w-full border rounded p-2">
          {paymentTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>

      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Zapisuję...' : 'Zapisz raport'}</Button>
    </form>
  )
}
