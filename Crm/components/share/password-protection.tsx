'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { verifyDynamicLinkPassword } from '@/lib/services/dynamic-links-client';

interface PasswordProtectionProps {
  token: string;
}

export function PasswordProtection({ token }: PasswordProtectionProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsVerifying(true);

    try {
      const isValid = await verifyDynamicLinkPassword(token, password);
      
      if (isValid) {
        // Store in session storage that this link has been verified
        sessionStorage.setItem(`link-verified-${token}`, 'true');
        // Refresh the page to show the content
        router.refresh();
      } else {
        setError('Nieprawidłowe hasło. Spróbuj ponownie.');
      }
    } catch (err) {
      setError('Wystąpił błąd podczas weryfikacji hasła.');
      console.error('Password verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Zawartość chroniona hasłem</CardTitle>
          <CardDescription className="text-center">
            Wprowadź hasło, aby uzyskać dostęp do tej zawartości.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Wprowadź hasło..."
                required
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isVerifying}>
              {isVerifying ? 'Weryfikacja...' : 'Odblokuj dostęp'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
