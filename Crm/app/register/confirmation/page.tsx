"use client";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function RegistrationConfirmationPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">GodLike HVAC CRM ERP</h1>
          <p className="text-gray-600 mt-2">Rejestracja zakończona</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg w-full text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 size={64} className="text-green-500" />
          </div>
          
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Dziękujemy za rejestrację!</h2>
          
          <p className="text-gray-600 mb-6">
            Na Twój adres email wysłaliśmy link aktywacyjny. 
            Kliknij w link, aby potwierdzić swoje konto i uzyskać pełny dostęp do systemu.
          </p>
          
          <p className="text-gray-600 mb-8">
            Jeśli nie otrzymałeś wiadomości, sprawdź folder spam lub skontaktuj się z nami.
          </p>
          
          <Link 
            href="/login" 
            className="inline-block bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          >
            Przejdź do logowania
          </Link>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>© 2024 GodLike HVAC CRM ERP. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </div>
  );
}
