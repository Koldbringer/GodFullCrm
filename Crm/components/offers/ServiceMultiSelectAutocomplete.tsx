import React, { useState, useEffect, useRef } from "react";

interface Service {
  id: string;
  name: string;
  price: number;
}

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
        const res = await fetch(`/api/services?search=${inputValue}`);
        if (!res.ok) {
          throw new Error(`Error fetching services: ${res.statusText}`);
        }
        const data: Service[] = await res.json();
        // Filter out already selected services
        const filteredSuggestions = data.filter(
          (service) =>
            !selectedServices.some(
              (selected) => selected.id === service.id
            )
        );
        setSuggestions(filteredSuggestions);
      } catch (e: any) {
        setError(e.message);
      } finally {
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
      <input
        ref={inputRef}
        type="text"
        className="input input-sm w-full"
        placeholder="Wyszukaj usługi..."
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (suggestions.length > 0 || loading || error) && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto shadow-lg"
        >
          {loading && <div className="p-2 text-sm text-gray-500">Ładowanie...</div>}
          {error && <div className="p-2 text-sm text-red-500">{error}</div>}
          {suggestions.map((service) => (
            <div
              key={service.id}
              className="p-2 text-sm cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectService(service)}
            >
              {service.name} ({service.price} zł)
            </div>
          ))}
        </div>
      )}
      <div className="mt-2 flex flex-wrap gap-1">
        {selectedServices.map((service) => (
          <span
            key={service.id}
            className="badge badge-primary badge-outline gap-2"
          >
            {service.name}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-4 h-4 stroke-current cursor-pointer"
              onClick={() => handleRemoveService(service)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
