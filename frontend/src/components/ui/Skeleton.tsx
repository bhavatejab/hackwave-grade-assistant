import React from 'react'
import { cn } from '../../utils/cn'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-shimmer bg-slate-200 dark:bg-slate-800 rounded-xl', className)}
      {...props}
    />
  )
}

export const SkeletonCard = () => (
  <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
    <Skeleton className="h-8 w-24" />
    <Skeleton className="h-3 w-40" />
  </div>
)

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
    <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-16" />
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex justify-between items-center py-2.5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    ))}
  </div>
)
