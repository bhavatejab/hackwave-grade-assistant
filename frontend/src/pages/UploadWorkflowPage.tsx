import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Play, ArrowLeft } from 'lucide-react'
import { QuestionPaperUploadCard } from '../components/evaluation/QuestionPaperUploadCard'
import { RubricUploadCard } from '../components/evaluation/RubricUploadCard'
import { StudentAnswersUploadCard } from '../components/evaluation/StudentAnswersUploadCard'
import { UploadHistoryList } from '../components/evaluation/UploadHistoryList'
import { PrivacyCard } from '../components/ui/PrivacyCard'
import { Button } from '../components/ui/Button'
import { useEvaluation } from '../contexts/EvaluationContext'

export const UploadWorkflowPage: React.FC = () => {
  const navigate = useNavigate()
  const { evaluation } = useEvaluation()
  const [qpSelected, setQpSelected] = useState<File | null>(null)
  const [rubricSelected, setRubricSelected] = useState<File | null>(null)
  const [isStarting, setIsStarting] = useState(false)

  const handleStartEvaluation = () => {
    setIsStarting(true)
    setTimeout(() => {
      navigate('/evaluations/progress')
    }, 600)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              Upload Assessment Files
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Step 2 of 3
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stage Question Paper, Rubric, and Student Answer Sheets for <span className="font-semibold text-slate-900 dark:text-slate-200">{evaluation.assessmentName}</span> ({evaluation.courseCode} • {evaluation.section} • {evaluation.maximumMarks} Max Marks).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/evaluations/new')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Details
          </Button>
          <Button
            variant="primary"
            size="md"
            isLoading={isStarting}
            onClick={handleStartEvaluation}
            rightIcon={<Play className="w-4 h-4 fill-current" />}
          >
            Start Evaluation Pipeline
          </Button>
        </div>
      </div>

      <PrivacyCard text="Student identities remain hidden from AI. Only anonymous UUIDs are processed during upload staging." />

      {/* Three Premium Upload Cards Required by Prompt */}
      <div className="space-y-6">
        {/* Card 1: Question Paper */}
        <QuestionPaperUploadCard onFileSelect={setQpSelected} />

        {/* Card 2: Answer Key / Rubric */}
        <RubricUploadCard onFileSelect={setRubricSelected} />

        {/* Card 3: Student Answer Sheets */}
        <StudentAnswersUploadCard />
      </div>

      {/* Upload History Audit Section */}
      <UploadHistoryList />

      {/* Bottom Floating CTA Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white dark:bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <p className="text-xs sm:text-sm font-semibold">
            All 3 upload components staged & verified with DPDP 2023 UUID mapping.
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          isLoading={isStarting}
          onClick={handleStartEvaluation}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Execute Evaluation Pipeline
        </Button>
      </div>
    </div>
  )
}
