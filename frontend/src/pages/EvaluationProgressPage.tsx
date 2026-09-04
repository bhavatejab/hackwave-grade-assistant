import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { EvaluationPipelineProgress, PipelineStep } from '../components/evaluation/EvaluationPipelineProgress'
import { PrivacyCard } from '../components/ui/PrivacyCard'

import { useEvaluation } from '../contexts/EvaluationContext'

export const EvaluationProgressPage: React.FC = () => {
  const navigate = useNavigate()
  const { evaluation } = useEvaluation()
  const [progress, setProgress] = useState(45)
  const [estimatedTime, setEstimatedTime] = useState(28)

  const [steps, setSteps] = useState<PipelineStep[]>([
    { name: 'Reading Question Paper', status: 'completed' },
    { name: 'Reading Answer Key', status: 'completed' },
    { name: 'Reading Student Answers', status: 'processing' },
    { name: 'Generating Evaluation', status: 'waiting' },
    { name: 'Generating Evidence', status: 'waiting' },
    { name: 'Calculating Confidence', status: 'waiting' },
    { name: 'Preparing Results', status: 'waiting' },
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            navigate('/evaluations/success')
          }, 800)
          return 100
        }
        const next = prev + 15
        if (next >= 60 && steps[2].status === 'processing') {
          setSteps((s) => [
            { ...s[0] },
            { ...s[1] },
            { ...s[2], status: 'completed' },
            { ...s[3], status: 'processing' },
            { ...s[4] },
            { ...s[5] },
            { ...s[6] },
          ])
        } else if (next >= 85 && steps[3].status === 'processing') {
          setSteps((s) => [
            { ...s[0] },
            { ...s[1] },
            { ...s[2] },
            { ...s[3], status: 'completed' },
            { ...s[4], status: 'completed' },
            { ...s[5], status: 'completed' },
            { ...s[6], status: 'processing' },
          ])
        }
        return next
      })

      setEstimatedTime((prev) => Math.max(0, prev - 7))
    }, 1200)

    return () => clearInterval(timer)
  }, [navigate, steps])

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Evaluation Progress Pipeline
          </h1>
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Step 3 of 3
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Evaluating <span className="font-semibold text-slate-900 dark:text-slate-200">{evaluation.assessmentName}</span> ({evaluation.courseCode} • {evaluation.section} • {evaluation.maximumMarks} Max Marks) with UUID anonymization.
        </p>
      </div>

      <PrivacyCard text="Student identities remain hidden from AI. Only anonymous UUIDs are processed during evaluation execution." />

      <EvaluationPipelineProgress
        progressPercentage={progress}
        estimatedTimeSeconds={estimatedTime}
        steps={steps}
      />
    </div>
  )
}
