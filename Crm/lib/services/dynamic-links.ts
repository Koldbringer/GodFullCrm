import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcrypt';

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

export interface CreateDynamicLinkOptions {
  linkType: DynamicLinkType;
  resourceId?: string;
  title: string;
  description?: string;
  createdBy?: string;
  expiresInDays?: number;
  password?: string;
  metadata?: Record<string, any>;
  customSlug?: string;
}

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

/**
 * Creates a new dynamic link
 */
export async function createDynamicLink(options: CreateDynamicLinkOptions): Promise<{ url: string; token: string }> {
  const cookiesInstance = cookies();
  const supabase = await createClient(cookiesInstance);
  const token = options.customSlug || uuidv4();

  // Calculate expiration date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (options.expiresInDays || 14));

  // Hash password if provided
  let passwordHash = null;
  if (options.password) {
    passwordHash = await hash(options.password, 10);
  }

  const { error } = await supabase
    .from('dynamic_links')
    .insert({
      token,
      link_type: options.linkType,
      resource_id: options.resourceId,
      title: options.title,
      description: options.description,
      created_by: options.createdBy,
      expires_at: expiresAt.toISOString(),
      password_protected: !!options.password,
      password_hash: passwordHash,
      metadata: options.metadata,
      custom_slug: options.customSlug
    });

  if (error) {
    console.error("Error creating dynamic link:", error);
    throw error;
  }

  // Return the URL path to access the link
  const urlPath = `/share/${token}`;
  return { url: urlPath, token };
}

/**
 * Gets a dynamic link by token
 */
export async function getDynamicLink(token: string): Promise<DynamicLink | null> {
  const cookiesInstance = cookies();
  const supabase = await createClient(cookiesInstance);

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

/**
 * Verifies a password for a password-protected link
 */
export async function verifyDynamicLinkPassword(token: string, password: string): Promise<boolean> {
  const cookiesInstance = cookies();
  const supabase = await createClient(cookiesInstance);

  const { data, error } = await supabase
    .from('dynamic_links')
    .select('password_hash')
    .eq('token', token)
    .single();

  if (error || !data || !data.password_hash) {
    return false;
  }

  return compare(password, data.password_hash);
}

/**
 * Records an access to a dynamic link
 */
export async function recordDynamicLinkAccess(token: string): Promise<void> {
  const cookiesInstance = cookies();
  const supabase = await createClient(cookiesInstance);

  await supabase.rpc('increment_link_access', {
    link_token: token,
    access_time: new Date().toISOString()
  });
}

/**
 * Deactivates a dynamic link
 */
export async function deactivateDynamicLink(token: string): Promise<void> {
  const cookiesInstance = cookies();
  const supabase = await createClient(cookiesInstance);

  await supabase
    .from('dynamic_links')
    .update({ is_active: false })
    .eq('token', token);
}

/**
 * Gets all dynamic links for a resource
 */
export async function getDynamicLinksForResource(resourceId: string): Promise<DynamicLink[]> {
  const cookiesInstance = cookies();
  const supabase = await createClient(cookiesInstance);

  const { data, error } = await supabase
    .from('dynamic_links')
    .select('*')
    .eq('resource_id', resourceId);

  if (error) {
    console.error("Error fetching dynamic links for resource:", error);
    return [];
  }

  return data as DynamicLink[];
}

/**
 * Gets all dynamic links created by a user
 */
export async function getDynamicLinksByCreator(createdBy: string): Promise<DynamicLink[]> {
  const cookiesInstance = cookies();
  const supabase = await createClient(cookiesInstance);

  const { data, error } = await supabase
    .from('dynamic_links')
    .select('*')
    .eq('created_by', createdBy);

  if (error) {
    console.error("Error fetching dynamic links by creator:", error);
    return [];
  }

  return data as DynamicLink[];
}
