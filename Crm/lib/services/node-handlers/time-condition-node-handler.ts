import { NodeHandler, WorkflowNode, WorkflowExecutionContext } from '../workflow-execution';

/**
 * Handler for the TimeConditionNode type
 * Evaluates a time-based condition and determines which path to follow
 */
export const TimeConditionNodeHandler: NodeHandler = {
  async execute(node: WorkflowNode, context: WorkflowExecutionContext): Promise<any> {
    try {
      // Extract condition parameters from node data
      const { conditionType, time, date, dayOfWeek, referenceDate } = node.data;
      
      // Validate required fields
      if (!conditionType) {
        throw new Error('Missing required condition parameter: conditionType');
      }
      
      // Get the reference date (either from the context or current time)
      let referenceDateObj: Date;
      if (referenceDate) {
        const refDateValue = context.variables[referenceDate];
        referenceDateObj = refDateValue ? new Date(refDateValue) : new Date();
      } else {
        referenceDateObj = new Date();
      }
      
      // Evaluate the condition
      let result = false;
      let conditionDescription = '';
      
      switch (conditionType) {
        case 'timeOfDay':
          if (!time) throw new Error('Missing required parameter: time');
          result = evaluateTimeOfDay(referenceDateObj, time);
          conditionDescription = `Current time is ${result ? '' : 'not '}${time}`;
          break;
          
        case 'dayOfWeek':
          if (!dayOfWeek) throw new Error('Missing required parameter: dayOfWeek');
          result = evaluateDayOfWeek(referenceDateObj, dayOfWeek);
          conditionDescription = `Current day is ${result ? '' : 'not '}${dayOfWeek}`;
          break;
          
        case 'specificDate':
          if (!date) throw new Error('Missing required parameter: date');
          result = evaluateSpecificDate(referenceDateObj, date);
          conditionDescription = `Current date is ${result ? '' : 'not '}${date}`;
          break;
          
        case 'businessHours':
          result = evaluateBusinessHours(referenceDateObj);
          conditionDescription = `Current time is ${result ? '' : 'not '}within business hours`;
          break;
          
        case 'weekend':
          result = evaluateWeekend(referenceDateObj);
          conditionDescription = `Current day is ${result ? '' : 'not '}a weekend`;
          break;
          
        default:
          throw new Error(`Unsupported condition type: ${conditionType}`);
      }
      
      // Return the result
      return {
        success: true,
        result,
        condition: conditionDescription,
        referenceDate: referenceDateObj.toISOString(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error executing TimeConditionNode:', error);
      throw error;
    }
  }
};

/**
 * Evaluate if the current time matches the specified time
 */
function evaluateTimeOfDay(date: Date, time: string): boolean {
  const [hours, minutes] = time.split(':').map(Number);
  return date.getHours() === hours && date.getMinutes() === minutes;
}

/**
 * Evaluate if the current day matches the specified day of week
 */
function evaluateDayOfWeek(date: Date, dayOfWeek: string | number): boolean {
  const daysMap: Record<string, number> = {
    'sunday': 0,
    'monday': 1,
    'tuesday': 2,
    'wednesday': 3,
    'thursday': 4,
    'friday': 5,
    'saturday': 6,
  };
  
  const targetDay = typeof dayOfWeek === 'string' 
    ? daysMap[dayOfWeek.toLowerCase()]
    : dayOfWeek;
    
  return date.getDay() === targetDay;
}

/**
 * Evaluate if the current date matches the specified date
 */
function evaluateSpecificDate(date: Date, targetDate: string): boolean {
  const target = new Date(targetDate);
  return date.getFullYear() === target.getFullYear() &&
         date.getMonth() === target.getMonth() &&
         date.getDate() === target.getDate();
}

/**
 * Evaluate if the current time is within business hours (9 AM - 5 PM, Monday - Friday)
 */
function evaluateBusinessHours(date: Date): boolean {
  const day = date.getDay();
  const hours = date.getHours();
  
  // Check if it's a weekday (Monday - Friday)
  const isWeekday = day >= 1 && day <= 5;
  
  // Check if it's between 9 AM and 5 PM
  const isBusinessHours = hours >= 9 && hours < 17;
  
  return isWeekday && isBusinessHours;
}

/**
 * Evaluate if the current day is a weekend (Saturday or Sunday)
 */
function evaluateWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}
