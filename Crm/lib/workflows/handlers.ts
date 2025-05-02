/**
 * Workflow Step Handlers
 */

import { 
  WorkflowStep, 
  WorkflowStepHandler, 
  WorkflowStepType,
  WorkflowContext,
  WorkflowStepExecution
} from './types';
import { updateServiceOrder } from '@/lib/api';
import { createClient } from '@/lib/supabase/server';

// Handler for service order status change
const serviceOrderStatusChangeHandler: WorkflowStepHandler = {
  async execute(step: WorkflowStep, context: WorkflowContext, execution: WorkflowStepExecution) {
    try {
      const { status } = step.config;
      
      if (!status) {
        return {
          success: false,
          error: 'No status specified in step configuration'
        };
      }

      // Update service order status
      const result = await updateServiceOrder(context.serviceOrder.id, {
        status,
        updated_at: new Date().toISOString()
      });

      if (!result) {
        return {
          success: false,
          error: 'Failed to update service order status'
        };
      }

      return {
        success: true,
        result: {
          previous_status: context.serviceOrder.status,
          new_status: status
        }
      };
    } catch (error) {
      console.error('Error in serviceOrderStatusChangeHandler:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

// Handler for assigning technician
const assignTechnicianHandler: WorkflowStepHandler = {
  async execute(step: WorkflowStep, context: WorkflowContext, execution: WorkflowStepExecution) {
    try {
      const { technician_id } = step.config;
      
      if (!technician_id) {
        return {
          success: false,
          error: 'No technician ID specified in step configuration'
        };
      }

      // Update service order with technician
      const result = await updateServiceOrder(context.serviceOrder.id, {
        technician_id,
        updated_at: new Date().toISOString()
      });

      if (!result) {
        return {
          success: false,
          error: 'Failed to assign technician to service order'
        };
      }

      // Get technician details
      const supabase = await createClient();
      if (!supabase) {
        return {
          success: true,
          result: {
            previous_technician_id: context.serviceOrder.technician_id,
            new_technician_id: technician_id,
            technician_details: null
          }
        };
      }

      const { data: technician } = await supabase
        .from('technicians')
        .select('*')
        .eq('id', technician_id)
        .single();

      return {
        success: true,
        result: {
          previous_technician_id: context.serviceOrder.technician_id,
          new_technician_id: technician_id,
          technician_details: technician || null
        }
      };
    } catch (error) {
      console.error('Error in assignTechnicianHandler:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

// Handler for sending notifications
const notificationHandler: WorkflowStepHandler = {
  async execute(step: WorkflowStep, context: WorkflowContext, execution: WorkflowStepExecution) {
    try {
      const { title, body, recipient_type, recipient_id } = step.config;
      
      if (!title || !body) {
        return {
          success: false,
          error: 'Missing title or body in notification configuration'
        };
      }

      // Determine recipient ID based on type
      let actualRecipientId = recipient_id;
      if (recipient_type === 'technician' && !recipient_id) {
        actualRecipientId = context.serviceOrder.technician_id;
      } else if (recipient_type === 'customer' && !recipient_id) {
        actualRecipientId = context.serviceOrder.customer_id;
      }

      if (!actualRecipientId) {
        return {
          success: false,
          error: 'No recipient ID available'
        };
      }

      // Create notification in database
      const supabase = await createClient();
      if (!supabase) {
        return {
          success: false,
          error: 'Failed to create Supabase client'
        };
      }

      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          title,
          body,
          user_id: actualRecipientId,
          is_read: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating notification:', error);
        return {
          success: false,
          error: 'Failed to create notification'
        };
      }

      return {
        success: true,
        result: {
          notification_id: notification.id,
          recipient_id: actualRecipientId,
          title,
          body
        }
      };
    } catch (error) {
      console.error('Error in notificationHandler:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

// Handler for creating documents
const createDocumentHandler: WorkflowStepHandler = {
  async execute(step: WorkflowStep, context: WorkflowContext, execution: WorkflowStepExecution) {
    try {
      const { document_type, template_id } = step.config;
      
      if (!document_type) {
        return {
          success: false,
          error: 'No document type specified in step configuration'
        };
      }

      // Create document in database
      const supabase = await createClient();
      if (!supabase) {
        return {
          success: false,
          error: 'Failed to create Supabase client'
        };
      }

      // TODO: Generate document content based on template if template_id is provided

      const { data: document, error } = await supabase
        .from('documents')
        .insert({
          document_type,
          service_order_id: context.serviceOrder.id,
          customer_id: context.serviceOrder.customer_id,
          // file_path will be generated later when the document is actually created
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating document:', error);
        return {
          success: false,
          error: 'Failed to create document'
        };
      }

      return {
        success: true,
        result: {
          document_id: document.id,
          document_type
        }
      };
    } catch (error) {
      console.error('Error in createDocumentHandler:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

// Handler for conditional steps
const conditionHandler: WorkflowStepHandler = {
  async execute(step: WorkflowStep, context: WorkflowContext, execution: WorkflowStepExecution) {
    try {
      const { condition, field, value, operator } = step.config;
      
      if (!condition && (!field || !operator)) {
        return {
          success: false,
          error: 'Invalid condition configuration'
        };
      }

      let conditionResult = false;

      // If a custom condition is provided, evaluate it
      if (condition) {
        // This is a simplified approach - in a real system, you'd want to use a proper expression evaluator
        try {
          // Create a function that evaluates the condition with the context
          const evalFunction = new Function(
            'context',
            `with(context) { return ${condition}; }`
          );
          conditionResult = evalFunction(context);
        } catch (evalError) {
          console.error('Error evaluating condition:', evalError);
          return {
            success: false,
            error: 'Failed to evaluate condition'
          };
        }
      } else {
        // Otherwise, use the field, operator, and value
        const fieldParts = field.split('.');
        let fieldValue = context;
        
        // Navigate through the context object to get the field value
        for (const part of fieldParts) {
          if (fieldValue === undefined || fieldValue === null) {
            break;
          }
          fieldValue = fieldValue[part];
        }

        // Compare the field value with the expected value
        switch (operator) {
          case 'eq':
            conditionResult = fieldValue === value;
            break;
          case 'neq':
            conditionResult = fieldValue !== value;
            break;
          case 'gt':
            conditionResult = fieldValue > value;
            break;
          case 'gte':
            conditionResult = fieldValue >= value;
            break;
          case 'lt':
            conditionResult = fieldValue < value;
            break;
          case 'lte':
            conditionResult = fieldValue <= value;
            break;
          case 'contains':
            conditionResult = String(fieldValue).includes(String(value));
            break;
          case 'startsWith':
            conditionResult = String(fieldValue).startsWith(String(value));
            break;
          case 'endsWith':
            conditionResult = String(fieldValue).endsWith(String(value));
            break;
          default:
            return {
              success: false,
              error: `Unknown operator: ${operator}`
            };
        }
      }

      // Override the next step based on the condition result
      if (conditionResult) {
        // Use the success path
        if (step.next_step_id) {
          // The next step is already set correctly
        } else {
          // No success path defined, treat as end of workflow
        }
      } else {
        // Use the failure path
        if (step.next_step_on_failure_id) {
          // Override the next step with the failure path
          step.next_step_id = step.next_step_on_failure_id;
        } else {
          // No failure path defined, treat as end of workflow
          step.next_step_id = null;
        }
      }

      return {
        success: true,
        result: {
          condition_result: conditionResult
        }
      };
    } catch (error) {
      console.error('Error in conditionHandler:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

// Handler for delay steps
const delayHandler: WorkflowStepHandler = {
  async execute(step: WorkflowStep, context: WorkflowContext, execution: WorkflowStepExecution) {
    try {
      const { delay_minutes } = step.config;
      
      if (!delay_minutes || typeof delay_minutes !== 'number') {
        return {
          success: false,
          error: 'Invalid delay configuration'
        };
      }

      // In a real system, you'd want to use a job scheduler for this
      // For now, we'll just simulate the delay by returning success immediately
      // and the workflow engine will need to handle scheduling the next step

      return {
        success: true,
        result: {
          delay_minutes,
          scheduled_time: new Date(Date.now() + delay_minutes * 60 * 1000).toISOString()
        }
      };
    } catch (error) {
      console.error('Error in delayHandler:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

// Map of step types to handlers
const handlers: Record<WorkflowStepType, WorkflowStepHandler> = {
  service_order_status_change: serviceOrderStatusChangeHandler,
  assign_technician: assignTechnicianHandler,
  notification: notificationHandler,
  create_document: createDocumentHandler,
  condition: conditionHandler,
  delay: delayHandler,
  
  // Placeholder handlers for other step types
  task: {
    async execute() {
      return { success: false, error: 'Task handler not implemented' };
    }
  },
  approval: {
    async execute() {
      return { success: false, error: 'Approval handler not implemented' };
    }
  },
  email: {
    async execute() {
      return { success: false, error: 'Email handler not implemented' };
    }
  },
  sms: {
    async execute() {
      return { success: false, error: 'SMS handler not implemented' };
    }
  },
  custom: {
    async execute() {
      return { success: false, error: 'Custom handler not implemented' };
    }
  }
};

/**
 * Get the handler for a specific step type
 */
export function getStepHandler(type: WorkflowStepType): WorkflowStepHandler | null {
  return handlers[type] || null;
}