import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  fullScreen?: boolean
  className?: string
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'md',
  label,
  fullScreen = false,
  className,
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  }

  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3 p-4', className)}>
      <div className="relative">
        <Loader2 className={cn('animate-spin text-blue-600 dark:text-blue-400', sizes[size])} />
      </div>
      {label && (
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wide uppercase">
          {label}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return content
}
