import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// API Route for managing external integrations settings

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const { data, error } = await supabase
      .from('external_integrations_settings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } else {
    const { data, error } = await supabase
      .from('external_integrations_settings')
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const integrationSettings = await request.json();

  const { data, error } = await supabase
    .from('external_integrations_settings')
    .insert([integrationSettings])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id, ...integrationSettings } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'ID is required for PUT operation' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('external_integrations_settings')
    .update(integrationSettings)
    .eq('id', id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required for DELETE operation' }, { status: 400 });
  }

  const { error } = await supabase
    .from('external_integrations')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Integration setting deleted successfully' });
}