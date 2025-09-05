
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

// Default Error Fallback Component
function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <Card className="max-w-lg mx-auto mt-8 border-red-200 bg-red-50/50">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <CardTitle className="text-red-800">Oops! Une erreur s'est produite</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Une erreur inattendue s'est produite. Veuillez essayer de recharger la page ou retourner à l'accueil.
          </AlertDescription>
        </Alert>
        
        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-sm bg-gray-100 p-3 rounded-md">
            <summary className="cursor-pointer font-medium text-gray-700 mb-2">
              Détails de l'erreur (mode développement)
            </summary>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {resetError && (
            <Button 
              onClick={resetError}
              className="flex-1 bg-brand-blue hover:bg-brand-navy text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          )}
          <Link href="/dashboard" className="flex-1">
            <Button variant="outline" className="w-full border-brand-blue text-brand-blue hover:bg-brand-sky">
              <Home className="h-4 w-4 mr-2" />
              Retour au Dashboard
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact Error Fallback for smaller components
export function CompactErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800">Erreur de chargement</p>
          <p className="text-xs text-red-600 mt-1">
            Impossible de charger cette section
          </p>
        </div>
        {resetError && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={resetError}
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Error Boundary Class Component
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      
      return (
        <FallbackComponent 
          error={this.state.error} 
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

// Hook-based Error Boundary (for functional components)
export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: React.ComponentType<ErrorFallbackProps>
) {
  const WrappedComponent = (props: T) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Specialized Error Boundaries for different contexts
export function DashboardErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={DefaultErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Dashboard Error:', error);
        // Could send to error tracking service
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function WidgetErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={CompactErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}

// Export default
export default ErrorBoundary;
