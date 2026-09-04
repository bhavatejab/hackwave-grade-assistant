import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Archive,
  RotateCcw,
  Trash2,
  Search,
  ChevronLeft,
  RefreshCw,
} from 'lucide-react'
import { reportService } from '../api/reportService'
import { ReportSummary } from '../api/mockReports'
import { PermanentStorageBanner } from '../components/reports/PermanentStorageBanner'
import { DeleteConfirmModal } from '../components/reports/DeleteConfirmModal'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table'
import { useNotifications } from '../contexts/NotificationContext'

export const ArchivedReportsPage: React.FC = () => {
  const navigate = useNavigate()
  const { addNotification } = useNotifications()

  const [reports, setReports] = useState<ReportSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteModalReport, setDeleteModalReport] = useState<ReportSummary | null>(null)
  const [restoreModalReport, setRestoreModalReport] = useState<ReportSummary | null>(null)

  const fetchArchived = useCallback(async () => {
    setLoading(true)
    const res = await reportService.getReports({
      search,
      isArchived: true,
      page: 1,
      limit: 10,
    })
    setReports(res.reports)
    setLoading(false)
  }, [search])

  useEffect(() => {
    fetchArchived()
  }, [fetchArchived])

  const handleRestore = async (id: string) => {
    await reportService.restoreReport(id)
    addNotification({
      type: 'success',
      title: 'Report Restored',
      message: 'The evaluation report has been restored to Evaluation History.',
    })
    fetchArchived()
  }

  const handleDeletePermanently = async (id: string) => {
    await reportService.deleteReport(id)
    addNotification({
      type: 'warning',
      title: 'Report Deleted',
      message: 'The evaluation report was permanently deleted.',
    })
    fetchArchived()
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/history')}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-1"
          >
            <ChevronLeft className="w-4 h-4" /> Back to History
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <span>Archived Reports Vault</span>
            <Archive className="w-6 h-6 text-amber-500" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Archived evaluations are stored securely and can be restored back to active history anytime.
          </p>
        </div>
      </div>

      {/* Permanent Storage UX Banner */}
      <PermanentStorageBanner />

      {/* Search Bar */}
      <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search archived reports..."
            className="w-full pl-10 pr-4 py-1.5 text-xs sm:text-sm rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700"
          />
        </div>
        <Button variant="outline" size="sm" onClick={fetchArchived} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh Vault
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Archived Assessment Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Archived Date</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Avg Score</TableHead>
            <TableHead>Vault Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-slate-400 font-mono text-xs">
                Loading Vault...
              </TableCell>
            </TableRow>
          ) : reports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                No archived evaluation reports found.
              </TableCell>
            </TableRow>
          ) : (
            reports.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm">
                      {r.assessmentName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {r.courseCode} • {r.teacherName}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                    {r.subject}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                    {r.evaluationDate}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {r.studentCount} Papers
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 font-mono">
                    {r.averageScore}%
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="warning">Archived</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRestoreModalReport(r)}
                      leftIcon={<RotateCcw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                    >
                      Restore
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteModalReport(r)}
                      leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                    >
                      Delete Permanently
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Restore Modal */}
      {restoreModalReport && (
        <DeleteConfirmModal
          isOpen={Boolean(restoreModalReport)}
          onClose={() => setRestoreModalReport(null)}
          onConfirm={() => handleRestore(restoreModalReport.id)}
          title="Restore Evaluation Report"
          description={`Are you sure you want to restore "${restoreModalReport.assessmentName}" back to active Evaluation History?`}
          confirmText="Restore Report"
          isPermanent={false}
        />
      )}

      {/* Delete Permanently Modal */}
      {deleteModalReport && (
        <DeleteConfirmModal
          isOpen={Boolean(deleteModalReport)}
          onClose={() => setDeleteModalReport(null)}
          onConfirm={() => handleDeletePermanently(deleteModalReport.id)}
          title="Delete Permanently"
          description={`Are you sure you want to PERMANENTLY delete "${deleteModalReport.assessmentName}"? This action CANNOT be undone.`}
          confirmText="Delete Permanently"
          isPermanent={true}
        />
      )}
    </div>
  )
}
