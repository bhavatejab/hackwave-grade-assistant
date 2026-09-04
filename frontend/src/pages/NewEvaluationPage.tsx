import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FilePlus, Save, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { PrivacyCard } from '../components/ui/PrivacyCard'
import { evaluationService } from '../services/evaluationService'

const newEvalSchema = z.object({
  assessmentName: z.string().min(2, 'Assessment Name is required'),
  subject: z.string().min(2, 'Subject is required'),
  className: z.string().min(1, 'Class is required'),
  section: z.string().min(1, 'Section is required'),
  maxMarks: z.number().min(1, 'Maximum Marks must be greater than 0'),
  assessmentDate: z.string().min(1, 'Assessment Date is required'),
  instructions: z.string().optional(),
})

type NewEvalFormData = z.infer<typeof newEvalSchema>

export const NewEvaluationPage: React.FC = () => {
  const navigate = useNavigate()
  const [isDraftSaved, setIsDraftSaved] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewEvalFormData>({
    resolver: zodResolver(newEvalSchema),
    defaultValues: {
      assessmentName: 'CS106B Midterm Examination',
      subject: 'Computer Science',
      className: 'CS106B',
      section: 'Section A',
      maxMarks: 100,
      assessmentDate: '2026-09-04',
      instructions: 'Standard closed-book midterm examination. Evaluated using UUID anonymization.',
    },
  })

  const onSaveDraft = async () => {
    setIsDraftSaved(true)
    setTimeout(() => setIsDraftSaved(false), 3000)
  }

  const onSubmit = async (data: NewEvalFormData) => {
    await evaluationService.createEvaluation(data)
    navigate('/evaluations/upload')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Create New Evaluation
          </h1>
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Step 1 of 3
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Set assessment parameters and grading metadata before staging answer sheets.
        </p>
      </div>

      <PrivacyCard />

      {isDraftSaved && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Evaluation parameters saved as draft!</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FilePlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <CardTitle>Assessment Details</CardTitle>
            </div>
            <CardDescription>
              Basic metadata for the evaluation batch.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Assessment Name"
                placeholder="e.g. CS106B Midterm Exam"
                errorText={errors.assessmentName?.message}
                {...register('assessmentName')}
              />
              <Input
                label="Subject"
                placeholder="e.g. Computer Science"
                errorText={errors.subject?.message}
                {...register('subject')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Class / Course Code"
                placeholder="e.g. CS106B"
                errorText={errors.className?.message}
                {...register('className')}
              />
              <Input
                label="Section"
                placeholder="e.g. Section A"
                errorText={errors.section?.message}
                {...register('section')}
              />
              <Input
                label="Maximum Marks"
                type="number"
                placeholder="100"
                errorText={errors.maxMarks?.message}
                {...register('maxMarks', { valueAsNumber: true })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Assessment Date"
                type="date"
                errorText={errors.assessmentDate?.message}
                {...register('assessmentDate')}
              />
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Include bonus credit for question 4 diagram"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  {...register('instructions')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onSaveDraft}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Draft
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Start Evaluation & Upload Files
          </Button>
        </div>
      </form>
    </div>
  )
}
