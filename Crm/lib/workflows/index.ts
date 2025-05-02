/**
 * Workflow module exports
 */

export * from './types';
export * from './engine';
export * from './handlers';

// Re-export common functions for easier access
import { 
  createWorkflowInstance, 
  executeWorkflowStep,
  getWorkflowTemplates,
  getWorkflowInstance,
  getWorkflowInstancesForServiceOrder,
  getStepExecutionsForWorkflowInstance
} from './engine';

export {
  createWorkflowInstance,
  executeWorkflowStep,
  getWorkflowTemplates,
  getWorkflowInstance,
  getWorkflowInstancesForServiceOrder,
  getStepExecutionsForWorkflowInstance
};