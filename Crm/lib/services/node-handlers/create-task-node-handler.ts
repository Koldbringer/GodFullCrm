import { NodeHandler, WorkflowNode, WorkflowExecutionContext } from '../workflow-execution';

/**
 * Handler for the CreateTaskNode type
 * Creates a task based on the node configuration
 */
export const CreateTaskNodeHandler: NodeHandler = {
  async execute(node: WorkflowNode, context: WorkflowExecutionContext): Promise<any> {
    try {
      // Extract task parameters from node data
      const { description, assignee, dueDate } = node.data;
      
      // Validate required fields
      if (!description) {
        throw new Error('Missing required task parameter: description');
      }
      
      // Replace variables in the task content
      const processedDescription = replaceVariables(description, context.variables);
      const processedAssignee = assignee ? replaceVariables(assignee, context.variables) : null;
      const processedDueDate = dueDate ? replaceVariables(dueDate, context.variables) : null;
      
      // Create the task in the database
      const { data, error } = await context.supabase
        .from('tasks')
        .insert({
          description: processedDescription,
          assignee: processedAssignee,
          due_date: processedDueDate,
          status: 'pending',
          created_at: new Date().toISOString(),
          workflow_execution_id: context.executionId,
        })
        .select()
        .single();
      
      if (error) {
        throw new Error(`Failed to create task: ${error.message}`);
      }
      
      // Return the result
      return {
        success: true,
        message: 'Task created successfully',
        taskId: data.id,
        description: processedDescription,
        assignee: processedAssignee,
        dueDate: processedDueDate,
        status: 'pending',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error executing CreateTaskNode:', error);
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
