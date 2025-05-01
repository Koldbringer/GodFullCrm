import { registerNodeHandler } from '../workflow-execution';
import { EmailNodeHandler } from './email-node-handler';
import { CreateTaskNodeHandler } from './create-task-node-handler';
import { DataConditionNodeHandler } from './data-condition-node-handler';
import { TimeConditionNodeHandler } from './time-condition-node-handler';
import { AiAnalysisNodeHandler } from './ai-analysis-node-handler';
import { DynamicLinkNodeHandler } from './dynamic-link-node-handler';

/**
 * Register all node handlers
 */
export function registerNodeHandlers() {
  // Register basic action nodes
  registerNodeHandler('EmailNode', EmailNodeHandler);
  registerNodeHandler('CreateTaskNode', CreateTaskNodeHandler);
  registerNodeHandler('DynamicLinkNode', DynamicLinkNodeHandler);

  // Register condition nodes
  registerNodeHandler('DataConditionNode', DataConditionNodeHandler);
  registerNodeHandler('TimeConditionNode', TimeConditionNodeHandler);

  // Register AI nodes
  registerNodeHandler('AiAnalysisNode', AiAnalysisNodeHandler);

  console.log('Node handlers registered successfully');
}

// Export all handlers for direct access if needed
export {
  EmailNodeHandler,
  CreateTaskNodeHandler,
  DataConditionNodeHandler,
  TimeConditionNodeHandler,
  AiAnalysisNodeHandler,
  DynamicLinkNodeHandler,
};
