import { Separator } from '@/components/ui/separator';
import { AutomationSettings } from '@/components/settings/automation-settings';

export default function AutomationSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Automatyzacja i Powiadomienia</h3>
        <p className="text-sm text-muted-foreground">
          Konfiguruj reguły automatyzacji i szablony powiadomień.
        </p>
      </div>
      <Separator />
      <AutomationSettings />
    </div>
  );
}