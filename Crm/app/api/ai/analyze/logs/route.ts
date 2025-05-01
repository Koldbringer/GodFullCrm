import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const workflowId = searchParams.get('workflowId');
    const executionId = searchParams.get('executionId');
    
    const supabase = createRouteHandlerClient({ cookies });
    
    let query = supabase
      .from('ai_analysis_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (workflowId) {
      // Join with workflow_executions to filter by workflow ID
      // This is a simplified approach - in a real implementation, you might need a more complex query
      const { data: executionIds } = await supabase
        .from('workflow_executions')
        .select('execution_id')
        .eq('workflow_id', workflowId);
      
      if (executionIds && executionIds.length > 0) {
        query = query.in('workflow_execution_id', executionIds.map(e => e.execution_id));
      } else {
        // No executions found for this workflow, return empty result
        return NextResponse.json([]);
      }
    }
    
    if (executionId) {
      query = query.eq('workflow_execution_id', executionId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching AI analysis logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch AI analysis logs', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in AI analysis logs API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
