import React from 'react'
import { ExternalLink, Lock } from 'lucide-react'
import { EvaluationItem } from '../../types'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table'
import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'

export interface RecentEvaluationsProps {
  evaluations: EvaluationItem[]
  onViewAll?: () => void
}

export const RecentEvaluations: React.FC<RecentEvaluationsProps> = ({
  evaluations,
  onViewAll,
}) => {
  const getStatusBadge = (status: EvaluationItem['status']) => {
    switch (status) {
      case 'auto_graded':
        return <Badge variant="success" showDot>Auto-Graded</Badge>
      case 'pending_review':
        return <Badge variant="warning" showDot>Pending Review</Badge>
      case 'manual_review':
        return <Badge variant="danger" showDot>Manual Review</Badge>
      case 'finalized':
        return <Badge variant="primary" showDot>Finalized</Badge>
      default:
        return <Badge variant="neutral">Unknown</Badge>
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Recent Student Submissions
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Anonymized submissions mapped strictly to secure UUIDs
          </p>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>View All</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Anonymous UUID</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {evaluations.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-mono text-xs text-slate-900 dark:text-slate-100">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span className="truncate max-w-[140px] sm:max-w-none">{item.anonymousStudentId}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                  {item.courseCode}
                </div>
                <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                  {item.courseName}
                </div>
              </TableCell>
              <TableCell className="min-w-[120px]">
                <ProgressBar
                  value={item.confidenceScore}
                  showLabel
                  labelPosition="right"
                  height="sm"
                  variant={
                    item.confidenceScore > 90
                      ? 'success'
                      : item.confidenceScore > 75
                      ? 'primary'
                      : 'warning'
                  }
                />
              </TableCell>
              <TableCell className="font-bold text-slate-900 dark:text-slate-100">
                {item.score}%
              </TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell className="text-xs text-slate-400 whitespace-nowrap">
                {item.submittedAt}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
