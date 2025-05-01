/**
 * MCP Tools for the CRM/ERP project
 * These tools are used by the Mastra MCP server to provide AI-powered functionality
 *
 * Enhanced with additional tools for lead scoring, document generation, meeting summaries,
 * and external API integration.
 */

import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';
import { openai } from '@ai-sdk/openai';

// Standard response format for all tools
interface StandardResponse {
  insights?: string[];
  recommendations?: string[];
  metrics?: Record<string, any>;
  actions?: Array<{
    type: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    data?: any;
  }>;
  error?: string;
}

/**
 * Tool to search the CRM database for customer information
 */
export const searchDatabaseTool = {
  name: 'search_database',
  description: 'Search the CRM database for customer information, service orders, or other data',
  parameters: {
    type: 'object',
    properties: {
      entity: {
        type: 'string',
        description: 'The entity type to search (customers, service_orders, devices, etc.)',
        enum: ['customers', 'service_orders', 'devices', 'technicians', 'invoices', 'quotes']
      },
      query: {
        type: 'string',
        description: 'The search query (name, email, phone, etc.)',
      },
      filters: {
        type: 'object',
        description: 'Additional filters to apply to the search',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results to return',
      },
    },
    required: ['entity', 'query'],
  },
  handler: async ({ entity, query, filters = {}, limit = 10 }) => {
    try {
      console.log(`Searching ${entity} for "${query}" with filters:`, filters);

      const supabase = await createClient();
      if (!supabase) {
        throw new Error('Database connection failed');
      }

      // Build the query based on the entity type
      let dbQuery = supabase.from(entity).select('*');

      // Apply text search if query is provided
      if (query) {
        // Different entities have different searchable fields
        switch (entity) {
          case 'customers':
            dbQuery = dbQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`);
            break;
          case 'service_orders':
            dbQuery = dbQuery.or(`description.ilike.%${query}%,notes.ilike.%${query}%`);
            break;
          case 'devices':
            dbQuery = dbQuery.or(`name.ilike.%${query}%,model.ilike.%${query}%,serial_number.ilike.%${query}%`);
            break;
          case 'technicians':
            dbQuery = dbQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`);
            break;
          default:
            dbQuery = dbQuery.textSearch('description', query);
        }
      }

      // Apply additional filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          dbQuery = dbQuery.eq(key, value);
        }
      });

      // Apply limit
      dbQuery = dbQuery.limit(limit);

      // Execute the query
      const { data, error } = await dbQuery;

      if (error) {
        throw error;
      }

      return {
        results: data,
        count: data.length,
      };
    } catch (error) {
      console.error(`Error searching ${entity}:`, error);
      return {
        error: `Failed to search ${entity}: ${error.message}`,
        results: [],
        count: 0,
      };
    }
  },
};

/**
 * Tool to analyze customer data and provide insights
 */
export const analyzeCustomersTool = {
  name: 'analyze_customers',
  description: 'Analyze customer data and provide insights',
  parameters: {
    type: 'object',
    properties: {
      timeframe: {
        type: 'string',
        description: 'The timeframe to analyze (last_month, last_quarter, last_year, all_time)',
        enum: ['last_month', 'last_quarter', 'last_year', 'all_time'],
      },
      segment: {
        type: 'string',
        description: 'The customer segment to analyze (all, residential, commercial, industrial)',
        enum: ['all', 'residential', 'commercial', 'industrial'],
      },
      metrics: {
        type: 'array',
        description: 'The metrics to analyze',
        items: {
          type: 'string',
          enum: ['revenue', 'service_frequency', 'lifetime_value', 'satisfaction', 'growth'],
        },
      },
    },
    required: ['timeframe'],
  },
  handler: async ({ timeframe, segment = 'all', metrics = ['revenue', 'service_frequency'] }) => {
    try {
      console.log(`Analyzing customers for ${timeframe}, segment: ${segment}, metrics: ${metrics.join(', ')}`);

      const supabase = await createClient();
      if (!supabase) {
        throw new Error('Database connection failed');
      }

      // Get customers based on segment and timeframe
      let query = supabase.from('customers').select('*');

      // Apply segment filter
      if (segment !== 'all') {
        query = query.eq('segment', segment);
      }

      // Apply timeframe filter
      if (timeframe !== 'all_time') {
        let date = new Date();
        switch (timeframe) {
          case 'last_month':
            date.setMonth(date.getMonth() - 1);
            break;
          case 'last_quarter':
            date.setMonth(date.getMonth() - 3);
            break;
          case 'last_year':
            date.setFullYear(date.getFullYear() - 1);
            break;
        }
        query = query.gte('created_at', date.toISOString());
      }

      const { data: customers, error } = await query;

      if (error) {
        throw error;
      }

      // Get service orders for these customers
      const customerIds = customers.map(c => c.id);
      const { data: serviceOrders, error: serviceOrdersError } = await supabase
        .from('service_orders')
        .select('*')
        .in('customer_id', customerIds);

      if (serviceOrdersError) {
        throw serviceOrdersError;
      }

      // Calculate metrics
      const results = {
        customerCount: customers.length,
        serviceOrderCount: serviceOrders.length,
        metrics: {},
        insights: [],
        recommendations: [],
      };

      // Calculate metrics based on the requested metrics
      if (metrics.includes('revenue')) {
        const totalRevenue = serviceOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        results.metrics['revenue'] = {
          total: totalRevenue,
          average: totalRevenue / Math.max(1, customers.length),
        };
      }

      if (metrics.includes('service_frequency')) {
        const serviceFrequency = serviceOrders.length / Math.max(1, customers.length);
        results.metrics['service_frequency'] = serviceFrequency;
      }

      // Generate insights based on the data
      if (customers.length > 0) {
        results.insights.push(`You have ${customers.length} ${segment} customers in the selected timeframe.`);

        if (metrics.includes('revenue')) {
          results.insights.push(`Average revenue per customer is $${results.metrics['revenue'].average.toFixed(2)}.`);
        }

        if (metrics.includes('service_frequency')) {
          results.insights.push(`Each customer has an average of ${results.metrics['service_frequency'].toFixed(2)} service orders.`);
        }
      } else {
        results.insights.push(`No ${segment} customers found in the selected timeframe.`);
      }

      // Generate recommendations
      if (customers.length > 0) {
        if (metrics.includes('revenue') && results.metrics['revenue'].average < 1000) {
          results.recommendations.push('Consider upselling additional services to increase average revenue per customer.');
        }

        if (metrics.includes('service_frequency') && results.metrics['service_frequency'] < 2) {
          results.recommendations.push('Implement a follow-up program to increase service frequency.');
        }
      }

      return results;
    } catch (error) {
      console.error('Error analyzing customers:', error);
      return {
        error: `Failed to analyze customers: ${error.message}`,
        customerCount: 0,
        serviceOrderCount: 0,
        metrics: {},
        insights: [],
        recommendations: [],
      };
    }
  },
};

/**
 * Tool to analyze service orders and provide insights
 */
export const analyzeServiceOrdersTool = {
  name: 'analyze_service_orders',
  description: 'Analyze service orders and provide insights',
  parameters: {
    type: 'object',
    properties: {
      timeframe: {
        type: 'string',
        description: 'The timeframe to analyze (last_month, last_quarter, last_year, all_time)',
        enum: ['last_month', 'last_quarter', 'last_year', 'all_time'],
      },
      type: {
        type: 'string',
        description: 'The type of service orders to analyze (all, installation, maintenance, repair)',
        enum: ['all', 'installation', 'maintenance', 'repair'],
      },
      metrics: {
        type: 'array',
        description: 'The metrics to analyze',
        items: {
          type: 'string',
          enum: ['completion_time', 'customer_satisfaction', 'revenue', 'technician_efficiency'],
        },
      },
    },
    required: ['timeframe'],
  },
  handler: async ({ timeframe, type = 'all', metrics = ['completion_time', 'revenue'] }) => {
    try {
      console.log(`Analyzing service orders for ${timeframe}, type: ${type}, metrics: ${metrics.join(', ')}`);

      const supabase = await createClient();
      if (!supabase) {
        throw new Error('Database connection failed');
      }

      // Get service orders based on type and timeframe
      let query = supabase.from('service_orders').select('*');

      // Apply type filter
      if (type !== 'all') {
        query = query.eq('type', type);
      }

      // Apply timeframe filter
      if (timeframe !== 'all_time') {
        let date = new Date();
        switch (timeframe) {
          case 'last_month':
            date.setMonth(date.getMonth() - 1);
            break;
          case 'last_quarter':
            date.setMonth(date.getMonth() - 3);
            break;
          case 'last_year':
            date.setFullYear(date.getFullYear() - 1);
            break;
        }
        query = query.gte('created_at', date.toISOString());
      }

      const { data: serviceOrders, error } = await query;

      if (error) {
        throw error;
      }

      // Calculate metrics
      const results = {
        serviceOrderCount: serviceOrders.length,
        metrics: {},
        insights: [],
        recommendations: [],
        timeTrends: [],
      };

      // Calculate metrics based on the requested metrics
      if (metrics.includes('completion_time')) {
        const completedOrders = serviceOrders.filter(order => order.completed_at);
        const completionTimes = completedOrders.map(order => {
          const startDate = new Date(order.created_at);
          const endDate = new Date(order.completed_at);
          return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24); // days
        });

        const averageCompletionTime = completionTimes.reduce((sum, time) => sum + time, 0) / Math.max(1, completionTimes.length);

        results.metrics['completion_time'] = {
          average: averageCompletionTime,
          min: Math.min(...completionTimes),
          max: Math.max(...completionTimes),
        };
      }

      if (metrics.includes('revenue')) {
        const totalRevenue = serviceOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        results.metrics['revenue'] = {
          total: totalRevenue,
          average: totalRevenue / Math.max(1, serviceOrders.length),
        };
      }

      // Generate insights based on the data
      if (serviceOrders.length > 0) {
        results.insights.push(`You have ${serviceOrders.length} ${type} service orders in the selected timeframe.`);

        if (metrics.includes('completion_time')) {
          results.insights.push(`Average completion time is ${results.metrics['completion_time'].average.toFixed(2)} days.`);
        }

        if (metrics.includes('revenue')) {
          results.insights.push(`Average revenue per service order is $${results.metrics['revenue'].average.toFixed(2)}.`);
        }
      } else {
        results.insights.push(`No ${type} service orders found in the selected timeframe.`);
      }

      // Generate recommendations
      if (serviceOrders.length > 0) {
        if (metrics.includes('completion_time') && results.metrics['completion_time'].average > 3) {
          results.recommendations.push('Consider optimizing your service process to reduce completion time.');
        }

        if (metrics.includes('revenue') && results.metrics['revenue'].average < 500) {
          results.recommendations.push('Explore opportunities to increase the average value of service orders.');
        }
      }

      // Generate time trends
      if (serviceOrders.length > 0) {
        // Group service orders by month
        const ordersByMonth = {};
        serviceOrders.forEach(order => {
          const date = new Date(order.created_at);
          const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          if (!ordersByMonth[monthKey]) {
            ordersByMonth[monthKey] = [];
          }
          ordersByMonth[monthKey].push(order);
        });

        // Create time trends
        results.timeTrends = Object.entries(ordersByMonth).map(([month, orders]) => {
          const [year, monthNum] = month.split('-');
          const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
          const monthName = date.toLocaleString('default', { month: 'long' });

          return {
            period: `${monthName} ${year}`,
            count: orders.length,
            revenue: orders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
          };
        });
      }

      return results;
    } catch (error) {
      console.error('Error analyzing service orders:', error);
      return {
        error: `Failed to analyze service orders: ${error.message}`,
        serviceOrderCount: 0,
        metrics: {},
        insights: [],
        recommendations: [],
        timeTrends: [],
      };
    }
  },
};

/**
 * Tool to generate content for customer communications
 */
export const generateContentTool = {
  name: 'generate_content',
  description: 'Generate content for customer communications',
  parameters: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        description: 'The type of content to generate',
        enum: ['email', 'sms', 'quote', 'report', 'follow_up'],
      },
      customer: {
        type: 'object',
        description: 'Customer information',
      },
      serviceOrder: {
        type: 'object',
        description: 'Service order information',
      },
      purpose: {
        type: 'string',
        description: 'The purpose of the communication',
        enum: ['appointment_reminder', 'follow_up', 'quote', 'invoice', 'feedback_request', 'promotion'],
      },
      tone: {
        type: 'string',
        description: 'The tone of the communication',
        enum: ['formal', 'friendly', 'professional', 'casual'],
      },
    },
    required: ['type', 'purpose'],
  },
  handler: async ({ type, customer = {}, serviceOrder = {}, purpose, tone = 'professional' }) => {
    try {
      console.log(`Generating ${type} content for ${purpose} with ${tone} tone`);

      // This would typically call an AI service like OpenAI
      // For now, we'll return template-based content

      const templates = {
        email: {
          appointment_reminder: {
            subject: 'Przypomnienie o wizycie serwisowej',
            body: `Szanowny Kliencie,

Przypominamy o zaplanowanej wizycie serwisowej w dniu ${serviceOrder.scheduled_date || '[DATA]'}.

Technik przybędzie w godzinach ${serviceOrder.scheduled_time || '[GODZINA]'}.

W przypadku pytań prosimy o kontakt.

Z poważaniem,
Zespół GodLike CRM/ERP`
          },
          follow_up: {
            subject: 'Jak oceniasz naszą usługę?',
            body: `Szanowny Kliencie,

Dziękujemy za skorzystanie z naszych usług. Mamy nadzieję, że jesteś zadowolony z wykonanej pracy.

Będziemy wdzięczni za Twoją opinię, która pomoże nam doskonalić nasze usługi.

Z poważaniem,
Zespół GodLike CRM/ERP`
          }
        },
        sms: {
          appointment_reminder: `Przypominamy o wizycie serwisowej w dniu ${serviceOrder.scheduled_date || '[DATA]'} o godz. ${serviceOrder.scheduled_time || '[GODZINA]'}. W razie pytań prosimy o kontakt.`,
          follow_up: `Dziękujemy za skorzystanie z naszych usług. Jak oceniasz naszą pracę? Odpowiedz na tego SMS-a z oceną od 1 do 5.`
        }
      };

      // Get the appropriate template
      const contentTemplate = templates[type]?.[purpose];

      if (!contentTemplate) {
        return {
          error: `No template found for ${type} content with purpose ${purpose}`,
        };
      }

      // Customize the template based on the tone
      let content = JSON.parse(JSON.stringify(contentTemplate));

      // Apply tone modifications
      if (tone === 'friendly' && type === 'email') {
        content.body = content.body.replace('Szanowny Kliencie', `Cześć ${customer.name || ''}!`);
        content.body = content.body.replace('Z poważaniem', 'Pozdrawiamy');
      } else if (tone === 'formal' && type === 'email') {
        content.body = content.body.replace('Szanowny Kliencie', `Szanowny Panie/Szanowna Pani ${customer.name || ''}`);
      }

      return {
        content,
        type,
        purpose,
        tone,
      };
    } catch (error) {
      console.error('Error generating content:', error);
      return {
        error: `Failed to generate content: ${error.message}`,
      };
    }
  },
};

// Export all tools
export const crmTools = {
  search_database: searchDatabaseTool,
  analyze_customers: analyzeCustomersTool,
  analyze_service_orders: analyzeServiceOrdersTool,
  generate_content: generateContentTool,
};