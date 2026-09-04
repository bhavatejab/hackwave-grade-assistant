import React from 'react'
import { CheckCircle2, XCircle, HelpCircle, ShieldCheck, Sparkles } from 'lucide-react'
import { Drawer } from '../ui/Drawer'
import { QuestionEvaluation } from '../../api/mockEvaluationResults'
import { ProgressBar } from '../ui/ProgressBar'

export interface WhyThisGradeDrawerProps {
  isOpen: boolean
  onClose: () => void
  question: QuestionEvaluation | null
}

export const WhyThisGradeDrawer: React.FC<WhyThisGradeDrawerProps> = ({
  isOpen,
  onClose,
  question,
}) => {
  if (!question) return null

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Explainable AI Breakdown: ${question.questionNumber}`}
    >
      <div className="space-y-6 text-xs">
        {/* Banner */}
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-blue-900 dark:text-blue-200">
              Transparent Evaluation Logic
            </span>
            <p className="text-blue-800 dark:text-blue-300 leading-relaxed">
              Detailed breakdown of why {question.marksAwarded} out of {question.maximumMarks} marks were assigned by the model.
            </p>
          </div>
        </div>

        {/* Confidence Metrics */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
          <div className="flex justify-between font-semibold">
            <span className="text-slate-700 dark:text-slate-300">Model Confidence</span>
            <span className="text-blue-600 dark:text-blue-400 font-mono">{question.confidence}%</span>
          </div>
          <ProgressBar value={question.confidence} height="md" variant={question.confidence > 90 ? 'success' : question.confidence > 75 ? 'primary' : 'danger'} />
        </div>

        {/* Matched Rubric Points */}
        <div className="space-y-2">
          <h5 className="font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Matched Rubric Points ({question.evidenceMatched.length})
          </h5>
          <div className="space-y-1.5">
            {question.evidenceMatched.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200 flex items-center gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Rubric Points */}
        {question.evidenceMissing.length > 0 && (
          <div className="space-y-2">
            <h5 className="font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
              <XCircle className="w-4 h-4" /> Missing / Deducted Rubric Points ({question.evidenceMissing.length})
            </h5>
            <div className="space-y-1.5">
              {question.evidenceMissing.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 text-red-900 dark:text-red-200 flex items-center gap-2"
                >
                  <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Reasoning Text */}
        <div className="space-y-2">
          <h5 className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Model Explanation
          </h5>
          <p className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed font-sans border border-slate-200 dark:border-slate-700">
            {question.reasoning}
          </p>
        </div>

        {/* FERPA Security */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-slate-400 text-[11px]">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Processed anonymously using Student UUID {question.studentUUID}</span>
        </div>
      </div>
    </Drawer>
  )
}
