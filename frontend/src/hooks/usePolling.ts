import { useState, useEffect, useRef } from 'react'

export type EvaluationStage =
  | 'Queued'
  | 'Uploading'
  | 'Processing OCR'
  | 'Generating Evaluation'
  | 'Evaluating Answers'
  | 'Calculating Confidence'
  | 'Waiting For Review'
  | 'Completed'
  | 'Failed'

export interface UsePollingResult {
  currentStage: EvaluationStage
  progress: number
  isProcessing: boolean
  startPolling: () => void
  resetPolling: () => void
}

export function usePolling(
  onComplete?: () => void,
  intervalMs = 1200
): UsePollingResult {
  const stages: EvaluationStage[] = [
    'Queued',
    'Uploading',
    'Processing OCR',
    'Generating Evaluation',
    'Evaluating Answers',
    'Calculating Confidence',
    'Waiting For Review',
    'Completed',
  ]

  const [stageIndex, setStageIndex] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startPolling = () => {
    setIsProcessing(true)
    setStageIndex(0)
  }

  const resetPolling = () => {
    setIsProcessing(false)
    setStageIndex(0)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  useEffect(() => {
    if (isProcessing && stageIndex < stages.length - 1) {
      timerRef.current = setTimeout(() => {
        setStageIndex((prev) => {
          const next = prev + 1
          if (next === stages.length - 1) {
            setIsProcessing(false)
            if (onComplete) onComplete()
          }
          return next
        })
      }, intervalMs)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isProcessing, stageIndex, intervalMs, onComplete, stages.length])

  const progress = Math.round(((stageIndex + 1) / stages.length) * 100)

  return {
    currentStage: stages[stageIndex],
    progress,
    isProcessing,
    startPolling,
    resetPolling,
  }
}
