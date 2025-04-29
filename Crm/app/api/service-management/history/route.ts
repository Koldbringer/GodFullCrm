import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceJobId = searchParams.get('serviceJobId');
  const changedBy = searchParams.get('changedBy');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  
  try {
    const supabase = createClient();
    
    let query = supabase
      .from('service_job_history')
      .select('*');
    
    // Apply filters if provided
    if (serviceJobId) {
      query = query.eq('service_job_id', serviceJobId);
    }
    
    if (changedBy) {
      query = query.eq('changed_by', changedBy);
    }
    
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    
    // Order by creation date
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching service job history:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in service job history API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      serviceJobId,
      previousStatus,
      newStatus,
      changedBy,
      changedByName,
      notes
    } = body;
    
    // Validate required fields
    if (!serviceJobId || !newStatus || !changedByName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('service_job_history')
      .insert([
        {
          service_job_id: serviceJobId,
          previous_status: previousStatus,
          new_status: newStatus,
          changed_by: changedBy,
          changed_by_name: changedByName,
          notes
        }
      ])
      .select();
    
    if (error) {
      console.error('Error creating service job history entry:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data[0]);
  } catch (error: any) {
    console.error('Error in service job history API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}