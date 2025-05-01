import { NodeHandler, WorkflowNode, WorkflowExecutionContext } from '../workflow-execution';
import { createDynamicLink, DynamicLinkType } from '../dynamic-links';

/**
 * Handler for the DynamicLinkNode type
 * Creates a dynamic link based on the node configuration
 */
export const DynamicLinkNodeHandler: NodeHandler = {
  async execute(node: WorkflowNode, context: WorkflowExecutionContext): Promise<any> {
    try {
      // Extract parameters from node data
      const {
        linkType,
        title,
        description,
        expiresInDays,
        passwordProtected,
        password,
        resourceIdVariable,
      } = node.data;
      
      // Validate required fields
      if (!linkType || !title) {
        throw new Error('Missing required parameters: linkType and title are required');
      }
      
      // Get resource ID from variables if specified
      let resourceId = null;
      if (resourceIdVariable && resourceIdVariable.trim() !== '') {
        // Remove $ prefix if present
        const varName = resourceIdVariable.startsWith('$') 
          ? resourceIdVariable.substring(1) 
          : resourceIdVariable;
        
        resourceId = context.variables[varName];
        if (!resourceId) {
          console.warn(`Resource ID variable ${resourceIdVariable} not found in context`);
        }
      }
      
      // Replace variables in the content
      const processedTitle = replaceVariables(title, context.variables);
      const processedDescription = description 
        ? replaceVariables(description, context.variables) 
        : '';
      
      // Create the dynamic link
      const { url, token } = await createDynamicLink({
        linkType: linkType as DynamicLinkType,
        resourceId: resourceId,
        title: processedTitle,
        description: processedDescription,
        expiresInDays: expiresInDays || 14,
        password: passwordProtected ? password : undefined,
        createdBy: context.userId,
        metadata: {
          workflowId: context.workflowId,
          executionId: context.executionId,
          createdBy: 'automation',
        },
      });
      
      // Store the generated link in the context variables
      if (node.data.outputLinkVariable) {
        const outputVarName = node.data.outputLinkVariable.startsWith('$') 
          ? node.data.outputLinkVariable.substring(1) 
          : node.data.outputLinkVariable;
        
        context.variables[outputVarName] = `${process.env.NEXT_PUBLIC_APP_URL || ''}${url}`;
      }
      
      // Return the result
      return {
        success: true,
        message: 'Dynamic link created successfully',
        token,
        url,
        fullUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}${url}`,
        linkType,
        title: processedTitle,
        description: processedDescription,
        expiresInDays,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error executing DynamicLinkNode:', error);
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
