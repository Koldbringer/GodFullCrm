import { Metadata } from 'next';
import { AiInsightsPanel } from '@/components/automation/ai-insights-panel';

export const metadata: Metadata = {
  title: 'AI Insights | GodLike CRM/ERP',
  description: 'AI-powered insights and analysis from your automation workflows',
};

export default function AiInsightsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Insights</h1>
        <p className="text-muted-foreground">
          AI-powered insights and analysis from your automation workflows
        </p>
      </div>
      
      <AiInsightsPanel />
    </div>
  );
}
