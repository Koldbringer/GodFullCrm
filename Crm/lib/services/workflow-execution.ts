import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createAutomationNotification } from './automation-notifications';
import { SUPABASE_CONFIG } from '@/lib/supabase/config';

// Types for workflow execution
export interface WorkflowNode {
  id: string;
  type: string;
  data: Record<string, any>;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  position: [number, number];
}

export interface WorkflowConnection {
  id: string;
  source: string;
  sourceOutput: string;
  target: string;
  targetInput: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  triggers?: WorkflowTrigger[];
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface WorkflowTrigger {
  id: string;
  type: 'schedule' | 'event' | 'webhook';
  config: Record<string, any>;
}

export interface WorkflowExecutionContext {
  workflowId: string;
  executionId: string;
  nodeResults: Record<string, any>;
  startTime: Date;
  variables: Record<string, any>;
  supabase: any;
}

export interface WorkflowExecutionResult {
  success: boolean;
  executionId: string;
  workflowId: string;
  startTime: Date;
  endTime: Date;
  nodeResults: Record<string, any>;
  error?: string;
}

export interface NodeHandler {
  execute: (node: WorkflowNode, context: WorkflowExecutionContext) => Promise<any>;
}

// Registry of node handlers
const nodeHandlers: Record<string, NodeHandler> = {};

// Helper function to create a Supabase client
const createClient = () => {
  const cookieStore = cookies();
  return createServerClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 });
        }
      }
    }
  );
};

/**
 * Register a node handler for a specific node type
 */
export function registerNodeHandler(nodeType: string, handler: NodeHandler) {
  nodeHandlers[nodeType] = handler;
}

/**
 * Get a workflow by ID
 */
export async function getWorkflow(workflowId: string): Promise<Workflow | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('automation_workflows')
    .select('*')
    .eq('id', workflowId)
    .single();

  if (error || !data) {
    console.error('Error fetching workflow:', error);
    return null;
  }

  // Parse the graph_json field which contains the workflow definition
  try {
    const workflow: Workflow = {
      id: data.id,
      name: data.name,
      description: data.description,
      created_at: data.created_at,
      updated_at: data.updated_at,
      is_active: data.is_active,
      ...JSON.parse(data.graph_json)
    };

    return workflow;
  } catch (e) {
    console.error('Error parsing workflow JSON:', e);
    return null;
  }
}

/**
 * Execute a workflow by ID
 */
export async function executeWorkflow(
  workflowId: string,
  initialVariables: Record<string, any> = {}
): Promise<WorkflowExecutionResult> {
  const supabase = createClient();
  const startTime = new Date();
  const executionId = generateExecutionId();

  // Create execution context
  const context: WorkflowExecutionContext = {
    workflowId,
    executionId,
    nodeResults: {},
    startTime,
    variables: { ...initialVariables },
    supabase
  };

  try {
    // Get the workflow
    const workflow = await getWorkflow(workflowId);
    if (!workflow) {
      throw new Error(`Workflow with ID ${workflowId} not found`);
    }

    // Log the execution start
    await logExecution(context, 'started', null);

    // Find start nodes (nodes with no incoming connections)
    const startNodes = findStartNodes(workflow);
    if (startNodes.length === 0) {
      throw new Error('No start nodes found in workflow');
    }

    // Execute the workflow starting from each start node
    for (const startNode of startNodes) {
      await executeNode(startNode, workflow, context);
    }

    // Log the execution completion
    const endTime = new Date();
    await logExecution(context, 'completed', null, endTime);

    // Create a success notification
    await createAutomationNotification(
      workflowId,
      workflow.name,
      executionId,
      `Przepływ "${workflow.name}" został wykonany pomyślnie`,
      'success'
    );

    return {
      success: true,
      executionId,
      workflowId,
      startTime,
      endTime,
      nodeResults: context.nodeResults
    };
  } catch (error) {
    // Log the execution error
    const endTime = new Date();
    const errorMessage = error instanceof Error ? error.message : String(error);
    await logExecution(context, 'failed', errorMessage, endTime);

    // Get the workflow name
    let workflowName = 'Unknown Workflow';
    try {
      const workflow = await getWorkflow(workflowId);
      if (workflow) {
        workflowName = workflow.name;
      }
    } catch (e) {
      console.error('Error getting workflow name for notification:', e);
    }

    // Create an error notification
    await createAutomationNotification(
      workflowId,
      workflowName,
      executionId,
      `Błąd wykonania przepływu "${workflowName}": ${errorMessage}`,
      'error'
    );

    return {
      success: false,
      executionId,
      workflowId,
      startTime,
      endTime,
      nodeResults: context.nodeResults,
      error: errorMessage
    };
  }
}

/**
 * Execute a single node in the workflow
 */
async function executeNode(
  node: WorkflowNode,
  workflow: Workflow,
  context: WorkflowExecutionContext
): Promise<any> {
  // Check if node has already been executed in this context
  if (context.nodeResults[node.id]) {
    return context.nodeResults[node.id];
  }

  try {
    // Log node execution start
    await logNodeExecution(context, node.id, 'started', null);

    // Get the handler for this node type
    const handler = nodeHandlers[node.type];
    if (!handler) {
      throw new Error(`No handler registered for node type: ${node.type}`);
    }

    // Execute the node
    const result = await handler.execute(node, context);

    // Store the result in the context
    context.nodeResults[node.id] = result;

    // Log node execution completion
    await logNodeExecution(context, node.id, 'completed', null);

    // Find and execute next nodes
    const nextNodes = findNextNodes(node, workflow);
    for (const nextNode of nextNodes) {
      await executeNode(nextNode, workflow, context);
    }

    return result;
  } catch (error) {
    // Log node execution error
    const errorMessage = error instanceof Error ? error.message : String(error);
    await logNodeExecution(context, node.id, 'failed', errorMessage);

    // Rethrow the error to be caught by the workflow executor
    throw error;
  }
}

/**
 * Find nodes that have no incoming connections (start nodes)
 */
function findStartNodes(workflow: Workflow): WorkflowNode[] {
  const nodesWithIncomingConnections = new Set(
    workflow.connections.map(conn => conn.target)
  );

  return workflow.nodes.filter(node => !nodesWithIncomingConnections.has(node.id));
}

/**
 * Find nodes that should be executed after the given node
 */
function findNextNodes(node: WorkflowNode, workflow: Workflow): WorkflowNode[] {
  const outgoingConnections = workflow.connections.filter(conn => conn.source === node.id);

  return outgoingConnections.map(conn => {
    return workflow.nodes.find(n => n.id === conn.target)!;
  }).filter(Boolean);
}

/**
 * Generate a unique execution ID
 */
function generateExecutionId(): string {
  return `exec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Log workflow execution
 */
async function logExecution(
  context: WorkflowExecutionContext,
  status: 'started' | 'completed' | 'failed',
  error: string | null,
  endTime?: Date
): Promise<void> {
  try {
    await context.supabase.from('workflow_executions').insert({
      execution_id: context.executionId,
      workflow_id: context.workflowId,
      status,
      started_at: context.startTime.toISOString(),
      completed_at: endTime ? endTime.toISOString() : null,
      error_message: error,
      variables: JSON.stringify(context.variables),
    });
  } catch (e) {
    console.error('Error logging workflow execution:', e);
  }
}

/**
 * Log node execution
 */
async function logNodeExecution(
  context: WorkflowExecutionContext,
  nodeId: string,
  status: 'started' | 'completed' | 'failed',
  error: string | null
): Promise<void> {
  try {
    await context.supabase.from('workflow_node_executions').insert({
      execution_id: context.executionId,
      workflow_id: context.workflowId,
      node_id: nodeId,
      status,
      timestamp: new Date().toISOString(),
      error_message: error,
    });
  } catch (e) {
    console.error('Error logging node execution:', e);
  }
}