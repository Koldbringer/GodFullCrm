import { createClient } from '@/lib/supabase/server'

export default async function AuthDebugPage() {
  const supabase = await createClient()

  // Get the current session
  const { data: { session }, error } = await supabase.auth.getSession()

  // Get all cookies for debugging
  const cookieStore = await import('next/headers').then(mod => mod.cookies())
  const allCookies = cookieStore.getAll()

  // Get environment variables for debugging
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not set',
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'Not set',
    NODE_ENV: process.env.NODE_ENV || 'Not set',
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Session Status</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <h3 className="font-medium text-red-800">Error</h3>
              <p className="text-red-700">{error.message}</p>
            </div>
          )}

          {session ? (
            <div className="space-y-2">
              <p className="text-green-600 font-medium">✅ Authenticated</p>
              <p><strong>User ID:</strong> {session.user.id}</p>
              <p><strong>Email:</strong> {session.user.email}</p>
              <p><strong>Created At:</strong> {new Date(session.user.created_at).toLocaleString()}</p>
              <p><strong>Session Expires:</strong> {new Date(session.expires_at * 1000).toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-red-600 font-medium">❌ Not authenticated</p>
          )}

          <div className="mt-6">
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>

          <div className="space-y-2">
            {Object.entries(envVars).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value}</p>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Cookies</h2>

          {allCookies.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allCookies.map((cookie, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cookie.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cookie.name.includes('token') || cookie.name.includes('auth')
                          ? `${cookie.value.substring(0, 10)}...`
                          : cookie.value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cookie.path || '/'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No cookies found</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <a
          href="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Go to Login Page
        </a>
      </div>
    </div>
  )
}
