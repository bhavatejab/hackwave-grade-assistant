import React from 'react'
import { ActivityItem } from '../../types'
import { Activity, CheckCircle2, AlertTriangle, FileText, Shield } from 'lucide-react'

export interface RecentActivityFeedProps {
  activities: ActivityItem[]
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ activities }) => {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'evaluation_completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      case 'manual_review_needed':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />
      case 'report_generated':
        return <FileText className="w-4 h-4 text-blue-500" />
      case 'system_alert':
        return <Shield className="w-4 h-4 text-purple-500" />
      default:
        return <Activity className="w-4 h-4 text-slate-500" />
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-slate-500" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Audit Activity Timeline
          </h3>
        </div>
        <span className="text-xs text-slate-400">Live API stream</span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {activities.map((act) => (
          <div key={act.id} className="relative group">
            <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs">
              {getIcon(act.type)}
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {act.title}
                </span>
                <span className="text-[10px] text-slate-400">{act.timestamp}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                {act.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
