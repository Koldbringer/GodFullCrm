import { Metadata } from 'next';
import { WorkflowMonitor } from '@/components/automation/workflow-monitor';

export const metadata: Metadata = {
  title: 'Monitor automatyzacji | GodLike CRM/ERP',
  description: 'Monitoruj wykonanie przepływów automatyzacji',
};

export default function WorkflowMonitorPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Monitor automatyzacji</h1>
        <p className="text-muted-foreground">
          Monitoruj wykonanie przepływów automatyzacji i sprawdzaj ich status
        </p>
      </div>
      
      <WorkflowMonitor />
    </div>
  );
}
