import { NextResponse } from 'next/server';
import { executeWorkflow } from '@/lib/services/workflow-execution';
import { registerNodeHandlers } from '@/lib/services/node-handlers';

// Register all node handlers
registerNodeHandlers();

export async function POST(request: Request) {
  try {
    const { workflowId, variables } = await request.json();
    
    if (!workflowId) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      );
    }
    
    // Execute the workflow
    const result = await executeWorkflow(workflowId, variables || {});
    
    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Workflow execution failed', 
          details: result.error,
          executionId: result.executionId
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      executionId: result.executionId,
      workflowId: result.workflowId,
      startTime: result.startTime,
      endTime: result.endTime,
    });
  } catch (error) {
    console.error('Error executing workflow:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
