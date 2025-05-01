import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function PrivatePage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data?.user) {
    redirect('/login')
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Strona prywatna</h1>
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-700">
              Witaj, <strong>{data.user.email}</strong>!
            </p>
            <p className="text-blue-600 mt-2 text-sm">
              ID użytkownika: {data.user.id}
            </p>
          </div>
          
          <p className="text-gray-600 mb-6">
            Ta strona jest dostępna tylko dla zalogowanych użytkowników. Jeśli widzisz tę stronę, oznacza to, że jesteś poprawnie zalogowany.
          </p>
          
          <div className="flex space-x-4">
            <Link 
              href="/"
              className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition text-center"
            >
              Strona główna
            </Link>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
              >
                Wyloguj
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
