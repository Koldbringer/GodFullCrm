import { Separator } from '@/components/ui/separator';
import { SecuritySettings } from '@/components/settings/security-settings';

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Bezpieczeństwo</h3>
        <p className="text-sm text-muted-foreground">
          Konfiguruj ustawienia związane z bezpieczeństwem systemu.
        </p>
      </div>
      <Separator />
      <SecuritySettings />
    </div>
  );
}