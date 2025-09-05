
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { demoUsers, AuthManager } from '@/lib/auth';
import { Skeleton } from '@/components/ui/skeleton';

export function SignInForm() {
  const router = useRouter();
  const { signIn, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email) {
      setLocalError('Veuillez saisir un email');
      return;
    }

    try {
      // Direct login using AuthManager
      const user = AuthManager.login(email);
      
      if (user) {
        console.log('Direct login successful:', user);
        // Force a page reload to update the auth state
        window.location.href = '/dashboard';
      } else {
        setLocalError('Email de démonstration non reconnu');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLocalError('Erreur lors de la connexion');
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    console.log('handleDemoLogin called with:', demoEmail);
    setEmail(demoEmail);
    setLocalError('');
    
    try {
      // Direct login using AuthManager
      const user = AuthManager.login(demoEmail);
      
      if (user) {
        console.log('Demo login successful:', user);
        // Force a page reload to update the auth state
        window.location.href = '/dashboard';
      } else {
        setLocalError('Utilisateur de démonstration non trouvé');
      }
    } catch (error) {
      console.error('Error during demo login:', error);
      setLocalError('Erreur lors de la connexion démonstration');
    }
  };

  const currentError = error || localError;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8 sm:py-12 px-3 sm:px-4 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16">
              <Image
                src="/birdlogyc-logo.png"
                alt="birdlogyc logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">birdlogyc</h2>
          <p className="mt-2 text-sm text-gray-600">
            Mode démonstration
          </p>
        </div>

        <Card className="bg-white/95 backdrop-blur-md shadow-xl border-0">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Connexion Démo</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Choisissez un profil de démonstration pour explorer birdlogyc
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {currentError && (
              <Alert variant="destructive">
                <AlertDescription>{currentError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email de démonstration</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Saisissez un email de démo"
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                )}
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700 text-center">
                Profils de démonstration :
              </div>
              <div className="space-y-2">
                {demoUsers.map((user) => (
                  <Button
                    key={user.id}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left p-3 sm:p-4 h-auto"
                    onClick={() => handleDemoLogin(user.email)}
                    disabled={loading}
                  >
                    <div className="flex flex-col items-start w-full">
                      <span className="font-medium text-sm sm:text-base">{user.name}</span>
                      <span className="text-xs text-gray-500 break-words">
                        {user.email}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {user.role === 'SALES_REP' ? 'Commercial' : user.role === 'MANAGER' ? 'Manager' : 'Admin'}
                        {user.territory && ` - ${user.territory}`}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Link href="/" className="text-sm text-blue-600 hover:text-blue-500">
                ← Retour à l'accueil
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
