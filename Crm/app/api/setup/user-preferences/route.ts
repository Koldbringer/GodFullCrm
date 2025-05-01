import { createRouteClient } from '@/lib/supabase/route';
import { NextResponse } from 'next/server';

// This API route sets up the user_preferences table in Supabase
export async function POST(request: Request) {
  try {
    const supabase = await createRouteClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Create the user_preferences table if it doesn't exist
    const { error: tableError } = await supabase.rpc('create_user_preferences_table');

    if (tableError) {
      console.error('Error creating user_preferences table:', tableError);
      return NextResponse.json({ error: tableError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'User preferences table created successfully' });
  } catch (error) {
    console.error('Error in setup route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
