
'use client';

import { useEffect, useState } from 'react';
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import { DashboardLoadingSkeleton } from '@/components/dashboard/dashboard-loading-skeleton';
import { getDashboardStats } from '@/lib/dashboard-data';
import { DashboardStats } from '@/lib/types';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get current user from auth session
  const { user: currentUser, loading: authLoading } = useAuth();

  useEffect(() => {
    const loadDashboardData = async () => {
      // Don't load if auth is still loading or no user
      if (authLoading || !currentUser) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Simulate realistic loading delay for smooth UX
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        const dashboardStats = await getDashboardStats(currentUser.id, currentUser.role);
        setStats(dashboardStats);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError('Erreur lors du chargement des données du tableau de bord');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [currentUser?.id, currentUser?.role, authLoading]);

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto animate-in fade-in duration-500">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-800 font-medium">Erreur de chargement</p>
          <p className="text-red-600 text-sm mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Show loading while auth is loading
  if (authLoading) {
    return <DashboardLoadingSkeleton />;
  }

  // Redirect if no user (should be handled by AuthProvider, but just in case)
  if (!currentUser) {
    return null;
  }

  return (
    <LoadingWrapper
      isLoading={loading}
      skeleton={<DashboardLoadingSkeleton />}
    >
      {stats && currentUser && (
        <DashboardContent 
          stats={stats} 
          user={currentUser}
        />
      )}
    </LoadingWrapper>
  );
}
