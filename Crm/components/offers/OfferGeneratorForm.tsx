import React, { useState } from "react";
import CustomerAutocomplete from "./CustomerAutocomplete";
import ServiceMultiSelectAutocomplete from "./ServiceMultiSelectAutocomplete";
import AIPricingAssistant from "./AIPricingAssistant";

interface Product {
  name: string;
  qty: number;
  unitPrice: number;
}
interface Service {
  id: string; // Added id for unique identification
  name: string;
  price: number;
}

export default function OfferGeneratorForm() {
  const [client, setClient] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]); // State for selected services
  const [serviceJobs, setServiceJobs] = useState<Service[]>([]);
  const [result, setResult] = useState<string>("");
  const [showLink, setShowLink] = useState(false);
  const [offerFileName, setOfferFileName] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Helpers to add items
  const addProduct = () => setProducts([...products, { name: "", qty: 1, unitPrice: 0 }]);
  const addServiceJob = () => setServiceJobs([...serviceJobs, { id: Date.now().toString(), name: "", price: 0 }]); // Generate unique ID

  // Helpers to update items
  const updateProduct = (i: number, field: keyof Product, value: any) => {
    setProducts(products.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  };
  const updateServiceJob = (i: number, field: keyof Service, value: any) => {
    setServiceJobs(serviceJobs.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };
  
  // Handle AI suggestions
  const handleAISuggestions = (suggestions: {
    products: Array<{ name: string; qty: number; unitPrice: number }>;
    services: Array<{ id: string; name: string; price: number }>;
  }) => {
    // Merge AI suggestions with existing products and services
    setProducts([...products, ...suggestions.products]);
    setSelectedServices([...selectedServices, ...suggestions.services]);
    setShowAIAssistant(false); // Hide the assistant after getting suggestions
  };

  // Generate MDX offer
  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSavedUrl(null);
    const productsTable = products.map(
      p => `| ${p.name} | ${p.qty} | ${p.unitPrice} zł | ${p.qty * p.unitPrice} zł |`
    ).join("\n");
    const servicesTable = selectedServices.map( // Use selectedServices state
      s => `| ${s.name} | ${s.price} zł |`
    ).join("\n");
    const serviceTable = serviceJobs.map(
      s => `| ${s.name} | ${s.price} zł |`
    ).join("\n");
    const materialSum = products.reduce((s, p) => s + (p.qty * p.unitPrice), 0);
    const workSum = selectedServices.reduce((s, p) => s + p.price, 0); // Use selectedServices state
    const serviceSum = serviceJobs.reduce((s, p) => s + p.price, 0);
    const totalSum = materialSum + workSum + serviceSum;
    const safeClient = client.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
    const filename = `oferta-${safeClient}`;
    setOfferFileName(filename);
    const mdx = `---\ntitle: Oferta dla ${client}\ndescription: Oferta na usługi HVAC dla ${client}\n---\n\n# Oferta dla ${client}\n\n## 1. Podsumowanie\n\nOferta przygotowana dla: **${client}**\n\n## 2. Produkty\n\n| Produkt       | Ilość | Cena jedn. netto | Wartość netto |\n|---------------|-------|------------------|---------------|\n${productsTable}\n\n## 3. Wycena prac montażowych\n\n| Usługa        | Cena netto |\n|---------------|------------|\n${servicesTable}\n\n## 4. Serwis\n\n| Usługa serwisowa | Cena netto |\n|------------------|------------|\n${serviceTable}\n\n## 5. Podsumowanie\n\n- Materiał: **${materialSum} zł netto**\n- Robocizna: **${workSum} zł netto**\n- Serwis: **${serviceSum} zł netto**\n\n**Łącznie do zapłaty:** ${totalSum} zł netto\n\n---\nOferta ważna 14 dni. Ceny nie zawierają VAT.\n`;
    setResult(mdx);
    setShowLink(true);
    setSaving(true);
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, content: mdx })
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setSavedUrl(data.url);
      } else {
        setError(data.error || "Błąd zapisu pliku MDX");
      }
    } catch (e) {
      setError("Błąd połączenia z API");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="max-w-2xl mx-auto p-6 bg-white rounded shadow flex flex-col gap-6" onSubmit={handleGenerate}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Generator oferty MDX</h2>
        <button 
          type="button" 
          className="btn btn-sm btn-outline btn-primary flex items-center gap-1"
          onClick={() => setShowAIAssistant(!showAIAssistant)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v4"></path><path d="M18 6l-2.5 2.5"></path><path d="M6 6l2.5 2.5"></path>
            <path d="M3 12h4"></path><path d="M17 12h4"></path><path d="M12 17v4"></path>
            <path d="M18 18l-2.5-2.5"></path><path d="M6 18l2.5-2.5"></path>
          </svg>
          {showAIAssistant ? 'Ukryj asystenta AI' : 'Pokaż asystenta AI'}
        </button>
      </div>
      
      {showAIAssistant && (
        <AIPricingAssistant 
          onSuggestionsGenerated={handleAISuggestions}
          customerName={client}
        />
      )}
      
      <label className="block">
        <span className="font-semibold">Nazwa klienta:</span>
        <CustomerAutocomplete value={client} onChange={setClient} />
      </label>
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Produkty</span>
          <button type="button" className="btn btn-sm btn-primary" onClick={addProduct}>+ Dodaj produkt</button>
        </div>
        {products.map((p, i) => (
          <div key={i} className="flex gap-2 mb-1">
            <input className="input input-sm flex-1" placeholder="Nazwa" value={p.name} onChange={e => updateProduct(i, 'name', e.target.value)} required />
            <input className="input input-sm w-16" type="number" min="1" value={p.qty} onChange={e => updateProduct(i, 'qty', Number(e.target.value))} required />
            <input className="input input-sm w-24" type="number" min="0" value={p.unitPrice} onChange={e => updateProduct(i, 'unitPrice', Number(e.target.value))} required />
          </div>
        ))}
      </div>
      <div> {/* Replaced existing services section */}
        <span className="font-semibold">Prace montażowe (Usługi)</span>
        <ServiceMultiSelectAutocomplete
          selectedServices={selectedServices}
          onServicesChange={setSelectedServices}
        />
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Serwis</span>
          <button type="button" className="btn btn-sm btn-primary" onClick={addServiceJob}>+ Dodaj serwis</button>
        </div>
        {serviceJobs.map((s, i) => (
          <div key={i} className="flex gap-2 mb-1">
            <input className="input input-sm flex-1" placeholder="Usługa serwisowa" value={s.name} onChange={e => updateServiceJob(i, 'name', e.target.value)} required />
            <input className="input input-sm w-24" type="number" min="0" value={s.price} onChange={e => updateServiceJob(i, 'price', Number(e.target.value))} required />
          </div>
        ))}
      </div>
      <button type="submit" className="btn btn-success w-full mt-2" disabled={saving}>{saving ? "Zapisuję..." : "Generuj i zapisz ofertę"}</button>
      {error && <div className="text-red-500">{error}</div>}
      {result && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Wynikowy plik MDX:</h3>
          <textarea className="textarea textarea-bordered w-full h-64" value={result} readOnly />
          {showLink && (
            <div className="mt-3">
              <span className="font-semibold">Dynamiczny link do oferty:</span>
              <div className="mt-1">
                <code className="bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded">
                  {savedUrl ? `${window.location.origin.replace(/\\$/, '')}${savedUrl}` : `${window.location.origin.replace(/\\$/, '')}/docs/${offerFileName}`}
                </code>
                <span className="ml-2 text-xs text-gray-500">(plik MDX zapisany automatycznie)</span>
              </div>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
