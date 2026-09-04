import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface CardProps extends HTMLMotionProps<'div'> {
  hoverEffect?: boolean
  glassmorphism?: boolean
  children: React.ReactNode
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ hoverEffect = false, glassmorphism = false, className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverEffect ? { y: -2, transition: { duration: 0.2 } } : undefined}
        className={cn(
          'rounded-2xl border transition-all duration-200',
          glassmorphism
            ? 'bg-white/80 dark:bg-[#111827]/90 backdrop-blur-md border-white/20 dark:border-[#334155] shadow-md'
            : 'bg-white dark:bg-[#111827] border-slate-200/80 dark:border-[#334155] shadow-sm',
          hoverEffect && 'hover:shadow-md hover:border-slate-300 dark:hover:border-[#334155]',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

export const CardHeader = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn('p-6 pb-4 border-b border-slate-100 dark:border-[#334155]', className)}>
    {children}
  </div>
)

export const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <h3 className={cn('text-lg font-semibold text-slate-900 dark:text-[#F8FAFC] tracking-tight', className)}>
    {children}
  </h3>
)

export const CardDescription = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <p className={cn('text-sm text-slate-500 dark:text-[#CBD5E1] mt-1', className)}>{children}</p>
)

export const CardContent = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn('p-6', className)}>{children}</div>
)

export const CardFooter = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn('p-6 pt-4 border-t border-slate-100 dark:border-[#334155] flex items-center justify-between', className)}>
    {children}
  </div>
)
