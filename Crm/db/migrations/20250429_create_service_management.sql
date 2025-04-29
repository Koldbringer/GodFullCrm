-- Create service_jobs table
CREATE TABLE IF NOT EXISTS service_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  technician_id UUID REFERENCES users(id) ON DELETE SET NULL,
  technician_name TEXT NOT NULL,
  device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
  device_name TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  description TEXT,
  scheduled_date TIMESTAMPTZ NOT NULL,
  completion_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create service_reports table
CREATE TABLE IF NOT EXISTS service_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_job_id UUID NOT NULL REFERENCES service_jobs(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('inspection', 'maintenance', 'repair', 'installation')),
  findings TEXT,
  actions_taken TEXT,
  parts_used JSONB,
  labor_hours NUMERIC(5,2) NOT NULL,
  follow_up_required BOOLEAN DEFAULT FALSE,
  follow_up_description TEXT,
  images TEXT[],
  signature_url TEXT,
  completed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create service_job_history table for tracking status changes
CREATE TABLE IF NOT EXISTS service_job_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_job_id UUID NOT NULL REFERENCES service_jobs(id) ON DELETE CASCADE,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  changed_by_name TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create devices table if it doesn't exist
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  model TEXT NOT NULL,
  serial_number TEXT,
  manufacturer TEXT NOT NULL,
  category TEXT NOT NULL,
  installation_date DATE,
  warranty_expiry DATE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  location TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'maintenance', 'decommissioned')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create maintenance_schedules table
CREATE TABLE IF NOT EXISTS maintenance_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'monthly', 'quarterly', 'biannually', 'annually')),
  last_maintenance_date TIMESTAMPTZ,
  next_maintenance_date TIMESTAMPTZ NOT NULL,
  maintenance_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS service_jobs_customer_id_idx ON service_jobs(customer_id);
CREATE INDEX IF NOT EXISTS service_jobs_technician_id_idx ON service_jobs(technician_id);
CREATE INDEX IF NOT EXISTS service_jobs_device_id_idx ON service_jobs(device_id);
CREATE INDEX IF NOT EXISTS service_jobs_status_idx ON service_jobs(status);
CREATE INDEX IF NOT EXISTS service_jobs_scheduled_date_idx ON service_jobs(scheduled_date);

CREATE INDEX IF NOT EXISTS service_reports_service_job_id_idx ON service_reports(service_job_id);
CREATE INDEX IF NOT EXISTS service_reports_report_type_idx ON service_reports(report_type);

CREATE INDEX IF NOT EXISTS service_job_history_service_job_id_idx ON service_job_history(service_job_id);

CREATE INDEX IF NOT EXISTS devices_customer_id_idx ON devices(customer_id);
CREATE INDEX IF NOT EXISTS devices_status_idx ON devices(status);
CREATE INDEX IF NOT EXISTS devices_category_idx ON devices(category);

CREATE INDEX IF NOT EXISTS maintenance_schedules_device_id_idx ON maintenance_schedules(device_id);
CREATE INDEX IF NOT EXISTS maintenance_schedules_next_maintenance_date_idx ON maintenance_schedules(next_maintenance_date);

-- Create triggers to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_service_jobs_updated_at ON service_jobs;
CREATE TRIGGER update_service_jobs_updated_at
BEFORE UPDATE ON service_jobs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_service_reports_updated_at ON service_reports;
CREATE TRIGGER update_service_reports_updated_at
BEFORE UPDATE ON service_reports
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_devices_updated_at ON devices;
CREATE TRIGGER update_devices_updated_at
BEFORE UPDATE ON devices
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_maintenance_schedules_updated_at ON maintenance_schedules;
CREATE TRIGGER update_maintenance_schedules_updated_at
BEFORE UPDATE ON maintenance_schedules
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to log service job status changes
CREATE OR REPLACE FUNCTION log_service_job_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO service_job_history (
      service_job_id,
      previous_status,
      new_status,
      changed_by,
      changed_by_name,
      notes
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      auth.uid(),
      (SELECT email FROM auth.users WHERE id = auth.uid()),
      'Status changed'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS log_service_job_status_change_trigger ON service_jobs;
CREATE TRIGGER log_service_job_status_change_trigger
AFTER UPDATE ON service_jobs
FOR EACH ROW
EXECUTE FUNCTION log_service_job_status_change();

-- Add RLS policies
ALTER TABLE service_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_job_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_schedules ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY service_jobs_policy ON service_jobs
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY service_reports_policy ON service_reports
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY service_job_history_policy ON service_job_history
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY devices_policy ON devices
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY maintenance_schedules_policy ON maintenance_schedules
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');