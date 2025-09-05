
'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LoadingWrapperProps {
  isLoading: boolean;
  children: ReactNode;
  skeleton: ReactNode;
  className?: string;
  delay?: number;
}

export function LoadingWrapper({ 
  isLoading, 
  children, 
  skeleton, 
  className,
  delay = 0 
}: LoadingWrapperProps) {
  if (isLoading) {
    return (
      <div 
        className={cn(
          'transition-opacity duration-300 ease-in-out',
          className
        )}
        style={{ 
          animationDelay: `${delay}ms`,
          opacity: isLoading ? 1 : 0 
        }}
      >
        {skeleton}
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'animate-in fade-in-50 duration-500 ease-in-out',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Staggered loading for multiple items
export function StaggeredLoadingWrapper({ 
  isLoading, 
  children, 
  skeleton, 
  items = 1,
  staggerDelay = 100,
  className 
}: LoadingWrapperProps & { 
  items?: number; 
  staggerDelay?: number;
}) {
  if (isLoading) {
    return (
      <div className={className}>
        {Array.from({ length: items }).map((_, index) => (
          <div 
            key={index}
            className="transition-opacity duration-300 ease-in-out"
            style={{ 
              animationDelay: `${index * staggerDelay}ms`,
            }}
          >
            {skeleton}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  );
}

// Smooth transition component
export function SmoothTransition({ 
  show, 
  children, 
  className,
  duration = 300 
}: {
  show: boolean;
  children: ReactNode;
  className?: string;
  duration?: number;
}) {
  return (
    <div
      className={cn(
        'transition-all ease-in-out',
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        className
      )}
      style={{ 
        transitionDuration: `${duration}ms`,
        visibility: show ? 'visible' : 'hidden'
      }}
    >
      {children}
    </div>
  );
}
