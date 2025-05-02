/**
 * Mastra CRM Tools
 * These tools provide AI-powered functionality for the CRM/ERP system
 */

import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';

/**
 * Tool to search customers in the database
 */
export const searchCustomersTool = createTool({
  id: 'search-customers',
  description: 'Search for customers in the database by name, email, phone, or address',
  inputSchema: z.object({
    query: z.string().describe('Search query (name, email, phone, or address)'),
    limit: z.number().optional().default(10).describe('Maximum number of results to return'),
  }),
  outputSchema: z.object({
    customers: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().nullable(),
        phone: z.string().nullable(),
        address: z.string().nullable(),
        created_at: z.string(),
      })
    ),
    count: z.number(),
  }),
  execute: async ({ context }) => {
    try {
      const supabase = createClient();
      
      // Build the query
      let query = supabase
        .from('customers')
        .select('id, name, email, phone, address, created_at', { count: 'exact' });
      
      // Apply search filter if query is provided
      if (context.query) {
        query = query.or(
          `name.ilike.%${context.query}%,email.ilike.%${context.query}%,phone.ilike.%${context.query}%,address.ilike.%${context.query}%`
        );
      }
      
      // Apply limit
      query = query.limit(context.limit);
      
      // Execute the query
      const { data, count, error } = await query;
      
      if (error) {
        throw new Error(`Error searching customers: ${error.message}`);
      }
      
      return {
        customers: data || [],
        count: count || 0,
      };
    } catch (error) {
      console.error('Error in searchCustomersTool:', error);
      throw error;
    }
  },
});

/**
 * Tool to search service orders in the database
 */
export const searchServiceOrdersTool = createTool({
  id: 'search-service-orders',
  description: 'Search for service orders in the database by customer, status, type, or date range',
  inputSchema: z.object({
    customerId: z.string().optional().describe('Customer ID to filter by'),
    status: z.string().optional().describe('Status to filter by (e.g., "pending", "completed")'),
    type: z.string().optional().describe('Type to filter by (e.g., "service", "installation", "inspection")'),
    fromDate: z.string().optional().describe('Start date in ISO format (YYYY-MM-DD)'),
    toDate: z.string().optional().describe('End date in ISO format (YYYY-MM-DD)'),
    limit: z.number().optional().default(10).describe('Maximum number of results to return'),
  }),
  outputSchema: z.object({
    serviceOrders: z.array(
      z.object({
        id: z.string(),
        customer_id: z.string(),
        customer_name: z.string(),
        status: z.string(),
        type: z.string(),
        description: z.string().nullable(),
        scheduled_date: z.string().nullable(),
        created_at: z.string(),
      })
    ),
    count: z.number(),
  }),
  execute: async ({ context }) => {
    try {
      const supabase = createClient();
      
      // Build the query
      let query = supabase
        .from('service_orders')
        .select(`
          id, 
          customer_id, 
          status, 
          type, 
          description, 
          scheduled_date, 
          created_at,
          customers(name)
        `, { count: 'exact' });
      
      // Apply filters
      if (context.customerId) {
        query = query.eq('customer_id', context.customerId);
      }
      
      if (context.status) {
        query = query.eq('status', context.status);
      }
      
      if (context.type) {
        query = query.eq('type', context.type);
      }
      
      if (context.fromDate) {
        query = query.gte('scheduled_date', context.fromDate);
      }
      
      if (context.toDate) {
        query = query.lte('scheduled_date', context.toDate);
      }
      
      // Apply limit
      query = query.limit(context.limit);
      
      // Execute the query
      const { data, count, error } = await query;
      
      if (error) {
        throw new Error(`Error searching service orders: ${error.message}`);
      }
      
      // Transform the data to include customer name
      const transformedData = data?.map(order => ({
        id: order.id,
        customer_id: order.customer_id,
        customer_name: order.customers?.name || 'Unknown',
        status: order.status,
        type: order.type,
        description: order.description,
        scheduled_date: order.scheduled_date,
        created_at: order.created_at,
      })) || [];
      
      return {
        serviceOrders: transformedData,
        count: count || 0,
      };
    } catch (error) {
      console.error('Error in searchServiceOrdersTool:', error);
      throw error;
    }
  },
});

/**
 * Tool to generate content for customer communications
 */
export const generateContentTool = createTool({
  id: 'generate-content',
  description: 'Generate content for customer communications like emails, SMS, or reports',
  inputSchema: z.object({
    type: z.enum(['email', 'sms', 'report']).describe('Type of content to generate'),
    purpose: z.enum([
      'appointment_reminder',
      'service_completed',
      'quote_follow_up',
      'maintenance_reminder',
      'custom'
    ]).describe('Purpose of the communication'),
    customer: z.object({
      name: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
    }).optional().describe('Customer information'),
    serviceOrder: z.object({
      id: z.string().optional(),
      type: z.string().optional(),
      description: z.string().optional(),
      scheduled_date: z.string().optional(),
    }).optional().describe('Service order information'),
    customMessage: z.string().optional().describe('Custom message to include'),
    tone: z.enum(['formal', 'friendly', 'professional', 'casual']).optional().default('professional').describe('Tone of the communication'),
  }),
  outputSchema: z.object({
    subject: z.string().optional(),
    body: z.string(),
    suggestions: z.array(z.string()).optional(),
  }),
  execute: async ({ context }) => {
    try {
      console.log(`Generating ${context.type} content for ${context.purpose} with ${context.tone} tone`);
      
      // This would typically call an AI service like OpenAI
      // For now, we'll return template-based content
      
      const templates = {
        email: {
          appointment_reminder: {
            subject: 'Przypomnienie o wizycie serwisowej',
            body: `Szanowny Kliencie${context.customer?.name ? ' ' + context.customer.name : ''},

Przypominamy o zaplanowanej wizycie serwisowej ${context.serviceOrder?.scheduled_date ? 'w dniu ' + new Date(context.serviceOrder.scheduled_date).toLocaleDateString('pl-PL') : ''}.

${context.serviceOrder?.description ? 'Zakres prac: ' + context.serviceOrder.description : ''}

${context.customMessage || ''}

Z poważaniem,
Zespół GodLike CRM/ERP`,
          },
          service_completed: {
            subject: 'Potwierdzenie wykonania usługi',
            body: `Szanowny Kliencie${context.customer?.name ? ' ' + context.customer.name : ''},

Dziękujemy za skorzystanie z naszych usług. Potwierdzamy wykonanie zlecenia ${context.serviceOrder?.id || ''}.

${context.customMessage || ''}

Z poważaniem,
Zespół GodLike CRM/ERP`,
          },
          // Add more templates as needed
        },
        sms: {
          appointment_reminder: {
            body: `Przypomnienie: wizyta serwisowa ${context.serviceOrder?.scheduled_date ? 'w dniu ' + new Date(context.serviceOrder.scheduled_date).toLocaleDateString('pl-PL') : ''}. ${context.customMessage || ''}`,
          },
          // Add more templates as needed
        },
        report: {
          // Report templates
        },
      };
      
      // Get the appropriate template
      const template = templates[context.type]?.[context.purpose];
      
      if (!template) {
        throw new Error(`No template found for ${context.type} with purpose ${context.purpose}`);
      }
      
      return {
        subject: template.subject,
        body: template.body,
        suggestions: [
          'Dodaj informacje o godzinie wizyty',
          'Dodaj link do kalendarza',
          'Dodaj informacje o przygotowaniu do wizyty',
        ],
      };
    } catch (error) {
      console.error('Error in generateContentTool:', error);
      throw error;
    }
  },
});

/**
 * Tool to analyze customer data
 */
export const analyzeCustomerDataTool = createTool({
  id: 'analyze-customer-data',
  description: 'Analyze customer data to provide insights and recommendations',
  inputSchema: z.object({
    customerId: z.string().optional().describe('Customer ID to analyze'),
    analysisType: z.enum(['service_history', 'spending', 'engagement', 'all']).default('all').describe('Type of analysis to perform'),
  }),
  outputSchema: z.object({
    insights: z.array(z.string()),
    recommendations: z.array(z.string()),
    metrics: z.record(z.string(), z.any()).optional(),
  }),
  execute: async ({ context }) => {
    try {
      const supabase = createClient();
      
      // If no customer ID is provided, return general insights
      if (!context.customerId) {
        return {
          insights: [
            'Ogólna analiza klientów wymaga podania ID klienta',
          ],
          recommendations: [
            'Podaj ID klienta, aby uzyskać spersonalizowane rekomendacje',
          ],
        };
      }
      
      // Get customer data
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', context.customerId)
        .single();
      
      if (customerError) {
        throw new Error(`Error fetching customer: ${customerError.message}`);
      }
      
      if (!customer) {
        throw new Error(`Customer with ID ${context.customerId} not found`);
      }
      
      // Get service orders for this customer
      const { data: serviceOrders, error: serviceOrdersError } = await supabase
        .from('service_orders')
        .select('*')
        .eq('customer_id', context.customerId);
      
      if (serviceOrdersError) {
        throw new Error(`Error fetching service orders: ${serviceOrdersError.message}`);
      }
      
      // Perform analysis based on the data
      // This would typically involve more sophisticated analysis
      // For now, we'll return some basic insights
      
      const insights = [];
      const recommendations = [];
      const metrics: Record<string, any> = {};
      
      // Service history analysis
      if (context.analysisType === 'service_history' || context.analysisType === 'all') {
        const serviceCount = serviceOrders?.length || 0;
        const lastServiceDate = serviceOrders && serviceOrders.length > 0
          ? new Date(serviceOrders[serviceOrders.length - 1].created_at).toLocaleDateString('pl-PL')
          : 'brak';
        
        insights.push(`Klient ma ${serviceCount} zleceń serwisowych w historii.`);
        insights.push(`Ostatnia usługa została wykonana: ${lastServiceDate}.`);
        
        metrics.serviceCount = serviceCount;
        metrics.lastServiceDate = lastServiceDate;
        
        if (serviceCount === 0) {
          recommendations.push('Zaproponuj pierwszą usługę serwisową.');
        } else if (serviceCount > 5) {
          recommendations.push('Zaproponuj program lojalnościowy dla stałych klientów.');
        }
      }
      
      // Spending analysis
      if (context.analysisType === 'spending' || context.analysisType === 'all') {
        // This would typically involve calculating total spending, average order value, etc.
        recommendations.push('Zaproponuj pakiet usług serwisowych, aby zwiększyć wartość zamówień.');
      }
      
      // Engagement analysis
      if (context.analysisType === 'engagement' || context.analysisType === 'all') {
        // This would typically involve analyzing communication history, response rates, etc.
        recommendations.push('Zwiększ częstotliwość komunikacji z klientem.');
      }
      
      return {
        insights,
        recommendations,
        metrics,
      };
    } catch (error) {
      console.error('Error in analyzeCustomerDataTool:', error);
      throw error;
    }
  },
});

// Export all tools
export const crmTools = {
  searchCustomersTool,
  searchServiceOrdersTool,
  generateContentTool,
  analyzeCustomerDataTool,
};