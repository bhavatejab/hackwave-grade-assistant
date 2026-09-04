import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, BarChart2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface ChartPlaceholderProps {
  title?: string
  subtitle?: string
  type?: 'bar' | 'line' | 'donut'
  className?: string
}

export const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({
  title = 'Grade Distribution Analytics',
  subtitle = 'Institutional confidence curve across anonymized evaluation batches',
  type = 'bar',
  className,
}) => {
  const barData = [
    { label: '90-100%', height: 85, color: 'bg-blue-600 dark:bg-blue-500' },
    { label: '80-89%', height: 65, color: 'bg-blue-500 dark:bg-blue-400' },
    { label: '70-79%', height: 45, color: 'bg-amber-500 dark:bg-amber-400' },
    { label: '60-69%', height: 25, color: 'bg-emerald-500 dark:bg-emerald-400' },
    { label: '< 60%', height: 15, color: 'bg-red-500 dark:bg-red-400' },
  ]

  return (
    <div
      className={cn(
        'p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between',
        className
      )}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-200 dark:border-blue-800/60">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+8.4% Confidence</span>
        </div>
      </div>

      {type === 'bar' && (
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4 h-48 pt-6 px-4 border-b border-slate-100 dark:border-slate-800">
            {barData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-md pointer-events-none whitespace-nowrap z-10">
                  {item.height}% Students
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg h-full flex items-end overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${item.height}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={cn('w-full rounded-t-lg transition-all', item.color)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between px-2 text-xs font-medium text-slate-400 dark:text-slate-500">
            {barData.map((item, index) => (
              <span key={index}>{item.label}</span>
            ))}
          </div>
        </div>
      )}

      {type === 'line' && (
        <div className="h-48 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 p-4">
          <div className="text-center">
            <BarChart2 className="w-8 h-8 text-blue-500 mx-auto mb-2 opacity-60" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Evaluations Over Time
            </p>
            <p className="text-[11px] text-slate-400">
              Real-time API metric streaming active
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
