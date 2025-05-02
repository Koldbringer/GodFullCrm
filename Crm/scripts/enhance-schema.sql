-- enhance-schema.sql
-- Script to enhance the Supabase database schema for the CRM system

-- 1. Add missing fields to service_orders table
ALTER TABLE service_orders 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS completed_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS estimated_duration INTEGER,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. Create user_roles table for RBAC
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create user_role_assignments table
CREATE TABLE IF NOT EXISTS user_role_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES user_roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- 4. Create workflow_templates table
CREATE TABLE IF NOT EXISTS workflow_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL DEFAULT '[]',
  service_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create workflow_instances table
CREATE TABLE IF NOT EXISTS workflow_instances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES workflow_templates(id),
  service_order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create inventory_transactions table
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
  service_order_id UUID REFERENCES service_orders(id),
  quantity INTEGER NOT NULL,
  transaction_type TEXT NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create customer_tags table
CREATE TABLE IF NOT EXISTS customer_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Create customer_tag_assignments table
CREATE TABLE IF NOT EXISTS customer_tag_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES customer_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customer_id, tag_id)
);

-- 10. Create notification_templates table
CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  type TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Add triggers for audit logging
CREATE OR REPLACE FUNCTION audit_log_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data,
    ip_address
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    CASE
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END,
    CASE
      WHEN TG_OP = 'INSERT' THEN NULL
      ELSE to_jsonb(OLD)
    END,
    CASE
      WHEN TG_OP = 'DELETE' THEN NULL
      ELSE to_jsonb(NEW)
    END,
    NULL
  );
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Create triggers for key tables
DO $$
DECLARE
  tables TEXT[] := ARRAY['customers', 'service_orders', 'devices', 'sites', 'inventory'];
  t TEXT;
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS audit_trigger ON %I', t);
    EXECUTE format('CREATE TRIGGER audit_trigger AFTER INSERT OR UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION audit_log_changes()', t);
  END LOOP;
END;
$$;

-- 13. Create RLS policies for RBAC
-- Example policy for service_orders
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service orders are viewable by authenticated users"
  ON service_orders FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Technicians can update their assigned service orders"
  ON service_orders FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM user_role_assignments
    JOIN user_roles ON user_role_assignments.role_id = user_roles.id
    WHERE user_roles.name = 'technician'
    AND service_orders.technician_id = (
      SELECT id FROM technicians WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Admins can insert, update, and delete service orders"
  ON service_orders FOR ALL
  USING (auth.uid() IN (
    SELECT user_id FROM user_role_assignments
    JOIN user_roles ON user_role_assignments.role_id = user_roles.id
    WHERE user_roles.name = 'admin'
  ));

-- 14. Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_service_orders_status ON service_orders(status);
CREATE INDEX IF NOT EXISTS idx_service_orders_customer_id ON service_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_technician_id ON service_orders(technician_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_scheduled_start ON service_orders(scheduled_start);
CREATE INDEX IF NOT EXISTS idx_addresses_district ON addresses(district);
CREATE INDEX IF NOT EXISTS idx_sites_customer_id ON sites(customer_id);
CREATE INDEX IF NOT EXISTS idx_devices_site_id ON devices(site_id);
CREATE INDEX IF NOT EXISTS idx_inventory_quantity ON inventory(quantity) WHERE quantity <= reorder_level;

-- 15. Create functions for common operations
CREATE OR REPLACE FUNCTION get_customer_service_history(customer_id UUID)
RETURNS TABLE (
  service_order_id UUID,
  title TEXT,
  status TEXT,
  service_type TEXT,
  scheduled_start TIMESTAMP,
  completed_date TIMESTAMP,
  technician_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    so.id as service_order_id,
    so.title,
    so.status,
    so.service_type,
    so.scheduled_start::TIMESTAMP,
    so.completed_date::TIMESTAMP,
    t.name as technician_name
  FROM
    service_orders so
  LEFT JOIN
    technicians t ON so.technician_id = t.id
  WHERE
    so.customer_id = get_customer_service_history.customer_id
  ORDER BY
    so.scheduled_start DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. Create function to assign workflow to service order
CREATE OR REPLACE FUNCTION assign_workflow_to_service_order(
  service_order_id UUID,
  workflow_template_id UUID
)
RETURNS UUID AS $$
DECLARE
  workflow_instance_id UUID;
BEGIN
  INSERT INTO workflow_instances (
    template_id,
    service_order_id,
    current_step,
    status,
    data
  ) VALUES (
    workflow_template_id,
    service_order_id,
    0,
    'active',
    '{}'
  ) RETURNING id INTO workflow_instance_id;
  
  RETURN workflow_instance_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 17. Create function to advance workflow step
CREATE OR REPLACE FUNCTION advance_workflow_step(
  workflow_instance_id UUID,
  step_data JSONB DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  current_step INTEGER;
  workflow_steps JSONB;
  max_steps INTEGER;
BEGIN
  -- Get current workflow information
  SELECT 
    wi.current_step,
    wt.steps
  INTO
    current_step,
    workflow_steps
  FROM
    workflow_instances wi
  JOIN
    workflow_templates wt ON wi.template_id = wt.id
  WHERE
    wi.id = advance_workflow_step.workflow_instance_id;
  
  -- Calculate max steps
  SELECT jsonb_array_length(workflow_steps) INTO max_steps;
  
  -- Update step data if provided
  IF step_data IS NOT NULL THEN
    UPDATE workflow_instances
    SET data = jsonb_set(
      data,
      ARRAY['step_' || current_step],
      step_data
    )
    WHERE id = workflow_instance_id;
  END IF;
  
  -- Advance step if not at the end
  IF current_step < max_steps - 1 THEN
    UPDATE workflow_instances
    SET 
      current_step = current_step + 1,
      updated_at = NOW()
    WHERE id = workflow_instance_id;
    RETURN TRUE;
  ELSIF current_step = max_steps - 1 THEN
    -- Complete workflow
    UPDATE workflow_instances
    SET 
      status = 'completed',
      updated_at = NOW()
    WHERE id = workflow_instance_id;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;