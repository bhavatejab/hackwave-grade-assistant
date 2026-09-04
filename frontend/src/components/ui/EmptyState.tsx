import React from 'react'
import { motion } from 'framer-motion'
import { FileQuestion, AlertCircle, BarChart3, Layers, Plus } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Button } from './Button'

export type EmptyStateType = 'evaluations' | 'reports' | 'reviews' | 'analytics' | 'generic'

export interface EmptyStateProps {
  type?: EmptyStateType
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'generic',
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}) => {
  const configs = {
    evaluations: {
      icon: Layers,
      defaultTitle: 'No Evaluations Found',
      defaultDesc: 'There are no active or historical evaluations in this queue. Start a new evaluation batch to begin grading.',
      actionText: 'New Evaluation Batch',
    },
    reports: {
      icon: FileQuestion,
      defaultTitle: 'No Exported Reports',
      defaultDesc: 'Finalized grade reports, course statistics, and institutional summaries will appear here once generated.',
      actionText: 'Generate Grade Report',
    },
    reviews: {
      icon: AlertCircle,
      defaultTitle: 'No Manual Reviews Pending',
      defaultDesc: 'All student submissions passed confidence thresholds. High priority manual review queue is currently clear.',
      actionText: 'Refresh Review Queue',
    },
    analytics: {
      icon: BarChart3,
      defaultTitle: 'No Analytics Data Available',
      defaultDesc: 'Analytics and grade distributions require at least one finalized evaluation batch to compute statistical metrics.',
      actionText: 'View Evaluation History',
    },
    generic: {
      icon: Layers,
      defaultTitle: 'No Data Available',
      defaultDesc: 'No items match the selected filter or query criteria.',
      actionText: 'Clear Filters',
    },
  }

  const currentConfig = configs[type] || configs.generic
  const IconComponent = currentConfig.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm max-w-xl mx-auto my-8',
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mb-5 border border-slate-200/60 dark:border-slate-700/60 shadow-inner">
        <IconComponent className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
        {title || currentConfig.defaultTitle}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md leading-relaxed">
        {description || currentConfig.defaultDesc}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        {(actionLabel || currentConfig.actionText) && onAction && (
          <Button
            variant="primary"
            size="md"
            onClick={onAction}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {actionLabel || currentConfig.actionText}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="outline" size="md" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  )
}
