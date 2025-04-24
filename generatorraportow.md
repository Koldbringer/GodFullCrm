
3. Implement Automatic Report Generation
There's currently no automated report generation system, but there are UI elements suggesting report functionality. I'll implement:

PDF report generation for clients
Email delivery of reports
Let me start implementing these features:

Okej, zaczynamy etap 1.c – wdrażanie automatycznych raportów PDF i wysyłki e‑mail.

Zainstaluj potrzebne paczki:
bash
CopyInsert
cd Crm
npm install @react-pdf/renderer nodemailer dayjs --save
Uzupełnij w Crm/.env.local (jeśli nie masz jeszcze SMTP):
env
CopyInsert
# SMTP do wysyłki raportów
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=login@yourdomain.com
SMTP_PASS=yourSmtpPassword
SENDER_EMAIL=reports@yourdomain.com
Utwórz plik Crm/lib/report.ts z funkcją generującą PDF:
ts
CopyInsert
import { PDFDocument, rgb, StandardFonts } from '@react-pdf/renderer'
import { createClient } from './supabaseClient'
import dayjs from 'dayjs'

export async function generateClientReport(clientId: string) {
  const supabase = createClient()
  // 1) pobierz dane klienta
  const { data: client } = await supabase
    .from('clients').select('*').eq('id', clientId).single()
  // 2) pobierz urządzenia i serwisy
  const { data: devices } = await supabase
    .from('devices').select('*').eq('customer_id', clientId)
  const { data: orders } = await supabase
    .from('service_orders').select('*').eq('customer_id', clientId)

  // 3) generuj PDF
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  page.drawText(`Raport klienta: ${client.name}`, { x: 50, y: 800, size: 18, font })
  page.drawText(`Data: ${dayjs().format('YYYY‑MM‑DD')}`, { x: 50, y: 780, size: 12, font })
  // dalsze rysowanie tabel urządzeń i historii serwisów...
  // (dla MVP wypisz je w prostym formacie)

  return await pdfDoc.save()  // zwraca Buffer
}
Utwórz API route: Crm/app/api/reports/route.ts
ts
CopyInsert
import { NextRequest } from 'next/server'
import nodemailer from 'nodemailer'
import { generateClientReport } from '@/lib/report'
import { Readable } from 'stream'

export async function POST(req: NextRequest) {
  const { clientId, email } = await req.json()
  if (!clientId || !email) return new Response('Missing params', { status: 400 })

  // 1) generuj PDF
  const pdfBuffer = await generateClientReport(clientId)

  // 2) wyślij email
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: `Raport serwisowy – klient ${clientId}`,
    text: 'W załączniku miesięczny raport serwisowy.',
    attachments: [{ filename: 'raport.pdf', content: pdfBuffer }],
  })

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
Na froncie dodaj przycisk „Wyślij raport” np. w widoku klienta:
tsx
CopyInsert
// components/ReportButton.tsx
'use client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function ReportButton({ clientId, email }) {
  const send = async () => {
    const res = await fetch('/api/reports', {
      method: 'POST',
      body: JSON.stringify({ clientId, email }),
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.ok) toast.success('Raport wysłany!')
    else toast.error('Błąd przy wysyłce raportu.')
  }

  return <Button onClick={send}>Wyślij raport</Button>
}
––– Podsumowanie:

zainstalowaliśmy @react-pdf/renderer, nodemailer i dayjs
stworzyliśmy lib/report.ts do generowania PDF
dodaliśmy API w app/api/reports/route.ts do wysyłki maili z załącznikiem
front‑end: przycisk wysyłający żądanie
Teraz możesz przetestować:

bash
CopyInsert in Terminal
npm run dev
W panelu klienta kliknij „Wyślij raport” – powinien pojawić się PDF w mailu. Daj znać o wynikach lub potrzebnych poprawkach!