import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none'

    const variants = {
      primary:
        'bg-[#22C55E] hover:bg-[#16A34A] active:bg-[#15803D] text-white shadow-sm focus:ring-green-500 border border-[#22C55E]',
      secondary:
        'bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-slate-800 dark:text-[#F8FAFC] border border-slate-200 dark:border-[#334155] focus:ring-slate-400',
      outline:
        'bg-transparent hover:bg-slate-100 dark:hover:bg-[#1E293B] text-slate-700 dark:text-[#CBD5E1] border border-slate-300 dark:border-[#334155] focus:ring-slate-400',
      ghost:
        'bg-transparent hover:bg-slate-100 dark:hover:bg-[#1E293B] text-slate-600 dark:text-[#CBD5E1] focus:ring-slate-400',
      danger:
        'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm focus:ring-red-500 border border-red-600',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-5 py-3 text-base gap-2.5',
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
