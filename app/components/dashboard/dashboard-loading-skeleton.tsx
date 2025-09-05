
'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Skeleton, 
  SkeletonKPI, 
  SkeletonTopCustomer, 
  SkeletonOffer, 
  SkeletonVisit 
} from '@/components/ui/skeleton';

export function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-700">
      {/* Header Skeleton */}
      <div className="bg-brand-gradient text-white rounded-xl p-8 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 bg-white/20" />
            <Skeleton className="h-5 w-48 bg-white/15" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-20 bg-white/20" />
                <Skeleton className="h-10 w-32 bg-white/25" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Calls Module Skeleton */}
      <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-xl">
        <CardHeader className="bg-red-50/80 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{ animationDelay: `${i * 100}ms` }}
            className="animate-in slide-in-from-bottom-4 duration-500"
          >
            <SkeletonKPI />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers Skeleton */}
        <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-xl">
          <CardHeader className="bg-brand-sky/20 rounded-t-lg">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{ animationDelay: `${i * 100}ms` }}
                  className="animate-in slide-in-from-left duration-400"
                >
                  <SkeletonTopCustomer />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Offers Needing Attention Skeleton */}
        <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-xl">
          <CardHeader className="bg-brand-light-blue/20 rounded-t-lg">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  style={{ animationDelay: `${i * 150}ms` }}
                  className="animate-in slide-in-from-right duration-400"
                >
                  <SkeletonOffer />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Visits Skeleton */}
      <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-xl">
        <CardHeader className="bg-brand-blue/20 rounded-t-lg">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-32 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{ animationDelay: `${i * 100}ms` }}
                className="animate-in slide-in-from-bottom duration-500"
              >
                <SkeletonVisit />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Skeleton */}
      <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-xl">
        <CardHeader className="bg-brand-gradient rounded-t-lg">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{ animationDelay: `${i * 100}ms` }}
                className="animate-in slide-in-from-bottom duration-400"
              >
                <Skeleton className="h-14 w-full rounded-md" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
