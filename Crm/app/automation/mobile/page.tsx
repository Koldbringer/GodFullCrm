import { Metadata } from 'next';
import { MobileAutomationDashboard } from '@/components/automation/mobile-automation-dashboard';

export const metadata: Metadata = {
  title: 'Automatyzacja (Mobile) | GodLike CRM/ERP',
  description: 'Mobilny panel zarządzania automatyzacją',
};

export default function MobileAutomationPage() {
  return (
    <div className="container mx-auto py-4 px-2">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Automatyzacja</h1>
        <p className="text-muted-foreground text-sm">
          Zarządzaj automatyzacją procesów biznesowych
        </p>
      </div>
      
      <MobileAutomationDashboard />
    </div>
  );
}
