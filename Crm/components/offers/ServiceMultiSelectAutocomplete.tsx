"use client";

import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Service {
  id: string;
  name: string;
  price: number;
}

// Sample services data - in a real app, this would come from the database
const sampleServices: Service[] = [
  { id: "s1", name: "Montaż klimatyzacji ściennej", price: 800 },
  { id: "s2", name: "Montaż klimatyzacji kanałowej", price: 1500 },
  { id: "s3", name: "Montaż klimatyzacji kasetonowej", price: 1200 },
  { id: "s4", name: "Montaż klimatyzacji przypodłogowej", price: 900 },
  { id: "s5", name: "Montaż klimatyzacji multi-split", price: 2000 },
  { id: "s6", name: "Instalacja rurociągu chłodniczego", price: 150 },
  { id: "s7", name: "Wykonanie odpływu skroplin", price: 100 },
  { id: "s8", name: "Wykonanie przebicia przez ścianę", price: 120 },
  { id: "s9", name: "Montaż sterownika przewodowego", price: 200 },
  { id: "s10", name: "Uruchomienie i test systemu", price: 250 },
];

interface ServiceMultiSelectAutocompleteProps {
  selectedServices: Service[];
  onServicesChange: (services: Service[]) => void;
}

export default function ServiceMultiSelectAutocomplete({
  selectedServices,
  onServicesChange,
}: ServiceMultiSelectAutocompleteProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchServices = async () => {
      if (inputValue.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // In a real implementation, we would fetch from Supabase
        // For now, we'll use the sample data
        const filteredServices = sampleServices.filter(
          service =>
            service.name.toLowerCase().includes(inputValue.toLowerCase()) &&
            !selectedServices.some(selected => selected.id === service.id)
        );

        // Simulate API delay
        setTimeout(() => {
          setSuggestions(filteredServices);
          setLoading(false);
        }, 300);

        /* Uncomment this for real Supabase implementation
        const supabase = createClient();
        const { data, error } = await supabase
          .from('services')
          .select('id, name, price')
          .ilike('name', `%${inputValue}%`)
          .order('name')
          .limit(10);

        if (error) throw error;

        // Filter out already selected services
        const filteredSuggestions = (data || []).filter(
          service => !selectedServices.some(selected => selected.id === service.id)
        );

        setSuggestions(filteredSuggestions);
        */
      } catch (e: any) {
        console.error('Error fetching services:', e);
        setError('Nie udało się pobrać listy usług');
        setSuggestions([]);
        setLoading(false);
      }
    };

    const handler = setTimeout(() => {
      fetchServices();
    }, 300); // Debounce API call

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, selectedServices]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectService = (service: Service) => {
    onServicesChange([...selectedServices, service]);
    setInputValue("");
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleRemoveService = (serviceToRemove: Service) => {
    onServicesChange(
      selectedServices.filter((service) => service.id !== serviceToRemove.id)
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          className="w-full"
          placeholder="Wyszukaj usługi..."
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
        />
        {loading && (
          <div className="absolute right-3 top-3">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {isOpen && (suggestions.length > 0 || loading || error) && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full bg-background border rounded-md mt-1 max-h-60 overflow-y-auto shadow-md"
        >
          {loading && suggestions.length === 0 && (
            <div className="p-3 text-sm text-muted-foreground flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Ładowanie usług...
            </div>
          )}

          {error && (
            <div className="p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {suggestions.map((service) => (
            <div
              key={service.id}
              className="p-3 text-sm cursor-pointer hover:bg-muted transition-colors flex justify-between items-center"
              onClick={() => handleSelectService(service)}
            >
              <span>{service.name}</span>
              <span className="font-medium">{service.price} zł</span>
            </div>
          ))}

          {!loading && suggestions.length === 0 && inputValue.length >= 2 && !error && (
            <div className="p-3 text-sm text-muted-foreground">
              Nie znaleziono usług. Spróbuj innego zapytania.
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {selectedServices.map((service) => (
          <Badge
            key={service.id}
            variant="outline"
            className="py-1.5 px-3 flex items-center gap-1"
          >
            <span className="mr-1">{service.name}</span>
            <span className="font-medium text-xs">{service.price} zł</span>
            <button
              type="button"
              className="ml-1 rounded-full hover:bg-muted p-0.5"
              onClick={() => handleRemoveService(service)}
              aria-label={`Usuń usługę ${service.name}`}
              title={`Usuń usługę ${service.name}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
