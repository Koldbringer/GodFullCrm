import { Metadata } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserInterfacePreferences } from '@/components/settings/user-interface-preferences';
import { DashboardLayoutPreferences } from '@/components/dashboard/dashboard-layout-preferences';
import { SetupUserPreferences } from '@/components/settings/setup-user-preferences';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'User Preferences | GodLike CRM/ERP',
  description: 'Manage your personal preferences and settings',
};

export default function PreferencesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">User Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Customize your experience with personalized settings
        </p>
      </div>
      <Separator />

      <Tabs defaultValue="interface" className="space-y-4">
        <TabsList>
          <TabsTrigger value="interface">Interface</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="setup">Setup</TabsTrigger>
        </TabsList>
        <TabsContent value="interface" className="space-y-4">
          <UserInterfacePreferences />
        </TabsContent>
        <TabsContent value="dashboard" className="space-y-4">
          <DashboardLayoutPreferences />
        </TabsContent>
        <TabsContent value="setup" className="space-y-4">
          <SetupUserPreferences />
        </TabsContent>
      </Tabs>
    </div>
  );
}
