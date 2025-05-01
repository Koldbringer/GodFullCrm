import { NodeHandler, WorkflowNode, WorkflowExecutionContext } from '../workflow-execution';

/**
 * Handler for the AiAnalysisNode type
 * Performs AI analysis on input data based on a prompt
 */
export const AiAnalysisNodeHandler: NodeHandler = {
  async execute(node: WorkflowNode, context: WorkflowExecutionContext): Promise<any> {
    try {
      // Extract parameters from node data
      const { inputData, prompt } = node.data;
      
      // Validate required fields
      if (!inputData) {
        throw new Error('Missing required parameter: inputData');
      }
      
      if (!prompt) {
        throw new Error('Missing required parameter: prompt');
      }
      
      // Replace variables in the prompt
      const processedPrompt = replaceVariables(prompt, context.variables);
      
      // Process input data - if it's a string that looks like JSON, parse it
      let processedInputData = inputData;
      if (typeof inputData === 'string' && (
        inputData.trim().startsWith('{') || 
        inputData.trim().startsWith('[')
      )) {
        try {
          processedInputData = JSON.parse(inputData);
        } catch (e) {
          console.warn('Failed to parse input data as JSON, using as string');
        }
      }
      
      // Replace variables in input data if it's a string
      if (typeof processedInputData === 'string') {
        processedInputData = replaceVariables(processedInputData, context.variables);
      }
      
      // Call OpenAI API or other AI service
      const aiResult = await callAiService(processedPrompt, processedInputData);
      
      // Return the result
      return {
        success: true,
        result: aiResult,
        prompt: processedPrompt,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error executing AiAnalysisNode:', error);
      throw error;
    }
  }
};

/**
 * Replace variables in a string with values from the context
 */
function replaceVariables(text: string, variables: Record<string, any>): string {
  if (!text || typeof text !== 'string') return text;
  
  return text.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    const trimmedKey = key.trim();
    return variables[trimmedKey] !== undefined ? 
      String(variables[trimmedKey]) : 
      match;
  });
}

/**
 * Call an AI service with the given prompt and data
 */
async function callAiService(prompt: string, data: any): Promise<any> {
  try {
    // Prepare the message for the AI service
    const message = `
      Analyze the following data according to these instructions:
      
      ${prompt}
      
      Data to analyze:
      ${JSON.stringify(data, null, 2)}
    `;
    
    // Call the AI service API
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`AI service error: ${errorData.error || response.statusText}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error calling AI service:', error);
    throw new Error(`Failed to get AI analysis: ${error instanceof Error ? error.message : String(error)}`);
  }
}
