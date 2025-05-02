import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcrypt';
import { SUPABASE_CONFIG } from '@/lib/supabase/config';

export async function POST(request: Request) {
  try {
    const {
      linkType,
      resourceId,
      title,
      description,
      expiresInDays = 14,
      password,
      customSlug,
      metadata
    } = await request.json();

    if (!linkType || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: linkType and title are required' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const cookieStore = cookies();
    const supabase = createServerClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name, options) {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 });
          }
        }
      }
    );

    // Generate token or use custom slug
    const token = customSlug || uuidv4();

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Hash password if provided
    let passwordHash = null;
    if (password) {
      passwordHash = await hash(password, 10);
    }

    // Insert into database
    const { error } = await supabase
      .from('dynamic_links')
      .insert({
        token,
        link_type: linkType,
        resource_id: resourceId,
        title,
        description,
        expires_at: expiresAt.toISOString(),
        password_protected: !!password,
        password_hash: passwordHash,
        metadata,
        custom_slug: customSlug
      });

    if (error) {
      console.error("Error creating dynamic link:", error);
      return NextResponse.json(
        { error: 'Failed to create dynamic link' },
        { status: 500 }
      );
    }

    // Return the URL path to access the link
    const urlPath = `/share/${token}`;
    return NextResponse.json({ url: urlPath, token });
  } catch (error) {
    console.error("Error in dynamic links API:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}