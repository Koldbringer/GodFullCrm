import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_CONFIG } from '@/lib/supabase/config';

export interface AutomationNotification {
  id: string;
  workflow_id: string;
  workflow_name: string;
  execution_id: string;
  message: string;
  status: 'info' | 'success' | 'warning' | 'error';
  created_at: string;
  read: boolean;
}

// Helper function to create a Supabase client
const createClient = () => {
  const cookieStore = cookies();
  return createServerClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 });
        }
      }
    }
  );
};

/**
 * Create a notification for an automation event
 */
export async function createAutomationNotification(
  workflowId: string,
  workflowName: string,
  executionId: string,
  message: string,
  status: 'info' | 'success' | 'warning' | 'error' = 'info'
): Promise<void> {
  try {
    const supabase = createClient();
    
    await supabase.from('automation_notifications').insert({
      workflow_id: workflowId,
      workflow_name: workflowName,
      execution_id: executionId,
      message,
      status,
      read: false,
    });
  } catch (error) {
    console.error('Error creating automation notification:', error);
  }
}

/**
 * Get all automation notifications
 */
export async function getAutomationNotifications(
  limit: number = 10,
  offset: number = 0,
  includeRead: boolean = false
): Promise<AutomationNotification[]> {
  try {
    const supabase = createClient();
    
    let query = supabase
      .from('automation_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (!includeRead) {
      query = query.eq('read', false);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching automation notifications:', error);
      return [];
    }
    
    return data as AutomationNotification[];
  } catch (error) {
    console.error('Error fetching automation notifications:', error);
    return [];
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('automation_notifications')
      .update({ read: true })
      .eq('id', notificationId);
    
    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<boolean> {
  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('automation_notifications')
      .update({ read: true })
      .eq('read', false);
    
    if (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('automation_notifications')
      .delete()
      .eq('id', notificationId);
    
    if (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
}