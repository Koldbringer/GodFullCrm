import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// API Route for managing external integrations settings

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const { data, error } = await supabase
      .from('external_integrations_settings')
      .select('*')
      .eq('id', id)
      .single() as any;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } else {
    const { data, error } = await supabase
      .from('external_integrations_settings')
      .select('*') as any;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const integrationSettings = await request.json();

  const { data, error } = await supabase
    .from('external_integrations_settings')
    .insert([integrationSettings])
    .select() as any;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { id, ...integrationSettings } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'ID is required for PUT operation' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('external_integrations_settings')
    .update(integrationSettings)
    .eq('id', id)
    .select() as any;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required for DELETE operation' }, { status: 400 });
  }

  const { error } = await supabase
    .from('external_integrations')
    .delete()
    .eq('id', id) as any;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Integration setting deleted successfully' });
}