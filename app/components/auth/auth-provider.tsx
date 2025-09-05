
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      const isAuthRoute = pathname?.startsWith('/auth/');
      const isDashboardRoute = pathname?.startsWith('/dashboard');
      const isPublicRoute = pathname === '/';

      if (isDashboardRoute && !user) {
        // Redirect to signin if trying to access dashboard without auth
        router.push('/auth/signin');
      } else if (isAuthRoute && user) {
        // Redirect to dashboard if already authenticated and on auth page
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);

  // Show loading spinner while checking auth
  if (loading && (pathname?.startsWith('/dashboard') || pathname?.startsWith('/auth/'))) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
