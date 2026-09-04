import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { QuestionEvaluation } from '../api/mockEvaluationResults'
import { QuestionCard } from '../components/evaluation/QuestionCard'
import { WhyThisGradeDrawer } from '../components/evaluation/WhyThisGradeDrawer'
import { ChallengeAiModal } from '../components/evaluation/ChallengeAiModal'
import { Button } from '../components/ui/Button'
import { PrivacyCard } from '../components/ui/PrivacyCard'
import { useEvaluation } from '../contexts/EvaluationContext'
import { cn } from '../utils/cn'

export const TeacherReviewPage: React.FC = () => {
  const navigate = useNavigate()
  const { evaluation, overrideQuestionMarks } = useEvaluation()

  const [selectedId, setSelectedId] = useState<string>('q4') // Default to low confidence question Q4
  const [drawerQuestion, setDrawerQuestion] = useState<QuestionEvaluation | null>(null)
  const [challengeQuestion, setChallengeQuestion] = useState<QuestionEvaluation | null>(null)

  const selectedQuestion = evaluation.questions.find((q) => q.id === selectedId) || evaluation.questions[0]

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Teacher Evaluation & Review Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Instructor review & mark overrides for <span className="font-semibold text-slate-900 dark:text-slate-200">{evaluation.assessmentName}</span> ({evaluation.courseCode} • {evaluation.section} • {evaluation.maximumMarks} Max Marks).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/evaluations/results')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Results Overview
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/evaluations/results')}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            Finalize Question Review
          </Button>
        </div>
      </div>

      <PrivacyCard text="Student identities remain hidden from AI. All override comments and reviews are tied to anonymous UUID STU-A91F23." />

      {/* Large Split Screen Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Side: Question List Workspace */}
        <div className="md:col-span-1 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2 sticky top-24">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Review Queue Items
          </h4>
          {evaluation.questions.map((q) => {
            const isSelected = q.id === selectedId
            return (
              <button
                key={q.id}
                onClick={() => setSelectedId(q.id)}
                className={cn(
                  'w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all text-left',
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
                  q.manualReviewRequired && !isSelected && 'border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 text-red-700 dark:text-red-300'
                )}
              >
                <span>{q.questionNumber}</span>
                <span className="font-mono text-[11px]">{q.marksAwarded}/{q.maximumMarks} ({q.confidence}%)</span>
              </button>
            )
          })}
        </div>

        {/* Right Side: Current Question Workspace */}
        <div className="md:col-span-3">
          <QuestionCard
            question={selectedQuestion}
            onWhyThisGrade={setDrawerQuestion}
            onChallengeAi={setChallengeQuestion}
            onSaveOverride={overrideQuestionMarks}
          />
        </div>
      </div>

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
