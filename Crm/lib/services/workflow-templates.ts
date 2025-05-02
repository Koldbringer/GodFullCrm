import { Workflow, WorkflowNode, WorkflowConnection, WorkflowTrigger } from './workflow-execution';

// Define the template interface
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'customer' | 'service' | 'inventory' | 'reporting' | 'marketing';
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  triggers: WorkflowTrigger[];
  previewImageUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Generate a unique ID for nodes when creating from templates
const generateUniqueId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Customer reminder template
const customerReminderTemplate: WorkflowTemplate = {
  id: 'customer-reminder',
  name: 'Przypomnienie o przeglądzie',
  description: 'Automatyczne przypomnienia dla klientów o zbliżających się przeglądach serwisowych',
  category: 'customer',
  difficulty: 'beginner',
  nodes: [
    {
      id: 'timeCondition1',
      type: 'TimeConditionNode',
      data: {
        conditionType: 'daysBefore',
        days: 7,
      },
      inputs: {},
      outputs: {},
      position: [300, 200],
    },
    {
      id: 'emailNode1',
      type: 'EmailNode',
      data: {
        recipient: '{{customer.email}}',
        subject: 'Przypomnienie o przeglądzie serwisowym',
        body: 'Szanowny {{customer.name}},\n\nPrzypominamy o zbliżającym się terminie przeglądu serwisowego zaplanowanym na {{service.date}}.\n\nZ poważaniem,\nZespół serwisowy',
      },
      inputs: {},
      outputs: {},
      position: [600, 200],
    },
    {
      id: 'createTaskNode1',
      type: 'CreateTaskNode',
      data: {
        description: 'Kontakt z klientem {{customer.name}} w sprawie przeglądu {{service.id}}',
        assignee: 'auto',
        dueDate: '{{service.date}}',
      },
      inputs: {},
      outputs: {},
      position: [600, 400],
    },
  ],
  connections: [
    {
      id: 'conn1',
      source: 'timeCondition1',
      sourceOutput: 'exec',
      target: 'emailNode1',
      targetInput: 'exec',
    },
    {
      id: 'conn2',
      source: 'timeCondition1',
      sourceOutput: 'exec',
      target: 'createTaskNode1',
      targetInput: 'exec',
    },
  ],
  triggers: [
    {
      id: 'trigger1',
      type: 'schedule',
      config: {
        schedule: '0 9 * * *', // Every day at 9 AM
        timezone: 'Europe/Warsaw',
      },
    },
  ],
};

// Service order assignment template
const serviceOrderAssignmentTemplate: WorkflowTemplate = {
  id: 'service-order-assignment',
  name: 'Przypisanie zlecenia serwisowego',
  description: 'Automatyczne przypisywanie zleceń serwisowych do techników na podstawie lokalizacji i umiejętności',
  category: 'service',
  difficulty: 'intermediate',
  nodes: [
    {
      id: 'dataCondition1',
      type: 'DataConditionNode',
      data: {
        field: 'service_order.status',
        operator: 'equals',
        value: 'new',
      },
      inputs: {},
      outputs: {},
      position: [300, 200],
    },
    {
      id: 'aiAnalysis1',
      type: 'AiAnalysisNode',
      data: {
        inputData: '{{service_order}}',
        prompt: 'Przeanalizuj zlecenie serwisowe i zaproponuj najlepszego technika na podstawie lokalizacji, umiejętności i dostępności.',
      },
      inputs: {},
      outputs: {},
      position: [600, 200],
    },
    {
      id: 'createTaskNode1',
      type: 'CreateTaskNode',
      data: {
        description: 'Przypisz zlecenie {{service_order.id}} do technika {{ai_result.recommended_technician}}',
        assignee: 'manager',
        dueDate: '{{today}}',
      },
      inputs: {},
      outputs: {},
      position: [900, 200],
    },
  ],
  connections: [
    {
      id: 'conn1',
      source: 'dataCondition1',
      sourceOutput: 'exec',
      target: 'aiAnalysis1',
      targetInput: 'exec',
    },
    {
      id: 'conn2',
      source: 'aiAnalysis1',
      sourceOutput: 'exec',
      target: 'createTaskNode1',
      targetInput: 'exec',
    },
  ],
  triggers: [
    {
      id: 'trigger1',
      type: 'event',
      config: {
        eventType: 'service_order.created',
      },
    },
  ],
};

// Inventory alert template
const inventoryAlertTemplate: WorkflowTemplate = {
  id: 'inventory-alert',
  name: 'Alert o niskim stanie magazynowym',
  description: 'Automatyczne powiadomienia o niskim stanie magazynowym części i materiałów',
  category: 'inventory',
  difficulty: 'beginner',
  nodes: [
    {
      id: 'dataCondition1',
      type: 'DataConditionNode',
      data: {
        field: 'inventory_item.quantity',
        operator: 'lessThan',
        value: '{{inventory_item.min_quantity}}',
      },
      inputs: {},
      outputs: {},
      position: [300, 200],
    },
    {
      id: 'emailNode1',
      type: 'EmailNode',
      data: {
        recipient: 'magazyn@firma.pl',
        subject: 'Alert: Niski stan magazynowy - {{inventory_item.name}}',
        body: 'Uwaga!\n\nStan magazynowy produktu {{inventory_item.name}} (ID: {{inventory_item.id}}) spadł poniżej minimum.\n\nAktualny stan: {{inventory_item.quantity}}\nMinimalny stan: {{inventory_item.min_quantity}}\n\nProszę o uzupełnienie zapasów.',
      },
      inputs: {},
      outputs: {},
      position: [600, 200],
    },
    {
      id: 'createTaskNode1',
      type: 'CreateTaskNode',
      data: {
        description: 'Zamów produkt {{inventory_item.name}} (ID: {{inventory_item.id}})',
        assignee: 'inventory_manager',
        dueDate: '{{today}}',
      },
      inputs: {},
      outputs: {},
      position: [600, 400],
    },
  ],
  connections: [
    {
      id: 'conn1',
      source: 'dataCondition1',
      sourceOutput: 'exec',
      target: 'emailNode1',
      targetInput: 'exec',
    },
    {
      id: 'conn2',
      source: 'dataCondition1',
      sourceOutput: 'exec',
      target: 'createTaskNode1',
      targetInput: 'exec',
    },
  ],
  triggers: [
    {
      id: 'trigger1',
      type: 'event',
      config: {
        eventType: 'inventory.updated',
      },
    },
  ],
};

// Monthly report template
const monthlyReportTemplate: WorkflowTemplate = {
  id: 'monthly-report',
  name: 'Raport miesięczny',
  description: 'Automatyczne generowanie i wysyłanie miesięcznych raportów biznesowych',
  category: 'reporting',
  difficulty: 'advanced',
  nodes: [
    {
      id: 'timeCondition1',
      type: 'TimeConditionNode',
      data: {
        conditionType: 'dayOfMonth',
        day: 1,
      },
      inputs: {},
      outputs: {},
      position: [300, 200],
    },
    {
      id: 'aiAnalysis1',
      type: 'AiAnalysisNode',
      data: {
        inputData: '{{monthly_data}}',
        prompt: 'Przeanalizuj dane z poprzedniego miesiąca i przygotuj raport zawierający kluczowe wskaźniki, trendy i rekomendacje.',
      },
      inputs: {},
      outputs: {},
      position: [600, 200],
    },
    {
      id: 'emailNode1',
      type: 'EmailNode',
      data: {
        recipient: 'zarzad@firma.pl',
        subject: 'Raport miesięczny - {{previous_month}}',
        body: 'Szanowni Państwo,\n\nW załączeniu przesyłam raport miesięczny za {{previous_month}}.\n\nKluczowe wskaźniki:\n{{ai_result.key_metrics}}\n\nTrendy:\n{{ai_result.trends}}\n\nRekomendacje:\n{{ai_result.recommendations}}\n\nZ poważaniem,\nSystem raportowania',
      },
      inputs: {},
      outputs: {},
      position: [900, 200],
    },
  ],
  connections: [
    {
      id: 'conn1',
      source: 'timeCondition1',
      sourceOutput: 'exec',
      target: 'aiAnalysis1',
      targetInput: 'exec',
    },
    {
      id: 'conn2',
      source: 'aiAnalysis1',
      sourceOutput: 'exec',
      target: 'emailNode1',
      targetInput: 'exec',
    },
  ],
  triggers: [
    {
      id: 'trigger1',
      type: 'schedule',
      config: {
        schedule: '0 7 1 * *', // First day of each month at 7 AM
        timezone: 'Europe/Warsaw',
      },
    },
  ],
};

// Customer satisfaction follow-up template
const customerSatisfactionTemplate: WorkflowTemplate = {
  id: 'customer-satisfaction',
  name: 'Ankieta satysfakcji klienta',
  description: 'Automatyczne wysyłanie ankiet satysfakcji po zakończeniu zlecenia serwisowego',
  category: 'marketing',
  difficulty: 'beginner',
  nodes: [
    {
      id: 'dataCondition1',
      type: 'DataConditionNode',
      data: {
        field: 'service_order.status',
        operator: 'equals',
        value: 'completed',
      },
      inputs: {},
      outputs: {},
      position: [300, 200],
    },
    {
      id: 'timeCondition1',
      type: 'TimeConditionNode',
      data: {
        conditionType: 'daysAfter',
        days: 2,
      },
      inputs: {},
      outputs: {},
      position: [600, 200],
    },
    {
      id: 'emailNode1',
      type: 'EmailNode',
      data: {
        recipient: '{{customer.email}}',
        subject: 'Jak oceniasz nasze usługi? - Ankieta satysfakcji',
        body: 'Szanowny {{customer.name}},\n\nDziękujemy za skorzystanie z naszych usług. Zależy nam na Twojej opinii.\n\nProsimy o wypełnienie krótkiej ankiety satysfakcji: {{survey_link}}\n\nZ góry dziękujemy za poświęcony czas.\n\nZ poważaniem,\nZespół obsługi klienta',
      },
      inputs: {},
      outputs: {},
      position: [900, 200],
    },
  ],
  connections: [
    {
      id: 'conn1',
      source: 'dataCondition1',
      sourceOutput: 'exec',
      target: 'timeCondition1',
      targetInput: 'exec',
    },
    {
      id: 'conn2',
      source: 'timeCondition1',
      sourceOutput: 'exec',
      target: 'emailNode1',
      targetInput: 'exec',
    },
  ],
  triggers: [
    {
      id: 'trigger1',
      type: 'event',
      config: {
        eventType: 'service_order.updated',
      },
    },
  ],
};

// Collection of all templates
export const workflowTemplates: WorkflowTemplate[] = [
  customerReminderTemplate,
  serviceOrderAssignmentTemplate,
  inventoryAlertTemplate,
  monthlyReportTemplate,
  customerSatisfactionTemplate,
];

// Function to get all available templates
export function getAllTemplates(): WorkflowTemplate[] {
  return workflowTemplates;
}

// Function to get a template by ID
export function getTemplateById(id: string): WorkflowTemplate | undefined {
  return workflowTemplates.find(template => template.id === id);
}

// Function to get templates by category
export function getTemplatesByCategory(category: string): WorkflowTemplate[] {
  return workflowTemplates.filter(template => template.category === category);
}

// Function to create a workflow from a template
export function createWorkflowFromTemplate(templateId: string): Workflow {
  const template = getTemplateById(templateId);
  
  if (!template) {
    throw new Error(`Template with ID ${templateId} not found`);
  }
  
  // Create a new workflow with unique node IDs
  const nodes = template.nodes.map(node => ({
    ...node,
    id: generateUniqueId(node.id),
  }));
  
  // Update connections to use the new node IDs
  const nodeIdMap = template.nodes.reduce((map, node, index) => {
    map[node.id] = nodes[index].id;
    return map;
  }, {} as Record<string, string>);
  
  const connections = template.connections.map(conn => ({
    ...conn,
    id: generateUniqueId(conn.id),
    source: nodeIdMap[conn.source],
    target: nodeIdMap[conn.target],
  }));
  
  // Create triggers with unique IDs
  const triggers = template.triggers.map(trigger => ({
    ...trigger,
    id: generateUniqueId(trigger.id),
  }));
  
  return {
    id: generateUniqueId('workflow'),
    name: template.name,
    description: template.description,
    nodes,
    connections,
    triggers,
    is_active: false, // Default to inactive
  };
}
