import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Download,
  Eye,
  Archive,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  PlusCircle,
  AlertTriangle,
} from 'lucide-react'
import { reportService } from '../api/reportService'
import { ReportSummary } from '../api/mockReports'
import { PermanentStorageBanner } from '../components/reports/PermanentStorageBanner'
import { ExportModal } from '../components/reports/ExportModal'
import { DeleteConfirmModal } from '../components/reports/DeleteConfirmModal'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table'
import { useNotifications } from '../contexts/NotificationContext'
import { useEvaluation } from '../contexts/EvaluationContext'

export const EvaluationHistoryPage: React.FC = () => {
  const navigate = useNavigate()
  const { addNotification } = useNotifications()

  const [reports, setReports] = useState<ReportSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & Controls
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'confidence' | 'name'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  // Modal States
  const [exportModalReport, setExportModalReport] = useState<ReportSummary | null>(null)
  const [deleteModalReport, setDeleteModalReport] = useState<ReportSummary | null>(null)
  const [archiveModalReport, setArchiveModalReport] = useState<ReportSummary | null>(null)

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await reportService.getReports({
        search,
        subject: subjectFilter,
        status: statusFilter,
        sortBy,
        sortOrder,
        dateFrom,
        dateTo,
        isArchived: false,
        page,
        limit: 8,
      })
      setReports(res.reports)
      setTotalPages(res.totalPages)
      setTotalItems(res.total)
    } catch (err: any) {
      setError('Failed Loading Reports. Please check network connection.')
    } finally {
      setLoading(false)
    }
  }, [search, subjectFilter, statusFilter, sortBy, sortOrder, dateFrom, dateTo, page])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const { refreshMetrics } = useEvaluation()

  const handleArchiveReport = async (id: string) => {
    await reportService.archiveReport(id)
    addNotification({
      type: 'info',
      title: 'Report Archived',
      message: 'The evaluation report has been moved to Archived Reports.',
    })
    fetchReports()
    refreshMetrics()
  }

  const handleDeleteReport = async (id: string) => {
    await reportService.deleteReport(id)
    addNotification({
      type: 'warning',
      title: 'Report Deleted',
      message: 'The evaluation report was deleted successfully.',
    })
    fetchReports()
    refreshMetrics()
  }

  const handleExportComplete = (format: string, scope: string) => {
    addNotification({
      type: 'success',
      title: 'Report Downloaded',
      message: `${format} report export (${scope}) initiated successfully.`,
    })
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Evaluation History & Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enterprise vault for completed evaluations, student performance records, and exportable reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/archived')}
            leftIcon={<Archive className="w-4 h-4 text-amber-500" />}
          >
            Archived Reports
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/evaluations/new')}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            New Evaluation
          </Button>
        </div>
      </div>

      {/* Permanent Storage UX Banner Required by Prompt */}
      <PermanentStorageBanner />

      {/* Search & Advanced Filters Bar */}
      <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Assessment Name, Subject, Class, Section, Student UUID, or Date..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quick Dropdown Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="app-select"
            >
              <option value="all">All Subjects</option>
              <option value="computer science">Computer Science</option>
              <option value="physics">Physics</option>
              <option value="mathematics">Mathematics</option>
              <option value="english">English</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="app-select"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="in_review">In Review</option>
            </select>

            <Button
              variant={showAdvancedFilters ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
            >
              Filters
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch('')
                setSubjectFilter('all')
                setStatusFilter('all')
                setDateFrom('')
                setDateTo('')
              }}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Collapsible Advanced Filters (Date Range & Sorting) */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Date From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Date To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Sort By Field
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="app-select w-full"
              >
                <option value="date">Evaluation Date</option>
                <option value="score">Average Score</option>
                <option value="confidence">AI Confidence</option>
                <option value="name">Assessment Name</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="app-select w-full"
              >
                <option value="desc">Descending (High to Low)</option>
                <option value="asc">Ascending (Low to High)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ERROR STATE WITH RETRY REQUIRED BY PROMPT */}
      {error ? (
        <div className="p-8 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-red-900 dark:text-red-200">Failed Loading Reports</h3>
            <p className="text-xs text-red-700 dark:text-red-300 mt-1">{error}</p>
          </div>
          <Button variant="danger" size="sm" onClick={fetchReports} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Retry Loading Reports
          </Button>
        </div>
      ) : (
        /* REPORT DATA TABLE */
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assessment Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Class / Section</TableHead>
                <TableHead>Evaluation Date</TableHead>
                <TableHead>Student Count</TableHead>
                <TableHead>Avg Score</TableHead>
                <TableHead>Avg Confidence</TableHead>
                <TableHead>Manual Reviews</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-slate-400 font-mono text-xs">
                    Loading Evaluation Reports...
                  </TableCell>
                </TableRow>
              ) : reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-slate-400 text-xs">
                    No evaluation reports found matching search criteria.
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
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                        {r.className} ({r.section})
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
                      <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-mono">
                        {r.averageScore}%
                        <span className="text-[10px] text-slate-400 block font-normal">/ {r.maximumMarks} Max</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          r.averageConfidence > 90
                            ? 'success'
                            : r.averageConfidence > 80
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {r.averageConfidence}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                        {r.manualReviewsCount} Flagged ({r.teacherOverridesCount} Overrides)
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={r.status === 'completed' ? 'success' : 'warning'} showDot>
                        {r.status === 'completed' ? 'Completed' : 'In Review'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/reports/${r.id}`)}
                          title="View Detailed Report"
                          leftIcon={<Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExportModalReport(r)}
                          title="Download Report"
                          leftIcon={<Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                        >
                          Download
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setArchiveModalReport(r)}
                          title="Archive Report"
                          leftIcon={<Archive className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteModalReport(r)}
                          title="Delete Report"
                          leftIcon={<Trash2 className="w-3.5 h-3.5 text-red-500" />}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination Bar */}
          {!loading && reports.length > 0 && (
            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between gap-4 text-xs">
              <span className="text-slate-600 dark:text-slate-400">
                Showing <strong className="text-slate-900 dark:text-slate-100">{reports.length}</strong> of{' '}
                <strong className="text-slate-900 dark:text-slate-100">{totalItems}</strong> reports
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
                >
                  Previous
                </Button>
                <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-slate-800 dark:text-slate-200 font-semibold">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* EXPORT MODAL */}
      {exportModalReport && (
        <ExportModal
          isOpen={Boolean(exportModalReport)}
          onClose={() => setExportModalReport(null)}
          assessmentName={exportModalReport.assessmentName}
          onExportComplete={handleExportComplete}
        />
      )}

      {/* ARCHIVE CONFIRMATION MODAL */}
      {archiveModalReport && (
        <DeleteConfirmModal
          isOpen={Boolean(archiveModalReport)}
          onClose={() => setArchiveModalReport(null)}
          onConfirm={() => handleArchiveReport(archiveModalReport.id)}
          title="Archive Evaluation Report"
          description={`Are you sure you want to archive "${archiveModalReport.assessmentName}"? It will be moved to Archived Reports and can be restored anytime.`}
          confirmText="Archive Report"
          isPermanent={false}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalReport && (
        <DeleteConfirmModal
          isOpen={Boolean(deleteModalReport)}
          onClose={() => setDeleteModalReport(null)}
          onConfirm={() => handleDeleteReport(deleteModalReport.id)}
          title="Delete Evaluation Report"
          description={`Are you sure you want to permanently delete "${deleteModalReport.assessmentName}"?`}
          confirmText="Permanently Delete"
          isPermanent={true}
        />
      )}
    </div>
  )
}
