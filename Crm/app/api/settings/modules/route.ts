import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// API Route for managing module-specific settings

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const moduleName = searchParams.get('moduleName');

  if (id) {
    const { data, error } = await supabase
      .from('module_settings')
      .select('*')
      .eq('id', id)
      .single() as any;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } else if (moduleName) {
     const { data, error } = await supabase
      .from('module_settings')
      .select('*')
      .eq('module_name', moduleName)
      .single() as any;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  }
  else {
    const { data, error } = await supabase
      .from('module_settings')
      .select('*') as any;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const moduleSettings = await request.json();

  const { data, error } = await supabase
    .from('module_settings')
    .insert([moduleSettings])
    .select() as any;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { id, ...moduleSettings } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'ID is required for PUT operation' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('module_settings')
    .update(moduleSettings)
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
    .from('module_settings')
    .delete()
    .eq('id', id) as any;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Module setting deleted successfully' });
}