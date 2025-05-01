import { Metadata } from 'next';
import { WorkflowTemplatesGallery } from '@/components/automation/workflow-templates-gallery';

export const metadata: Metadata = {
  title: 'Szablony automatyzacji | GodLike CRM/ERP',
  description: 'Gotowe szablony przepływów automatyzacji dla Twojego biznesu',
};

export default function WorkflowTemplatesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Szablony automatyzacji</h1>
        <p className="text-muted-foreground">
          Wybierz gotowy szablon przepływu pracy i dostosuj go do swoich potrzeb
        </p>
      </div>
      
      <WorkflowTemplatesGallery />
    </div>
  );
}
