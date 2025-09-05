

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Card } from './card';

// Bouton avec animation de clic
interface AnimatedButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
  animationType?: 'scale' | 'pulse' | 'bounce';
}

export function AnimatedButton({ 
  children, 
  className, 
  animationType = 'scale',
  onClick,
  ...props 
}: AnimatedButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsClicked(true);
    
    // Animation feedback
    setTimeout(() => setIsClicked(false), 150);
    
    if (onClick) {
      await onClick(e);
    }
  };

  const animationClasses = {
    scale: isClicked ? 'scale-95' : 'scale-100',
    pulse: isClicked ? 'animate-pulse' : '',
    bounce: isClicked ? 'animate-bounce' : ''
  };

  return (
    <Button
      className={cn(
        'transition-transform duration-150',
        animationClasses[animationType],
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
}

// Carte avec hover effects
interface HoverCardProps extends React.ComponentProps<typeof Card> {
  children: React.ReactNode;
  hoverEffect?: 'lift' | 'glow' | 'border';
}

export function HoverCard({ 
  children, 
  className, 
  hoverEffect = 'lift',
  ...props 
}: HoverCardProps) {
  const hoverClasses = {
    lift: 'hover:shadow-lg hover:-translate-y-1',
    glow: 'hover:shadow-xl hover:shadow-blue-200/50',
    border: 'hover:border-blue-300'
  };

  return (
    <Card
      className={cn(
        'transition-all duration-200 cursor-pointer',
        hoverClasses[hoverEffect],
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}

// Badge avec animation de pulse
interface PulseBadgeProps {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow';
  pulse?: boolean;
  className?: string;
}

export function PulseBadge({ 
  children, 
  color = 'blue', 
  pulse = false,
  className 
}: PulseBadgeProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800', 
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      colorClasses[color],
      pulse && 'animate-pulse',
      className
    )}>
      {pulse && (
        <span className={cn(
          'w-2 h-2 rounded-full mr-1.5',
          color === 'blue' && 'bg-blue-600',
          color === 'green' && 'bg-green-600',
          color === 'red' && 'bg-red-600',
          color === 'yellow' && 'bg-yellow-600'
        )} />
      )}
      {children}
    </span>
  );
}

// Progress bar animée
interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showValue?: boolean;
  animated?: boolean;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  className, 
  showValue = false,
  animated = true 
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-1">
        {showValue && (
          <span className="text-sm font-medium text-gray-700">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={cn(
            'h-2 rounded-full bg-blue-600',
            animated && 'transition-all duration-500 ease-out'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Fade in animation wrapper
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, duration = 300, className }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        'transition-all ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

