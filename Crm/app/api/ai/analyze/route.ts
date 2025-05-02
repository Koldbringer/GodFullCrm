import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createMCPClient, createAgent, generateResponse, disconnectMCP } from '@/lib/mcp/client';

/**
 * AI Analysis API endpoint
 * Uses Mastra MCP with OpenAI to provide AI-powered analysis
 */
export async function POST(request: Request) {
  let mcp = null;

  try {
    const { message, data } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Create an MCP client
    mcp = await createMCPClient();

    // Create an agent with the MCP tools
    const agent = await createAgent(mcp, `You are an AI assistant for a CRM/ERP system focused on HVAC services.
    You analyze data and provide insights to help the business improve.
    Always format your responses as structured JSON with insights, recommendations, and metrics when appropriate.
    Use the available tools to search the database and analyze data.`);

    // Determine the appropriate prompt based on the message and data
    let prompt = message;

    // If data is provided, include it in the prompt
    if (data) {
      prompt += `\n\nHere is the data to analyze:\n${JSON.stringify(data, null, 2)}`;
    }

    // Generate a response using the agent
    const response = await agent.generate(prompt);

    // Parse the response text to extract JSON if possible
    let aiResponse;
    try {
      // Check if the response contains a JSON object
      const jsonMatch = response.text.match(/```json\n([\s\S]*?)\n```/) ||
                        response.text.match(/```\n([\s\S]*?)\n```/) ||
                        response.text.match(/{[\s\S]*?}/);

      if (jsonMatch) {
        aiResponse = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        // If no JSON found, create a simple structure
        aiResponse = {
          summary: response.text,
          insights: extractInsights(response.text),
          recommendations: extractRecommendations(response.text)
        };
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      aiResponse = {
        summary: response.text,
        rawResponse: response.text
      };
    }

    // Log the analysis request to the database
    await logAnalysisRequest(message, aiResponse);

    return NextResponse.json({
      result: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in AI analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze data', details: String(error) },
      { status: 500 }
    );
  } finally {
    // Disconnect from the MCP server
    if (mcp) {
      try {
        await disconnectMCP(mcp);
      } catch (disconnectError) {
        console.error('Error disconnecting from MCP server:', disconnectError);
      }
    }
  }
}

/**
 * Extract insights from the response text
 */
function extractInsights(text: string): string[] {
  const insights = [];

  // Look for patterns like "Insight:" or "Key finding:" or bullet points
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (
      trimmedLine.match(/^(insight|finding|observation|analysis):/i) ||
      trimmedLine.match(/^[•\-\*]\s+/) ||
      trimmedLine.match(/^\d+\.\s+/)
    ) {
      // Clean up the line
      const cleanLine = trimmedLine
        .replace(/^(insight|finding|observation|analysis):/i, '')
        .replace(/^[•\-\*]\s+/, '')
        .replace(/^\d+\.\s+/, '')
        .trim();

      if (cleanLine) {
        insights.push(cleanLine);
      }
    }
  }

  // If no insights were found, try to extract sentences
  if (insights.length === 0) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    return sentences.slice(0, 3).map(s => s.trim());
  }

  return insights;
}

/**
 * Extract recommendations from the response text
 */
function extractRecommendations(text: string): string[] {
  const recommendations = [];

  // Look for patterns like "Recommendation:" or "Suggest:" or bullet points after "recommend"
  const lines = text.split('\n');
  let inRecommendationSection = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.match(/^(recommendation|suggest|advise|propose):/i) ||
        trimmedLine.match(/recommendations:/i)) {
      inRecommendationSection = true;

      // Extract the recommendation from this line if it contains one
      const match = trimmedLine.match(/^(?:recommendation|suggest|advise|propose):(.*)/i);
      if (match && match[1].trim()) {
        recommendations.push(match[1].trim());
      }
      continue;
    }

    if (inRecommendationSection &&
        (trimmedLine.match(/^[•\-\*]\s+/) || trimmedLine.match(/^\d+\.\s+/))) {
      // Clean up the line
      const cleanLine = trimmedLine
        .replace(/^[•\-\*]\s+/, '')
        .replace(/^\d+\.\s+/, '')
        .trim();

      if (cleanLine) {
        recommendations.push(cleanLine);
      }
    }

    // End of recommendation section
    if (inRecommendationSection && trimmedLine === '') {
      inRecommendationSection = false;
    }
  }

  // If no explicit recommendations, look for sentences with recommendation keywords
  if (recommendations.length === 0) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    for (const sentence of sentences) {
      if (sentence.match(/\b(recommend|suggest|advise|should|could|consider|try|implement)\b/i)) {
        recommendations.push(sentence.trim());
      }
    }
  }

  return recommendations;
}

/**
 * Log the analysis request to the database
 */
async function logAnalysisRequest(message: string, response: any): Promise<void> {
  try {
    const supabase = await createClient();

    await supabase.from('ai_analysis_logs').insert({
      prompt: message,
      response: JSON.stringify(response),
      created_at: new Date().toISOString()
    }) as any;
  } catch (error) {
    console.error('Error logging AI analysis request:', error);
    // Don't throw - this is a non-critical operation
  }
}
