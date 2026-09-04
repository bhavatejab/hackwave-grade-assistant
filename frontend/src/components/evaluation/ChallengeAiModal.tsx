import React, { useState } from 'react'
import { AlertCircle, Send, CheckCircle2 } from 'lucide-react'
import { Dialog } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { QuestionEvaluation } from '../../api/mockEvaluationResults'

export interface ChallengeAiModalProps {
  isOpen: boolean
  onClose: () => void
  question: QuestionEvaluation | null
  onSubmitChallenge: (questionId: string, reason: string, comments: string) => void
}

export const ChallengeAiModal: React.FC<ChallengeAiModalProps> = ({
  isOpen,
  onClose,
  question,
  onSubmitChallenge,
}) => {
  const [reason, setReason] = useState('Alternative proofs should be accepted')
  const [comments, setComments] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!question) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((res) => setTimeout(res, 600))
    setIsSubmitting(false)
    setIsSubmitted(true)
    onSubmitChallenge(question.id, reason, comments)
    setTimeout(() => {
      setIsSubmitted(false)
      onClose()
    }, 1200)
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Challenge AI Evaluation: ${question.questionNumber}`}
      description="Submit a formal feedback report to flag model evaluation anomalies."
      maxWidth="md"
    >
      {isSubmitted ? (
        <div className="py-8 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
            AI Challenge Submitted!
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Feedback logged in institutional audit log for model calibration.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Challenging AI evaluation for Student UUID {question.studentUUID}</span>
          </div>

          <Input
            label="Reason for Challenge"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Alternative method valid according to syllabus"
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Instructor Comments
            </label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Detail why the model's evidence scoring was inaccurate..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Submit Challenge
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  )
}
