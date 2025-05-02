/**
 * DEPRECATED: This file is kept for backward compatibility
 * Please use @/lib/supabase instead
 */

import { 
  createClient as createLibClient,
  createServerClient as createLibServerClient,
  createRouteClient as createLibRouteClient
} from '@/lib/supabase'

// Re-export the standardized clients with a deprecation warning
export function createClient() {
  console.warn('DEPRECATED: utils/supabase/client is deprecated. Please use lib/supabase/client instead.')
  return createLibClient()
}

export function createServerClient() {
  console.warn('DEPRECATED: utils/supabase/server is deprecated. Please use lib/supabase/server instead.')
  return createLibServerClient()
}

export function createRouteClient() {
  console.warn('DEPRECATED: utils/supabase/route is deprecated. Please use lib/supabase/route instead.')
  return createLibRouteClient()
}