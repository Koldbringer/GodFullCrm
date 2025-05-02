import { NodeHandler, WorkflowNode, WorkflowExecutionContext } from '../workflow-execution';

/**
 * Handler for the DataConditionNode type
 * Evaluates a condition and determines which path to follow
 */
export const DataConditionNodeHandler: NodeHandler = {
  async execute(node: WorkflowNode, context: WorkflowExecutionContext): Promise<any> {
    try {
      // Extract condition parameters from node data
      const { field, operator, value } = node.data;
      
      // Validate required fields
      if (!field || !operator) {
        throw new Error('Missing required condition parameters: field or operator');
      }
      
      // Get the actual field value from context variables
      const fieldValue = getNestedValue(context.variables, field);
      
      // Evaluate the condition
      const result = evaluateCondition(fieldValue, operator, value);
      
      // Return the result
      return {
        success: true,
        result,
        condition: `${field} ${operator} ${value}`,
        fieldValue,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error executing DataConditionNode:', error);
      throw error;
    }
  }
};

/**
 * Get a nested value from an object using dot notation
 * Example: getNestedValue({user: {profile: {name: 'John'}}}, 'user.profile.name') returns 'John'
 */
function getNestedValue(obj: Record<string, any>, path: string): any {
  const keys = path.split('.');
  return keys.reduce((o, key) => (o && o[key] !== undefined) ? o[key] : undefined, obj);
}

/**
 * Evaluate a condition based on the operator
 */
function evaluateCondition(fieldValue: any, operator: string, compareValue: any): boolean {
  switch (operator) {
    case 'equals':
      return fieldValue == compareValue;
    case 'notEquals':
      return fieldValue != compareValue;
    case 'greaterThan':
      return fieldValue > compareValue;
    case 'lessThan':
      return fieldValue < compareValue;
    case 'greaterThanOrEqual':
      return fieldValue >= compareValue;
    case 'lessThanOrEqual':
      return fieldValue <= compareValue;
    case 'contains':
      return String(fieldValue).includes(String(compareValue));
    case 'notContains':
      return !String(fieldValue).includes(String(compareValue));
    case 'startsWith':
      return String(fieldValue).startsWith(String(compareValue));
    case 'endsWith':
      return String(fieldValue).endsWith(String(compareValue));
    case 'isEmpty':
      return fieldValue === undefined || fieldValue === null || fieldValue === '';
    case 'isNotEmpty':
      return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}
