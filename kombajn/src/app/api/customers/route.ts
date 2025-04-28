import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase URL and anon key or use env variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  // Pobierz klientów z tabeli "customers" w Supabase
  const { data, error } = await supabase.from('customers').select('*');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
