"use client";

import React, { useState } from "react";
import CustomerAutocomplete from "./CustomerAutocomplete";
import ServiceMultiSelectAutocomplete from "./ServiceMultiSelectAutocomplete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Copy, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Product {
  name: string;
  qty: number;
  unitPrice: number;
}

interface Service {
  id: string;
  name: string;
  price: number;
}

export default function OfferGeneratorForm() {
  const [client, setClient] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [serviceJobs, setServiceJobs] = useState<Service[]>([]);
  const [result, setResult] = useState<string>("");
  const [showLink, setShowLink] = useState(false);
  const [offerFileName, setOfferFileName] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helpers to add items
  const addProduct = () => setProducts([...products, { name: "", qty: 1, unitPrice: 0 }]);

  const addServiceJob = () => setServiceJobs([
    ...serviceJobs,
    { id: Date.now().toString(), name: "", price: 0 }
  ]);

  // Helpers to update items
  const updateProduct = (i: number, field: keyof Product, value: any) => {
    setProducts(products.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  };

  const removeProduct = (i: number) => {
    setProducts(products.filter((_, idx) => idx !== i));
  };

  const updateServiceJob = (i: number, field: keyof Service, value: any) => {
    setServiceJobs(serviceJobs.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };

  const removeServiceJob = (i: number) => {
    setServiceJobs(serviceJobs.filter((_, idx) => idx !== i));
  };

  // Generate MDX offer
  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSavedUrl(null);

    // Validate form
    if (!client.trim()) {
      setError("Podaj nazwę klienta");
      return;
    }

    if (products.length === 0 && selectedServices.length === 0 && serviceJobs.length === 0) {
      setError("Dodaj przynajmniej jeden produkt lub usługę");
      return;
    }

    // Generate MDX content
    const productsTable = products.map(
      p => `| ${p.name} | ${p.qty} | ${p.unitPrice} zł | ${p.qty * p.unitPrice} zł |`
    ).join("\n");

    const servicesTable = selectedServices.map(
      s => `| ${s.name} | ${s.price} zł |`
    ).join("\n");

    const serviceTable = serviceJobs.map(
      s => `| ${s.name} | ${s.price} zł |`
    ).join("\n");

    const materialSum = products.reduce((s, p) => s + (p.qty * p.unitPrice), 0);
    const workSum = selectedServices.reduce((s, p) => s + p.price, 0);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <form className="max-w-3xl mx-auto space-y-6" onSubmit={handleGenerate}>
      <Card>
        <CardHeader>
          <CardTitle>Generator oferty MDX</CardTitle>
          <CardDescription>
            Stwórz ofertę w formacie MDX, która zostanie zapisana i udostępniona jako dynamiczny link
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="client">Nazwa klienta</Label>
            <CustomerAutocomplete value={client} onChange={setClient} />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Produkty</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addProduct}
              >
                <Plus className="h-4 w-4 mr-1" /> Dodaj produkt
              </Button>
            </div>

            {products.length === 0 ? (
              <div className="text-sm text-muted-foreground py-2">
                Brak produktów. Kliknij "Dodaj produkt" aby dodać.
              </div>
            ) : (
              <div className="space-y-2">
                {products.map((p, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input
                      className="flex-1"
                      placeholder="Nazwa produktu"
                      value={p.name}
                      onChange={e => updateProduct(i, 'name', e.target.value)}
                      required
                    />
                    <Input
                      className="w-20"
                      type="number"
                      min="1"
                      placeholder="Ilość"
                      value={p.qty}
                      onChange={e => updateProduct(i, 'qty', Number(e.target.value))}
                      required
                    />
                    <Input
                      className="w-28"
                      type="number"
                      min="0"
                      placeholder="Cena"
                      value={p.unitPrice}
                      onChange={e => updateProduct(i, 'unitPrice', Number(e.target.value))}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProduct(i)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Prace montażowe (Usługi)</Label>
            <ServiceMultiSelectAutocomplete
              selectedServices={selectedServices}
              onServicesChange={setSelectedServices}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Serwis</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addServiceJob}
              >
                <Plus className="h-4 w-4 mr-1" /> Dodaj serwis
              </Button>
            </div>

            {serviceJobs.length === 0 ? (
              <div className="text-sm text-muted-foreground py-2">
                Brak usług serwisowych. Kliknij "Dodaj serwis" aby dodać.
              </div>
            ) : (
              <div className="space-y-2">
                {serviceJobs.map((s, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input
                      className="flex-1"
                      placeholder="Nazwa usługi serwisowej"
                      value={s.name}
                      onChange={e => updateServiceJob(i, 'name', e.target.value)}
                      required
                    />
                    <Input
                      className="w-28"
                      type="number"
                      min="0"
                      placeholder="Cena"
                      value={s.price}
                      onChange={e => updateServiceJob(i, 'price', Number(e.target.value))}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeServiceJob(i)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Zapisuję...
              </>
            ) : (
              "Generuj i zapisz ofertę"
            )}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Wygenerowana oferta</CardTitle>
            <CardDescription>
              Oferta została wygenerowana w formacie MDX
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="result" className="mb-2 block">Zawartość pliku MDX:</Label>
              <Textarea
                id="result"
                className="font-mono text-sm h-64"
                value={result}
                readOnly
              />
            </div>

            {showLink && (
              <div className="space-y-2">
                <Label className="block">Dynamiczny link do oferty:</Label>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-3 py-2 rounded text-sm flex-1 overflow-x-auto">
                    {savedUrl
                      ? `${window.location.origin.replace(/\\$/, '')}${savedUrl}`
                      : `${window.location.origin.replace(/\\$/, '')}/docs/${offerFileName}`
                    }
                  </code>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(
                      savedUrl
                        ? `${window.location.origin.replace(/\\$/, '')}${savedUrl}`
                        : `${window.location.origin.replace(/\\$/, '')}/docs/${offerFileName}`
                    )}
                    title="Kopiuj link"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(
                      savedUrl
                        ? `${window.location.origin.replace(/\\$/, '')}${savedUrl}`
                        : `${window.location.origin.replace(/\\$/, '')}/docs/${offerFileName}`,
                      '_blank'
                    )}
                    title="Otwórz link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Plik MDX został zapisany automatycznie. Link można udostępnić klientowi.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </form>
  );
}
