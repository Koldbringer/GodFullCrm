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
};

// Add other shared types as needed