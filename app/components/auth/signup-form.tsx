
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { demoUsers } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';

export function SignUpForm() {
  const router = useRouter();
  const { signIn } = useAuth();

  const handleDemoLogin = async (email: string) => {
    const result = await signIn(email);
    if (result.success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16">
              <Image
                src="/birdlogyc-logo.png"
                alt="birdlogyc logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">birdlogyc</h2>
          <p className="mt-2 text-sm text-gray-600">
            Mode démonstration
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inscription Démo</CardTitle>
            <CardDescription>
              En mode démonstration, choisissez un profil existant pour découvrir birdlogyc
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700 text-center">
                Profils disponibles :
              </div>
              <div className="space-y-2">
                {demoUsers.map((user) => (
                  <Button
                    key={user.id}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => handleDemoLogin(user.email)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-gray-500">
                        {user.email} - {user.role === 'SALES_REP' ? 'Commercial' : user.role === 'MANAGER' ? 'Manager' : 'Admin'}
                        {user.territory && ` - ${user.territory}`}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="text-center space-y-2">
              <Link href="/auth/signin" className="text-sm text-blue-600 hover:text-blue-500 block">
                Déjà un compte ? Se connecter
              </Link>
              <Link href="/" className="text-sm text-blue-600 hover:text-blue-500 block">
                ← Retour à l'accueil
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
