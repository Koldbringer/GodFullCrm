import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_CONFIG } from '@/lib/supabase/config';

export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  const token = params.token;

  if (!token) {
    return NextResponse.json(
      { error: 'Token is required' },
      { status: 400 }
    );
  }

  try {
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

    // Update the link to set is_active to false
    const { error } = await supabase
      .from('dynamic_links')
      .update({ is_active: false })
      .eq('token', token);

    if (error) {
      console.error("Error deactivating dynamic link:", error);
      return NextResponse.json(
        { error: 'Failed to deactivate link' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in deactivate dynamic link API:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}