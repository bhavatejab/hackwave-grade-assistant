import React, { useState } from 'react'
import { AlertCircle, Send, CheckCircle2, Sparkles, Scale, AlertTriangle, ArrowRight } from 'lucide-react'
import { Dialog } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'
import { QuestionEvaluation } from '../../api/mockEvaluationResults'
import { evaluationService } from '../../services/evaluationService'
import { ChallengeResponse } from '../../types/api'

export interface ChallengeAiModalProps {
  isOpen: boolean
  onClose: () => void
  question: QuestionEvaluation | null
  onSubmitChallenge?: (questionId: string, reason: string, comments: string) => void
  onApplyScore?: (questionId: string, newMarks: number, reason: string, notes: string) => void
}

export const ChallengeAiModal: React.FC<ChallengeAiModalProps> = ({
  isOpen,
  onClose,
  question,
  onSubmitChallenge,
  onApplyScore,
}) => {
  const [reason, setReason] = useState('Alternative proofs should be accepted')
  const [comments, setComments] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reconsiderationResult, setReconsiderationResult] = useState<ChallengeResponse | null>(null)

  if (!question) return null

  const handleResetAndClose = () => {
    setReconsiderationResult(null)
    setErrorMessage(null)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const criterionId = question.criteria?.[0]?.id || 'crit_1'
      const criterionDescription =
        question.criteria?.[0]?.reasoning || question.expectedAnswer || 'Core question rubric'

      const challengePayload = {
        question: question.questionText,
        criterion: {
          id: criterionId,
          description: criterionDescription,
          max_score: question.maximumMarks,
        },
        student_answer: question.studentAnswerText,
        original_score: question.marksAwarded,
        original_reasoning: question.reasoning,
        original_evidence: question.evidenceMatched.join('; '),
        teacher_challenge: `${reason}${comments ? `: ${comments}` : ''}`.trim(),
      }

      // Live call to FastAPI backend POST /api/challenge
      const response = await evaluationService.challengeCriterion(challengePayload)
      setReconsiderationResult(response)

      if (onSubmitChallenge) {
        onSubmitChallenge(question.id, reason, comments)
      }
    } catch (err: any) {
      console.error('Challenge AI error:', err)
      const msg =
        err.response?.data?.detail ||
        (err.code === 'ERR_NETWORK'
          ? 'Cannot connect to backend server at http://127.0.0.1:8000.'
          : 'Failed to process AI challenge reconsideration. Please check backend connection.')
      setErrorMessage(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApplyReconsideration = () => {
    if (reconsiderationResult && onApplyScore) {
      onApplyScore(
        question.id,
        reconsiderationResult.reconsidered_score,
        `AI Challenge Reconsideration (${reconsiderationResult.decision})`,
        reconsiderationResult.reasoning
      )
    }
    handleResetAndClose()
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={`Challenge AI Evaluation: ${question.questionNumber}`}
      description="Submit a formal challenge to prompt Featherless AI to reconsider the rubric score."
      maxWidth="lg"
    >
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {reconsiderationResult ? (
        /* Reconsideration Result View */
        <div className="space-y-5 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400 block">Decision</span>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge
                  variant={
                    reconsiderationResult.decision === 'score_changed'
                      ? 'success'
                      : reconsiderationResult.decision === 'needs_teacher_review'
                      ? 'danger'
                      : 'neutral'
                  }
                  showDot
                >
                  {reconsiderationResult.decision === 'score_changed'
                    ? 'Score Changed'
                    : reconsiderationResult.decision === 'needs_teacher_review'
                    ? 'Needs Teacher Review'
                    : 'Score Unchanged'}
                </Badge>
                <span className="text-xs text-slate-500">
                  AI Confidence: {Math.round(reconsiderationResult.confidence * 100)}%
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] uppercase font-bold text-slate-400 block">Score</span>
              <div className="font-mono text-base font-extrabold text-slate-900 dark:text-slate-100">
                <span className="line-through text-slate-400">
                  {reconsiderationResult.original_score}
                </span>{' '}
                $\rightarrow${' '}
                <span className="text-blue-600 dark:text-blue-400">
                  {reconsiderationResult.reconsidered_score}
                </span>{' '}
                / {reconsiderationResult.max_score}
              </div>
            </div>
          </div>

          {/* AI's New Reasoning */}
          <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>AI Reconsideration Explanation</span>
            </div>
            <p className="text-blue-900 dark:text-blue-200 leading-relaxed">
              {reconsiderationResult.reasoning}
            </p>
          </div>

          {/* Evidence from student answer */}
          {reconsiderationResult.evidence && (
            <div className="p-3 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1 text-xs text-emerald-900 dark:text-emerald-200">
              <strong className="block text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Evidence Identified in Student Response:
              </strong>
              <p className="italic">&quot;{reconsiderationResult.evidence}&quot;</p>
            </div>
          )}

          {/* Teacher Review Recommendation */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {reconsiderationResult.requires_teacher_review ? (
              <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                <AlertTriangle className="w-4 h-4" /> Further teacher review recommended.
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> AI reconsideration resolved with high certainty.
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={handleResetAndClose}>
              Keep Original Score
            </Button>
            {onApplyScore && reconsiderationResult.reconsidered_score !== reconsiderationResult.original_score && (
              <Button
                type="button"
                variant="primary"
                onClick={handleApplyReconsideration}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Apply Reconsidered Score ({reconsiderationResult.reconsidered_score} pts)
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Challenge Form */
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between font-medium">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                Current Marks: <strong>{question.marksAwarded} / {question.maximumMarks}</strong> (Confidence {question.confidence}%)
              </span>
            </div>
            <span className="font-mono text-[11px] text-amber-600">{question.studentUUID}</span>
          </div>

          <Input
            label="Reason for Challenge"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Alternative proof method valid according to syllabus"
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Instructor Comments & Challenge Evidence
            </label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Detail why the model's score was inaccurate and point out specific steps in the student's answer..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={handleResetAndClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
            >
              {isSubmitting ? 'Reconsidering via AI...' : 'Submit Challenge to AI'}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  )
}

