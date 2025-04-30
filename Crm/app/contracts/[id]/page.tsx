import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // Optionally fetch contract info for SEO
  return {
    title: `Szczegóły umowy #${params.id}`,
    description: 'Podgląd szczegółów umowy i statusów.'
  };
}

export default async function ContractPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const { data: contract, error } = await supabase
    .from('contracts')
    .select('*, tickets(*), attachments(*)')
    .eq('id', params.id)
    .single();

  if (error || !contract) {
    return notFound();
  }

  // Helper for copying link
  async function copyLink() {
    if (typeof window !== 'undefined') {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link skopiowany do schowka!');
    }
  }

  return (
    <main className="max-w-2xl mx-auto py-8 px-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Umowa #{contract.id}</h1>
        <button
          onClick={copyLink}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Kopiuj link
        </button>
      </div>
      <section className="mb-6">
        <div className="mb-2">Status: <span className="font-semibold">{contract.status}</span></div>
        <div className="mb-2">Klient: <span className="font-semibold">{contract.client_name}</span></div>
        <div className="mb-2">Data rozpoczęcia: <span className="font-semibold">{contract.start_date}</span></div>
        <div className="mb-2">Data zakończenia: <span className="font-semibold">{contract.end_date}</span></div>
        <div className="mb-2">Opis: <span className="font-semibold">{contract.description}</span></div>
      </section>
      {contract.attachments && contract.attachments.length > 0 && (
        <section className="mb-6">
          <h2 className="font-semibold mb-2">Załączniki</h2>
          <ul className="list-disc pl-5">
            {contract.attachments.map((att: any) => (
              <li key={att.id}>
                <a href={att.url} target="_blank" rel="noopener" className="text-blue-600 underline">{att.name}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
      {contract.tickets && contract.tickets.length > 0 && (
        <section>
          <h2 className="font-semibold mb-2">Powiązane zgłoszenia</h2>
          <ul className="divide-y">
            {contract.tickets.map((ticket: any) => (
              <li key={ticket.id} className="py-2">
                <Link href={`/tickets/${ticket.id}`} className="text-blue-700 hover:underline">
                  [{ticket.status}] {ticket.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
