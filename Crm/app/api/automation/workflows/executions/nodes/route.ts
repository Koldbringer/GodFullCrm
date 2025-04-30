import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
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
    const { data, error } = await supabase
      .from('workflow_node_executions')
      .select('*')
      .eq('execution_id', executionId)
      .order('timestamp', { ascending: true });
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch node executions', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching node executions:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
