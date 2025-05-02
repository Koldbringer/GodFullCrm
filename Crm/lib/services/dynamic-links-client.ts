"use client";

import { createBrowserClient } from '@supabase/ssr';
import { v4 as uuidv4 } from 'uuid';
import { SUPABASE_CONFIG } from '@/lib/supabase/config';

export type DynamicLinkType =
  | 'offer'
  | 'contract'
  | 'report'
  | 'invoice'
  | 'form'
  | 'service_order'
  | 'customer_portal'
  | 'document'
  | 'custom';

export interface DynamicLink {
  id: string;
  token: string;
  link_type: DynamicLinkType;
  resource_id: string | null;
  title: string;
  description: string | null;
  created_by: string | null;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  access_count: number;
  last_accessed_at: string | null;
  password_protected: boolean;
  metadata: Record<string, any> | null;
  custom_slug: string | null;
}

// Create a Supabase client for client-side use
const createClient = () => {
  return createBrowserClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey
  );
};

/**
 * Verifies a password for a password-protected link (client-side version)
 * Note: We're using a simple string comparison here instead of bcrypt
 * because bcrypt is not compatible with client-side Next.js
 */
export async function verifyDynamicLinkPassword(token: string, password: string): Promise<boolean> {
  const supabase = createClient();

  // Instead of comparing with bcrypt, we'll send the password to the server for verification
  const { data, error } = await supabase.functions.invoke('verify-link-password', {
    body: { token, password }
  });

  if (error || !data) {
    console.error("Error verifying password:", error);
    return false;
  }

  return data.verified === true;
}

/**
 * Records an access to a dynamic link (client-side version)
 */
export async function recordDynamicLinkAccess(token: string): Promise<void> {
  const supabase = createClient();

  await supabase.rpc('increment_link_access', {
    link_token: token,
    access_time: new Date().toISOString()
  });
}

/**
 * Gets a dynamic link by token (client-side version)
 */
export async function getDynamicLink(token: string): Promise<DynamicLink | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('dynamic_links')
    .select('*')
    .eq('token', token)
    .single();

  if (error || !data) {
    console.error("Error fetching dynamic link:", error);
    return null;
  }

  return data as DynamicLink;
}