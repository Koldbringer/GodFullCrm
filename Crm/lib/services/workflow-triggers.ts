import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { executeWorkflow, Workflow, WorkflowTrigger } from './workflow-execution';
import { SUPABASE_CONFIG } from '@/lib/supabase/config';

// Types for workflow triggers
export interface ScheduleTrigger extends WorkflowTrigger {
  type: 'schedule';
  config: {
    schedule: string; // cron expression
    timezone?: string;
    lastExecuted?: string;
  };
}

export interface EventTrigger extends WorkflowTrigger {
  type: 'event';
  config: {
    eventType: string;
    conditions?: Record<string, any>;
  };
}

export interface WebhookTrigger extends WorkflowTrigger {
  type: 'webhook';
  config: {
    endpoint: string;
    secret?: string;
  };
}

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
 * Get all workflows with triggers
 */
export async function getWorkflowsWithTriggers(): Promise<Workflow[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('automation_workflows')
    .select('*')
    .eq('is_active', true);
  
  if (error || !data) {
    console.error('Error fetching workflows with triggers:', error);
    return [];
  }
  
  // Parse the workflows and filter those with triggers
  const workflowsWithTriggers = data
    .map(item => {
      try {
        const parsedGraph = JSON.parse(item.graph_json || '{}');
        const workflow: Workflow = {
          id: item.id,
          name: item.name,
          description: item.description,
          nodes: parsedGraph.nodes || [],
          connections: parsedGraph.connections || [],
          triggers: parsedGraph.triggers || [],
          created_at: item.created_at,
          updated_at: item.updated_at,
          is_active: item.is_active,
        };
        return workflow;
      } catch (e) {
        console.error(`Error parsing workflow ${item.id}:`, e);
        return null;
      }
    })
    .filter(Boolean)
    .filter(workflow => workflow?.triggers && workflow.triggers.length > 0);
  
  return workflowsWithTriggers as Workflow[];
}

/**
 * Process schedule triggers
 */
export async function processScheduleTriggers(): Promise<void> {
  const workflows = await getWorkflowsWithTriggers();
  
  // Filter workflows with schedule triggers
  const workflowsWithScheduleTriggers = workflows.filter(workflow => 
    workflow.triggers?.some(trigger => trigger.type === 'schedule')
  );
  
  for (const workflow of workflowsWithScheduleTriggers) {
    const scheduleTriggers = workflow.triggers?.filter(
      trigger => trigger.type === 'schedule'
    ) as ScheduleTrigger[];
    
    for (const trigger of scheduleTriggers) {
      if (shouldExecuteSchedule(trigger.config.schedule, trigger.config.lastExecuted)) {
        console.log(`Executing workflow ${workflow.id} based on schedule trigger`);
        
        try {
          // Execute the workflow
          await executeWorkflow(workflow.id);
          
          // Update the last executed time
          await updateTriggerLastExecuted(workflow.id, trigger.id);
        } catch (error) {
          console.error(`Error executing workflow ${workflow.id}:`, error);
        }
      }
    }
  }
}

/**
 * Process event triggers
 */
export async function processEventTrigger(
  eventType: string,
  eventData: Record<string, any>
): Promise<void> {
  const workflows = await getWorkflowsWithTriggers();
  
  // Filter workflows with event triggers matching the event type
  const matchingWorkflows = workflows.filter(workflow => 
    workflow.triggers?.some(trigger => 
      trigger.type === 'event' && 
      (trigger as EventTrigger).config.eventType === eventType
    )
  );
  
  for (const workflow of matchingWorkflows) {
    const eventTriggers = workflow.triggers?.filter(
      trigger => trigger.type === 'event' && (trigger as EventTrigger).config.eventType === eventType
    ) as EventTrigger[];
    
    for (const trigger of eventTriggers) {
      // Check if the event data matches the trigger conditions
      if (matchesConditions(eventData, trigger.config.conditions || {})) {
        console.log(`Executing workflow ${workflow.id} based on event trigger`);
        
        try {
          // Execute the workflow with the event data as variables
          await executeWorkflow(workflow.id, eventData);
        } catch (error) {
          console.error(`Error executing workflow ${workflow.id}:`, error);
        }
      }
    }
  }
}

/**
 * Check if a schedule should be executed based on its cron expression and last execution time
 */
function shouldExecuteSchedule(cronExpression: string, lastExecuted?: string): boolean {
  // This is a simplified implementation
  // In a real application, you would use a cron parser library to check if the schedule should run
  
  if (!lastExecuted) {
    return true; // First execution
  }
  
  const lastExecutedDate = new Date(lastExecuted);
  const now = new Date();
  
  // Simple implementation: check if at least 1 hour has passed since last execution
  const hoursSinceLastExecution = (now.getTime() - lastExecutedDate.getTime()) / (1000 * 60 * 60);
  
  return hoursSinceLastExecution >= 1;
}

/**
 * Check if event data matches the trigger conditions
 */
function matchesConditions(eventData: Record<string, any>, conditions: Record<string, any>): boolean {
  // Simple implementation: check if all conditions match
  for (const [key, value] of Object.entries(conditions)) {
    const eventValue = getNestedValue(eventData, key);
    
    if (eventValue !== value) {
      return false;
    }
  }
  
  return true;
}

/**
 * Get a nested value from an object using dot notation
 */
function getNestedValue(obj: Record<string, any>, path: string): any {
  const keys = path.split('.');
  return keys.reduce((o, key) => (o && o[key] !== undefined) ? o[key] : undefined, obj);
}

/**
 * Update the last executed time for a trigger
 */
async function updateTriggerLastExecuted(workflowId: string, triggerId: string): Promise<void> {
  const supabase = createClient();
  
  try {
    // Get the current workflow
    const { data, error } = await supabase
      .from('automation_workflows')
      .select('*')
      .eq('id', workflowId)
      .single();
    
    if (error || !data) {
      throw new Error(`Error fetching workflow ${workflowId}: ${error?.message}`);
    }
    
    // Parse the graph JSON
    const graphJson = JSON.parse(data.graph_json || '{}');
    
    // Update the trigger's last executed time
    if (graphJson.triggers) {
      const triggerIndex = graphJson.triggers.findIndex((t: WorkflowTrigger) => t.id === triggerId);
      
      if (triggerIndex >= 0) {
        if (!graphJson.triggers[triggerIndex].config) {
          graphJson.triggers[triggerIndex].config = {};
        }
        
        graphJson.triggers[triggerIndex].config.lastExecuted = new Date().toISOString();
        
        // Update the workflow with the modified triggers
        await supabase
          .from('automation_workflows')
          .update({ graph_json: JSON.stringify(graphJson) })
          .eq('id', workflowId);
      }
    }
  } catch (error) {
    console.error(`Error updating trigger last executed time:`, error);
  }
}