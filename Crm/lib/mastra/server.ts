/**
 * Mastra MCP Server for the CRM/ERP project
 * This server provides AI-powered tools for the CRM/ERP project
 */

import { MCPServer } from '@mastra/mcp';
import { crmTools } from './tools/crm-tools';

/**
 * Start the MCP server
 * @returns {Promise<MCPServer>} The MCP server instance
 */
export async function startMCPServer(): Promise<MCPServer> {
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