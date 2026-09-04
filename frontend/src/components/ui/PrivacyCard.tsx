import React from 'react'
import { Lock, ShieldCheck } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface PrivacyCardProps {
  className?: string
  text?: string
}

export const PrivacyCard: React.FC<PrivacyCardProps> = ({
  className,
  text = "Student data is handled using a privacy-first approach aligned with the principles of India's Digital Personal Data Protection (DPDP) Act, 2023. Student identities are anonymized using UUIDs before AI evaluation to protect personal information.",
}) => {
  return (
    <div
      className={cn(
        'p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white dark:from-slate-900 dark:to-slate-950 border border-slate-800 shadow-md flex items-center gap-4',
        className
      )}
    >
      <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
        <Lock className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            UUID Anonymization System
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            DPDP 2023 Aligned
          </span>
        </div>
        <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  )
}
