-- Create table for workflow executions
CREATE TABLE IF NOT EXISTS workflow_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  execution_id TEXT NOT NULL UNIQUE,
  workflow_id UUID NOT NULL REFERENCES automation_workflows(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  variables JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on workflow_id for faster lookups
CREATE INDEX IF NOT EXISTS workflow_executions_workflow_id_idx ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS workflow_executions_execution_id_idx ON workflow_executions(execution_id);
CREATE INDEX IF NOT EXISTS workflow_executions_status_idx ON workflow_executions(status);

-- Create table for node executions
CREATE TABLE IF NOT EXISTS workflow_node_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  execution_id TEXT NOT NULL,
  workflow_id UUID NOT NULL,
  node_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (execution_id) REFERENCES workflow_executions(execution_id) ON DELETE CASCADE
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS workflow_node_executions_execution_id_idx ON workflow_node_executions(execution_id);
CREATE INDEX IF NOT EXISTS workflow_node_executions_workflow_id_idx ON workflow_node_executions(workflow_id);
CREATE INDEX IF NOT EXISTS workflow_node_executions_node_id_idx ON workflow_node_executions(node_id);

-- Create table for tasks created by workflows
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description TEXT NOT NULL,
  assignee TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending',
  workflow_execution_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (workflow_execution_id) REFERENCES workflow_executions(execution_id) ON DELETE SET NULL
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS tasks_assignee_idx ON tasks(assignee);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status);
CREATE INDEX IF NOT EXISTS tasks_workflow_execution_id_idx ON tasks(workflow_execution_id);

-- Add is_active column to automation_workflows if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'automation_workflows' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE automation_workflows ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;
