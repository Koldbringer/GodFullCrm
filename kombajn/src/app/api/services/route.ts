import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase URL and anon key or use env variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  // Pobierz usługi z tabeli "services" w Supabase
  const { data, error } = await supabase.from('services').select('*');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
