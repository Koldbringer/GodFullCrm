import { createRouteClient } from '@/lib/supabase/route';
import { NextResponse } from 'next/server';

// API Route for managing users and roles
// Note: Direct user management (create/delete/update) should ideally use Supabase Admin client
// or Edge Functions for security. This is a simplified example for role management.

export async function GET(request: Request) {
  const supabase = await createRouteClient();

  if (!supabase) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }

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
  const supabase = await createRouteClient();

  if (!supabase) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }

  const { userId, roleId } = await request.json();

  if (!userId || !roleId) {
    return NextResponse.json({ error: 'userId and roleId are required' }, { status: 400 });
  }

  // Assign a role to a user
  const { data, error } = await supabase
    .from('user_roles')
    .insert([{ user_id: userId, role_id: roleId }])
    .select() as any;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const supabase = await createRouteClient();

  if (!supabase) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }

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
    .eq('role_id', roleId) as any;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Role removed successfully' });
}

// Note: Additional user management functions have been removed
// They will be implemented properly in a future update