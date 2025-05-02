import { GeneralSettingsForm } from '@/components/settings/general-settings-form';

export default function GeneralSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Ogólne</h3>
        <p className="text-sm text-muted-foreground">
          Zarządzaj ogólnymi ustawieniami aplikacji.
        </p>
      </div>
      <GeneralSettingsForm />
    </div>
  );
}