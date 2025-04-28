import React, { useState } from "react";

// Dummy data, replace with real fetch from CRM DB
const customers = [
  { id: "c1", name: "Jan Kowalski" },
  { id: "c2", name: "Anna Nowak" },
  { id: "c3", name: "Firma ABC Sp. z o.o." },
];

export default function CustomerAutocomplete({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [query, setQuery] = useState("");
  const filtered = customers.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="relative">
      <input
        className="input input-bordered w-full"
        value={query || value}
        onChange={e => {
          setQuery(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Wyszukaj klienta..."
      />
      {query && (
        <ul className="absolute left-0 right-0 bg-white border mt-1 rounded shadow z-10">
          {filtered.map(c => (
            <li
              key={c.id}
              className="px-3 py-1 hover:bg-blue-100 cursor-pointer"
              onClick={() => {
                onChange(c.name);
                setQuery("");
              }}
            >
              {c.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
