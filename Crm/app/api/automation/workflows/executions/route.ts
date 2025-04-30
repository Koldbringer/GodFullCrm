import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  
  const workflowId = searchParams.get('workflowId');
  const executionId = searchParams.get('executionId');
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  
  try {
    let query = supabase
      .from('workflow_executions')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);
    
    if (workflowId) {
      query = query.eq('workflow_id', workflowId);
    }
    
    if (executionId) {
      query = query.eq('execution_id', executionId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch workflow executions', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching workflow executions:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  
  const executionId = searchParams.get('executionId');
  
  if (!executionId) {
    return NextResponse.json(
      { error: 'Execution ID is required' },
      { status: 400 }
    );
  }
  
  try {
    // Delete node executions first (foreign key constraint)
    await supabase
      .from('workflow_node_executions')
      .delete()
      .eq('execution_id', executionId);
    
    // Then delete the workflow execution
    const { error } = await supabase
      .from('workflow_executions')
      .delete()
      .eq('execution_id', executionId);
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete workflow execution', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting workflow execution:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
