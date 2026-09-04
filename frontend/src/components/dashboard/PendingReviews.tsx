import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Lock, ArrowRight } from 'lucide-react'
import { ReviewQueueItem } from '../../types'
import { Badge } from '../ui/Badge'

export interface PendingReviewsProps {
  reviews: ReviewQueueItem[]
  onReviewClick?: (id: string) => void
}

export const PendingReviews: React.FC<PendingReviewsProps> = ({ reviews, onReviewClick }) => {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Pending Manual Reviews
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Submissions flagged for instructor verification
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          {reviews.length} Queue Items
        </span>
      </div>

      <div className="space-y-3 mt-4">
        {reviews.map((rev) => (
          <motion.div
            key={rev.id}
            whileHover={{ x: 3 }}
            onClick={() => onReviewClick && onReviewClick(rev.id)}
            className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                  {rev.courseCode}: {rev.assignmentTitle}
                </span>
                <Badge
                  variant={rev.priority === 'high' ? 'danger' : rev.priority === 'medium' ? 'warning' : 'neutral'}
                  size="sm"
                >
                  {rev.priority.toUpperCase()} PRIORITY
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate max-w-[200px]">{rev.anonymousStudentId}</span>
              </div>

              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                Reason: {rev.flagReason}
              </p>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-center">
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Suggested: {rev.suggestedScore}%
                </div>
                <div className="text-[10px] text-slate-400">
                  Confidence: {rev.confidenceScore}%
                </div>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-600">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
