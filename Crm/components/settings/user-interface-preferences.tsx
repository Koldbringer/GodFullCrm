'use client';

import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/AuthProvider';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

interface UIPreferences {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  denseMode: boolean;
  animationsEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const defaultPreferences: UIPreferences = {
  theme: 'system',
  sidebarCollapsed: false,
  denseMode: false,
  animationsEnabled: true,
  fontSize: 'medium',
};

export function UserInterfacePreferences() {
  const { user } = useAuth();
  const { setTheme } = useTheme();
  const {
    value: preferences,
    setValue: setPreferences,
    isLoading,
    isSaving,
  } = useUserPreferences<UIPreferences>('ui', 'interface', defaultPreferences);

  // Apply theme when it changes
  useEffect(() => {
    if (preferences.theme) {
      setTheme(preferences.theme);
    }
  }, [preferences.theme, setTheme]);

  // Apply font size when it changes
  useEffect(() => {
    if (preferences.fontSize) {
      const root = document.documentElement;
      switch (preferences.fontSize) {
        case 'small':
          root.style.fontSize = '14px';
          break;
        case 'medium':
          root.style.fontSize = '16px';
          break;
        case 'large':
          root.style.fontSize = '18px';
          break;
      }
    }
  }, [preferences.fontSize]);

  // Handle individual preference changes
  const updatePreference = <K extends keyof UIPreferences>(key: K, value: UIPreferences[K]) => {
    setPreferences({
      ...preferences,
      [key]: value,
    });
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Interface Preferences</CardTitle>
          <CardDescription>Please log in to manage your preferences</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Interface Preferences</CardTitle>
        <CardDescription>Customize how the application looks and feels</CardDescription>
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
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={preferences.theme}
                  onValueChange={(value) => updatePreference('theme', value as UIPreferences['theme'])}
                  disabled={isSaving}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="sidebarCollapsed">Collapsed Sidebar</Label>
                <Switch
                  id="sidebarCollapsed"
                  checked={preferences.sidebarCollapsed}
                  onCheckedChange={(checked) => updatePreference('sidebarCollapsed', checked)}
                  disabled={isSaving}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="denseMode">Dense Mode</Label>
                <Switch
                  id="denseMode"
                  checked={preferences.denseMode}
                  onCheckedChange={(checked) => updatePreference('denseMode', checked)}
                  disabled={isSaving}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="animationsEnabled">Enable Animations</Label>
                <Switch
                  id="animationsEnabled"
                  checked={preferences.animationsEnabled}
                  onCheckedChange={(checked) => updatePreference('animationsEnabled', checked)}
                  disabled={isSaving}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="fontSize">Font Size</Label>
                <Select
                  value={preferences.fontSize}
                  onValueChange={(value) => updatePreference('fontSize', value as UIPreferences['fontSize'])}
                  disabled={isSaving}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
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
