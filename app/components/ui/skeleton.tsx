
'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]',
        'animate-[shimmer_2s_ease-in-out_infinite]',
        className
      )}
      {...props}
    />
  );
}

// Skeleton variants for different content types
function SkeletonCard({ children, className, ...props }: SkeletonProps & { children?: React.ReactNode }) {
  return (
    <div
      className={cn(
        'bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg rounded-lg p-6 space-y-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SkeletonKPI() {
  return (
    <SkeletonCard>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-6 w-12 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    </SkeletonCard>
  );
}

function SkeletonTopCustomer() {
  return (
    <div className="flex items-center justify-between p-4 bg-brand-sky/20 rounded-xl border border-brand-sky/30">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="text-right space-y-1">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

function SkeletonOffer() {
  return (
    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-5 w-5 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

function SkeletonVisit() {
  return (
    <div className="p-4 bg-white/90 backdrop-blur-sm border border-brand-sky/40 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-5 w-32 mb-2" />
      <Skeleton className="h-4 w-full mb-3" />
      <div className="flex items-center space-x-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      ))}
    </div>
  );
}

function SkeletonAvatar() {
  return <Skeleton className="h-8 w-8 rounded-full" />;
}

export {
  Skeleton,
  SkeletonCard,
  SkeletonKPI,
  SkeletonTopCustomer,
  SkeletonOffer,
  SkeletonVisit,
  SkeletonTable,
  SkeletonAvatar
};
