import { Separator } from '@/components/ui/separator';
import { ModuleSettings } from '@/components/settings/module-settings';

export default function ModuleSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Ustawienia Modułowe</h3>
        <p className="text-sm text-muted-foreground">
          Konfiguruj ustawienia specyficzne dla poszczególnych modułów systemu.
        </p>
      </div>
      <Separator />
      <ModuleSettings />
    </div>
  );
}