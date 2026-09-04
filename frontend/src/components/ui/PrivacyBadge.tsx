import React from 'react'
import { Lock, ShieldCheck } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface PrivacyBadgeProps {
  className?: string
  variant?: 'banner' | 'pill'
}

export const PrivacyBadge: React.FC<PrivacyBadgeProps> = ({
  className,
  variant = 'banner',
}) => {
  if (variant === 'pill') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
          className
        )}
      >
        <Lock className="w-3 h-3 text-emerald-500" />
        <span>AI evaluates anonymous student submissions using UUID.</span>
      </span>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-900 dark:text-slate-100 border border-slate-800 shadow-sm',
        className
      )}
    >
      <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
        <Lock className="w-4 h-4" />
      </div>
      <div className="flex-1 text-xs sm:text-sm font-medium tracking-tight">
        <span>Student data is handled using a privacy-first approach aligned with the principles of India's Digital Personal Data Protection (DPDP) Act, 2023. Student identities are anonymized using UUIDs before AI evaluation to protect personal information.</span>
      </div>
      <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>DPDP 2023 Aligned</span>
      </div>
    </div>
  )
}
