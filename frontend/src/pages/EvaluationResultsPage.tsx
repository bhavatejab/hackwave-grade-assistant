import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Download,
  ArrowLeft,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react'
import { QuestionEvaluation } from '../api/mockEvaluationResults'
import { QuestionNavigator } from '../components/evaluation/QuestionNavigator'
import { QuestionCard } from '../components/evaluation/QuestionCard'
import { WhyThisGradeDrawer } from '../components/evaluation/WhyThisGradeDrawer'
import { ChallengeAiModal } from '../components/evaluation/ChallengeAiModal'
import { FinalizeEvaluationModal } from '../components/evaluation/FinalizeEvaluationModal'
import { ExportModal } from '../components/reports/ExportModal'
import { StatCard } from '../components/dashboard/StatCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { PrivacyCard } from '../components/ui/PrivacyCard'
import { useEvaluation } from '../contexts/EvaluationContext'
import { useNotifications } from '../contexts/NotificationContext'

export const EvaluationResultsPage: React.FC = () => {
  const navigate = useNavigate()
  const { evaluationId } = useParams<{ evaluationId?: string }>()
  const [searchParams] = useSearchParams()
  const { evaluation, overrideQuestionMarks, finalizeEvaluation } = useEvaluation()
  const { addNotification } = useNotifications()

  const requestedId = evaluationId || searchParams.get('id')
  // Check if explicit invalid ID is passed (e.g. 'invalid', 'not-found')
  const isInvalidId = requestedId === 'invalid' || requestedId === 'not-found' || (Boolean(requestedId) && requestedId !== 'eval-123' && requestedId !== 'eval-1' && requestedId !== 'STU-A91F23' && requestedId !== evaluation.studentUUID)

  const [activeQuestionId, setActiveQuestionId] = useState<string>('q1')
  const [drawerQuestion, setDrawerQuestion] = useState<QuestionEvaluation | null>(null)
  const [challengeQuestion, setChallengeQuestion] = useState<QuestionEvaluation | null>(null)
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  const activeIndex = evaluation.questions.findIndex((q) => q.id === activeQuestionId)

  // IntersectionObserver Scroll Spy to update active question as teacher manually scrolls
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -50% 0px',
      threshold: 0.1,
    }

    const handleIntersection: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const qId = entry.target.getAttribute('data-question-id')
          if (qId) {
            setActiveQuestionId(qId)
          }
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersection, observerOptions)
    const elements = document.querySelectorAll('[data-question-card]')
    elements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, [evaluation.questions])

  const handleSelectQuestion = (id: string) => {
    const rawNum = id.replace(/^(question-|q)/, '')
    const cardElementId = `question-${rawNum}`
    const questionStateId = `q${rawNum}`

    setActiveQuestionId(questionStateId)

    const element = document.getElementById(cardElementId) || document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handlePrevQuestion = () => {
    if (activeIndex > 0) {
      const prevId = evaluation.questions[activeIndex - 1].id
      handleSelectQuestion(prevId)
    }
  }

  const handleNextQuestion = () => {
    if (activeIndex < evaluation.questions.length - 1) {
      const nextId = evaluation.questions[activeIndex + 1].id
      handleSelectQuestion(nextId)
    }
  }

  if (isInvalidId) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-12">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20 shadow-inner">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Evaluation Not Found
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              The requested evaluation session or ID (<span className="font-mono text-emerald-600 dark:text-emerald-400">{requestedId}</span>) could not be retrieved from active workspace records.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/uploads')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Evaluation Queue
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/history')}
              leftIcon={<FileSpreadsheet className="w-4 h-4" />}
            >
              View Reports & History
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              AI Evaluation Results
            </h1>
            <Badge variant={evaluation.status === 'pending_review' ? 'warning' : 'success'} showDot>
              {evaluation.status === 'pending_review' ? 'Pending Review' : 'Finalized'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {evaluation.assessmentName} ({evaluation.courseCode} • {evaluation.section}) • Student UUID {evaluation.studentUUID} • {evaluation.maximumMarks} Max Marks
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/uploads')}
            leftIcon={<ArrowLeft className="w-4 h-4 text-slate-400" />}
          >
            Back to Queue
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => setIsExportModalOpen(true)}
            leftIcon={<Download className="w-4 h-4 text-emerald-500" />}
          >
            Export Report
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/manual-review')}
            leftIcon={<CheckSquare className="w-4 h-4 text-amber-500" />}
          >
            Review Queue ({evaluation.questionsRequiringReview})
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsFinalizeModalOpen(true)}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            Finalize Evaluation
          </Button>
        </div>
      </div>

      <PrivacyCard text="Student identities remain hidden from AI. Per-question evidence and reasoning are generated against anonymous UUID STU-A91F23." />

      {/* TOP SUMMARY CARDS displaying single source of truth state */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Overall Marks"
          value={`${evaluation.overallScore} / ${evaluation.maximumMarks}`}
          change={`${Math.round((evaluation.overallScore / evaluation.maximumMarks) * 100)}%`}
          isPositive={true}
          description="Cumulative score"
          iconName="score"
        />
        <StatCard
          title="AI Confidence"
          value={`${evaluation.overallConfidence}%`}
          change="+2.1%"
          isPositive={true}
          description="Model decision certainty"
          iconName="confidence"
        />
        <StatCard
          title="Evaluated"
          value={evaluation.questionsEvaluated}
          change="100% Paper"
          isPositive={true}
          description="Questions scored"
          iconName="total"
        />
        <StatCard
          title="Needs Review"
          value={evaluation.questionsRequiringReview}
          change="Flagged"
          isPositive={false}
          description="Low confidence questions"
          iconName="reviews"
        />
        <StatCard
          title="Overrides"
          value={evaluation.teacherOverrides}
          change="Adjusted"
          isPositive={true}
          description="Teacher score edits"
          iconName="reports"
        />
        <StatCard
          title="Status"
          value={evaluation.status === 'pending_review' ? 'Pending' : 'Final'}
          change="Audit Ready"
          isPositive={true}
          description="Evaluation state"
          iconName="auto"
        />
      </div>

      {/* MAIN WORKSPACE GRID: Sticky Left Question Navigation + Question Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* LEFT SIDEBAR INSIDE RESULTS: Sticky Question Navigation */}
        <div className="md:col-span-1">
          <QuestionNavigator
            questions={evaluation.questions}
            activeQuestionId={activeQuestionId}
            onSelectQuestion={handleSelectQuestion}
          />
        </div>

        {/* RIGHT COLUMN: Question Cards & Controls */}
        <div className="md:col-span-3 space-y-6">
          {/* Question Jump / Pagination Bar */}
          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between gap-4 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Question {activeIndex >= 0 ? activeIndex + 1 : 1} of {evaluation.questions.length}
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={activeIndex <= 0}
                onClick={handlePrevQuestion}
                leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
              >
                Previous Question
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={activeIndex >= evaluation.questions.length - 1}
                onClick={handleNextQuestion}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Next Question
              </Button>
            </div>
          </div>

          {/* RENDER ALL QUESTION CARDS SUBSCRIBED TO EVALUATION CONTEXT */}
          {evaluation.questions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              onWhyThisGrade={setDrawerQuestion}
              onChallengeAi={setChallengeQuestion}
              onSaveOverride={overrideQuestionMarks}
              onPrevQuestion={() => {
                if (idx > 0) handleSelectQuestion(evaluation.questions[idx - 1].id)
              }}
              onNextQuestion={() => {
                if (idx < evaluation.questions.length - 1) handleSelectQuestion(evaluation.questions[idx + 1].id)
              }}
              hasPrev={idx > 0}
              hasNext={idx < evaluation.questions.length - 1}
            />
          ))}
        </div>
      </div>

      {/* WHY THIS GRADE DRAWER */}
      <WhyThisGradeDrawer
        isOpen={Boolean(drawerQuestion)}
        onClose={() => setDrawerQuestion(null)}
        question={drawerQuestion}
      />

      {/* CHALLENGE AI MODAL */}
      <ChallengeAiModal
        isOpen={Boolean(challengeQuestion)}
        onClose={() => setChallengeQuestion(null)}
        question={challengeQuestion}
        onSubmitChallenge={() => {}}
      />

      {/* FINALIZE EVALUATION MODAL */}
      <FinalizeEvaluationModal
        isOpen={isFinalizeModalOpen}
        onClose={() => setIsFinalizeModalOpen(false)}
        totalMarks={evaluation.overallScore}
        maximumMarks={evaluation.maximumMarks}
        overrideCount={evaluation.teacherOverrides}
        reviewsCompletedCount={evaluation.questionsEvaluated - evaluation.questionsRequiringReview}
        onConfirmFinalize={() => {
          finalizeEvaluation()
          setIsFinalizeModalOpen(false)
          navigate('/reports')
        }}
      />

      {/* EXPORT MODAL */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        assessmentName={evaluation.assessmentName}
        onExportComplete={(fmt, sc) => {
          addNotification({
            title: 'Report Exported',
            message: `${fmt} report exported successfully (${sc} scope).`,
            type: 'success',
          })
        }}
      />
    </div>
  )
}
