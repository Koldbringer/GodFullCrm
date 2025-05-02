import { Metadata } from 'next';
import { MastraAssistant } from '@/components/mastra/mastra-assistant';
import { Bot, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mastra Assistant | GodLike CRM/ERP',
  description: 'AI-powered assistant using Mastra MCP with OpenAI integration',
};

export default function MastraAssistantPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Mastra Assistant</h1>
        <p className="text-muted-foreground">
          AI-powered assistant using Mastra MCP with OpenAI integration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <MastraAssistant />
        </div>
        
        <div className="space-y-6">
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              About Mastra Assistant
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Mastra Assistant is an AI-powered assistant that can help you with various tasks in the CRM/ERP system.
            </p>
            <div className="space-y-3">
              <h3 className="font-medium">Capabilities:</h3>
              <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                <li>Search for customers and service orders</li>
                <li>Analyze customer data and provide insights</li>
                <li>Generate content for customer communications</li>
                <li>Answer questions about the CRM/ERP system</li>
              </ul>
            </div>
          </div>
          
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Example Prompts
            </h2>
            <div className="space-y-3">
              <div className="text-sm p-2 bg-muted rounded-md cursor-pointer hover:bg-muted/80">
                Search for customers named "Smith"
              </div>
              <div className="text-sm p-2 bg-muted rounded-md cursor-pointer hover:bg-muted/80">
                Find service orders scheduled for next week
              </div>
              <div className="text-sm p-2 bg-muted rounded-md cursor-pointer hover:bg-muted/80">
                Analyze customer data for customer ID 123
              </div>
              <div className="text-sm p-2 bg-muted rounded-md cursor-pointer hover:bg-muted/80">
                Generate an email reminder for a service appointment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}