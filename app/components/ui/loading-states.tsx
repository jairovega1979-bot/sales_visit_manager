

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from './button';

// Spinner de chargement simple mais élégant
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 className={cn(
      'animate-spin text-blue-600',
      sizeClasses[size],
      className
    )} />
  );
}

// Overlay de chargement
interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ isVisible, message = 'Chargement...', className }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className={cn(
      'absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50',
      'transition-opacity duration-200',
      className
    )}>
      <div className="flex flex-col items-center space-y-3 text-center">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}

// Bouton de rafraîchissement
interface RefreshButtonProps {
  onRefresh: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function RefreshButton({ onRefresh, isLoading = false, disabled = false, className }: RefreshButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onRefresh}
      disabled={isLoading || disabled}
      className={cn('transition-all duration-200', className)}
    >
      <RefreshCw className={cn(
        'h-4 w-4 mr-2',
        isLoading && 'animate-spin'
      )} />
      {isLoading ? 'Actualisation...' : 'Actualiser'}
    </Button>
  );
}

// États de contenu vide
interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 px-6 text-center',
      className
    )}>
      {Icon && (
        <div className="mb-4">
          <Icon className="h-12 w-12 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-6 max-w-sm">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Indicateur d'état
interface StatusIndicatorProps {
  status: 'success' | 'error' | 'warning' | 'info';
  message: string;
  className?: string;
}

export function StatusIndicator({ status, message, className }: StatusIndicatorProps) {
  const configs = {
    success: {
      icon: CheckCircle2,
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      iconColor: 'text-green-500'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      textColor: 'text-red-800', 
      iconColor: 'text-red-500'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-500'
    },
    info: {
      icon: AlertCircle,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500'
    }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={cn(
      'flex items-center space-x-3 p-4 rounded-lg border',
      config.bgColor,
      config.textColor,
      className
    )}>
      <Icon className={cn('h-5 w-5 flex-shrink-0', config.iconColor)} />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

// Skeleton pour le chargement
interface SkeletonProps {
  className?: string;
  rows?: number;
}

export function Skeleton({ className, rows = 1 }: SkeletonProps) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={cn(
          'h-4 bg-gray-200 rounded',
          className
        )} />
      ))}
    </div>
  );
}

