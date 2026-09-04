import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Users,
  Award,
  Calendar,
  ChevronRight,
  Eye,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Clock,
  GraduationCap,
} from 'lucide-react'
import { reportService } from '../api/reportService'
import { StudentHistoryItem } from '../api/mockReports'
import { PermanentStorageBanner } from '../components/reports/PermanentStorageBanner'
import { UuidBadge } from '../components/ui/UuidBadge'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

export const StudentsPage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedUUID, setSelectedUUID] = useState('STU-A91F23')
  const [history, setHistory] = useState<StudentHistoryItem[]>([])
  const [loading, setLoading] = useState(false)

  const sampleUUIDs = ['STU-A91F23', 'STU-B42C89', 'STU-C78D12', 'STU-D34E56', 'STU-E89F01']

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      const res = await reportService.getStudentHistory(selectedUUID)
      setHistory(res)
      setLoading(false)
    }
    fetchHistory()
  }, [selectedUUID])

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Student Assessment History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search by anonymized student UUID to inspect timeline history across all course evaluations.
          </p>
        </div>
      </div>

      {/* Permanent Storage UX Banner */}
      <PermanentStorageBanner />

      {/* Search Input & Quick Select Badges */}
      <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="space-y-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Search Student by UUID
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={selectedUUID}
              onChange={(e) => setSelectedUUID(e.target.value)}
              placeholder="Enter Student UUID (e.g. STU-A91F23)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 font-mono"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Quick Select UUID:</span>
          {sampleUUIDs.map((uuid) => (
            <button
              key={uuid}
              onClick={() => setSelectedUUID(uuid)}
              className={`px-2.5 py-1 rounded-lg font-mono transition-all ${
                selectedUUID === uuid
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {uuid}
            </button>
          ))}
        </div>
      </div>

      {/* TIMELINE VIEW REQUIRED BY PROMPT */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Evaluation Timeline for</span>
            <UuidBadge uuid={selectedUUID} size="md" />
          </h3>
          <span className="text-xs text-slate-400 font-mono">{history.length} Assessments</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">Loading Timeline...</div>
        ) : history.length === 0 ? (
          <div className="p-12 text-center border rounded-2xl text-slate-400 text-xs">
            No previous evaluation records found for student UUID {selectedUUID}.
          </div>
        ) : (
          <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {history.map((item) => (
              <div key={item.id} className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                  <GraduationCap className="w-3 h-3" />
                </div>

                {/* Timeline card */}
                <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 hover:border-blue-300 dark:hover:border-blue-800 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                          {item.assessmentName}
                        </span>
                        <Badge variant="primary">{item.courseCode}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {item.date}
                        </span>
                        <span>•</span>
                        <span>{item.subject}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-slate-400 font-semibold uppercase">Total Marks</div>
                        <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                          {item.totalMarks} / {item.maximumMarks}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-slate-400 font-semibold uppercase">Grade</div>
                        <div className="px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200 font-extrabold text-sm font-mono text-center">
                          {item.finalGrade}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Badges & Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={item.confidence > 90 ? 'success' : 'warning'}>
                        AI Confidence: {item.confidence}%
                      </Badge>
                      {item.teacherReviewed ? (
                        <Badge variant="primary" showDot>
                          Teacher Reviewed ({item.overridesCount} Overrides)
                        </Badge>
                      ) : (
                        <Badge variant="success" showDot>
                          Auto Graded
                        </Badge>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/reports/${item.reportId}/student/${selectedUUID}`)}
                      rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                    >
                      View Student Report
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
