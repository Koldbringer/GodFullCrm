"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

type Customer = {
  id: string;
  name: string | null;
};

export default function CustomerAutocomplete({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch customers from Supabase
  useEffect(() => {
    const fetchCustomers = async () => {
      if (query.length < 2) return; // Only search if query is at least 2 characters

      setLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('customers')
          .select('id, name')
          .ilike('name', `%${query}%`)
          .order('name')
          .limit(10);

        if (error) throw error;
        setCustomers(data || []);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Nie udało się pobrać listy klientów');
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (query) fetchCustomers();
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [query]);

  const filtered = customers.filter(c =>
    c.name && c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      <Input
        className="w-full"
        value={query || value}
        onChange={e => {
          setQuery(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Wyszukaj klienta..."
      />
      {loading && (
        <div className="absolute right-3 top-3">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
      {query && filtered.length > 0 && (
        <ul className="absolute left-0 right-0 bg-background border mt-1 rounded shadow-md z-10 max-h-60 overflow-auto">
          {filtered.map(c => (
            <li
              key={c.id}
              className="px-3 py-2 hover:bg-muted cursor-pointer transition-colors"
              onClick={() => {
                onChange(c.name || "");
                setQuery("");
              }}
            >
              {c.name}
            </li>
          ))}
        </ul>
      )}
      {query && !loading && filtered.length === 0 && (
        <div className="absolute left-0 right-0 bg-background border mt-1 rounded shadow-md z-10 p-3 text-sm text-muted-foreground">
          Nie znaleziono klientów. Wpisz nazwę nowego klienta.
        </div>
      )}
      {error && (
        <div className="text-sm text-destructive mt-1">
          {error}
        </div>
      )}
    </div>
  );
}
