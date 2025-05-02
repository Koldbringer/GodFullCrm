/**
 * Mastra MCP Server for the CRM/ERP project
 * This server provides AI-powered tools for the CRM/ERP project
 */

const { MCPServer } = require('@mastra/mcp');

// Define the CRM tools
const crmTools = {
  // Search customers tool
  searchCustomers: {
    description: 'Search for customers in the database by name, email, phone, or address',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (name, email, phone, or address)',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return',
          default: 10,
        },
      },
      required: ['query'],
    },
    handler: async ({ query, limit = 10 }) => {
      console.log(`Searching for customers with query: ${query}, limit: ${limit}`);
      
      // This would typically call the database
      // For now, return mock data
      return {
        customers: [
          {
            id: '1',
            name: 'John Smith',
            email: 'john@example.com',
            phone: '123-456-7890',
            address: '123 Main St',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Jane Doe',
            email: 'jane@example.com',
            phone: '987-654-3210',
            address: '456 Oak Ave',
            created_at: new Date().toISOString(),
          },
        ],
        count: 2,
      };
    },
  },
  
  // Search service orders tool
  searchServiceOrders: {
    description: 'Search for service orders in the database by customer, status, type, or date range',
    parameters: {
      type: 'object',
      properties: {
        customerId: {
          type: 'string',
          description: 'Customer ID to filter by',
        },
        status: {
          type: 'string',
          description: 'Status to filter by (e.g., "pending", "completed")',
        },
        type: {
          type: 'string',
          description: 'Type to filter by (e.g., "service", "installation", "inspection")',
        },
        fromDate: {
          type: 'string',
          description: 'Start date in ISO format (YYYY-MM-DD)',
        },
        toDate: {
          type: 'string',
          description: 'End date in ISO format (YYYY-MM-DD)',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return',
          default: 10,
        },
      },
    },
    handler: async ({ customerId, status, type, fromDate, toDate, limit = 10 }) => {
      console.log(`Searching for service orders with filters: ${JSON.stringify({ customerId, status, type, fromDate, toDate, limit })}`);
      
      // This would typically call the database
      // For now, return mock data
      return {
        serviceOrders: [
          {
            id: '1',
            customer_id: '1',
            customer_name: 'John Smith',
            status: 'pending',
            type: 'service',
            description: 'HVAC maintenance',
            scheduled_date: '2025-05-15',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            customer_id: '2',
            customer_name: 'Jane Doe',
            status: 'completed',
            type: 'installation',
            description: 'New AC installation',
            scheduled_date: '2025-05-10',
            created_at: new Date().toISOString(),
          },
        ],
        count: 2,
      };
    },
  },
  
  // Generate content tool
  generateContent: {
    description: 'Generate content for customer communications like emails, SMS, or reports',
    parameters: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['email', 'sms', 'report'],
          description: 'Type of content to generate',
        },
        purpose: {
          type: 'string',
          enum: ['appointment_reminder', 'service_completed', 'quote_follow_up', 'maintenance_reminder', 'custom'],
          description: 'Purpose of the communication',
        },
        customer: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
          },
          description: 'Customer information',
        },
        serviceOrder: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            type: { type: 'string' },
            description: { type: 'string' },
            scheduled_date: { type: 'string' },
          },
          description: 'Service order information',
        },
        customMessage: {
          type: 'string',
          description: 'Custom message to include',
        },
        tone: {
          type: 'string',
          enum: ['formal', 'friendly', 'professional', 'casual'],
          description: 'Tone of the communication',
          default: 'professional',
        },
      },
      required: ['type', 'purpose'],
    },
    handler: async ({ type, purpose, customer = {}, serviceOrder = {}, customMessage = '', tone = 'professional' }) => {
      console.log(`Generating ${type} content for ${purpose} with ${tone} tone`);
      
      // This would typically call an AI service like OpenAI
      // For now, return template-based content
      
      const templates = {
        email: {
          appointment_reminder: {
            subject: 'Przypomnienie o wizycie serwisowej',
            body: `Szanowny Kliencie${customer.name ? ' ' + customer.name : ''},

Przypominamy o zaplanowanej wizycie serwisowej ${serviceOrder.scheduled_date ? 'w dniu ' + new Date(serviceOrder.scheduled_date).toLocaleDateString('pl-PL') : ''}.

${serviceOrder.description ? 'Zakres prac: ' + serviceOrder.description : ''}

${customMessage || ''}

Z poważaniem,
Zespół GodLike CRM/ERP`,
          },
          service_completed: {
            subject: 'Potwierdzenie wykonania usługi',
            body: `Szanowny Kliencie${customer.name ? ' ' + customer.name : ''},

Dziękujemy za skorzystanie z naszych usług. Potwierdzamy wykonanie zlecenia ${serviceOrder.id || ''}.

${customMessage || ''}

Z poważaniem,
Zespół GodLike CRM/ERP`,
          },
        },
        sms: {
          appointment_reminder: {
            body: `Przypomnienie: wizyta serwisowa ${serviceOrder.scheduled_date ? 'w dniu ' + new Date(serviceOrder.scheduled_date).toLocaleDateString('pl-PL') : ''}. ${customMessage || ''}`,
          },
        },
        report: {
          // Report templates
        },
      };
      
      // Get the appropriate template
      const template = templates[type]?.[purpose];
      
      if (!template) {
        throw new Error(`No template found for ${type} with purpose ${purpose}`);
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
    },
  },
  
  // Analyze customer data tool
  analyzeCustomerData: {
    description: 'Analyze customer data to provide insights and recommendations',
    parameters: {
      type: 'object',
      properties: {
        customerId: {
          type: 'string',
          description: 'Customer ID to analyze',
        },
        analysisType: {
          type: 'string',
          enum: ['service_history', 'spending', 'engagement', 'all'],
          description: 'Type of analysis to perform',
          default: 'all',
        },
      },
    },
    handler: async ({ customerId, analysisType = 'all' }) => {
      console.log(`Analyzing customer data for customer ID: ${customerId}, analysis type: ${analysisType}`);
      
      // This would typically call the database and perform analysis
      // For now, return mock insights
      
      if (!customerId) {
        return {
          insights: [
            'Ogólna analiza klientów wymaga podania ID klienta',
          ],
          recommendations: [
            'Podaj ID klienta, aby uzyskać spersonalizowane rekomendacje',
          ],
        };
      }
      
      const insights = [];
      const recommendations = [];
      const metrics = {};
      
      // Service history analysis
      if (analysisType === 'service_history' || analysisType === 'all') {
        const serviceCount = 3; // Mock data
        const lastServiceDate = '01.05.2025'; // Mock data
        
        insights.push(`Klient ma ${serviceCount} zleceń serwisowych w historii.`);
        insights.push(`Ostatnia usługa została wykonana: ${lastServiceDate}.`);
        
        metrics.serviceCount = serviceCount;
        metrics.lastServiceDate = lastServiceDate;
        
        if (serviceCount === 0) {
          recommendations.push('Zaproponuj pierwszą usługę serwisową.');
        } else if (serviceCount > 2) {
          recommendations.push('Zaproponuj program lojalnościowy dla stałych klientów.');
        }
      }
      
      // Spending analysis
      if (analysisType === 'spending' || analysisType === 'all') {
        recommendations.push('Zaproponuj pakiet usług serwisowych, aby zwiększyć wartość zamówień.');
      }
      
      // Engagement analysis
      if (analysisType === 'engagement' || analysisType === 'all') {
        recommendations.push('Zwiększ częstotliwość komunikacji z klientem.');
      }
      
      return {
        insights,
        recommendations,
        metrics,
      };
    },
  },
};

// Create and start the MCP server
async function startMCPServer() {
  try {
    // Create the MCP server with the CRM tools
    const server = new MCPServer({
      name: 'CRM Assistant MCP Server',
      version: '1.0.0',
      tools: crmTools,
    });

    // Start the server using stdio
    await server.startStdio();
    console.log('MCP server started successfully');

    return server;
  } catch (error) {
    console.error('Error starting MCP server:', error);
    throw error;
  }
}

// If this file is run directly, start the server
if (require.main === module) {
  startMCPServer().catch(error => {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  });
}