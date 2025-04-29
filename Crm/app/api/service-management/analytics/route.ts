import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reportType = searchParams.get('reportType');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const technicianId = searchParams.get('technicianId');
  const customerId = searchParams.get('customerId');
  
  try {
    const supabase = createClient();
    
    // Default date range is last 30 days if not specified
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);
    
    const effectiveStartDate = startDate || defaultStartDate.toISOString();
    const effectiveEndDate = endDate || new Date().toISOString();
    
    let data;
    let error;
    
    switch (reportType) {
      case 'service_completion_rate':
        // Calculate service completion rate
        ({ data, error } = await supabase.rpc('calculate_service_completion_rate', {
          start_date: effectiveStartDate,
          end_date: effectiveEndDate,
          technician_id: technicianId || null,
          customer_id: customerId || null
        }));
        break;
        
      case 'service_by_type':
        // Get service jobs grouped by type
        ({ data, error } = await supabase
          .from('service_reports')
          .select('report_type, count(*)')
          .gte('completed_at', effectiveStartDate)
          .lte('completed_at', effectiveEndDate)
          .groupBy('report_type'));
        break;
        
      case 'service_by_technician':
        // Get service jobs grouped by technician
        ({ data, error } = await supabase
          .from('service_jobs')
          .select('technician_name, technician_id, count(*)')
          .eq('status', 'completed')
          .gte('completion_date', effectiveStartDate)
          .lte('completion_date', effectiveEndDate)
          .groupBy('technician_name, technician_id'));
        break;
        
      case 'service_by_customer':
        // Get service jobs grouped by customer
        ({ data, error } = await supabase
          .from('service_jobs')
          .select('customer_name, customer_id, count(*)')
          .eq('status', 'completed')
          .gte('completion_date', effectiveStartDate)
          .lte('completion_date', effectiveEndDate)
          .groupBy('customer_name, customer_id'));
        break;
        
      case 'average_resolution_time':
        // Calculate average time to resolve service jobs
        ({ data, error } = await supabase.rpc('calculate_average_resolution_time', {
          start_date: effectiveStartDate,
          end_date: effectiveEndDate,
          technician_id: technicianId || null,
          customer_id: customerId || null
        }));
        break;
        
      case 'maintenance_compliance':
        // Calculate maintenance compliance rate
        ({ data, error } = await supabase.rpc('calculate_maintenance_compliance', {
          start_date: effectiveStartDate,
          end_date: effectiveEndDate,
          customer_id: customerId || null
        }));
        break;
        
      case 'device_failure_rate':
        // Calculate device failure rate
        ({ data, error } = await supabase.rpc('calculate_device_failure_rate', {
          start_date: effectiveStartDate,
          end_date: effectiveEndDate,
          customer_id: customerId || null
        }));
        break;
        
      case 'service_status_summary':
      default:
        // Get service jobs grouped by status
        ({ data, error } = await supabase
          .from('service_jobs')
          .select('status, count(*)')
          .gte('created_at', effectiveStartDate)
          .lte('created_at', effectiveEndDate)
          .groupBy('status'));
        break;
    }
    
    if (error) {
      console.error(`Error fetching ${reportType} analytics:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in service analytics API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}