
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Mobile-optimized spacing utilities
export const mobileSpacing = {
  page: 'p-3 sm:p-4 md:p-6',
  card: 'p-3 sm:p-4 md:p-6',
  header: 'p-4 sm:p-6',
  content: 'p-4 sm:p-6',
  compact: 'p-2 sm:p-3 md:p-4',
  section: 'space-y-4 sm:space-y-6',
  items: 'space-y-2 sm:space-y-3 md:space-y-4',
  inline: 'space-x-2 sm:space-x-3 md:space-x-4',
};

// Mobile-optimized grid classes
export const mobileGrids = {
  stats2: 'grid-cols-2 md:grid-cols-4',
  stats3: 'grid-cols-1 sm:grid-cols-3',
  stats4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  cards2: 'grid-cols-1 lg:grid-cols-2',
  cards3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  actions: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
  visits: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
};

// Mobile-optimized text sizes
export const mobileText = {
  pageTitle: 'text-2xl sm:text-3xl md:text-4xl',
  sectionTitle: 'text-lg sm:text-xl md:text-2xl',
  cardTitle: 'text-base sm:text-lg',
  body: 'text-sm sm:text-base',
  caption: 'text-xs sm:text-sm',
  stat: 'text-xl sm:text-2xl md:text-3xl',
  statSmall: 'text-lg sm:text-xl md:text-2xl',
};

// Mobile-optimized button heights
export const mobileButtons = {
  compact: 'h-8 sm:h-9',
  default: 'h-10 sm:h-11',
  large: 'h-12 sm:h-14',
};

// Touch-friendly component wrapper
interface TouchFriendlyProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function TouchFriendly({ children, className, onClick, disabled }: TouchFriendlyProps) {
  return (
    <div
      className={cn(
        'touch-manipulation select-none',
        onClick && !disabled && 'cursor-pointer active:scale-95 transition-transform duration-150',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </div>
  );
}

// Mobile-responsive container
interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function ResponsiveContainer({ 
  children, 
  className, 
  maxWidth = '2xl' 
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn(
      'w-full mx-auto px-3 sm:px-4 md:px-6',
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  );
}

// Mobile-optimized card wrapper
interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'compact' | 'default' | 'large';
  hover?: boolean;
}

export function MobileCard({ 
  children, 
  className, 
  padding = 'default',
  hover = true 
}: MobileCardProps) {
  const paddingClasses = {
    compact: 'p-3 sm:p-4',
    default: 'p-4 sm:p-6',
    large: 'p-6 sm:p-8'
  };

  return (
    <div className={cn(
      'bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg rounded-xl',
      hover && 'hover:shadow-xl hover:scale-[1.02] transition-all duration-300',
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
}

// Mobile-responsive flex layouts
export const mobileFlex = {
  stackOnMobile: 'flex flex-col sm:flex-row',
  centerOnMobile: 'flex flex-col sm:flex-row sm:items-center sm:justify-between',
  wrapOnMobile: 'flex flex-wrap',
  responsiveGap: 'gap-2 sm:gap-3 md:gap-4',
  responsiveSpaceY: 'space-y-2 sm:space-y-0',
  responsiveSpaceX: 'space-x-0 sm:space-x-2 md:space-x-4',
};

// Responsive image sizes
export const responsiveImageSizes = {
  avatar: '(max-width: 640px) 28px, (max-width: 768px) 32px, 40px',
  logo: '(max-width: 640px) 40px, (max-width: 768px) 48px, 56px',
  icon: '(max-width: 640px) 16px, (max-width: 768px) 20px, 24px',
  card: '(max-width: 640px) 200px, (max-width: 768px) 300px, 400px',
};

export default {
  mobileSpacing,
  mobileGrids,
  mobileText,
  mobileButtons,
  mobileFlex,
  responsiveImageSizes,
  TouchFriendly,
  ResponsiveContainer,
  MobileCard,
};
