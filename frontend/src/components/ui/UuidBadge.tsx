import React from 'react'
import { Lock } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface UuidBadgeProps {
  uuid: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const UuidBadge: React.FC<UuidBadgeProps> = ({
  uuid,
  size = 'md',
  className,
}) => {
  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-mono',
    lg: 'px-3 py-1.5 text-sm gap-2 font-mono font-bold',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 select-all',
        sizes[size],
        className
      )}
    >
      <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
      <span>{uuid}</span>
    </span>
  )
}
