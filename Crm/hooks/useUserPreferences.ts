import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/ui/use-toast';

export type PreferenceType = 'ui' | 'dashboard' | 'notifications' | 'filters';

export function useUserPreferences<T>(
  preferenceType: PreferenceType,
  preferenceKey: string,
  defaultValue: T
) {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const supabase = createClient();

  // Load preference from Supabase
  useEffect(() => {
    if (!user || !supabase) {
      setIsLoading(false);
      return;
    }

    async function loadPreference() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('user_preferences')
          .select('preference_value')
          .eq('user_id', user.id)
          .eq('preference_type', preferenceType)
          .eq('preference_key', preferenceKey)
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" - not an error for us
          console.error('Error loading preference:', error);
          toast({
            title: 'Error',
            description: 'Failed to load your preferences',
            variant: 'destructive',
          });
        }

        if (data) {
          setValue(data.preference_value as T);
        }
      } catch (err) {
        console.error('Unexpected error loading preference:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadPreference();

    // Set up real-time subscription
    const channel = supabase
      .channel(`user-preferences-${preferenceType}-${preferenceKey}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_preferences',
          filter: `user_id=eq.${user.id} AND preference_type=eq.${preferenceType} AND preference_key=eq.${preferenceKey}`,
        },
        (payload) => {
          if (payload.new) {
            setValue(payload.new.preference_value as T);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase, preferenceType, preferenceKey, toast]);

  // Save preference to Supabase
  const savePreference = async (newValue: T) => {
    if (!user || !supabase) {
      setValue(newValue); // Still update local state
      return;
    }

    try {
      setIsSaving(true);
      setValue(newValue); // Optimistic update

      const { error } = await supabase
        .from('user_preferences')
        .upsert(
          {
            user_id: user.id,
            preference_type: preferenceType,
            preference_key: preferenceKey,
            preference_value: newValue,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id, preference_type, preference_key',
          }
        );

      if (error) {
        console.error('Error saving preference:', error);
        toast({
          title: 'Error',
          description: 'Failed to save your preferences',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Your preferences have been saved',
        });
      }
    } catch (err) {
      console.error('Unexpected error saving preference:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    value,
    setValue: savePreference,
    isLoading,
    isSaving,
  };
}
