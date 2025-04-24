import { supabase } from './supabase'
import { Database } from '@/types/supabase'

// Typy podstawowe
export type Customer = Database['public']['Tables']['customers']['Row']
export type Site = Database['public']['Tables']['sites']['Row']
export type Device = Database['public']['Tables']['devices']['Row']
export type ServiceOrder = Database['public']['Tables']['service_orders']['Row']
export type Technician = Database['public']['Tables']['technicians']['Row']
export type InventoryItem = Database['public']['Tables']['inventory_items']['Row']
export type ServiceReport = Database['public']['Tables']['service_reports']['Row']
export type DeviceTelemetry = Database['public']['Tables']['device_telemetry']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']

// Typy dla nowych tabel
export type CustomerContact = Database['public']['Tables']['customer_contacts']['Row']
export type MaintenanceSchedule = Database['public']['Tables']['maintenance_schedules']['Row']
export type InventoryTransaction = Database['public']['Tables']['inventory_transactions']['Row']
export type DeviceDocument = Database['public']['Tables']['device_documents']['Row']
export type Invoice = Database['public']['Tables']['invoices']['Row']
export type WarrantyClaim = Database['public']['Tables']['warranty_claims']['Row']
export type TechnicianSchedule = Database['public']['Tables']['technician_schedules']['Row']
export type DevicePart = Database['public']['Tables']['device_parts']['Row']
export type CustomerNote = Database['public']['Tables']['customer_notes']['Row']
export type CustomerFile = Database['public']['Tables']['customer_files']['Row']
export type Ticket = Database['public']['Tables']['tickets']['Row']

// Funkcje dla klientów
export async function getCustomers(options: {
  type?: string,
  status?: string,
  industry?: string,
  search?: string,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
  limit?: number,
  offset?: number
} = {}) {
  let query = supabase
    .from('customers')
    .select('*', { count: 'exact' })

  // Filtrowanie
  if (options.type) {
    query = query.eq('type', options.type)
  }

  if (options.status) {
    query = query.eq('status', options.status)
  }

  if (options.industry) {
    query = query.eq('industry', options.industry)
  }

  if (options.search) {
    query = query.or(
      `name.ilike.%${options.search}%,email.ilike.%${options.search}%,phone.ilike.%${options.search}%,address.ilike.%${options.search}%`
    )
  }

  // Sortowanie
  const sortBy = options.sortBy || 'name'
  const sortOrder = options.sortOrder || 'asc'
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  // Paginacja
  if (options.limit) {
    query = query.limit(options.limit)
  }

  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching customers:', error)
    return { data: [], count: 0 }
  }

  return { data, count }
}

export async function getCustomerById(id: string, includeRelated: boolean = false) {
  let query = supabase
    .from('customers')

  if (includeRelated) {
    query = query.select(`
      *,
      sites(id, name, street, city, zip_code, type, status),
      customer_contacts(id, name, position, email, phone, is_primary),
      service_orders(id, title, status, scheduled_date, priority),
      invoices(id, invoice_number, issue_date, due_date, total_amount, status),
      warranty_claims(id, device_id, claim_date, status, devices(name, model))
    `)
  } else {
    query = query.select('*')
  }

  const { data, error } = await query
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching customer with id ${id}:`, error)
    return null
  }

  return data
}

export async function createCustomer(customer: Database['public']['Tables']['customers']['Insert']) {
  const { data, error } = await supabase
    .from('customers')
    .insert(customer)
    .select()

  if (error) {
    console.error('Error creating customer:', error)
    return null
  }

  return data[0]
}

export async function updateCustomer(id: string, customer: Database['public']['Tables']['customers']['Update']) {
  const { data, error } = await supabase
    .from('customers')
    .update(customer)
    .eq('id', id)
    .select()

  if (error) {
    console.error(`Error updating customer with id ${id}:`, error)
    return null
  }

  return data[0]
}

// Funkcje dla lokalizacji
export async function getSites() {
  const { data, error } = await supabase
    .from('sites')
    .select('*, customers(name, email, phone)')
    .order('name')

  if (error) {
    console.error('Error fetching sites:', error)
    return []
  }

  return data
}

export async function getSiteById(id: string) {
  const { data, error } = await supabase
    .from('sites')
    .select('*, customers(name, email, phone)')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching site with id ${id}:`, error)
    return null
  }

  return data
}

export async function getSitesByCustomerId(customerId: string, includeDevices: boolean = false) {
  let query = supabase
    .from('sites')

  if (includeDevices) {
    query = query.select(`
      *,
      devices(id, name, model, serial_number, type, status)
    `)
  } else {
    query = query.select('*')
  }

  const { data, error } = await query
    .eq('customer_id', customerId)
    .order('name')

  if (error) {
    console.error(`Error fetching sites for customer ${customerId}:`, error)
    return []
  }

  return data
}

export async function createSite(site: Database['public']['Tables']['sites']['Insert']) {
  const { data, error } = await supabase
    .from('sites')
    .insert(site)
    .select()

  if (error) {
    console.error('Error creating site:', error)
    return null
  }

  return data[0]
}

export async function updateSite(id: string, site: Database['public']['Tables']['sites']['Update']) {
  const { data, error } = await supabase
    .from('sites')
    .update(site)
    .eq('id', id)
    .select()

  if (error) {
    console.error(`Error updating site with id ${id}:`, error)
    return null
  }

  return data[0]
}

// Funkcje dla urządzeń
export async function getDevices() {
  const { data, error } = await supabase
    .from('devices')
    .select('*, sites(name, street)')
    .order('model')

  if (error) {
    console.error('Error fetching devices:', error)
    return []
  }

  return data
}

export async function getDeviceById(id: string) {
  const { data, error } = await supabase
    .from('devices')
    .select('*, sites(name, street, customer_id, customers(name))')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching device with id ${id}:`, error)
    return null
  }

  return data
}

export async function getDevicesBySiteId(siteId: string) {
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('site_id', siteId)
    .order('name')

  if (error) {
    console.error(`Error fetching devices for site ${siteId}:`, error)
    return []
  }

  return data
}

export async function createDevice(device: Database['public']['Tables']['devices']['Insert']) {
  const { data, error } = await supabase
    .from('devices')
    .insert(device)
    .select()

  if (error) {
    console.error('Error creating device:', error)
    return null
  }

  return data[0]
}

export async function updateDevice(id: string, device: Database['public']['Tables']['devices']['Update']) {
  const { data, error } = await supabase
    .from('devices')
    .update(device)
    .eq('id', id)
    .select()

  if (error) {
    console.error(`Error updating device with id ${id}:`, error)
    return null
  }

  return data[0]
}

// Funkcje dla zleceń serwisowych
export async function getServiceOrders() {
  const { data, error } = await supabase
    .from('service_orders')
    .select(`
      *,
      customers(name),
      sites(name, street),
      devices(type, model),
      technicians(name)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching service orders:', error)
    return []
  }

  return data
}

export async function getServiceOrderById(id: string) {
  const { data, error } = await supabase
    .from('service_orders')
    .select(`
      *,
      customers(name, email, phone),
      sites(name, street),
      devices(type, model, serial_number),
      technicians(name, email, phone)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching service order with id ${id}:`, error)
    return null
  }

  return data
}

export async function createServiceOrder(order: Database['public']['Tables']['service_orders']['Insert']) {
  const { data, error } = await supabase
    .from('service_orders')
    .insert(order)
    .select()

  if (error) {
    console.error('Error creating service order:', error)
    return null
  }

  return data[0]
}

export async function updateServiceOrder(id: string, order: Database['public']['Tables']['service_orders']['Update']) {
  const { data, error } = await supabase
    .from('service_orders')
    .update(order)
    .eq('id', id)
    .select()

  if (error) {
    console.error(`Error updating service order with id ${id}:`, error)
    return null
  }

  return data[0]
}

// Funkcje dla techników
export async function getTechnicians() {
  const { data, error } = await supabase
    .from('technicians')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching technicians:', error)
    return []
  }

  return data
}

export async function getTechnicianById(id: string) {
  const { data, error } = await supabase
    .from('technicians')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching technician with id ${id}:`, error)
    return null
  }

  return data
}

// Funkcje dla magazynu
export async function getInventoryItems() {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching inventory items:', error)
    return []
  }

  return data
}

export async function getInventoryItemById(id: string) {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching inventory item with id ${id}:`, error)
    return null
  }

  return data
}

// Funkcje dla raportów serwisowych
export async function getServiceReports() {
  const { data, error } = await supabase
    .from('service_reports')
    .select(`
      *,
      service_orders(title, customer_id, site_id, customers(name), sites(name)),
      technicians(name)
    `)
    .order('report_date', { ascending: false })

  if (error) {
    console.error('Error fetching service reports:', error)
    return []
  }

  return data
}

export async function getServiceReportById(id: string) {
  const { data, error } = await supabase
    .from('service_reports')
    .select(`
      *,
      service_orders(title, description, customer_id, site_id, device_id, customers(name), sites(name), devices(name, model)),
      technicians(name, email, phone)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching service report with id ${id}:`, error)
    return null
  }

  return data
}

export async function createServiceReport(report: Database['public']['Tables']['service_reports']['Insert']) {
  const { data, error } = await supabase
    .from('service_reports')
    .insert(report)
    .select()

  if (error) {
    console.error('Error creating service report:', error)
    return null
  }

  return data[0]
}

// Funkcje dla telemetrii urządzeń
export async function getDeviceTelemetry(deviceId: string, limit = 100) {
  const { data, error } = await supabase
    .from('device_telemetry')
    .select('*')
    .eq('device_id', deviceId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error(`Error fetching telemetry for device ${deviceId}:`, error)
    return []
  }

  return data
}

export async function getLatestDeviceTelemetry(deviceId: string) {
  const { data, error } = await supabase
    .from('device_telemetry')
    .select('*')
    .eq('device_id', deviceId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error(`Error fetching latest telemetry for device ${deviceId}:`, error)
    return null
  }

  return data
}

// Funkcje dla powiadomień
export async function getNotifications(userId?: string, limit = 50) {
  let query = supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching notifications:', error)
    return []
  }

  return data
}

export async function getUnreadNotificationsCount(userId?: string) {
  let query = supabase
    .from('notifications')
    .select('id', { count: 'exact' })
    .eq('is_read', false)

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { count, error } = await query

  if (error) {
    console.error('Error fetching unread notifications count:', error)
    return 0
  }

  return count || 0
}

export async function markNotificationAsRead(id: string) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .select()

  if (error) {
    console.error(`Error marking notification ${id} as read:`, error)
    return null
  }

  return data[0]
}

export async function markAllNotificationsAsRead(userId?: string) {
  let query = supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('is_read', false)

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { error } = await query

  if (error) {
    console.error('Error marking all notifications as read:', error)
    return false
  }

  return true
}

export async function toggleNotificationStar(id: string, isStarred: boolean) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_starred: isStarred })
    .eq('id', id)
    .select()

  if (error) {
    console.error(`Error toggling star for notification ${id}:`, error)
    return null
  }

  return data[0]
}

export async function deleteNotification(id: string) {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting notification ${id}:`, error)
    return false
  }

  return true
}

// Funkcje dla kontaktów klientów
export async function getCustomerContacts(customerId: string) {
  const { data, error } = await supabase
    .from('customer_contacts')
    .select('*')
    .eq('customer_id', customerId)
    .order('is_primary', { ascending: false })
    .order('name')

  if (error) {
    console.error(`Error fetching contacts for customer ${customerId}:`, error)
    return []
  }

  return data
}

export async function getCustomerContactById(id: string) {
  const { data, error } = await supabase
    .from('customer_contacts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching customer contact with id ${id}:`, error)
    return null
  }

  return data
}

export async function createCustomerContact(contact: Database['public']['Tables']['customer_contacts']['Insert']) {
  const { data, error } = await supabase
    .from('customer_contacts')
    .insert(contact)
    .select()

  if (error) {
    console.error('Error creating customer contact:', error)
    return null
  }

  return data[0]
}

export async function updateCustomerContact(id: string, contact: Database['public']['Tables']['customer_contacts']['Update']) {
  const { data, error } = await supabase
    .from('customer_contacts')
    .update(contact)
    .eq('id', id)
    .select()

  if (error) {
    console.error(`Error updating customer contact with id ${id}:`, error)
    return null
  }

  return data[0]
}

export async function deleteCustomerContact(id: string) {
  const { error } = await supabase
    .from('customer_contacts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting customer contact ${id}:`, error)
    return false
  }

  return true
}

// Funkcje dla harmonogramów konserwacji
export async function getMaintenanceSchedules(deviceId?: string) {
  let query = supabase
    .from('maintenance_schedules')
    .select(`
      *,
      devices(name, model, serial_number, site_id, sites(name, customer_id, customers(name))),
      technicians(name, email, phone)
    `)
    .order('next_maintenance_date')

  if (deviceId) {
    query = query.eq('device_id', deviceId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching maintenance schedules:', error)
    return []
  }

  return data
}

export async function getMaintenanceScheduleById(id: string) {
  const { data, error } = await supabase
    .from('maintenance_schedules')
    .select(`
      *,
      devices(name, model, serial_number, site_id, sites(name, customer_id, customers(name))),
      technicians(name, email, phone)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching maintenance schedule with id ${id}:`, error)
    return null
  }

  return data
}

export async function createMaintenanceSchedule(schedule: Database['public']['Tables']['maintenance_schedules']['Insert']) {
  const { data, error } = await supabase
    .from('maintenance_schedules')
    .insert(schedule)
    .select()

  if (error) {
    console.error('Error creating maintenance schedule:', error)
    return null
  }

  return data[0]
}

export async function updateMaintenanceSchedule(id: string, schedule: Database['public']['Tables']['maintenance_schedules']['Update']) {
  const { data, error } = await supabase
    .from('maintenance_schedules')
    .update(schedule)
    .eq('id', id)
    .select()

  if (error) {
    console.error(`Error updating maintenance schedule with id ${id}:`, error)
    return null
  }

  return data[0]
}

export async function deleteMaintenanceSchedule(id: string) {
  const { error } = await supabase
    .from('maintenance_schedules')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting maintenance schedule ${id}:`, error)
    return false
  }

  return true
}

// Funkcje dla transakcji magazynowych
export async function getInventoryTransactions(inventoryItemId?: string) {
  let query = supabase
    .from('inventory_transactions')
    .select(`
      *,
      inventory_items(name, category)
    `)
    .order('created_at', { ascending: false })

  if (inventoryItemId) {
    query = query.eq('inventory_item_id', inventoryItemId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching inventory transactions:', error)
    return []
  }

  return data
}

export async function createInventoryTransaction(transaction: Database['public']['Tables']['inventory_transactions']['Insert']) {
  const { data, error } = await supabase
    .from('inventory_transactions')
    .insert(transaction)
    .select()

  if (error) {
    console.error('Error creating inventory transaction:', error)
    return null
  }

  // Aktualizacja stanu magazynowego
  if (data[0]) {
    const { inventory_item_id, quantity, transaction_type } = data[0]
    const { data: inventoryItem } = await supabase
      .from('inventory_items')
      .select('quantity')
      .eq('id', inventory_item_id)
      .single()

    if (inventoryItem) {
      let newQuantity = inventoryItem.quantity

      if (transaction_type === 'receipt') {
        newQuantity += quantity
      } else if (transaction_type === 'issue') {
        newQuantity -= quantity
      }

      await supabase
        .from('inventory_items')
        .update({ quantity: newQuantity })
        .eq('id', inventory_item_id)
    }
  }

  return data[0]
}

// Funkcje dla dokumentów urządzeń
export async function getDeviceDocuments(deviceId: string) {
  const { data, error } = await supabase
    .from('device_documents')
    .select('*')
    .eq('device_id', deviceId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(`Error fetching documents for device ${deviceId}:`, error)
    return []
  }

  return data
}

export async function getDeviceDocumentById(id: string) {
  const { data, error } = await supabase
    .from('device_documents')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching device document with id ${id}:`, error)
    return null
  }

  return data
}

export async function createDeviceDocument(document: Database['public']['Tables']['device_documents']['Insert']) {
  const { data, error } = await supabase
    .from('device_documents')
    .insert(document)
    .select()

  if (error) {
    console.error('Error creating device document:', error)
    return null
  }

  return data[0]
}

export async function deleteDeviceDocument(id: string) {
  const { error } = await supabase
    .from('device_documents')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting device document ${id}:`, error)
    return false
  }

  return true
}

// Funkcje dla faktur
export async function getInvoices(customerId?: string) {
  let query = supabase
    .from('invoices')
    .select(`
      *,
      customers(name),
      service_orders(title)
    `)
    .order('issue_date', { ascending: false })

  if (customerId) {
    query = query.eq('customer_id', customerId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching invoices:', error)
    return []
  }

  return data
}

export async function getInvoiceById(id: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      customers(name, email, phone, address, city, postal_code),
      service_orders(title, description)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching invoice with id ${id}:`, error)
    return null
  }

  return data
}

export async function createInvoice(invoice: Database['public']['Tables']['invoices']['Insert']) {
  const { data, error } = await supabase
    .from('invoices')
    .insert(invoice)
    .select()

  if (error) {
    console.error('Error creating invoice:', error)
    return null
  }

  return data[0]
}

export async function updateInvoice(id: string, invoice: Database['public']['Tables']['invoices']['Update']) {
  const { data, error } = await supabase
    .from('invoices')
    .update(invoice)
    .eq('id', id)
    .select()

  if (error) {
    console.error(`Error updating invoice with id ${id}:`, error)
    return null
  }

  return data[0]
}

// Funkcje dla zgłoszeń gwarancyjnych
export async function getWarrantyClaims(deviceId?: string, customerId?: string) {
  let query = supabase
    .from('warranty_claims')
    .select(`
      *,
      devices(name, model, serial_number),
      customers(name)
    `)
    .order('claim_date', { ascending: false })

  if (deviceId) {
    query = query.eq('device_id', deviceId)
  }

  if (customerId) {
    query = query.eq('customer_id', customerId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching warranty claims:', error)
    return []
  }

  return data
}

export async function getWarrantyClaimById(id: string) {
  const { data, error } = await supabase
    .from('warranty_claims')
    .select(`
      *,
      devices(name, model, serial_number, site_id, sites(name)),
      customers(name, email, phone)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching warranty claim with id ${id}:`, error)
    return null
  }

  return data
}

export async function createWarrantyClaim(claim: Database['public']['Tables']['warranty_claims']['Insert']) {
  const { data, error } = await supabase
    .from('warranty_claims')
    .insert(claim)
    .select()

  if (error) {
    console.error('Error creating warranty claim:', error)
    return null
  }

  return data[0]
}

export async function updateWarrantyClaim(id: string, claim: Database['public']['Tables']['warranty_claims']['Update']) {
  const { data, error } = await supabase
    .from('warranty_claims')
    .update(claim)
    .eq('id', id)
    .select()

  if (error) {
    console.error(`Error updating warranty claim with id ${id}:`, error)
    return null
  }

  return data[0]
}

// Funkcje dla harmonogramów techników
export async function getTechnicianSchedules(technicianId?: string, startDate?: string, endDate?: string) {
  let query = supabase
    .from('technician_schedules')
    .select(`
      *,
      technicians(name),
      service_orders(title, customer_id, site_id, customers(name), sites(name))
    `)
    .order('start_time')

  if (technicianId) {
    query = query.eq('technician_id', technicianId)
  }

  if (startDate) {
    query = query.gte('start_time', startDate)
  }

  if (endDate) {
    query = query.lte('end_time', endDate)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching technician schedules:', error)
    return []
  }

  return data
}

export async function createTechnicianSchedule(schedule: Database['public']['Tables']['technician_schedules']['Insert']) {
  const { data, error } = await supabase
    .from('technician_schedules')
    .insert(schedule)
    .select()

  if (error) {
    console.error('Error creating technician schedule:', error)
    return null
  }

  return data[0]
}

export async function updateTechnicianSchedule(id: string, schedule: Database['public']['Tables']['technician_schedules']['Update']) {
  const { data, error } = await supabase
    .from('technician_schedules')
    .update(schedule)
    .eq('id', id)
    .select()

  if (error) {
    console.error(`Error updating technician schedule with id ${id}:`, error)
    return null
  }

  return data[0]
}

export async function deleteTechnicianSchedule(id: string) {
  const { error } = await supabase
    .from('technician_schedules')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting technician schedule ${id}:`, error)
    return false
  }

  return true
}

// Funkcje dla części urządzeń
export async function getDeviceParts(deviceId: string) {
  const { data, error } = await supabase
    .from('device_parts')
    .select(`
      *,
      inventory_items(name, category, quantity, unit_price)
    `)
    .eq('device_id', deviceId)
    .order('is_critical', { ascending: false })

  if (error) {
    console.error(`Error fetching parts for device ${deviceId}:`, error)
    return []
  }

  return data
}

export async function createDevicePart(part: Database['public']['Tables']['device_parts']['Insert']) {
  const { data, error } = await supabase
    .from('device_parts')
    .insert(part)
    .select()

  if (error) {
    console.error('Error creating device part:', error)
    return null
  }

  return data[0]
}

export async function updateDevicePart(id: string, part: Database['public']['Tables']['device_parts']['Update']) {
  const { data, error } = await supabase
    .from('device_parts')
    .update(part)
    .eq('id', id)
    .select()

  if (error) {
    console.error(`Error updating device part with id ${id}:`, error)
    return null
  }

  return data[0]
}

export async function deleteDevicePart(id: string) {
  const { error } = await supabase
    .from('device_parts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting device part ${id}:`, error)
    return false
  }

  return true
}

// Funkcje dla notatek klientów
export async function getCustomerNotes(customerId: string) {
  const { data, error } = await supabase
    .from('customer_notes')
    .select('*')
    .eq('customer_id', customerId)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error(`Error fetching notes for customer ${customerId}:`, error)
    return []
  }

  return data
}

export async function getCustomerNoteById(id: string) {
  const { data, error } = await supabase
    .from('customer_notes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching customer note with id ${id}:`, error)
    return null
  }

  return data
}

export async function createCustomerNote(note: Database['public']['Tables']['customer_notes']['Insert']) {
  const { data, error } = await supabase
    .from('customer_notes')
    .insert(note)
    .select()

  if (error) {
    console.error('Error creating customer note:', error)
    return null
  }

  return data[0]
}

export async function updateCustomerNote(id: string, note: Database['public']['Tables']['customer_notes']['Update']) {
  const { data, error } = await supabase
    .from('customer_notes')
    .update(note)
    .eq('id', id)
    .select()

  if (error) {
    console.error(`Error updating customer note with id ${id}:`, error)
    return null
  }

  return data[0]
}

export async function deleteCustomerNote(id: string) {
  const { error } = await supabase
    .from('customer_notes')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting customer note ${id}:`, error)
    return false
  }

  return true
}

export async function toggleCustomerNotePin(id: string, isPinned: boolean) {
  const { data, error } = await supabase
    .from('customer_notes')
    .update({ is_pinned: isPinned })
    .eq('id', id)
    .select()

  if (error) {
    console.error(`Error toggling pin for customer note ${id}:`, error)
    return null
  }

  return data[0]
}

// Funkcje dla plików klientów
export async function getCustomerFiles(customerId: string) {
  const { data, error } = await supabase
    .from('customer_files')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(`Error fetching files for customer ${customerId}:`, error)
    return []
  }

  return data
}

export async function getCustomerFileById(id: string) {
  const { data, error } = await supabase
    .from('customer_files')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching customer file with id ${id}:`, error)
    return null
  }

  return data
}

export async function createCustomerFile(file: Database['public']['Tables']['customer_files']['Insert']) {
  const { data, error } = await supabase
    .from('customer_files')
    .insert(file)
    .select()

  if (error) {
    console.error('Error creating customer file:', error)
    return null
  }

  return data[0]
}

export async function updateCustomerFile(id: string, file: Database['public']['Tables']['customer_files']['Update']) {
  const { data, error } = await supabase
    .from('customer_files')
    .update(file)
    .eq('id', id)
    .select()

  if (error) {
    console.error(`Error updating customer file with id ${id}:`, error)
    return null
  }

  return data[0]
}

export async function deleteCustomerFile(id: string) {
  const { error } = await supabase
    .from('customer_files')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting customer file ${id}:`, error)
    return false
  }

  return true
}

// Funkcje dla zgłoszeń (tickets)
export async function getTickets() {
  const { data, error } = await supabase
    .from('tickets')
    .select(`
      *,
      customers(name),
      sites(name, street),
      devices(type, model),
      technicians(name)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tickets:', error)
    return []
  }

  return data
}

export async function getTicketById(id: string) {
  const { data, error } = await supabase
    .from('tickets')
    .select(`
      *,
      customers(name, email, phone),
      sites(name, street),
      devices(type, model, serial_number),
      technicians(name, email, phone)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching ticket with id ${id}:`, error)
    return null
  }

  return data
}

export async function createTicket(ticket: Database['public']['Tables']['tickets']['Insert']) {
  const { data, error } = await supabase
    .from('tickets')
    .insert(ticket)
    .select()

  if (error) {
    console.error('Error creating ticket:', error)
    return null
  }

  return data[0]
}

export async function updateTicket(id: string, ticket: Database['public']['Tables']['tickets']['Update']) {
  const { data, error } = await supabase
    .from('tickets')
    .update(ticket)
    .eq('id', id)
    .select()

  if (error) {
    console.error(`Error updating ticket with id ${id}:`, error)
    return null
  }

  return data[0]
}

export async function deleteTicket(id: string) {
  const { error } = await supabase
    .from('tickets')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting ticket ${id}:`, error)
    return false
  }

  return true
}
