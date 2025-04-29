"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";

interface AIPricingAssistantProps {
  onSuggestionsGenerated: (suggestions: {
    products: Array<{ name: string; qty: number; unitPrice: number }>;
    services: Array<{ id: string; name: string; price: number }>;
  }) => void;
  customerName: string;
}

export default function AIPricingAssistant({
  onSuggestionsGenerated,
  customerName,
}: AIPricingAssistantProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSuggestions = async () => {
    if (!prompt.trim()) {
      setError("Proszę wprowadzić opis potrzeb klienta");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/offers/ai-pricing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          customerName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }

      const data = await response.json();
      onSuggestionsGenerated(data);
    } catch (err) {
      console.error("Error generating AI suggestions:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Wystąpił błąd podczas generowania sugestii"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Asystent wyceny AI
        </CardTitle>
        <CardDescription>
          Opisz potrzeby klienta, a AI zaproponuje produkty i usługi z wyceną
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Np. Klient potrzebuje klimatyzacji do mieszkania 60m2 z dwoma pokojami i salonem. Budynek to nowe budownictwo z 2020 roku."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mb-4 min-h-[100px]"
        />
        <div className="flex justify-between items-center">
          <Button
            onClick={handleGenerateSuggestions}
            disabled={loading || !prompt.trim()}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generowanie...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generuj sugestie AI
              </>
            )}
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
}