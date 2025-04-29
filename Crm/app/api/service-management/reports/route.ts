import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceJobId = searchParams.get('serviceJobId');
  const reportType = searchParams.get('reportType');
  const completedBy = searchParams.get('completedBy');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  
  try {
    const supabase = createClient();
    
    let query = supabase
      .from('service_reports')
      .select(`
        *,
        service_jobs(*)
      `);
    
    // Apply filters if provided
    if (serviceJobId) {
      query = query.eq('service_job_id', serviceJobId);
    }
    
    if (reportType) {
      query = query.eq('report_type', reportType);
    }
    
    if (completedBy) {
      query = query.eq('completed_by', completedBy);
    }
    
    if (startDate) {
      query = query.gte('completed_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('completed_at', endDate);
    }
    
    // Order by completion date
    query = query.order('completed_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching service reports:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in service reports API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      serviceJobId,
      reportType,
      findings,
      actionsTaken,
      partsUsed,
      laborHours,
      followUpRequired,
      followUpDescription,
      images,
      signatureUrl,
      completedBy
    } = body;
    
    // Validate required fields
    if (!serviceJobId || !reportType || !actionsTaken || !laborHours) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const supabase = createClient();
    
    // First, update the service job status to completed
    const { error: updateError } = await supabase
      .from('service_jobs')
      .update({ 
        status: 'completed',
        completion_date: new Date().toISOString()
      })
      .eq('id', serviceJobId);
    
    if (updateError) {
      console.error('Error updating service job status:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    
    // Then create the service report
    const { data, error } = await supabase
      .from('service_reports')
      .insert([
        {
          service_job_id: serviceJobId,
          report_type: reportType,
          findings,
          actions_taken: actionsTaken,
          parts_used: partsUsed,
          labor_hours: laborHours,
          follow_up_required: followUpRequired || false,
          follow_up_description: followUpDescription,
          images,
          signature_url: signatureUrl,
          completed_by: completedBy,
          completed_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) {
      console.error('Error creating service report:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data[0]);
  } catch (error: any) {
    console.error('Error in service reports API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Service report ID is required' },
        { status: 400 }
      );
    }
    
    const supabase = createClient();
    
    // Convert camelCase to snake_case for database fields
    const dbUpdateData: any = {};
    if (updateData.serviceJobId !== undefined) dbUpdateData.service_job_id = updateData.serviceJobId;
    if (updateData.reportType !== undefined) dbUpdateData.report_type = updateData.reportType;
    if (updateData.findings !== undefined) dbUpdateData.findings = updateData.findings;
    if (updateData.actionsTaken !== undefined) dbUpdateData.actions_taken = updateData.actionsTaken;
    if (updateData.partsUsed !== undefined) dbUpdateData.parts_used = updateData.partsUsed;
    if (updateData.laborHours !== undefined) dbUpdateData.labor_hours = updateData.laborHours;
    if (updateData.followUpRequired !== undefined) dbUpdateData.follow_up_required = updateData.followUpRequired;
    if (updateData.followUpDescription !== undefined) dbUpdateData.follow_up_description = updateData.followUpDescription;
    if (updateData.images !== undefined) dbUpdateData.images = updateData.images;
    if (updateData.signatureUrl !== undefined) dbUpdateData.signature_url = updateData.signatureUrl;
    if (updateData.completedBy !== undefined) dbUpdateData.completed_by = updateData.completedBy;
    if (updateData.completedAt !== undefined) dbUpdateData.completed_at = updateData.completedAt;
    
    const { data, error } = await supabase
      .from('service_reports')
      .update(dbUpdateData)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating service report:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Service report not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(data[0]);
  } catch (error: any) {
    console.error('Error in service reports API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { error: 'Service report ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('service_reports')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting service report:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in service reports API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}