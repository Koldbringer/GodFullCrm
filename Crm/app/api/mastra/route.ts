import { NextResponse } from 'next/server';
import { createMCPClient, createAgent, generateResponse, disconnectMCP } from '@/lib/mastra/client';

/**
 * Mastra API endpoint
 * Uses Mastra MCP with OpenAI to provide AI-powered assistance
 */
export async function POST(request: Request) {
  let mcp = null;

  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Create an MCP client
    mcp = await createMCPClient();

    // Create an agent with the MCP tools
    const agent = await createAgent(mcp);

    // Generate a response from the agent
    const result = await generateResponse(agent, message);

    // Disconnect the MCP client
    await disconnectMCP(mcp);

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error in Mastra API:', error);

    // Ensure MCP client is disconnected in case of error
    if (mcp) {
      try {
        await disconnectMCP(mcp);
      } catch (disconnectError) {
        console.error('Error disconnecting MCP client:', disconnectError);
      }
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}