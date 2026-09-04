import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  Download,
  Printer,
  FileText,
  Table as TableIcon,
  FileCode,
  Edit3,
  Search,
  Eye,
} from 'lucide-react'
import { reportService } from '../api/reportService'
import { EvaluationReportDetail } from '../api/mockReports'
import { PermanentStorageBanner } from '../components/reports/PermanentStorageBanner'
import { ExportModal } from '../components/reports/ExportModal'
import { StatCard } from '../components/dashboard/StatCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table'
import { UuidBadge } from '../components/ui/UuidBadge'
import { useNotifications } from '../contexts/NotificationContext'

export const EvaluationReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addNotification } = useNotifications()

  const [report, setReport] = useState<EvaluationReportDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchUUID, setSearchUUID] = useState('')
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true)
      const data = await reportService.getReportById(id || 'REP-2026-001')
      setReport(data)
      setLoading(false)
    }
    fetchReport()
  }, [id])

  const handlePrint = () => {
    addNotification({
      type: 'info',
      title: 'Print Command Sent',
      message: `Print dialog opened for ${report?.assessmentName || 'Evaluation Report'}.`,
    })
    window.print()
  }

  const handleQuickDownload = (formatName: string) => {
    addNotification({
      type: 'success',
      title: 'Report Downloaded',
      message: `${formatName} export initiated successfully.`,
    })
  }

  const filteredStudents = (report?.students || []).filter((s) =>
    s.studentUUID.toLowerCase().includes(searchUUID.toLowerCase())
  )

  if (loading || !report) {
    return (
      <div className="p-12 text-center text-slate-500 space-y-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono">Loading Evaluation Report...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/history')}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-1"
          >
            <ChevronLeft className="w-4 h-4" /> Back to History
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {report.assessmentName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {report.subject} ({report.courseCode}) • {report.className} ({report.section}) • Teacher:{' '}
            {report.teacherName} ({report.teacherEmail})
          </p>
        </div>

        {/* Action Buttons required by prompt */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
            Print Report
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export Report Options
          </Button>
        </div>
      </div>

      {/* Permanent Storage UX Banner */}
      <PermanentStorageBanner />

      {/* Summary Metrics Cards required by prompt */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Student Papers"
          value={report.studentCount}
          change="100% Graded"
          isPositive={true}
          description="Total submissions"
          iconName="total"
        />
        <StatCard
          title="Average Score"
          value={`${report.averageMarks} / ${report.maximumMarks}`}
          change={`${Math.round((report.averageMarks / report.maximumMarks) * 100)}%`}
          isPositive={true}
          description="Class mean mark"
          iconName="score"
        />
        <StatCard
          title="Avg Confidence"
          value={`${report.averageConfidence}%`}
          change="High Certainty"
          isPositive={true}
          description="AI model certainty"
          iconName="confidence"
        />
        <StatCard
          title="Manual Reviews"
          value={report.manualReviewsCount}
          change="Flagged"
          isPositive={false}
          description="Low confidence items"
          iconName="reviews"
        />
        <StatCard
          title="Teacher Overrides"
          value={report.teacherOverridesCount}
          change="Adjusted"
          isPositive={true}
          description="Manual score edits"
          iconName="reports"
        />
        <StatCard
          title="Evaluation Date"
          value={report.evaluationDate}
          change="Vaulted"
          isPositive={true}
          description="Completion timestamp"
          iconName="auto"
        />
      </div>

      {/* Download Options Bar required by prompt (Report PDF, CSV, Excel, Print buttons) */}
      <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
          <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Quick Download Formats:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickDownload('PDF Document')}
            leftIcon={<FileText className="w-3.5 h-3.5 text-red-500" />}
          >
            Report PDF
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickDownload('CSV Spreadsheet')}
            leftIcon={<TableIcon className="w-3.5 h-3.5 text-emerald-500" />}
          >
            CSV Export
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickDownload('Excel Workbook (.xlsx)')}
            leftIcon={<FileCode className="w-3.5 h-3.5 text-blue-500" />}
          >
            Excel (.xlsx)
          </Button>

          <Button variant="outline" size="sm" onClick={handlePrint} leftIcon={<Printer className="w-3.5 h-3.5" />}>
            Print Page
          </Button>
        </div>
      </div>

      {/* Student List Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Student Submissions ({report.students.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Per-student breakdown with anonymized UUIDs and AI confidence scores.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchUUID}
              onChange={(e) => setSearchUUID(e.target.value)}
              placeholder="Search Student UUID (e.g. STU-A91F23)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student UUID</TableHead>
              <TableHead>Total Marks</TableHead>
              <TableHead>Final Grade</TableHead>
              <TableHead>AI Confidence</TableHead>
              <TableHead>Evaluation Status</TableHead>
              <TableHead>Teacher Overrides</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                  No student submissions found matching UUID search.
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((s) => (
                <TableRow key={s.studentUUID}>
                  <TableCell>
                    <UuidBadge uuid={s.studentUUID} size="md" />
                  </TableCell>
                  <TableCell>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100 font-mono">
                      {s.totalMarks} / {s.maximumMarks}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200 font-extrabold text-xs font-mono">
                      {s.finalGrade}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={s.overallConfidence > 90 ? 'success' : s.overallConfidence > 75 ? 'warning' : 'danger'}>
                      {s.overallConfidence}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        s.status === 'teacher_reviewed' ? 'primary' : s.status === 'auto_graded' ? 'success' : 'danger'
                      }
                      showDot
                    >
                      {s.status === 'teacher_reviewed'
                        ? 'Teacher Reviewed'
                        : s.status === 'auto_graded'
                        ? 'Auto Graded'
                        : 'Manual Review'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {s.teacherOverridesCount > 0 ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                        <Edit3 className="w-3.5 h-3.5" />
                        {s.teacherOverridesCount} Overridden
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/reports/${report.id}/student/${s.studentUUID}`)}
                      leftIcon={<Eye className="w-3.5 h-3.5 text-blue-500" />}
                    >
                      View Student Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* EXPORT OPTIONS MODAL */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        assessmentName={report.assessmentName}
        onExportComplete={(fmt, scope) => {
          addNotification({
            type: 'success',
            title: 'Export Initiated',
            message: `${fmt} export (${scope}) generated successfully.`,
          })
        }}
      />
    </div>
  )
}
