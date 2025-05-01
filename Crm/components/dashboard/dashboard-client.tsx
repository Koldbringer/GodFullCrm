'use client';

import { useUserPreferences } from '@/hooks/useUserPreferences';
import { AiInsightsPanel } from '@/components/dashboard/ai-insights-panel';
import { IotMonitoringPanel } from '@/components/dashboard/iot-monitoring-panel';
import { TechnicianPerformance } from '@/components/dashboard/technician-performance';
import { BusinessMetrics } from '@/components/dashboard/business-metrics';
import { UpcomingTasks } from '@/components/dashboard/upcoming-tasks';
import { AutomationStatusPanel } from '@/components/dashboard/automation-status-panel';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

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

export function DashboardClient() {
  const { value: preferences, isLoading } = useUserPreferences<DashboardPreferences>(
    'dashboard',
    'layout',
    defaultPreferences
  );
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Set up auto-refresh
  useEffect(() => {
    // Clear any existing timer
    if (refreshTimer) {
      clearInterval(refreshTimer);
      setRefreshTimer(null);
    }

    // If refresh interval is set and greater than 0, set up a new timer
    if (preferences.refreshInterval > 0) {
      const timer = setInterval(() => {
        // Refresh the page data
        window.location.reload();
        toast({
          title: 'Dashboard Refreshed',
          description: `Dashboard data has been automatically refreshed.`,
        });
      }, preferences.refreshInterval * 1000);

      setRefreshTimer(timer);
    }

    // Clean up on unmount
    return () => {
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
    };
  }, [preferences.refreshInterval, toast]);

  if (isLoading) {
    return <div>Loading dashboard preferences...</div>;
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/settings/preferences">
            <Settings className="mr-2 h-4 w-4" />
            Customize Dashboard
          </Link>
        </Button>
      </div>

      <div className={`grid gap-4 ${preferences.layout === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {/* Column 1 */}
        <div className="space-y-4">
          {preferences.showAiInsights && <AiInsightsPanel />}
          {preferences.showBusinessMetrics && <BusinessMetrics />}
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          {preferences.showIotMonitoring && <IotMonitoringPanel />}
          {preferences.showTechnicianPerformance && <TechnicianPerformance />}
        </div>

        {/* Column 3 */}
        <div className="space-y-4">
          {preferences.showUpcomingTasks && <UpcomingTasks />}
          {preferences.showAutomationStatus && <AutomationStatusPanel />}
        </div>
      </div>
    </>
  );
}
