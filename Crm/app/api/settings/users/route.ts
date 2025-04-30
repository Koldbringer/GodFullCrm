import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// API Route for managing users and roles
// Note: Direct user management (create/delete/update) should ideally use Supabase Admin client
// or Edge Functions for security. This is a simplified example for role management.

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (userId) {
    // Get roles for a specific user
    const { data, error } = await supabase
      .from('user_roles')
      .select('*, roles(name)')
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } else {
    // Get all roles
    const { data, error } = await supabase
      .from('roles')
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { userId, roleId } = await request.json();

  if (!userId || !roleId) {
    return NextResponse.json({ error: 'userId and roleId are required' }, { status: 400 });
  }

  // Assign a role to a user
  const { data, error } = await supabase
    .from('user_roles')
    .insert([{ user_id: userId, role_id: roleId }])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const roleId = searchParams.get('roleId');

  if (!userId || !roleId) {
    return NextResponse.json({ error: 'userId and roleId are required' }, { status: 400 });
  }

  // Remove a role from a user
  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId)
    .eq('role_id', roleId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Role removed successfully' });
}

// Note: PUT operation for roles would typically involve updating role permissions,
// which is not covered in this simplified example.

export async function GET_LOGS(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 100;
  const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset') as string) : 0;

  let query = supabase
    .from('user_activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST_ROLE(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const role = await request.json();

  const { data, error } = await supabase
    .from('user_roles')
    .insert([role])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function GET_ROLE(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get('roleId');

  if (!roleId) {
    return NextResponse.json({ error: 'roleId is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .eq('id', roleId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT_ROLE(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id, ...role } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'ID is required for PUT operation' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('user_roles')
    .update(role)
    .eq('id', id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE_ROLE(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get('roleId');

  if (!roleId) {
    return NextResponse.json({ error: 'roleId is required for DELETE operation' }, { status: 400 });
  }

  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('id', roleId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Role deleted successfully' });
}