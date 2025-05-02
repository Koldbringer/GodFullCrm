/**
 * CRM Agent for the CRM/ERP project
 * This agent provides AI-powered assistance for the CRM/ERP project
 */

import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import { MCPClient } from '@mastra/mcp';

/**
 * Create a CRM agent with the MCP tools
 * @param {MCPClient} mcp The MCP client instance
 * @returns {Promise<Agent>} The agent instance
 */
export async function createCRMAgent(mcp: MCPClient): Promise<Agent> {
  // Get all tools from the MCP server
  const tools = await mcp.getTools();

  // Create an agent with the MCP tools
  const agent = new Agent({
    name: 'CRM Assistant',
    instructions: `You are an AI assistant for a CRM/ERP system focused on HVAC services.
    
    Your capabilities include:
    1. Searching for customers and service orders in the database
    2. Analyzing customer data to provide insights and recommendations
    3. Generating content for customer communications
    
    When responding to queries:
    - Always be professional and helpful
    - Provide concise but informative answers
    - Format data in a readable way
    - Suggest next steps or additional information when appropriate
    
    If you need more information to complete a task, ask clarifying questions.
    If you're unsure about something, be honest about your limitations.`,
    model: openai('gpt-4o'),
    tools,
  });

  return agent;
}

/**
 * Generate a response from the CRM agent
 * @param {Agent} agent The agent instance
 * @param {string} prompt The prompt to send to the agent
 * @returns {Promise<{text: string}>} The agent's response
 */
export async function generateCRMResponse(agent: Agent, prompt: string): Promise<{text: string}> {
  // Generate a response from the agent
  const result = await agent.generate(prompt);

  return { text: result.text };
}