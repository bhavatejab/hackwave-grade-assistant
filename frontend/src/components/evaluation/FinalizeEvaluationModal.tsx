import React, { useState } from 'react'
import { CheckCircle2, Award, Edit3, ShieldCheck, ArrowRight } from 'lucide-react'
import { Dialog } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { PrivacyBadge } from '../ui/PrivacyBadge'
import { useEvaluation } from '../../contexts/EvaluationContext'

export interface FinalizeEvaluationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirmFinalize: () => void
  totalMarks: number
  maximumMarks: number
  overrideCount: number
  reviewsCompletedCount: number
}

export const FinalizeEvaluationModal: React.FC<FinalizeEvaluationModalProps> = ({
  isOpen,
  onClose,
  onConfirmFinalize,
  totalMarks,
  maximumMarks,
  overrideCount,
  reviewsCompletedCount,
}) => {
  const { evaluation } = useEvaluation()
  const [isFinalizing, setIsFinalizing] = useState(false)

  const handleFinalize = async () => {
    setIsFinalizing(true)
    await new Promise((res) => setTimeout(res, 800))
    setIsFinalizing(false)
    onConfirmFinalize()
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Finalize Assessment Evaluation"
      description={`Confirm and lock evaluation score for ${evaluation.assessmentName}. Verified grade sheets will be published to the registrar.`}
      maxWidth="md"
    >
      <div className="space-y-6 pt-2">
        <PrivacyBadge variant="banner" />

        {/* Summary Metrics Cards Required by Prompt */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <Award className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Total Score
            </span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-mono">
              {totalMarks} / {maximumMarks}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <Edit3 className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Teacher Overrides
            </span>
            <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400 font-mono">
              {overrideCount}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <ShieldCheck className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Reviews Completed
            </span>
            <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {reviewsCompletedCount}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
          <span className="font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Ready for Grade Sheet Sign-Off
          </span>
          <p className="text-emerald-700 dark:text-emerald-400">
            Clicking &quot;Finalize & Publish&quot; triggers mock API POST `/evaluations/finalize` and updates assessment status to Finalized.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose}>
            Keep Reviewing
          </Button>
          <Button
            variant="primary"
            isLoading={isFinalizing}
            onClick={handleFinalize}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Finalize & Publish Grade
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
