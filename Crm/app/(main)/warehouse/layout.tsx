import React from 'react';

export default function WarehouseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Tutaj można dodać specyficzne dla modułu warehouse elementy layoutu, np. nagłówek, nawigację boczną */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}