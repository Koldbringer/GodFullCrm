/**
 * MCP Client for the CRM/ERP project
 * This client connects to the MCP server and provides AI-powered tools
 */

import { MCPClient } from '@mastra/mcp';
import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';

/**
 * Create an MCP client for the CRM/ERP project
 * @returns {Promise<MCPClient>} The MCP client instance
 */
export async function createMCPClient(): Promise<MCPClient> {
  try {
    // Create an MCP client that connects to the server
    const mcp = new MCPClient({
      servers: {
        crmAssistant: {
          command: 'node',
          args: ['./lib/mcp/server.js'],
        },
      },
    });

    return mcp;
  } catch (error) {
    console.error('Error creating MCP client:', error);
    throw error;
  }
}

/**
 * Create an agent with the MCP tools
 * @param {MCPClient} mcp The MCP client instance
 * @param {string} instructions Custom instructions for the agent
 * @returns {Promise<Agent>} The agent instance
 */
export async function createAgent(mcp: MCPClient, instructions?: string): Promise<Agent> {
  try {
    // Get all tools from the MCP server
    const tools = await mcp.getTools();

    // Create an agent with the MCP tools
    const agent = new Agent({
      name: 'CRM Assistant',
      instructions: instructions || `You are a helpful CRM assistant that can search the database, analyze data, and generate content.
      You can provide insights about customers, service orders, and other aspects of the business.
      Always be professional and helpful.`,
      model: openai('gpt-4o'),
      tools,
    });

    return agent;
  } catch (error) {
    console.error('Error creating agent:', error);
    throw error;
  }
}

/**
 * Generate a response using the agent
 * @param {Agent} agent The agent instance
 * @param {string} prompt The prompt to generate a response for
 * @returns {Promise<string>} The generated response
 */
export async function generateResponse(agent: Agent, prompt: string): Promise<string> {
  try {
    const response = await agent.generate(prompt);
    return response.text;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

/**
 * Disconnect from the MCP server
 * @param {MCPClient} mcp The MCP client instance
 * @returns {Promise<void>}
 */
export async function disconnectMCP(mcp: MCPClient): Promise<void> {
  try {
    await mcp.disconnect();
    console.log('Successfully disconnected from MCP server');
  } catch (error) {
    console.error('Error disconnecting from MCP server:', error);
    throw error;
  }
}