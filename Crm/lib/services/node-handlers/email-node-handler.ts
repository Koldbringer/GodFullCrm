import { NodeHandler, WorkflowNode, WorkflowExecutionContext } from '../workflow-execution';

/**
 * Handler for the EmailNode type
 * Sends an email based on the node configuration
 */
export const EmailNodeHandler: NodeHandler = {
  async execute(node: WorkflowNode, context: WorkflowExecutionContext): Promise<any> {
    try {
      // Extract email parameters from node data
      const { recipient, subject, body } = node.data;
      
      // Validate required fields
      if (!recipient || !subject || !body) {
        throw new Error('Missing required email parameters: recipient, subject, or body');
      }
      
      // Replace variables in the email content
      const processedRecipient = replaceVariables(recipient, context.variables);
      const processedSubject = replaceVariables(subject, context.variables);
      const processedBody = replaceVariables(body, context.variables);
      
      // Call the email sending API
      const response = await fetch('/api/automation/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'EmailNode',
          nodeData: {
            recipient: processedRecipient,
            subject: processedSubject,
            body: processedBody,
          },
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to send email: ${errorData.error || response.statusText}`);
      }
      
      const result = await response.json();
      
      // Return the result
      return {
        success: true,
        message: 'Email sent successfully',
        recipient: processedRecipient,
        subject: processedSubject,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error executing EmailNode:', error);
      throw error;
    }
  }
};

/**
 * Replace variables in a string with their values from the context
 * Variables are in the format {{variableName}}
 */
function replaceVariables(text: string, variables: Record<string, any>): string {
  return text.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
    const value = variables[variableName.trim()];
    return value !== undefined ? String(value) : match;
  });
}
