
'use client';

import { AppError } from '@/lib/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
  showHomeButton?: boolean;
  className?: string;
}

export function ErrorDisplay({ 
  error, 
  onRetry, 
  showHomeButton = false,
  className = "" 
}: ErrorDisplayProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="font-medium">
          {error.message}
        </AlertDescription>
      </Alert>

      {(error.code || error.details) && (
        <details className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
          <summary className="cursor-pointer font-medium">
            Détails techniques
          </summary>
          <div className="mt-2 space-y-1">
            {error.code && (
              <p><strong>Code:</strong> {error.code}</p>
            )}
            {error.details && (
              <p><strong>Détails:</strong> {JSON.stringify(error.details, null, 2)}</p>
            )}
          </div>
        </details>
      )}

      <div className="flex flex-wrap gap-3">
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        )}
        
        {showHomeButton && (
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

// Loading spinner component
interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({ 
  message = "Chargement...", 
  className = "" 
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
}

// Empty state component
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  title, 
  description, 
  icon: Icon, 
  action,
  className = "" 
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
}
