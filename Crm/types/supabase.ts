export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          email: string
          phone: string
          address: string
          city: string
          postal_code: string
          notes: string | null
          status: string
          type: string
          tax_id: string | null
          website: string | null
          industry: string | null
          payment_terms: string | null
          credit_limit: number | null
          company_size: number | null
          annual_revenue: number | null
          customer_since: string | null
          referral_source: string | null
          social_media_links: Json | null
          logo_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          email: string
          phone: string
          address: string
          city: string
          postal_code: string
          notes?: string | null
          status?: string
          type?: string
          tax_id?: string | null
          website?: string | null
          industry?: string | null
          payment_terms?: string | null
          credit_limit?: number | null
          company_size?: number | null
          annual_revenue?: number | null
          customer_since?: string | null
          referral_source?: string | null
          social_media_links?: Json | null
          logo_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          city?: string
          postal_code?: string
          notes?: string | null
          status?: string
          type?: string
          tax_id?: string | null
          website?: string | null
          industry?: string | null
          payment_terms?: string | null
          credit_limit?: number | null
          company_size?: number | null
          annual_revenue?: number | null
          customer_since?: string | null
          referral_source?: string | null
          social_media_links?: Json | null
          logo_url?: string | null
        }
        Relationships: []
      }
      sites: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          street: string
          city: string
          zip_code: string
          customer_id: string
          type: string
          status: string
          latitude: number | null
          longitude: number | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          street: string
          city: string
          zip_code: string
          customer_id: string
          type?: string
          status?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          street?: string
          city?: string
          zip_code?: string
          customer_id?: string
          type?: string
          status?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sites_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          }
        ]
      }
      devices: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          model: string
          serial_number: string
          installation_date: string | null
          warranty_expiry: string | null
          site_id: string
          type: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          model: string
          serial_number: string
          installation_date?: string | null
          warranty_expiry?: string | null
          site_id: string
          type?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          model?: string
          serial_number?: string
          installation_date?: string | null
          warranty_expiry?: string | null
          site_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "devices_site_id_fkey"
            columns: ["site_id"]
            referencedRelation: "sites"
            referencedColumns: ["id"]
          }
        ]
      }
      service_orders: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          status: string
          priority: string
          type: string
          scheduled_date: string | null
          completed_date: string | null
          estimated_duration: number | null
          customer_id: string
          site_id: string
          device_id: string | null
          technician_id: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          status?: string
          priority?: string
          type?: string
          scheduled_date?: string | null
          completed_date?: string | null
          estimated_duration?: number | null
          customer_id: string
          site_id: string
          device_id?: string | null
          technician_id?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          status?: string
          priority?: string
          type?: string
          scheduled_date?: string | null
          completed_date?: string | null
          estimated_duration?: number | null
          customer_id?: string
          site_id?: string
          device_id?: string | null
          technician_id?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_orders_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_site_id_fkey"
            columns: ["site_id"]
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_device_id_fkey"
            columns: ["device_id"]
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_technician_id_fkey"
            columns: ["technician_id"]
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          }
        ]
      }
      technicians: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          email: string
          phone: string
          specialization: string | null
          status: string
          notes: string | null
          certification: string | null
          hire_date: string | null
          emergency_contact: string | null
          hourly_rate: number | null
          avatar_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          email: string
          phone: string
          specialization?: string | null
          status?: string
          notes?: string | null
          certification?: string | null
          hire_date?: string | null
          emergency_contact?: string | null
          hourly_rate?: number | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          email?: string
          phone?: string
          specialization?: string | null
          status?: string
          notes?: string | null
          certification?: string | null
          hire_date?: string | null
          emergency_contact?: string | null
          hourly_rate?: number | null
          avatar_url?: string | null
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          category: string
          manufacturer: string | null
          model: string | null
          sku: string | null
          quantity: number
          unit_price: number | null
          location: string | null
          min_quantity: number | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          category: string
          manufacturer?: string | null
          model?: string | null
          sku?: string | null
          quantity: number
          unit_price?: number | null
          location?: string | null
          min_quantity?: number | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          category?: string
          manufacturer?: string | null
          model?: string | null
          sku?: string | null
          quantity?: number
          unit_price?: number | null
          location?: string | null
          min_quantity?: number | null
          notes?: string | null
        }
        Relationships: []
      }
      service_reports: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          service_order_id: string
          technician_id: string
          report_date: string
          work_performed: string
          parts_used: Json | null
          labor_hours: number
          status: string
          customer_signature: boolean
          notes: string | null
          recommendations: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          service_order_id: string
          technician_id: string
          report_date: string
          work_performed: string
          parts_used?: Json | null
          labor_hours: number
          status?: string
          customer_signature?: boolean
          notes?: string | null
          recommendations?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          service_order_id?: string
          technician_id?: string
          report_date?: string
          work_performed?: string
          parts_used?: Json | null
          labor_hours?: number
          status?: string
          customer_signature?: boolean
          notes?: string | null
          recommendations?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_reports_service_order_id_fkey"
            columns: ["service_order_id"]
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_reports_technician_id_fkey"
            columns: ["technician_id"]
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          }
        ]
      }
      device_telemetry: {
        Row: {
          id: string
          created_at: string
          device_id: string
          temperature: number | null
          humidity: number | null
          pressure: number | null
          airflow: number | null
          energy_consumption: number | null
          status: string
          alert: boolean
          alert_message: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          device_id: string
          temperature?: number | null
          humidity?: number | null
          pressure?: number | null
          airflow?: number | null
          energy_consumption?: number | null
          status?: string
          alert?: boolean
          alert_message?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          device_id?: string
          temperature?: number | null
          humidity?: number | null
          pressure?: number | null
          airflow?: number | null
          energy_consumption?: number | null
          status?: string
          alert?: boolean
          alert_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "device_telemetry_device_id_fkey"
            columns: ["device_id"]
            referencedRelation: "devices"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          created_at: string
          user_id: string | null
          title: string
          message: string
          type: string
          is_read: boolean
          source: string
          link: string | null
          is_starred: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string | null
          title: string
          message: string
          type?: string
          is_read?: boolean
          source: string
          link?: string | null
          is_starred?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string | null
          title?: string
          message?: string
          type?: string
          is_read?: boolean
          source?: string
          link?: string | null
          is_starred?: boolean
        }
        Relationships: []
      }
      customer_contacts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          customer_id: string
          name: string
          position: string | null
          email: string
          phone: string
          is_primary: boolean
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          customer_id: string
          name: string
          position?: string | null
          email: string
          phone: string
          is_primary?: boolean
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          customer_id?: string
          name?: string
          position?: string | null
          email?: string
          phone?: string
          is_primary?: boolean
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_contacts_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          }
        ]
      }
      maintenance_schedules: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          device_id: string
          frequency: string
          last_maintenance_date: string | null
          next_maintenance_date: string
          description: string
          technician_id: string | null
          status: string
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          device_id: string
          frequency: string
          last_maintenance_date?: string | null
          next_maintenance_date: string
          description: string
          technician_id?: string | null
          status?: string
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          device_id?: string
          frequency?: string
          last_maintenance_date?: string | null
          next_maintenance_date?: string
          description?: string
          technician_id?: string | null
          status?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_schedules_device_id_fkey"
            columns: ["device_id"]
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_schedules_technician_id_fkey"
            columns: ["technician_id"]
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          }
        ]
      }
      inventory_transactions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          inventory_item_id: string
          quantity: number
          transaction_type: string
          reference_id: string | null
          reference_type: string | null
          notes: string | null
          performed_by: string | null
          unit_price: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          inventory_item_id: string
          quantity: number
          transaction_type: string
          reference_id?: string | null
          reference_type?: string | null
          notes?: string | null
          performed_by?: string | null
          unit_price?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          inventory_item_id?: string
          quantity?: number
          transaction_type?: string
          reference_id?: string | null
          reference_type?: string | null
          notes?: string | null
          performed_by?: string | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          }
        ]
      }
      device_documents: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          device_id: string
          name: string
          description: string | null
          file_url: string
          file_type: string
          file_size: number | null
          uploaded_by: string | null
          document_type: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          device_id: string
          name: string
          description?: string | null
          file_url: string
          file_type: string
          file_size?: number | null
          uploaded_by?: string | null
          document_type: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          device_id?: string
          name?: string
          description?: string | null
          file_url?: string
          file_type?: string
          file_size?: number | null
          uploaded_by?: string | null
          document_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_documents_device_id_fkey"
            columns: ["device_id"]
            referencedRelation: "devices"
            referencedColumns: ["id"]
          }
        ]
      }
      invoices: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          invoice_number: string
          customer_id: string
          service_order_id: string | null
          issue_date: string
          due_date: string
          amount: number
          tax_amount: number
          total_amount: number
          status: string
          notes: string | null
          payment_date: string | null
          payment_method: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          invoice_number: string
          customer_id: string
          service_order_id?: string | null
          issue_date: string
          due_date: string
          amount: number
          tax_amount: number
          total_amount: number
          status?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          invoice_number?: string
          customer_id?: string
          service_order_id?: string | null
          issue_date?: string
          due_date?: string
          amount?: number
          tax_amount?: number
          total_amount?: number
          status?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_service_order_id_fkey"
            columns: ["service_order_id"]
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          }
        ]
      }
      warranty_claims: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          device_id: string
          customer_id: string
          claim_date: string
          description: string
          status: string
          resolution: string | null
          resolution_date: string | null
          manufacturer_claim_number: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          device_id: string
          customer_id: string
          claim_date: string
          description: string
          status?: string
          resolution?: string | null
          resolution_date?: string | null
          manufacturer_claim_number?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          device_id?: string
          customer_id?: string
          claim_date?: string
          description?: string
          status?: string
          resolution?: string | null
          resolution_date?: string | null
          manufacturer_claim_number?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "warranty_claims_device_id_fkey"
            columns: ["device_id"]
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warranty_claims_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          }
        ]
      }
      technician_schedules: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          technician_id: string
          service_order_id: string | null
          start_time: string
          end_time: string
          status: string
          notes: string | null
          schedule_type: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          technician_id: string
          service_order_id?: string | null
          start_time: string
          end_time: string
          status?: string
          notes?: string | null
          schedule_type: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          technician_id?: string
          service_order_id?: string | null
          start_time?: string
          end_time?: string
          status?: string
          notes?: string | null
          schedule_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_schedules_technician_id_fkey"
            columns: ["technician_id"]
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_schedules_service_order_id_fkey"
            columns: ["service_order_id"]
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          }
        ]
      }
      device_parts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          device_id: string
          inventory_item_id: string
          quantity_required: number
          position: string | null
          is_critical: boolean
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          device_id: string
          inventory_item_id: string
          quantity_required: number
          position?: string | null
          is_critical?: boolean
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          device_id?: string
          inventory_item_id?: string
          quantity_required?: number
          position?: string | null
          is_critical?: boolean
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "device_parts_device_id_fkey"
            columns: ["device_id"]
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "device_parts_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          }
        ]
      }
      customer_notes: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          customer_id: string
          created_by: string | null
          content: string
          note_type: string
          is_pinned: boolean
          is_private: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          customer_id: string
          created_by?: string | null
          content: string
          note_type?: string
          is_pinned?: boolean
          is_private?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          customer_id?: string
          created_by?: string | null
          content?: string
          note_type?: string
          is_pinned?: boolean
          is_private?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "customer_notes_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          }
        ]
      }
      customer_files: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          customer_id: string
          name: string
          description: string | null
          file_url: string
          file_type: string
          file_size: number | null
          uploaded_by: string | null
          file_category: string
          is_private: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          customer_id: string
          name: string
          description?: string | null
          file_url: string
          file_type: string
          file_size?: number | null
          uploaded_by?: string | null
          file_category?: string
          is_private?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          customer_id?: string
          name?: string
          description?: string | null
          file_url?: string
          file_type?: string
          file_size?: number | null
          uploaded_by?: string | null
          file_category?: string
          is_private?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "customer_files_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          }
        ]
      },
      tickets: {
        Row: {
          id: string
          title: string
          description: string | null
          status: string
          priority: string
          type: string
          customer_id: string
          site_id: string
          device_id: string | null
          technician_id: string | null
          created_at: string
          updated_at: string
          scheduled_date: string | null
          completed_date: string | null
          estimated_duration: number | null
          notes: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: string
          priority?: string
          type?: string
          customer_id: string
          site_id: string
          device_id?: string | null
          technician_id?: string | null
          created_at?: string
          updated_at?: string
          scheduled_date?: string | null
          completed_date?: string | null
          estimated_duration?: number | null
          notes?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: string
          priority?: string
          type?: string
          customer_id?: string
          site_id?: string
          device_id?: string | null
          technician_id?: string | null
          created_at?: string
          updated_at?: string
          scheduled_date?: string | null
          completed_date?: string | null
          estimated_duration?: number | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_site_id_fkey"
            columns: ["site_id"]
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_device_id_fkey"
            columns: ["device_id"]
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_technician_id_fkey"
            columns: ["technician_id"]
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
