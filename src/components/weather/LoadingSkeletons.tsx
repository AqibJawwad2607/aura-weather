import React from 'react';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-muted/50 rounded-lg ${className}`} />
);

export const HeroSkeleton: React.FC = () => (
  <div className="glass-card p-6 md:p-8 relative overflow-hidden">
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
      <div className="space-y-4">
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-24 w-40" />
        <Skeleton className="h-5 w-36" />
      </div>
      <div className="flex flex-col items-start md:items-end gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-16 h-16 rounded-2xl" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex gap-6 mt-4">
          <Skeleton className="w-24 h-12" />
          <Skeleton className="w-24 h-12" />
        </div>
      </div>
    </div>
  </div>
);

export const HourlySkeleton: React.FC = () => (
  <div>
    <Skeleton className="h-6 w-40 mb-4" />
    <div className="glass-card p-4">
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-20 p-3 rounded-xl bg-background/50">
            <Skeleton className="h-3 w-8 mx-auto mb-2" />
            <Skeleton className="w-6 h-6 mx-auto mb-2 rounded-full" />
            <Skeleton className="h-4 w-8 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const WeeklySkeleton: React.FC = () => (
  <div>
    <Skeleton className="h-6 w-36 mb-4" />
    <div className="glass-card divide-y divide-border">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-24">
              <Skeleton className="h-5 w-16 mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="w-6 h-6 rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="w-24 h-2 rounded-full" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const MetricsSkeleton: React.FC = () => (
  <div>
    <Skeleton className="h-6 w-36 mb-4" />
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass-card p-4 md:p-6">
          <Skeleton className="w-10 h-10 rounded-xl mb-3" />
          <Skeleton className="h-4 w-16 mb-1" />
          <Skeleton className="h-7 w-20 mb-2" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  </div>
);

export const AlertsSkeleton: React.FC = () => (
  <div>
    <Skeleton className="h-6 w-36 mb-4" />
    <div className="space-y-3">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="glass-card p-4">
          <div className="flex items-start gap-3">
            <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
