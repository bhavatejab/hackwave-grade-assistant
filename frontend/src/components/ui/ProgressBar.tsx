import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface ProgressBarProps {
  value: number // 0 to 100
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  showLabel?: boolean
  labelPosition?: 'right' | 'top'
  height?: 'sm' | 'md' | 'lg'
  className?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  variant = 'primary',
  showLabel = false,
  labelPosition = 'right',
  height = 'md',
  className,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value))

  const variants = {
    primary: 'bg-blue-600 dark:bg-blue-500',
    success: 'bg-emerald-600 dark:bg-emerald-500',
    warning: 'bg-amber-500 dark:bg-amber-400',
    danger: 'bg-red-600 dark:bg-red-500',
  }

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  return (
    <div className={cn('w-full', className)}>
      {showLabel && labelPosition === 'top' && (
        <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
          <span>Confidence Level</span>
          <span>{clampedValue}%</span>
        </div>
      )}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex-1',
            heights[height]
          )}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${clampedValue}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={cn('h-full rounded-full', variants[variant])}
          />
        </div>
        {showLabel && labelPosition === 'right' && (
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 min-w-[36px]">
            {clampedValue}%
          </span>
        )}
      </div>
    </div>
  )
}
