/**
 * Mastra MCP Client for the CRM/ERP project
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
          args: ['./lib/mastra/server.js'],
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
 * Generate a response from the agent
 * @param {Agent} agent The agent instance
 * @param {string} prompt The prompt to send to the agent
 * @returns {Promise<{text: string}>} The agent's response
 */
export async function generateResponse(agent: Agent, prompt: string): Promise<{text: string}> {
  try {
    // Generate a response from the agent
    const result = await agent.generate(prompt);

    return { text: result.text };
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

/**
 * Disconnect the MCP client
 * @param {MCPClient} mcp The MCP client instance
 * @returns {Promise<void>}
 */
export async function disconnectMCP(mcp: MCPClient): Promise<void> {
  try {
    // Disconnect the MCP client
    await mcp.disconnect();
  } catch (error) {
    console.error('Error disconnecting MCP client:', error);
    throw error;
  }
}