import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AuthTestPage() {
  const supabase = await createClient()
  
  // Get the current session
  const { data: { session }, error } = await supabase.auth.getSession()
  
  // If there's an error or no session, redirect to login
  if (error || !session) {
    return redirect('/login?redirectTo=/auth-test')
  }
  
  // If we have a session, display the user info
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Test Page</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Current User</h2>
        
        <div className="space-y-2">
          <p><strong>User ID:</strong> {session.user.id}</p>
          <p><strong>Email:</strong> {session.user.email}</p>
          <p><strong>Created At:</strong> {new Date(session.user.created_at).toLocaleString()}</p>
          <p><strong>Session Expires:</strong> {new Date(session.expires_at * 1000).toLocaleString()}</p>
        </div>
        
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
    </div>
  )
}
