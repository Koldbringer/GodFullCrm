import { Separator } from '@/components/ui/separator';
import { UserRolesSettings } from '@/components/settings/user-roles-settings';

export default function UserRolesSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Użytkownicy i Role</h3>
        <p className="text-sm text-muted-foreground">
          Zarządzaj użytkownikami systemu i przypisanymi do nich rolami.
        </p>
      </div>
      <Separator />
      <UserRolesSettings />
    </div>
  );
}