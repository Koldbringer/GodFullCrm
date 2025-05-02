'use client'

import Link from 'next/link'

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">GodLike HVAC CRM ERP</h1>
        <div className="bg-white p-8 rounded-lg shadow-lg w-full">
          <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-4">
            <p className="text-red-600">Wystąpił błąd podczas przetwarzania żądania</p>
          </div>
          <p className="text-gray-600 mb-4">
            Przepraszamy, wystąpił problem podczas przetwarzania Twojego żądania. Spróbuj ponownie lub skontaktuj się z administratorem.
          </p>
          <div className="flex space-x-4">
            <Link 
              href="/login"
              className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition text-center"
            >
              Powrót do logowania
            </Link>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
            >
              Odśwież stronę
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
