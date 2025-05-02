'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function SetupUserPreferences() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/setup/user-preferences', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: data.message || 'User preferences setup completed successfully',
        });
      } else {
        throw new Error(data.error || 'Failed to set up user preferences');
      }
    } catch (error) {
      console.error('Error setting up user preferences:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Setup User Preferences</CardTitle>
        <CardDescription>
          Initialize the database schema for user preferences. This only needs to be done once.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This will create the necessary database tables and functions to store user preferences.
          It's safe to run this multiple times as it will only create the tables if they don't exist.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSetup} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Setting up...
            </>
          ) : (
            'Initialize User Preferences'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
