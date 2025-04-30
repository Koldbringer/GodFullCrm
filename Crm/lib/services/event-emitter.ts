/**
 * Utility to emit events that can trigger workflows
 */

/**
 * Emit an event that can trigger workflows
 * @param eventType The type of event to emit
 * @param eventData The data associated with the event
 */
export async function emitEvent(eventType: string, eventData: Record<string, any> = {}): Promise<void> {
  try {
    // Call the event trigger API
    const response = await fetch('/api/automation/triggers/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType,
        eventData,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to emit event: ${errorData.error || response.statusText}`);
    }
    
    console.log(`Event ${eventType} emitted successfully`);
  } catch (error) {
    console.error(`Error emitting event ${eventType}:`, error);
    throw error;
  }
}

/**
 * Common event types used in the system
 */
export const EventTypes = {
  // Customer events
  CUSTOMER_CREATED: 'customer.created',
  CUSTOMER_UPDATED: 'customer.updated',
  CUSTOMER_DELETED: 'customer.deleted',
  
  // Service order events
  SERVICE_ORDER_CREATED: 'service_order.created',
  SERVICE_ORDER_UPDATED: 'service_order.updated',
  SERVICE_ORDER_COMPLETED: 'service_order.completed',
  SERVICE_ORDER_CANCELLED: 'service_order.cancelled',
  SERVICE_ORDER_ASSIGNED: 'service_order.assigned',
  
  // Device events
  DEVICE_CREATED: 'device.created',
  DEVICE_UPDATED: 'device.updated',
  DEVICE_DELETED: 'device.deleted',
  DEVICE_MAINTENANCE_DUE: 'device.maintenance_due',
  
  // Technician events
  TECHNICIAN_CREATED: 'technician.created',
  TECHNICIAN_UPDATED: 'technician.updated',
  TECHNICIAN_DELETED: 'technician.deleted',
  
  // Inventory events
  INVENTORY_LOW: 'inventory.low',
  INVENTORY_OUT_OF_STOCK: 'inventory.out_of_stock',
  INVENTORY_RESTOCKED: 'inventory.restocked',
  
  // User events
  USER_LOGGED_IN: 'user.logged_in',
  USER_LOGGED_OUT: 'user.logged_out',
  USER_PASSWORD_RESET: 'user.password_reset',
  
  // System events
  SYSTEM_ERROR: 'system.error',
  SYSTEM_WARNING: 'system.warning',
  SYSTEM_NOTIFICATION: 'system.notification',
};
