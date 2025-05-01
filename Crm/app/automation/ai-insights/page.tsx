import { Metadata } from 'next';
import { AiInsightsPanel } from '@/components/automation/ai-insights-panel';
import { MCPAiInsightsPanel } from '@/components/automation/mcp-ai-insights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Sparkles } from 'lucide-react';

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

      <Tabs defaultValue="mcp" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="mcp" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            MCP AI Insights
          </TabsTrigger>
          <TabsTrigger value="legacy" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Legacy AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mcp">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Enhanced AI insights powered by Mastra MCP with OpenAI integration.
              This version provides more accurate and detailed analysis with direct database integration.
            </p>
          </div>
          <MCPAiInsightsPanel />
        </TabsContent>

        <TabsContent value="legacy">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Legacy AI insights panel. This version will be deprecated in the future.
            </p>
          </div>
          <AiInsightsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
