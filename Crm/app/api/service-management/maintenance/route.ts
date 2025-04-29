import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get('deviceId');
  const frequency = searchParams.get('frequency');
  const upcoming = searchParams.get('upcoming') === 'true';
  const overdue = searchParams.get('overdue') === 'true';
  
  try {
    const supabase = createClient();
    
    let query = supabase
      .from('maintenance_schedules')
      .select(`
        *,
        devices(*)
      `);
    
    // Apply filters if provided
    if (deviceId) {
      query = query.eq('device_id', deviceId);
    }
    
    if (frequency) {
      query = query.eq('frequency', frequency);
    }
    
    if (upcoming) {
      // Get maintenance due in the next 30 days
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      
      query = query
        .gte('next_maintenance_date', today.toISOString())
        .lte('next_maintenance_date', thirtyDaysFromNow.toISOString());
    }
    
    if (overdue) {
      // Get overdue maintenance
      const today = new Date();
      query = query.lt('next_maintenance_date', today.toISOString());
    }
    
    // Order by next maintenance date
    query = query.order('next_maintenance_date', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching maintenance schedules:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in maintenance schedules API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      deviceId,
      frequency,
      lastMaintenanceDate,
      nextMaintenanceDate,
      maintenanceType,
      description
    } = body;
    
    // Validate required fields
    if (!deviceId || !frequency || !nextMaintenanceDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('maintenance_schedules')
      .insert([
        {
          device_id: deviceId,
          frequency,
          last_maintenance_date: lastMaintenanceDate,
          next_maintenance_date: nextMaintenanceDate,
          maintenance_type: maintenanceType || 'regular',
          description
        }
      ])
      .select();
    
    if (error) {
      console.error('Error creating maintenance schedule:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data[0]);
  } catch (error: any) {
    console.error('Error in maintenance schedules API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Maintenance schedule ID is required' },
        { status: 400 }
      );
    }
    
    const supabase = createClient();
    
    // Convert camelCase to snake_case for database fields
    const dbUpdateData: any = {};
    if (updateData.deviceId !== undefined) dbUpdateData.device_id = updateData.deviceId;
    if (updateData.frequency !== undefined) dbUpdateData.frequency = updateData.frequency;
    if (updateData.lastMaintenanceDate !== undefined) dbUpdateData.last_maintenance_date = updateData.lastMaintenanceDate;
    if (updateData.nextMaintenanceDate !== undefined) dbUpdateData.next_maintenance_date = updateData.nextMaintenanceDate;
    if (updateData.maintenanceType !== undefined) dbUpdateData.maintenance_type = updateData.maintenanceType;
    if (updateData.description !== undefined) dbUpdateData.description = updateData.description;
    
    const { data, error } = await supabase
      .from('maintenance_schedules')
      .update(dbUpdateData)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating maintenance schedule:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Maintenance schedule not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(data[0]);
  } catch (error: any) {
    console.error('Error in maintenance schedules API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { error: 'Maintenance schedule ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('maintenance_schedules')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting maintenance schedule:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in maintenance schedules API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}