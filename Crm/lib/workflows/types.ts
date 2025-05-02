/**
 * Types for workflow automation
 */

export type WorkflowStepType = 
  | 'task'
  | 'approval'
  | 'notification'
  | 'email'
  | 'sms'
  | 'condition'
  | 'delay'
  | 'service_order_status_change'
  | 'assign_technician'
  | 'create_document'
  | 'custom';

export interface WorkflowStep {
  id: string;
  name: string;
  type: WorkflowStepType;
  description?: string;
  config: Record<string, any>;
  next_step_id?: string | null;
  next_step_on_failure_id?: string | null;
  is_required: boolean;
  timeout_minutes?: number | null;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description?: string;
  service_type?: string | null;
  steps: WorkflowStep[];
  created_at: string;
  updated_at: string;
}

export interface WorkflowInstance {
  id: string;
  template_id: string;
  service_order_id: string;
  current_step_id: string | null;
  status: 'active' | 'completed' | 'failed' | 'cancelled';
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface WorkflowStepExecution {
  id: string;
  workflow_instance_id: string;
  step_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  result?: Record<string, any> | null;
  error_message?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  assigned_to?: string | null;
}

export interface WorkflowContext {
  serviceOrder: any;
  customer: any;
  technician: any;
  site: any;
  device: any;
  user: any;
  data: Record<string, any>;
}

export interface WorkflowStepHandler {
  execute: (
    step: WorkflowStep,
    context: WorkflowContext,
    execution: WorkflowStepExecution
  ) => Promise<{
    success: boolean;
    result?: Record<string, any>;
    error?: string;
  }>;
}