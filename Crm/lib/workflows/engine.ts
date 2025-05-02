/**
 * Workflow Engine for Service Orders
 */

import { createClient } from '@/lib/supabase/server';
import { 
  WorkflowInstance, 
  WorkflowStep, 
  WorkflowStepExecution, 
  WorkflowTemplate,
  WorkflowContext
} from './types';
import { getStepHandler } from './handlers';
import { getServiceOrder } from '@/lib/api';

/**
 * Create a new workflow instance for a service order
 */
export async function createWorkflowInstance(
  templateId: string,
  serviceOrderId: string,
  initialData: Record<string, any> = {}
): Promise<WorkflowInstance | null> {
  try {
    const supabase = await createClient();
    if (!supabase) return null;

    // Get the workflow template
    const { data: template, error: templateError } = await supabase
      .from('workflow_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (templateError || !template) {
      console.error('Error fetching workflow template:', templateError);
      return null;
    }

    // Create the workflow instance
    const { data: instance, error: instanceError } = await supabase
      .from('workflow_instances')
      .insert({
        template_id: templateId,
        service_order_id: serviceOrderId,
        status: 'active',
        data: initialData,
        current_step_id: template.steps[0]?.id || null
      })
      .select()
      .single();

    if (instanceError || !instance) {
      console.error('Error creating workflow instance:', instanceError);
      return null;
    }

    // Create the first step execution
    if (template.steps.length > 0) {
      const firstStep = template.steps[0];
      await createStepExecution(instance.id, firstStep.id);
    }

    return instance;
  } catch (error) {
    console.error('Error in createWorkflowInstance:', error);
    return null;
  }
}

/**
 * Create a step execution record
 */
async function createStepExecution(
  workflowInstanceId: string,
  stepId: string
): Promise<WorkflowStepExecution | null> {
  try {
    const supabase = await createClient();
    if (!supabase) return null;

    const { data: execution, error } = await supabase
      .from('workflow_step_executions')
      .insert({
        workflow_instance_id: workflowInstanceId,
        step_id: stepId,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating step execution:', error);
      return null;
    }

    return execution;
  } catch (error) {
    console.error('Error in createStepExecution:', error);
    return null;
  }
}

/**
 * Execute a workflow step
 */
export async function executeWorkflowStep(
  executionId: string
): Promise<boolean> {
  try {
    const supabase = await createClient();
    if (!supabase) return false;

    // Get the step execution
    const { data: execution, error: executionError } = await supabase
      .from('workflow_step_executions')
      .select('*')
      .eq('id', executionId)
      .single();

    if (executionError || !execution) {
      console.error('Error fetching step execution:', executionError);
      return false;
    }

    // Get the workflow instance
    const { data: instance, error: instanceError } = await supabase
      .from('workflow_instances')
      .select('*, workflow_templates(*)')
      .eq('id', execution.workflow_instance_id)
      .single();

    if (instanceError || !instance) {
      console.error('Error fetching workflow instance:', instanceError);
      return false;
    }

    // Get the step
    const template = instance.workflow_templates as unknown as WorkflowTemplate;
    const step = template.steps.find(s => s.id === execution.step_id);
    
    if (!step) {
      console.error('Step not found:', execution.step_id);
      return false;
    }

    // Update execution status to in_progress
    await supabase
      .from('workflow_step_executions')
      .update({
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .eq('id', executionId);

    // Get the service order and related data
    const serviceOrder = await getServiceOrder(instance.service_order_id);
    if (!serviceOrder) {
      console.error('Service order not found:', instance.service_order_id);
      return false;
    }

    // Create context for step execution
    const context: WorkflowContext = {
      serviceOrder,
      customer: serviceOrder.customers || {},
      technician: serviceOrder.technicians || {},
      site: serviceOrder.sites || {},
      device: serviceOrder.devices || {},
      user: {}, // Current user info will be added by the handler
      data: instance.data || {}
    };

    // Get the step handler
    const handler = getStepHandler(step.type);
    if (!handler) {
      console.error('Handler not found for step type:', step.type);
      await updateStepExecutionStatus(executionId, 'failed', {
        error_message: `Handler not found for step type: ${step.type}`
      });
      return false;
    }

    // Execute the step
    try {
      const result = await handler.execute(step, context, execution);
      
      if (result.success) {
        // Update execution status to completed
        await updateStepExecutionStatus(executionId, 'completed', {
          result: result.result || {},
          completed_at: new Date().toISOString()
        });

        // Update workflow instance data
        if (result.result) {
          await updateWorkflowInstanceData(instance.id, {
            ...instance.data,
            [step.id]: result.result
          });
        }

        // Move to next step if available
        if (step.next_step_id) {
          const nextStep = template.steps.find(s => s.id === step.next_step_id);
          if (nextStep) {
            await updateWorkflowInstanceCurrentStep(instance.id, nextStep.id);
            await createStepExecution(instance.id, nextStep.id);
          } else {
            // No more steps, complete the workflow
            await updateWorkflowInstanceStatus(instance.id, 'completed');
          }
        } else {
          // No next step defined, complete the workflow
          await updateWorkflowInstanceStatus(instance.id, 'completed');
        }

        return true;
      } else {
        // Step failed
        await updateStepExecutionStatus(executionId, 'failed', {
          error_message: result.error || 'Step execution failed',
          completed_at: new Date().toISOString()
        });

        // Check if there's a failure path
        if (step.next_step_on_failure_id) {
          const nextStep = template.steps.find(s => s.id === step.next_step_on_failure_id);
          if (nextStep) {
            await updateWorkflowInstanceCurrentStep(instance.id, nextStep.id);
            await createStepExecution(instance.id, nextStep.id);
          } else {
            // Invalid next step, mark workflow as failed
            await updateWorkflowInstanceStatus(instance.id, 'failed');
          }
        } else if (step.is_required) {
          // Required step failed and no failure path, mark workflow as failed
          await updateWorkflowInstanceStatus(instance.id, 'failed');
        } else {
          // Non-required step failed and no failure path, try to continue with next step
          if (step.next_step_id) {
            const nextStep = template.steps.find(s => s.id === step.next_step_id);
            if (nextStep) {
              await updateWorkflowInstanceCurrentStep(instance.id, nextStep.id);
              await createStepExecution(instance.id, nextStep.id);
            } else {
              // No more steps, complete the workflow
              await updateWorkflowInstanceStatus(instance.id, 'completed');
            }
          } else {
            // No next step defined, complete the workflow
            await updateWorkflowInstanceStatus(instance.id, 'completed');
          }
        }

        return false;
      }
    } catch (error) {
      console.error('Error executing step:', error);
      await updateStepExecutionStatus(executionId, 'failed', {
        error_message: error instanceof Error ? error.message : 'Unknown error',
        completed_at: new Date().toISOString()
      });

      // Mark workflow as failed if step is required
      if (step.is_required) {
        await updateWorkflowInstanceStatus(instance.id, 'failed');
      }

      return false;
    }
  } catch (error) {
    console.error('Error in executeWorkflowStep:', error);
    return false;
  }
}

/**
 * Update step execution status
 */
async function updateStepExecutionStatus(
  executionId: string,
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped',
  additionalData: Record<string, any> = {}
): Promise<boolean> {
  try {
    const supabase = await createClient();
    if (!supabase) return false;

    const { error } = await supabase
      .from('workflow_step_executions')
      .update({
        status,
        ...additionalData
      })
      .eq('id', executionId);

    if (error) {
      console.error('Error updating step execution status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateStepExecutionStatus:', error);
    return false;
  }
}

/**
 * Update workflow instance status
 */
async function updateWorkflowInstanceStatus(
  instanceId: string,
  status: 'active' | 'completed' | 'failed' | 'cancelled'
): Promise<boolean> {
  try {
    const supabase = await createClient();
    if (!supabase) return false;

    const { error } = await supabase
      .from('workflow_instances')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', instanceId);

    if (error) {
      console.error('Error updating workflow instance status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateWorkflowInstanceStatus:', error);
    return false;
  }
}

/**
 * Update workflow instance current step
 */
async function updateWorkflowInstanceCurrentStep(
  instanceId: string,
  stepId: string
): Promise<boolean> {
  try {
    const supabase = await createClient();
    if (!supabase) return false;

    const { error } = await supabase
      .from('workflow_instances')
      .update({
        current_step_id: stepId,
        updated_at: new Date().toISOString()
      })
      .eq('id', instanceId);

    if (error) {
      console.error('Error updating workflow instance current step:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateWorkflowInstanceCurrentStep:', error);
    return false;
  }
}

/**
 * Update workflow instance data
 */
async function updateWorkflowInstanceData(
  instanceId: string,
  data: Record<string, any>
): Promise<boolean> {
  try {
    const supabase = await createClient();
    if (!supabase) return false;

    const { error } = await supabase
      .from('workflow_instances')
      .update({
        data,
        updated_at: new Date().toISOString()
      })
      .eq('id', instanceId);

    if (error) {
      console.error('Error updating workflow instance data:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateWorkflowInstanceData:', error);
    return false;
  }
}

/**
 * Get workflow templates
 */
export async function getWorkflowTemplates(
  serviceType?: string
): Promise<WorkflowTemplate[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return [];

    let query = supabase
      .from('workflow_templates')
      .select('*');

    if (serviceType) {
      query = query.eq('service_type', serviceType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching workflow templates:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getWorkflowTemplates:', error);
    return [];
  }
}

/**
 * Get workflow instance
 */
export async function getWorkflowInstance(
  instanceId: string
): Promise<WorkflowInstance | null> {
  try {
    const supabase = await createClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('workflow_instances')
      .select('*')
      .eq('id', instanceId)
      .single();

    if (error) {
      console.error('Error fetching workflow instance:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getWorkflowInstance:', error);
    return null;
  }
}

/**
 * Get workflow instances for a service order
 */
export async function getWorkflowInstancesForServiceOrder(
  serviceOrderId: string
): Promise<WorkflowInstance[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('workflow_instances')
      .select('*')
      .eq('service_order_id', serviceOrderId);

    if (error) {
      console.error('Error fetching workflow instances:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getWorkflowInstancesForServiceOrder:', error);
    return [];
  }
}

/**
 * Get step executions for a workflow instance
 */
export async function getStepExecutionsForWorkflowInstance(
  instanceId: string
): Promise<WorkflowStepExecution[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('workflow_step_executions')
      .select('*')
      .eq('workflow_instance_id', instanceId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching step executions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getStepExecutionsForWorkflowInstance:', error);
    return [];
  }
}