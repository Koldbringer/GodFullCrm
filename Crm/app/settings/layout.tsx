import { Separator } from '@/components/ui/separator';
import { SidebarNav } from '@/components/sidebar-nav';

import { SettingsSidebarNav } from '@/components/settings/settings-sidebar-nav';

const sidebarNavItems = [
  {
    title: 'Ogólne',
    href: '/settings/general',
  },
  {
    title: 'Użytkownicy i Role',
    href: '/settings/users',
  },
  {
    title: 'Integracje',
    href: '/settings/integrations',
  },
  {
    title: 'Automatyzacja i Powiadomienia',
    href: '/settings/automation',
  },
  {
    title: 'Moduły',
    href: '/settings/modules',
  },
  {
    title: 'Bezpieczeństwo',
    href: '/settings/security',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="hidden space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Ustawienia</h2>
        <p className="text-muted-foreground">
          Zarządzaj ustawieniami swojego konta i systemu.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SettingsSidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
}