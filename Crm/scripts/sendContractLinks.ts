import nodemailer from 'nodemailer';
import { createServerClient } from '../lib/supabase';

// KONFIGURACJA SMTP HOME.PL
const transporter = nodemailer.createTransport({
  host: 'smtp.home.pl',
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER, // ustaw w .env.local
    pass: process.env.SMTP_PASS
  }
});

async function main() {
  const supabase = await createServerClient();
  if (!supabase) {
    console.error('Failed to create Supabase client');
    return;
  }
  // Pobierz kontrakty wymagające powiadomienia (np. kończące się w ciągu 7 dni)
  const { data: contracts, error } = await supabase
    .from('contracts')
    .select('id, client_email, client_name, status, end_date')
    .gte('end_date', new Date().toISOString().slice(0, 10))
    .lte('end_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));

  if (error) {
    console.error('Błąd pobierania kontraktów:', error);
    return;
  }
  if (!contracts || contracts.length === 0) {
    console.log('Brak kontraktów do powiadomienia.');
    return;
  }

  for (const contract of contracts) {
    if (!contract.client_email) continue;
    const link = `https://twoja-domena.pl/contracts/${contract.id}`;
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: contract.client_email,
      subject: `Przypomnienie o kończącej się umowie #${contract.id}`,
      html: `<p>Dzień dobry ${contract.client_name || ''},</p>
        <p>Twoja umowa <b>#${contract.id}</b> wygasa dnia <b>${contract.end_date}</b>.</p>
        <p>Możesz zobaczyć szczegóły i status umowy pod tym linkiem:<br/>
        <a href="${link}">${link}</a></p>
        <p>Pozdrawiamy,<br/>Zespół GodLike CRM</p>`
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Wysłano e-mail do ${contract.client_email}`);
    } catch (err) {
      console.error(`Błąd wysyłki do ${contract.client_email}:`, err);
    }
  }
}

main();
