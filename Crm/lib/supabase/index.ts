/**
 * Central export file for all Supabase clients
 * This file provides a unified interface for all Supabase clients
 */

// Export client-side Supabase client
export { createClient } from './client'

// Export server-side Supabase client
export { createClient as createServerClient } from './server'

// Export route handler Supabase client
export { createRouteClient } from './route'

// Export any other specialized clients
export { createMapClient } from './map-client'