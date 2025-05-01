import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AutomationDashboard } from '@/components/automation/automation-dashboard';

export const metadata: Metadata = {
  title: 'Automation Dashboard | GodLike CRM/ERP',
  description: 'Monitor and manage your automation workflows',
};

export default function AutomationDashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Automation Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage your automation workflows
        </p>
      </div>
      
      <AutomationDashboard />
    </div>
  );
}
