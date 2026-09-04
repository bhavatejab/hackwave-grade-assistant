import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  Download,
  Printer,
  Edit3,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  FileText,
  ShieldCheck,
} from 'lucide-react'
import { reportService } from '../api/reportService'
import { StudentEvaluationReport } from '../api/mockReports'
import { QuestionEvaluation } from '../api/mockEvaluationResults'
import { PermanentStorageBanner } from '../components/reports/PermanentStorageBanner'
import { QuestionNavigator } from '../components/evaluation/QuestionNavigator'
import { QuestionCard } from '../components/evaluation/QuestionCard'
import { WhyThisGradeDrawer } from '../components/evaluation/WhyThisGradeDrawer'
import { ChallengeAiModal } from '../components/evaluation/ChallengeAiModal'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { UuidBadge } from '../components/ui/UuidBadge'
import { StatCard } from '../components/dashboard/StatCard'
import { useNotifications } from '../contexts/NotificationContext'

export const StudentReportPage: React.FC = () => {
  const { id, uuid } = useParams<{ id: string; uuid: string }>()
  const navigate = useNavigate()
  const { addNotification } = useNotifications()

  const [studentReport, setStudentReport] = useState<StudentEvaluationReport | null>(null)
  const [questions, setQuestions] = useState<QuestionEvaluation[]>([])
  const [activeQuestionId, setActiveQuestionId] = useState('q1')
  const [loading, setLoading] = useState(true)

  const [drawerQuestion, setDrawerQuestion] = useState<QuestionEvaluation | null>(null)
  const [challengeQuestion, setChallengeQuestion] = useState<QuestionEvaluation | null>(null)

  useEffect(() => {
    const fetchStudentReport = async () => {
      setLoading(true)
      const data = await reportService.getStudentReport(id || 'REP-2026-001', uuid || 'STU-A91F23')
      if (data) {
        setStudentReport(data)
        setQuestions(data.questions)
      }
      setLoading(false)
    }
    fetchStudentReport()
  }, [id, uuid])

  const handlePrint = () => {
    addNotification({
      type: 'info',
      title: 'Print Command Sent',
      message: `Print dialog opened for Student ${uuid || 'STU-A91F23'}.`,
    })
    window.print()
  }

  const handleDownload = () => {
    addNotification({
      type: 'success',
      title: 'Report Downloaded',
      message: `Individual Student Report PDF for ${uuid || 'STU-A91F23'} downloaded.`,
    })
  }

  const handleOverrideSave = (qId: string, newMarks: number, reason: string, notes: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              marksAwarded: newMarks,
              isOverridden: true,
              overrideReason: reason,
              teacherNotes: notes,
              status: 'teacher_reviewed',
            }
          : q
      )
    )
    addNotification({
      type: 'success',
      title: 'Marks updated successfully.',
      message: `Updated score for question ${qId}.`,
    })
  }

  if (loading || !studentReport) {
    return (
      <div className="p-12 text-center text-slate-500 space-y-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono">Loading Student Evaluation Report...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(`/reports/${id || 'REP-2026-001'}`)}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-1"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Assessment Report
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Student Evaluation Report
            </h1>
            <UuidBadge uuid={studentReport.studentUUID} size="md" />
            <Badge variant="primary" showDot>
              Grade {studentReport.finalGrade}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Anonymized evaluation record for assessment {id || 'REP-2026-001'}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
            Print Report
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleDownload}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download Student Report PDF
          </Button>
        </div>
      </div>

      {/* Permanent Storage UX Banner */}
      <PermanentStorageBanner />

      {/* Summary Cards required by prompt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall Marks"
          value={`${studentReport.totalMarks} / ${studentReport.maximumMarks}`}
          change={`Grade ${studentReport.finalGrade}`}
          isPositive={true}
          description="Cumulative total"
          iconName="score"
        />
        <StatCard
          title="Final Grade"
          value={studentReport.finalGrade}
          change="Letter Grade"
          isPositive={true}
          description="Institutional grade"
          iconName="confidence"
        />
        <StatCard
          title="AI Confidence"
          value={`${studentReport.overallConfidence}%`}
          change="High Certainty"
          isPositive={true}
          description="Model decision certainty"
          iconName="auto"
        />
        <StatCard
          title="Teacher Overrides"
          value={studentReport.teacherOverridesCount}
          change="Adjusted"
          isPositive={true}
          description="Score adjustments"
          iconName="reports"
        />
      </div>

      {/* Teacher Notes Banner if Present */}
      {studentReport.teacherNotes && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs space-y-1 text-blue-900 dark:text-blue-200">
          <div className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-300">
            <Edit3 className="w-4 h-4" />
            <span>Teacher Evaluation Notes</span>
          </div>
          <p className="italic leading-relaxed text-slate-800 dark:text-slate-200">
            &quot;{studentReport.teacherNotes}&quot;
          </p>
        </div>
      )}

      {/* Question Navigation & Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Sticky Question Navigator */}
        <div className="md:col-span-1">
          <QuestionNavigator
            questions={questions}
            activeQuestionId={activeQuestionId}
            onSelectQuestion={(qId) => {
              setActiveQuestionId(qId)
              const cardId = `question-${qId.replace(/^q/, '')}`
              const el = document.getElementById(cardId)
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          />
        </div>

        {/* Question Cards Breakdown */}
        <div className="md:col-span-3 space-y-6">
          {questions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              onWhyThisGrade={setDrawerQuestion}
              onChallengeAi={setChallengeQuestion}
              onSaveOverride={handleOverrideSave}
              onPrevQuestion={() => {
                if (idx > 0) {
                  const prevId = questions[idx - 1].id
                  setActiveQuestionId(prevId)
                  document.getElementById(`question-${prevId.replace(/^q/, '')}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
              onNextQuestion={() => {
                if (idx < questions.length - 1) {
                  const nextId = questions[idx + 1].id
                  setActiveQuestionId(nextId)
                  document.getElementById(`question-${nextId.replace(/^q/, '')}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
              hasPrev={idx > 0}
              hasNext={idx < questions.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Drawers and Modals */}
      <WhyThisGradeDrawer
        isOpen={Boolean(drawerQuestion)}
        onClose={() => setDrawerQuestion(null)}
        question={drawerQuestion}
      />

      <ChallengeAiModal
        isOpen={Boolean(challengeQuestion)}
        onClose={() => setChallengeQuestion(null)}
        question={challengeQuestion}
        onSubmitChallenge={() => {}}
      />
    </div>
  )
}
