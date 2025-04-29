"use client";

import React, { useEffect, useState } from "react";

export default function OffersList() {
  const [offers, setOffers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // For now, we'll just simulate some offers
    const mockOffers = [
      "oferta_klimatyzacja_split.mdx",
      "oferta_pompa_ciepla.mdx",
      "oferta_serwis_roczny.mdx"
    ];
    
    // Simulate API call
    setTimeout(() => {
      setOffers(mockOffers);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded shadow p-4">
      <h2 className="text-lg font-bold mb-2">Lista wygenerowanych ofert</h2>
      
      {loading ? (
        <p className="text-gray-500 italic">Loading offers...</p>
      ) : offers.length > 0 ? (
        <ul className="list-disc pl-6">
          {offers.map(file => (
            <li key={file}>
              <a
                className="text-blue-700 hover:underline dark:text-blue-300"
                href={`/docs/${file.replace(/\.mdx$/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.replace(/_/g, ' ').replace(/\.mdx$/, '')}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No offers generated yet</p>
      )}
    </div>
  );
}