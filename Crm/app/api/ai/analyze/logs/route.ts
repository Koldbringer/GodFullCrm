import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Define types for our custom tables
interface WorkflowExecution {
  execution_id: string;
  workflow_id: string;
}

interface AIAnalysisLog {
  id: string;
  workflow_execution_id: string;
  created_at: string;
  content: any;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const workflowId = searchParams.get('workflowId');
    const executionId = searchParams.get('executionId');

    const supabase = await createClient();

    // Use type assertion to handle custom tables
    let query = supabase
      .from('ai_analysis_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1) as any;

    if (workflowId) {
      // Join with workflow_executions to filter by workflow ID
      // This is a simplified approach - in a real implementation, you might need a more complex query
      const { data: executionIds } = await supabase
        .from('workflow_executions')
        .select('execution_id')
        .eq('workflow_id', workflowId) as any;

      if (executionIds && executionIds.length > 0) {
        query = query.in('workflow_execution_id', executionIds.map((e: WorkflowExecution) => e.execution_id));
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
