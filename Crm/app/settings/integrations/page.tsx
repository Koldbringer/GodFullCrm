import { Separator } from '@/components/ui/separator';
import { IntegrationsSettings } from '@/components/settings/integrations-settings';

export default function IntegrationsSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Integracje Zewnętrzne</h3>
        <p className="text-sm text-muted-foreground">
          Konfiguruj integracje z zewnętrznymi systemami i usługami.
        </p>
      </div>
      <Separator />
      <IntegrationsSettings />
    </div>
  );
}