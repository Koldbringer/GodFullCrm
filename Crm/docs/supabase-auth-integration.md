# Supabase Authentication Integration

This document explains how authentication is implemented in the CRM/ERP system using Supabase.

## Architecture

The authentication system is built using the following components:

1. **Supabase Clients**:
   - Browser Client: For client-side components
   - Server Client: For server components
   - Route Handler Client: For API routes
   - Middleware Client: For protecting routes

2. **Auth Provider**:
   - Provides authentication state to the entire application
   - Handles auth state changes
   - Provides sign-out functionality

3. **Middleware**:
   - Protects routes from unauthenticated access
   - Redirects to login page when needed

## File Structure

```
lib/
  supabase/
    index.ts       # Exports all clients
    client.ts      # Browser client
    server.ts      # Server component client
    route.ts       # API route client

components/
  providers/
    AuthProvider.tsx  # Auth context provider
    Providers.tsx     # Root providers wrapper

  auth/
    ProtectedRoute.tsx  # Client-side route protection
```

## Usage Examples

### Client Components

```tsx
'use client'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/components/providers/AuthProvider'

export function MyComponent() {
  const { user } = useAuth()
  const supabase = createClient()
  
  // Use supabase client and user...
}
```

### Server Components

```tsx
import { createServerClient } from '@/lib/supabase'

export async function MyServerComponent() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  // Use supabase client and session...
}
```

### API Routes

```tsx
import { createRouteClient } from '@/lib/supabase'

export async function POST(req: Request) {
  const supabase = createRouteClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Handle authenticated request...
}
```

## Authentication Flow

1. User visits login page
2. User enters credentials
3. On successful login, Supabase sets cookies
4. User is redirected to protected page
5. Middleware checks for valid session
6. If session is valid, user can access the page
7. If session is invalid, user is redirected to login

## Row Level Security (RLS)

For enhanced security, implement Row Level Security policies in Supabase:

```sql
-- Example RLS policy for customers table
CREATE POLICY "Users can only view their own customers"
ON customers
FOR SELECT
USING (auth.uid() = user_id);
```

This ensures that even if someone bypasses your application's security, they can only access data they're authorized to see.

## Best Practices

1. Always check for authentication in API routes
2. Use the correct client for each context (browser, server, route)
3. Implement proper error handling for auth failures
4. Use the auth context for client-side auth state
5. Implement Row Level Security in Supabase
6. Never expose sensitive data to unauthenticated users
