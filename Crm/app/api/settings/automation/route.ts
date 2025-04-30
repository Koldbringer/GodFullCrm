import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// API Route for managing automation and notification settings

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const type = searchParams.get('type'); // 'automation', 'notifications', or 'channels'

  if (id) {
    // Fetch a specific setting by ID
    let tableName;
    if (type === 'notifications') {
      tableName = 'notification_templates';
    } else if (type === 'channels') {
      tableName = 'notification_channels';
    } else { // Default to automation settings if type is not specified or is 'automation'
      tableName = 'automation_workflows';
    }

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } else if (type === 'notifications') {
    // Fetch all notification templates
    const { data, error } = await supabase
      .from('notification_templates')
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } else if (type === 'channels') {
    // Fetch all notification channels
    const { data, error } = await supabase
      .from('notification_channels')
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  }
   else { // Default to automation settings if type is not specified or is 'automation'
    // Fetch all automation settings
    const { data, error } = await supabase
      .from('automation_workflows')
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { type, ...settings } = await request.json(); // 'automation', 'notifications', or 'channels'

  if (!type) {
     return NextResponse.json({ error: 'Type (automation, notifications, or channels) is required for POST operation' }, { status: 400 });
  }

  let tableName;
  if (type === 'notifications') {
    tableName = 'notification_templates';
  } else if (type === 'channels') {
    tableName = 'notification_channels';
  } else {
    tableName = 'automation_workflows';
  }

  const { data, error } = await supabase
    .from(tableName)
    .insert([settings])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id, type, ...settings } = await request.json(); // 'automation', 'notifications', or 'channels'

  if (!id || !type) {
    return NextResponse.json({ error: 'ID and Type (automation, notifications, or channels) are required for PUT operation' }, { status: 400 });
  }

  let tableName;
  if (type === 'notifications') {
    tableName = 'notification_templates';
  } else if (type === 'channels') {
    tableName = 'notification_channels';
  } else {
    tableName = 'automation_workflows';
  }

  const { data, error } = await supabase
    .from(tableName)
    .update(settings)
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
  const type = searchParams.get('type'); // 'automation', 'notifications', or 'channels'

  if (!id || !type) {
    return NextResponse.json({ error: 'ID and Type (automation, notifications, or channels) are required for DELETE operation' }, { status: 400 });
  }

  let tableName;
  if (type === 'notifications') {
    tableName = 'notification_templates';
  } else if (type === 'channels') {
    tableName = 'notification_channels';
  } else {
    tableName = 'automation_workflows';
  }

  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Setting deleted successfully' });
}