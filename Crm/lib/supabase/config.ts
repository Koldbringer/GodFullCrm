/**
 * Centralized Supabase configuration
 * This file ensures consistent configuration across all Supabase clients
 */

// Load environment variables with fallbacks
export const SUPABASE_CONFIG = {
  // URL for the Supabase project
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://acfyvozuelayjdhmdtky.supabase.co',

  // Anonymous key for the Supabase project
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZnl2b3p1ZWxheWpkaG1kdGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMDQwNTcsImV4cCI6MjA2MDU4MDA1N30.G3S7w0L4pFXDBUtwxBz660MfG0PJt1Esyb2GZf1l_bw',

  // Whether authentication is disabled
  disableAuth: (process.env.NEXT_PUBLIC_DISABLE_SUPABASE_AUTH === 'true' || process.env.DISABLE_SUPABASE_AUTH === 'true'),

  // Cookie name for authentication
  get cookieName(): string {
    // Extract project reference from URL to create consistent cookie name
    const projectRef = this.url.split('//')[1]?.split('.')[0] || 'acfyvozuelayjdhmdtky';
    return `sb-${projectRef}-auth-token`;
  },

  // Cookie options
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  }
};

// Log configuration in development mode
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase Configuration:');
  console.log('URL:', SUPABASE_CONFIG.url ? 'Set' : 'Not set');
  console.log('Anon Key:', SUPABASE_CONFIG.anonKey ? 'Set (length: ' + SUPABASE_CONFIG.anonKey.length + ')' : 'Not set');
  console.log('Disable Auth:', SUPABASE_CONFIG.disableAuth);
  console.log('Cookie Name:', SUPABASE_CONFIG.cookieName);
}
