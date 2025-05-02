// Define shared types here

export type ServiceOrder = {
  id: string;
  title: string;
  description: string | null;
  status: string; // Assuming status is always a string based on usage, but could be null in DB
  priority: string | null;
  service_type: string | null; // Matches database schema
  created_at: string | null; // Assuming nullable based on Supabase default
  updated_at: string | null; // Assuming nullable based on Supabase default
  customer_id: string | null;
  site_id: string | null;
  device_id: string | null;
  technician_id: string | null;
  scheduled_start: string | null; // Matches database schema
  scheduled_end: string | null; // Matches database schema
  completed_date: string | null; // Used in fallback data
  estimated_duration: number | null; // Used in fallback data
  notes: string | null; // Used in fallback data
  cost: number | null; // Matches database schema
  payment_status: string | null; // Matches database schema
  workflow_id: string | null; // Reference to a workflow template
  current_step: number | null; // Current step in the workflow
  customers?: { // Optional related data
    id: string; // Assuming id exists
    name: string;
  };
  sites?: { // Optional related data
    id: string; // Assuming id exists
    name: string;
  };
  devices?: { // Optional related data
    id: string; // Assuming id exists
    model: string;
    type: string; // Keep device type for display if needed
  };
  technicians?: { // Optional related data
    id: string; // Assuming id exists
    name: string;
  };
  workflow?: WorkflowTemplate; // Optional related workflow data
};

// Workflow types
export type WorkflowStep = {
  id: string;
  name: string;
  description: string | null;
  order: number;
  estimated_duration: number | null; // in minutes
  required_role: string | null; // Role required to complete this step
  is_automated: boolean; // Whether this step is automated or requires manual action
  triggers_notification: boolean; // Whether completing this step triggers a notification
  next_steps: string[]; // IDs of possible next steps (for branching workflows)
  form_schema: any | null; // JSON schema for any form data required for this step
};

export type WorkflowTemplate = {
  id: string;
  name: string;
  description: string | null;
  service_type: string | null; // Type of service this workflow is for
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
  steps: WorkflowStep[]; // Array of workflow steps
  default_step_id: string | null; // ID of the default first step
};

export type WorkflowExecution = {
  id: string;
  service_order_id: string;
  workflow_template_id: string;
  current_step_id: string | null;
  status: 'active' | 'completed' | 'cancelled' | 'paused';
  started_at: string;
  completed_at: string | null;
  step_history: {
    step_id: string;
    started_at: string;
    completed_at: string | null;
    completed_by: string | null;
    notes: string | null;
    form_data: any | null;
  }[];
};

// Add other shared types as needed