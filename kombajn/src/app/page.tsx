import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-neutral-900 dark:to-neutral-950 p-8">
      <div className="mb-8 flex flex-col items-center">
        <Image src="/logo-hvac.svg" alt="HVAC Warszawa Logo" width={96} height={96} className="mb-4" />
        <h1 className="text-3xl font-bold mb-2 text-blue-900 dark:text-blue-100 text-center">GodLike HVAC CRM/ERP</h1>
        <p className="text-lg text-blue-800 dark:text-blue-200 text-center max-w-xl">
          Kompleksowy system do zarządzania firmą HVAC – 20 lat doświadczenia w Warszawie. 
          <br />
          <span className="font-semibold">Zarządzaj klientami, zleceniami, urządzeniami, lokalizacjami, magazynem i serwisem – wszystko w jednym miejscu.</span>
        </p>
      </div>
      <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 mb-8 flex flex-col gap-4">
        <h2 className="text-xl font-semibold mb-2">Szybki dostęp</h2>
        <ul className="space-y-2">
          <li>
            <a href="/docs" className="text-blue-700 hover:underline dark:text-blue-300">Dokumentacja i oferty</a>
          </li>
          <li>
            <a href="/docs/oferta-przyklad" className="text-blue-700 hover:underline dark:text-blue-300">Przykładowa oferta 1</a>
          </li>
          <li>
            <a href="/docs/oferta-przyklad-2" className="text-blue-700 hover:underline dark:text-blue-300">Przykładowa oferta 2</a>
          </li>
        </ul>
      </div>
      <div className="text-center text-sm text-blue-900 dark:text-blue-200 opacity-70">
        <p>© {new Date().getFullYear()} GodLike HVAC Warszawa – CRM/ERP dla profesjonalistów</p>
      </div>
    </main>
  );
}
