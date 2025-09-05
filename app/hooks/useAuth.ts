
'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthManager, DemoUser } from '@/lib/auth';

interface AuthState {
  user: DemoUser | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = () => {
      try {
        const user = AuthManager.getCurrentUser();
        setAuthState({
          user,
          loading: false,
          error: null
        });
      } catch (error) {
        setAuthState({
          user: null,
          loading: false,
          error: 'Erreur lors de la récupération de la session'
        });
      }
    };

    initializeAuth();

    // Listen for storage changes (for multi-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'birdlogyc_session') {
        initializeAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const signIn = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // For demo mode, directly use AuthManager without API call
      console.log('Attempting login with email:', email);
      
      const user = AuthManager.login(email);
      
      if (user) {
        console.log('Login successful:', user);
        setAuthState({
          user,
          loading: false,
          error: null
        });
        return { success: true };
      } else {
        console.log('Login failed: user not found');
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Utilisateur de démonstration non trouvé'
        }));
        return { success: false, error: 'Utilisateur de démonstration non trouvé' };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 'Erreur de connexion';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const signOut = useCallback(async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
      });
    } catch (error) {
      console.warn('Erreur lors de la déconnexion:', error);
    }

    AuthManager.logout();
    setAuthState({
      user: null,
      loading: false,
      error: null
    });
  }, []);

  const isAuthenticated = authState.user !== null;

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    isAuthenticated,
    signIn,
    signOut,
    // Compatibility with useSession
    data: authState.user ? { user: authState.user } : null,
    status: authState.loading ? 'loading' : (authState.user ? 'authenticated' : 'unauthenticated')
  };
}

// Helper hook for easier migration from useSession
export function useSession() {
  return useAuth();
}
