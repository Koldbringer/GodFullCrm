-- Create calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('service', 'installation', 'inspection')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  customer TEXT NOT NULL,
  technician TEXT NOT NULL,
  location TEXT NOT NULL,
  device TEXT,
  status TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS calendar_events_type_idx ON calendar_events(type);
CREATE INDEX IF NOT EXISTS calendar_events_start_date_idx ON calendar_events(start_date);
CREATE INDEX IF NOT EXISTS calendar_events_end_date_idx ON calendar_events(end_date);
CREATE INDEX IF NOT EXISTS calendar_events_customer_idx ON calendar_events(customer);
CREATE INDEX IF NOT EXISTS calendar_events_technician_idx ON calendar_events(technician);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_calendar_events_updated_at ON calendar_events;
CREATE TRIGGER update_calendar_events_updated_at
BEFORE UPDATE ON calendar_events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY calendar_events_policy ON calendar_events
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');