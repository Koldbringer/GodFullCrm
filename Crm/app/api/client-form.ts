// Crm/lib/api/client-form.ts
import { createClient } from "@/lib/supabase/client"
import { v4 as uuidv4 } from "uuid"

/**
 * Creates a new client form token and returns the URL to access it
 */
export async function createClientFormToken(initialData: any = {}) {
  const supabase = createClient()
  const token = uuidv4()
  
  const { error } = await supabase
    .from('client_form_tokens')
    .insert({
      token,
      initial_data: initialData,
      status: 'created',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    })
  
  if (error) {
    console.error("Error creating client form token:", error)
    throw error
  }
  
  // Return the URL to access the form
  return `/mobile/client-form/${token}`
}

/**
 * Gets the submitted form data for a given token
 */
export async function getClientFormData(token: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('client_forms')
    .select('*')
    .eq('token', token)
    .single()
  
  if (error) {
    console.error("Error getting client form data:", error)
    return null
  }
  
  return data
}

/**
 * Converts submitted form data to a customer record
 */
export async function convertFormToCustomer(formId: string) {
  const supabase = createClient()
  
  // Get the form data
  const { data: formData, error: formError } = await supabase
    .from('client_forms')
    .select('*')
    .eq('id', formId)
    .single()
  
  if (formError || !formData) {
    console.error("Error getting form data:", formError)
    return null
  }
  
  // Create a new customer record
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .insert({
      name: formData.form_data.name,
      email: formData.form_data.email,
      phone: formData.form_data.phone,
      address: formData.form_data.address,
      city: formData.form_data.city,
      postal_code: formData.form_data.postalCode,
      source: 'client_form',
      status: 'lead'
    })
    .select()
    .single()
  
  if (customerError) {
    console.error("Error creating customer:", customerError)
    return null
  }
  
  // Update the form status
  await supabase
    .from('client_forms')
    .update({ status: 'converted', customer_id: customer.id })
    .eq('id', formId)
  
  return customer
}