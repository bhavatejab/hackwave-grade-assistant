import React, { useState } from 'react'
import { History, FileText, CheckCircle2, Clock, AlertTriangle, RefreshCw } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { UuidBadge } from '../ui/UuidBadge'

export interface UploadHistoryItem {
  id: string
  fileName: string
  uploadedAt: string
  fileSize: string
  status: 'Completed' | 'Processing' | 'Failed'
  uuid: string
}

export const UploadHistoryList: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<UploadHistoryItem[]>([
    {
      id: 'hist-1',
      fileName: 'CS106B_Final_Exam_Scan_Batch_1.pdf',
      uploadedAt: '15 mins ago',
      fileSize: '24.8 MB',
      status: 'Completed',
      uuid: 'STU-A91F23',
    },
    {
      id: 'hist-2',
      fileName: 'CS182_Ethics_Paper_Submissions.pdf',
      uploadedAt: '1 hour ago',
      fileSize: '18.2 MB',
      status: 'Processing',
      uuid: 'STU-B88D41',
    },
    {
      id: 'hist-3',
      fileName: 'MATH51_Multivariable_Midterm.pdf',
      uploadedAt: '3 hours ago',
      fileSize: '31.5 MB',
      status: 'Failed',
      uuid: 'STU-C44E90',
    },
  ])

  const handleRetry = (id: string) => {
    setHistoryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Completed' } : item))
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-slate-500" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Recent Upload History
          </h3>
        </div>
        <span className="text-xs text-slate-400">Audit Log</span>
      </div>

      <div className="space-y-3">
        {historyItems.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3 truncate">
              <FileText className="w-5 h-5 text-blue-500 shrink-0" />
              <div className="truncate min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {item.fileName}
                  </span>
                  <UuidBadge uuid={item.uuid} size="sm" />
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span>{item.fileSize}</span>
                  <span>•</span>
                  <span>{item.uploadedAt}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              {item.status === 'Completed' && (
                <Badge variant="success" showDot>
                  <CheckCircle2 className="w-3 h-3" /> Completed
                </Badge>
              )}
              {item.status === 'Processing' && (
                <Badge variant="warning" showDot>
                  <Clock className="w-3 h-3" /> Processing
                </Badge>
              )}
              {item.status === 'Failed' && (
                <div className="flex items-center gap-2">
                  <Badge variant="danger" showDot>
                    <AlertTriangle className="w-3 h-3" /> Failed
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRetry(item.id)}
                    leftIcon={<RefreshCw className="w-3 h-3" />}
                  >
                    Retry
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
