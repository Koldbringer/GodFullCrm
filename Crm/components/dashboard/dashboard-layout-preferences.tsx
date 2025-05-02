'use client';

import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/AuthProvider';

interface DashboardPreferences {
  layout: 'grid' | 'list';
  showAiInsights: boolean;
  showIotMonitoring: boolean;
  showTechnicianPerformance: boolean;
  showBusinessMetrics: boolean;
  showUpcomingTasks: boolean;
  showAutomationStatus: boolean;
  refreshInterval: number; // in seconds
}

const defaultPreferences: DashboardPreferences = {
  layout: 'grid',
  showAiInsights: true,
  showIotMonitoring: true,
  showTechnicianPerformance: true,
  showBusinessMetrics: true,
  showUpcomingTasks: true,
  showAutomationStatus: true,
  refreshInterval: 300, // 5 minutes
};

export function DashboardLayoutPreferences() {
  const { user } = useAuth();
  const {
    value: preferences,
    setValue: setPreferences,
    isLoading,
    isSaving,
  } = useUserPreferences<DashboardPreferences>('dashboard', 'layout', defaultPreferences);

  // Handle individual preference changes
  const updatePreference = <K extends keyof DashboardPreferences>(key: K, value: DashboardPreferences[K]) => {
    setPreferences({
      ...preferences,
      [key]: value,
    });
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Preferences</CardTitle>
          <CardDescription>Please log in to manage your dashboard preferences</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Preferences</CardTitle>
        <CardDescription>Customize your dashboard layout and widgets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="layout">Layout Style</Label>
                <Select
                  value={preferences.layout}
                  onValueChange={(value) => updatePreference('layout', value as 'grid' | 'list')}
                  disabled={isSaving}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="refreshInterval">Auto-refresh Interval</Label>
                <Select
                  value={preferences.refreshInterval.toString()}
                  onValueChange={(value) => updatePreference('refreshInterval', parseInt(value))}
                  disabled={isSaving}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                    <SelectItem value="600">10 minutes</SelectItem>
                    <SelectItem value="1800">30 minutes</SelectItem>
                    <SelectItem value="3600">1 hour</SelectItem>
                    <SelectItem value="0">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 pt-4">
                <h3 className="text-sm font-medium">Visible Widgets</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showAiInsights"
                      checked={preferences.showAiInsights}
                      onCheckedChange={(checked) => updatePreference('showAiInsights', checked)}
                      disabled={isSaving}
                    />
                    <Label htmlFor="showAiInsights">AI Insights</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showIotMonitoring"
                      checked={preferences.showIotMonitoring}
                      onCheckedChange={(checked) => updatePreference('showIotMonitoring', checked)}
                      disabled={isSaving}
                    />
                    <Label htmlFor="showIotMonitoring">IoT Monitoring</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showTechnicianPerformance"
                      checked={preferences.showTechnicianPerformance}
                      onCheckedChange={(checked) => updatePreference('showTechnicianPerformance', checked)}
                      disabled={isSaving}
                    />
                    <Label htmlFor="showTechnicianPerformance">Technician Performance</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showBusinessMetrics"
                      checked={preferences.showBusinessMetrics}
                      onCheckedChange={(checked) => updatePreference('showBusinessMetrics', checked)}
                      disabled={isSaving}
                    />
                    <Label htmlFor="showBusinessMetrics">Business Metrics</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showUpcomingTasks"
                      checked={preferences.showUpcomingTasks}
                      onCheckedChange={(checked) => updatePreference('showUpcomingTasks', checked)}
                      disabled={isSaving}
                    />
                    <Label htmlFor="showUpcomingTasks">Upcoming Tasks</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showAutomationStatus"
                      checked={preferences.showAutomationStatus}
                      onCheckedChange={(checked) => updatePreference('showAutomationStatus', checked)}
                      disabled={isSaving}
                    />
                    <Label htmlFor="showAutomationStatus">Automation Status</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setPreferences(defaultPreferences)}
                disabled={isSaving}
                className="mr-2"
              >
                Reset to Defaults
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
