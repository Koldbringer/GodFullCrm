// Export only client-safe Supabase clients
// Server client should be imported directly in server components
export { createClient } from './client'
export { createRouteClient } from './route'
