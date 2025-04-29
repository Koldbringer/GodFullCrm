import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const technician = searchParams.get('technician');
  const customer = searchParams.get('customer');
  
  try {
    const supabase = createClient();
    
    let query = supabase
      .from('calendar_events')
      .select('*');
    
    // Apply filters if provided
    if (type && type !== 'all') {
      query = query.eq('type', type);
    }
    
    if (startDate) {
      query = query.gte('start_date', startDate);
    }
    
    if (endDate) {
      query = query.lte('end_date', endDate);
    }
    
    if (technician) {
      query = query.ilike('technician', `%${technician}%`);
    }
    
    if (customer) {
      query = query.ilike('customer', `%${customer}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching calendar events:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Transform data to match the CalendarEvent type
    const events = data.map(event => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start_date),
      end: new Date(event.end_date),
      type: event.type,
      resource: {
        customer: event.customer,
        technician: event.technician,
        site: event.location,
        device: event.device,
        status: event.status,
        description: event.description || '',
      }
    }));
    
    return NextResponse.json(events);
  } catch (error: any) {
    console.error('Error in calendar events API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, type, startDate, endDate, customer, technician, location, device, status, description } = body;
    
    if (!title || !type || !startDate || !customer || !technician || !location || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('calendar_events')
      .insert([
        {
          title,
          type,
          start_date: startDate,
          end_date: endDate || startDate,
          customer,
          technician,
          location,
          device: device || '',
          status,
          description: description || '',
        }
      ])
      .select();
    
    if (error) {
      console.error('Error creating calendar event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Transform the created event to match the CalendarEvent type
    const event = {
      id: data[0].id,
      title: data[0].title,
      start: new Date(data[0].start_date),
      end: new Date(data[0].end_date),
      type: data[0].type,
      resource: {
        customer: data[0].customer,
        technician: data[0].technician,
        site: data[0].location,
        device: data[0].device,
        status: data[0].status,
        description: data[0].description || '',
      }
    };
    
    return NextResponse.json(event);
  } catch (error: any) {
    console.error('Error in calendar events API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, type, startDate, endDate, customer, technician, location, device, status, description } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }
    
    const supabase = createClient();
    
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (type !== undefined) updateData.type = type;
    if (startDate !== undefined) updateData.start_date = startDate;
    if (endDate !== undefined) updateData.end_date = endDate;
    if (customer !== undefined) updateData.customer = customer;
    if (technician !== undefined) updateData.technician = technician;
    if (location !== undefined) updateData.location = location;
    if (device !== undefined) updateData.device = device;
    if (status !== undefined) updateData.status = status;
    if (description !== undefined) updateData.description = description;
    
    const { data, error } = await supabase
      .from('calendar_events')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating calendar event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Transform the updated event to match the CalendarEvent type
    const event = {
      id: data[0].id,
      title: data[0].title,
      start: new Date(data[0].start_date),
      end: new Date(data[0].end_date),
      type: data[0].type,
      resource: {
        customer: data[0].customer,
        technician: data[0].technician,
        site: data[0].location,
        device: data[0].device,
        status: data[0].status,
        description: data[0].description || '',
      }
    };
    
    return NextResponse.json(event);
  } catch (error: any) {
    console.error('Error in calendar events API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { error: 'Event ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting calendar event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in calendar events API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}