import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Edit3,
  Sparkles,
  FileText,
  Eye,
  ShieldCheck,
} from 'lucide-react'
import { QuestionEvaluation } from '../../api/mockEvaluationResults'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { UuidBadge } from '../ui/UuidBadge'
import { ProgressBar } from '../ui/ProgressBar'
import { OverrideMarksForm } from './OverrideMarksForm'
import { FilePreviewModal } from '../ui/FilePreviewModal'
import { cn } from '../../utils/cn'

export interface QuestionCardProps {
  question: QuestionEvaluation
  onWhyThisGrade: (q: QuestionEvaluation) => void
  onChallengeAi: (q: QuestionEvaluation) => void
  onSaveOverride: (
    questionId: string,
    newMarks: number,
    reason: string,
    notes: string
  ) => void
  onPrevQuestion?: () => void
  onNextQuestion?: () => void
  hasPrev?: boolean
  hasNext?: boolean
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onWhyThisGrade,
  onChallengeAi,
  onSaveOverride,
  onPrevQuestion,
  onNextQuestion,
  hasPrev,
  hasNext,
}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isOverriding, setIsOverriding] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const getStatusBadge = () => {
    if (question.isOverridden) {
      return <Badge variant="primary" showDot>Teacher Overridden</Badge>
    }
    if (question.status === 'teacher_reviewed') {
      return <Badge variant="primary" showDot>Teacher Reviewed</Badge>
    }
    if (question.manualReviewRequired || question.status === 'manual_review_required') {
      return <Badge variant="danger" showDot>Manual Review Required</Badge>
    }
    return <Badge variant="success" showDot>Auto Graded</Badge>
  }

  const getConfidenceBadge = () => {
    if (question.confidence > 90) {
      return <Badge variant="success">High Confidence ({question.confidence}%)</Badge>
    }
    if (question.confidence > 75) {
      return <Badge variant="warning">Medium Confidence ({question.confidence}%)</Badge>
    }
    return <Badge variant="danger">Low Confidence ({question.confidence}%)</Badge>
  }

  const cardId = question.id.startsWith('question-')
    ? question.id
    : `question-${question.id.replace(/^q/, '')}`

  return (
    <div
      id={cardId}
      data-question-card="true"
      data-question-id={question.id}
      className={cn(
        'rounded-2xl border transition-all duration-200 bg-white dark:bg-slate-900 shadow-sm overflow-hidden scroll-mt-24',
        question.manualReviewRequired
          ? 'border-red-300 dark:border-red-900/80 ring-1 ring-red-500/20'
          : question.isOverridden
          ? 'border-blue-300 dark:border-blue-900/80 ring-1 ring-blue-500/20'
          : 'border-slate-200/80 dark:border-slate-800'
      )}
    >
      {/* Card Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/40 dark:bg-slate-900/60">
        <div className="flex items-start gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors mt-0.5"
          >
            <ChevronDown
              className={cn('w-5 h-5 text-slate-400 transition-transform duration-200', !isExpanded && '-rotate-90')}
            />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-base text-slate-900 dark:text-slate-100 font-mono">
                {question.questionNumber}
              </span>
              <UuidBadge uuid={question.studentUUID} size="sm" />
              {getStatusBadge()}
              {getConfidenceBadge()}
            </div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
              {question.questionText}
            </h4>
          </div>
        </div>

        {/* Display both Original AI Marks and Teacher Override Marks required by prompt */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          {question.isOverridden ? (
            <div className="text-right space-y-0.5">
              <div className="text-[11px] text-slate-400">
                Original AI: <span className="line-through">{question.originalAiMarks}</span> / {question.maximumMarks}
              </div>
              <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                Teacher Marks: {question.marksAwarded} / {question.maximumMarks}
              </div>
            </div>
          ) : (
            <div className="text-right">
              <div className="text-xs text-slate-400 font-semibold uppercase">Marks Awarded</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {question.marksAwarded} / {question.maximumMarks}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Card Body */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="p-5 sm:p-6 space-y-6"
          >
            {/* Display Teacher Override Banner & Comments if Overridden */}
            {question.isOverridden && (
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs space-y-1.5 text-blue-900 dark:text-blue-200">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Teacher Override Active
                  </span>
                  <span className="font-mono text-blue-600 dark:text-blue-400">
                    AI: {question.originalAiMarks} $\rightarrow$ Teacher: {question.marksAwarded}
                  </span>
                </div>
                {question.overrideReason && (
                  <p className="text-blue-800 dark:text-blue-300">
                    <strong>Reason:</strong> {question.overrideReason}
                  </p>
                )}
                {question.teacherNotes && (
                  <p className="text-blue-700 dark:text-blue-300/80 italic">
                    &quot;{question.teacherNotes}&quot;
                  </p>
                )}
              </div>
            )}

            {/* Low vs High Confidence Banners */}
            {!question.isOverridden && (question.manualReviewRequired || question.confidence < 75) ? (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-800 dark:text-red-300 font-medium flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <div>
                    <strong className="block text-red-900 dark:text-red-200 font-bold">
                      Manual Review Required
                    </strong>
                    <span>Confidence ({question.confidence}%) fell below institutional threshold. Verify handwritten derivation.</span>
                  </div>
                </div>
                <Button variant="danger" size="sm" onClick={() => setIsOverriding(true)}>
                  Review & Override
                </Button>
              </div>
            ) : !question.isOverridden ? (
              <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>AI is highly confident ({question.confidence}%). Teacher review optional.</span>
                </div>
              </div>
            ) : null}

            {/* SECTION 1: Student Answer */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Student Submission
              </span>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-200 leading-relaxed">
                {question.studentAnswerText}
              </div>

              {question.studentAnswerImageUrl && (
                <div className="mt-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>Handwritten Answer Scan Image</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPreviewOpen(true)}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    View High-Res Scan
                  </Button>
                </div>
              )}
            </div>

            {/* SECTION 2: Expected Answer */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Expected Answer (Rubric Answer Key)
              </span>
              <div className="p-4 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 text-xs sm:text-sm font-sans text-purple-900 dark:text-purple-200 leading-relaxed">
                {question.expectedAnswer}
              </div>
            </div>

            {/* SECTION 3: Evidence Bullets */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Rubric Evidence Match
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {question.evidenceMatched.map((m, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{m}</span>
                  </div>
                ))}
                {question.evidenceMissing.map((m, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 text-red-900 dark:text-red-200 flex items-center gap-2"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 4: AI Reasoning Card */}
            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>AI Grading Explanation</span>
              </div>
              <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed font-sans">
                {question.reasoning}
              </p>
            </div>

            {/* SECTION 5: Alternative Reasoning Card */}
            {question.alternativeReasoning && (
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Alternative Reasoning Detected</span>
                </div>
                <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
                  {question.alternativeReasoning}
                </p>
              </div>
            )}

            {/* SECTION 6: Confidence Progress & Recommendation */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Confidence Threshold Assessment
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  Recommendation: {question.reviewRecommendation}
                </span>
              </div>
              <ProgressBar
                value={question.confidence}
                showLabel
                labelPosition="right"
                variant={
                  question.confidence > 90
                    ? 'success'
                    : question.confidence > 75
                    ? 'primary'
                    : 'danger'
                }
              />
            </div>

            {/* Inline Mark Override Form */}
            {isOverriding && (
              <OverrideMarksForm
                question={question}
                onSaveOverride={(id, newMarks, reason, notes) => {
                  onSaveOverride(id, newMarks, reason, notes)
                  setIsOverriding(false)
                }}
                onCancel={() => setIsOverriding(false)}
              />
            )}

            {/* SECTION 7: Action Buttons required by prompt */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onWhyThisGrade(question)}
                  leftIcon={<HelpCircle className="w-3.5 h-3.5 text-blue-500" />}
                >
                  Why This Grade?
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onChallengeAi(question)}
                  leftIcon={<AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                >
                  Challenge AI
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={isOverriding ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setIsOverriding(!isOverriding)}
                  leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                >
                  {isOverriding ? 'Close Form' : 'Override Marks'}
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    onSaveOverride(
                      question.id,
                      question.marksAwarded,
                      'Confirmed without score change',
                      'Reviewed & Approved'
                    )
                  }
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                >
                  Save Review
                </Button>
              </div>
            </div>

            {/* Card Bottom Navigation: Previous & Next Question */}
            {(onPrevQuestion || onNextQuestion) && (
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!hasPrev}
                  onClick={onPrevQuestion}
                  leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
                >
                  Previous Question
                </Button>
                <span className="text-[11px] text-slate-400 font-mono font-medium">
                  {question.questionNumber} Navigation
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!hasNext}
                  onClick={onNextQuestion}
                  rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                >
                  Next Question
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      {question.studentAnswerImageUrl && (
        <FilePreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          fileName={`${question.questionNumber}_ProofScan.jpg`}
          fileType="image"
        />
      )}
    </div>
  )
}
