import React from 'react'
import { motion } from 'framer-motion'
import {
  Layers,
  CheckSquare,
  FileCheck,
  Zap,
  Award,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '../../utils/cn'

export interface StatCardProps {
  title: string
  value: string | number
  change: string
  isPositive?: boolean
  description: string
  iconName: 'total' | 'reviews' | 'reports' | 'confidence' | 'score' | 'auto'
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  description,
  iconName,
  className,
}) => {
  const getIcon = () => {
    switch (iconName) {
      case 'total':
        return <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      case 'reviews':
        return <CheckSquare className="w-5 h-5 text-amber-600 dark:text-amber-400" />
      case 'reports':
        return <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      case 'confidence':
        return <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-sky-400" />
      case 'score':
        return <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      case 'auto':
        return <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      default:
        return <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
    }
  }

  const getBg = () => {
    switch (iconName) {
      case 'total':
        return 'bg-blue-50 dark:bg-blue-950/50 border-blue-100 dark:border-blue-900/50'
      case 'reviews':
        return 'bg-amber-50 dark:bg-amber-950/50 border-amber-100 dark:border-amber-900/50'
      case 'reports':
        return 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-100 dark:border-emerald-900/50'
      case 'confidence':
        return 'bg-sky-50 dark:bg-sky-950/50 border-sky-100 dark:border-sky-900/50'
      case 'score':
        return 'bg-purple-50 dark:bg-purple-950/50 border-purple-100 dark:border-purple-900/50'
      case 'auto':
        return 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-100 dark:border-indigo-900/50'
      default:
        return 'bg-blue-50 dark:bg-blue-950/50 border-blue-100 dark:border-blue-900/50'
    }
  }

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={cn(
        'p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={cn('p-2.5 rounded-xl border shrink-0', getBg())}>{getIcon()}</div>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {value}
          </h3>
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border',
              isPositive
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{change}</span>
          </div>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-normal">
          {description}
        </p>
      </div>
    </motion.div>
  )
}
