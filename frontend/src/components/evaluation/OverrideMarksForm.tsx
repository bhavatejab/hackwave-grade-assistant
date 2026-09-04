import React, { useState } from 'react'
import { Edit3, CheckCircle2, TrendingUp, TrendingDown, AlertCircle, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { QuestionEvaluation } from '../../api/mockEvaluationResults'

export interface OverrideMarksFormProps {
  question: QuestionEvaluation
  onSaveOverride: (
    questionId: string,
    newMarks: number,
    reason: string,
    notes: string
  ) => void
  onCancel: () => void
}

export const OverrideMarksForm: React.FC<OverrideMarksFormProps> = ({
  question,
  onSaveOverride,
  onCancel,
}) => {
  const [newMarks, setNewMarks] = useState<number>(question.marksAwarded)
  const [overrideReason, setOverrideReason] = useState<string>(
    question.overrideReason || 'Instructor discretion based on non-standard proof step'
  )
  const [teacherNotes, setTeacherNotes] = useState<string>(
    question.teacherNotes || 'Reviewed & verified by evaluator.'
  )
  const [validationError, setValidationError] = useState<string>('')

  const difference = newMarks - question.originalAiMarks

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isNaN(newMarks) || newMarks < 0) {
      setValidationError('Marks cannot be negative.')
      return
    }

    if (newMarks > question.maximumMarks) {
      setValidationError(`Marks cannot exceed maximum marks (${question.maximumMarks}).`)
      return
    }

    if (!overrideReason.trim()) {
      setValidationError('Please provide an override reason.')
      return
    }

    setValidationError('')
    onSaveOverride(question.id, newMarks, overrideReason, teacherNotes)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 rounded-2xl border border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 shadow-md space-y-4 text-xs"
    >
      <div className="flex items-center justify-between border-b border-blue-200/80 dark:border-blue-900/60 pb-3">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
          <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Override Marks for {question.questionNumber}</span>
        </div>
        <span className="font-mono text-xs font-semibold text-slate-500">
          Max Marks: {question.maximumMarks}
        </span>
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{validationError}</span>
          </div>
          <button type="button" onClick={() => setValidationError('')} className="p-0.5 text-red-400 hover:text-red-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Difference Metrics Calculation Display */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Original AI Marks
          </span>
          <span className="text-base font-extrabold text-slate-700 dark:text-slate-300 font-mono">
            {question.originalAiMarks}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-400 dark:border-blue-700 shadow-xs">
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block">
            Teacher Marks
          </span>
          <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 font-mono">
            {isNaN(newMarks) ? 0 : newMarks}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Score Difference
          </span>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            {difference > 0 ? (
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +{difference}
              </span>
            ) : difference < 0 ? (
              <span className="text-base font-extrabold text-red-600 dark:text-red-400 font-mono flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" /> {difference}
              </span>
            ) : (
              <span className="text-base font-extrabold text-slate-400 font-mono">0.0</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Teacher Marks Awarded"
          type="number"
          step="0.5"
          min="0"
          max={question.maximumMarks}
          value={isNaN(newMarks) ? '' : newMarks}
          onChange={(e) => {
            const val = parseFloat(e.target.value)
            setNewMarks(isNaN(val) ? 0 : val)
            setValidationError('')
          }}
          required
        />
        <Input
          label="Override Reason"
          value={overrideReason}
          onChange={(e) => {
            setOverrideReason(e.target.value)
            setValidationError('')
          }}
          placeholder="e.g. Non-standard proof method verified"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Teacher Comments
        </label>
        <textarea
          rows={2}
          value={teacherNotes}
          onChange={(e) => setTeacherNotes(e.target.value)}
          placeholder="Detailed comments saved on evaluation audit trail..."
          className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-blue-200/60 dark:border-blue-900/40">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Discard Changes
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          leftIcon={<CheckCircle2 className="w-4 h-4" />}
        >
          Save Override
        </Button>
      </div>
    </form>
  )
}
