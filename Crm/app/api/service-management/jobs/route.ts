import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const customerId = searchParams.get('customerId');
  const technicianId = searchParams.get('technicianId');
  const deviceId = searchParams.get('deviceId');
  const priority = searchParams.get('priority');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  
  try {
    const supabase = createClient();
    
    let query = supabase
      .from('service_jobs')
      .select(`
        *,
        service_reports(*)
      `);
    
    // Apply filters if provided
    if (status) {
      query = query.eq('status', status);
    }
    
    if (customerId) {
      query = query.eq('customer_id', customerId);
    }
    
    if (technicianId) {
      query = query.eq('technician_id', technicianId);
    }
    
    if (deviceId) {
      query = query.eq('device_id', deviceId);
    }
    
    if (priority) {
      query = query.eq('priority', priority);
    }
    
    if (startDate) {
      query = query.gte('scheduled_date', startDate);
    }
    
    if (endDate) {
      query = query.lte('scheduled_date', endDate);
    }
    
    // Order by scheduled date
    query = query.order('scheduled_date', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching service jobs:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in service jobs API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      customerId,
      customerName,
      technicianId,
      technicianName,
      deviceId,
      deviceName,
      location,
      status,
      priority,
      description,
      scheduledDate
    } = body;
    
    // Validate required fields
    if (!title || !customerName || !technicianName || !deviceName || !location || !status || !priority || !scheduledDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('service_jobs')
      .insert([
        {
          title,
          customer_id: customerId,
          customer_name: customerName,
          technician_id: technicianId,
          technician_name: technicianName,
          device_id: deviceId,
          device_name: deviceName,
          location,
          status,
          priority,
          description,
          scheduled_date: scheduledDate
        }
      ])
      .select();
    
    if (error) {
      console.error('Error creating service job:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data[0]);
  } catch (error: any) {
    console.error('Error in service jobs API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Service job ID is required' },
        { status: 400 }
      );
    }
    
    const supabase = createClient();
    
    // Convert camelCase to snake_case for database fields
    const dbUpdateData: any = {};
    if (updateData.title !== undefined) dbUpdateData.title = updateData.title;
    if (updateData.customerId !== undefined) dbUpdateData.customer_id = updateData.customerId;
    if (updateData.customerName !== undefined) dbUpdateData.customer_name = updateData.customerName;
    if (updateData.technicianId !== undefined) dbUpdateData.technician_id = updateData.technicianId;
    if (updateData.technicianName !== undefined) dbUpdateData.technician_name = updateData.technicianName;
    if (updateData.deviceId !== undefined) dbUpdateData.device_id = updateData.deviceId;
    if (updateData.deviceName !== undefined) dbUpdateData.device_name = updateData.deviceName;
    if (updateData.location !== undefined) dbUpdateData.location = updateData.location;
    if (updateData.status !== undefined) dbUpdateData.status = updateData.status;
    if (updateData.priority !== undefined) dbUpdateData.priority = updateData.priority;
    if (updateData.description !== undefined) dbUpdateData.description = updateData.description;
    if (updateData.scheduledDate !== undefined) dbUpdateData.scheduled_date = updateData.scheduledDate;
    if (updateData.completionDate !== undefined) dbUpdateData.completion_date = updateData.completionDate;
    
    const { data, error } = await supabase
      .from('service_jobs')
      .update(dbUpdateData)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating service job:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Service job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(data[0]);
  } catch (error: any) {
    console.error('Error in service jobs API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { error: 'Service job ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('service_jobs')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting service job:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in service jobs API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}