
// Utilities pour assurer la compatibilité de déploiement
'use client';

import React, { useState, useEffect } from 'react';

// Fonction pour vérifier si on est côté client
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

// Fonction pour vérifier si on est en mode démo
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_APP_MODE === 'demo' || process.env.NODE_ENV === 'production';
}

// Fonction pour gérer les imports dynamiques sécurisés
export async function safeImport<T>(
  importFn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await importFn();
  } catch (error) {
    console.warn('Import failed, using fallback:', error);
    return fallback;
  }
}

// Fonction pour gérer les opérations de base de données sécurisées
export async function safeDatabaseOperation<T>(
  operation: () => Promise<T>,
  fallback: T,
  errorMessage = 'Opération de base de données échouée'
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.warn(errorMessage, error);
    return fallback;
  }
}

// Gestionnaire d'erreurs pour les composants
export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  fallbackComponent?: React.ComponentType<T>
): React.ComponentType<T> {
  return function SafeComponent(props: T) {
    try {
      return React.createElement(Component, props);
    } catch (error) {
      console.error('Component error:', error);
      return fallbackComponent ? React.createElement(fallbackComponent, props) : null;
    }
  };
}

// Hook pour gérer l'état d'hydratation
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

// Composant wrapper pour éviter les erreurs d'hydratation
export function ClientOnly({ children, fallback = null }: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode; 
}): React.ReactNode {
  const isHydrated = useHydration();
  
  if (!isHydrated) {
    return fallback;
  }
  
  return children;
}

// Utilitaires pour les dates (évite les problèmes d'hydratation)
export function formatDateSafe(date: string | Date, locale = 'fr-CH'): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return 'Date invalide';
    }
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(dateObj);
  } catch (error) {
    return 'Date invalide';
  }
}

export function formatDateTimeSafe(date: string | Date, locale = 'fr-CH'): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return 'Date invalide';
    }
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  } catch (error) {
    return 'Date invalide';
  }
}

// Fonction pour formater les montants
export function formatCurrencySafe(amount: number, currency = 'CHF'): string {
  try {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (error) {
    return `${amount.toLocaleString()} ${currency}`;
  }
}

// Export all utilities
export default {
  isClient,
  isDemoMode,
  safeImport,
  safeDatabaseOperation,
  withErrorBoundary,
  useHydration,
  ClientOnly,
  formatDateSafe,
  formatDateTimeSafe,
  formatCurrencySafe
};
