import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { EvaluationResultPayload, MOCK_EVALUATION_RESULT } from '../api/mockEvaluationResults'
import { reportService } from '../api/reportService'
import { useNotifications } from './NotificationContext'

export interface EvaluationContextType {
  evaluation: EvaluationResultPayload
  reportsCount: number
  archivedCount: number
  queueCount: number
  pendingReviewCount: number
  overrideQuestionMarks: (
    questionId: string,
    newMarks: number,
    reason: string,
    notes: string
  ) => void
  updateEvaluationConfig: (params: {
    assessmentName?: string
    subject?: string
    className?: string
    section?: string
    maximumMarks?: number
  }) => void
  finalizeEvaluation: () => void
  setQueueCount: (count: number) => void
  refreshMetrics: () => Promise<void>
}

const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined)

const getInitialEvaluation = (): EvaluationResultPayload => {
  try {
    const data = localStorage.getItem('smart_grade_active_evaluation')
    if (data) {
      return JSON.parse(data)
    }
  } catch (e) {
    console.error('Failed reading evaluation state from localStorage', e)
  }
  return MOCK_EVALUATION_RESULT
}

export const EvaluationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [evaluation, setEvaluation] = useState<EvaluationResultPayload>(getInitialEvaluation)
  const [reportsCount, setReportsCount] = useState<number>(12)
  const [archivedCount, setArchivedCount] = useState<number>(3)
  const [queueCount, setQueueCount] = useState<number>(0)
  const { addNotification } = useNotifications()

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem('smart_grade_active_evaluation', JSON.stringify(evaluation))
    } catch (e) {
      console.error('Failed saving evaluation state to localStorage', e)
    }
  }, [evaluation])

  const refreshMetrics = useCallback(async () => {
    try {
      const activeRes = await reportService.getReports({ isArchived: false, limit: 100 })
      const archivedRes = await reportService.getReports({ isArchived: true, limit: 100 })
      setReportsCount(activeRes.total)
      setArchivedCount(archivedRes.total)
    } catch (e) {
      console.error('Failed refreshing report metrics', e)
    }
  }, [])

  useEffect(() => {
    refreshMetrics()
  }, [refreshMetrics])

  const pendingReviewCount = evaluation.status === 'finalized' ? 0 : evaluation.questionsRequiringReview

  const overrideQuestionMarks = (
    questionId: string,
    newMarks: number,
    reason: string,
    notes: string
  ) => {
    setEvaluation((prev) => {
      const updatedQuestions = prev.questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            marksAwarded: newMarks,
            teacherMarks: newMarks,
            isOverridden: true,
            overrideReason: reason,
            teacherNotes: notes,
            status: 'teacher_reviewed' as const,
            manualReviewRequired: false,
          }
        }
        return q
      })

      const newTotal = updatedQuestions.reduce((acc, q) => acc + q.marksAwarded, 0)
      const overridesCount = updatedQuestions.filter((q) => q.isOverridden).length
      const remainingReviews = updatedQuestions.filter((q) => q.manualReviewRequired).length

      return {
        ...prev,
        overallScore: newTotal,
        teacherOverrides: overridesCount,
        questionsRequiringReview: remainingReviews,
        questions: updatedQuestions,
      }
    })

    // Show success toast required by prompt
    addNotification({
      title: 'Marks Updated',
      message: 'Marks updated successfully.',
      type: 'success',
    })
  }

  const updateEvaluationConfig = (params: {
    assessmentName?: string
    subject?: string
    className?: string
    courseCode?: string
    section?: string
    maximumMarks?: number
    assessmentDate?: string
    instructions?: string
  }) => {
    setEvaluation((prev) => {
      const newMaxMarks = params.maximumMarks !== undefined ? Number(params.maximumMarks) : prev.maximumMarks
      const oldMaxMarks = prev.maximumMarks || 100
      const scale = oldMaxMarks > 0 ? newMaxMarks / oldMaxMarks : 1

      let updatedQuestions = prev.questions
      if (newMaxMarks !== oldMaxMarks && scale > 0) {
        updatedQuestions = prev.questions.map((q) => {
          const qOldMax = q.maximumMarks || 20
          const qNewMax = Math.max(1, Math.round(qOldMax * scale))
          const qNewAwarded = Math.min(qNewMax, Math.round((q.marksAwarded / qOldMax) * qNewMax))
          const qNewAi = Math.min(qNewMax, Math.round((q.originalAiMarks / qOldMax) * qNewMax))
          return {
            ...q,
            maximumMarks: qNewMax,
            marksAwarded: qNewAwarded,
            originalAiMarks: qNewAi,
          }
        })
      }

      const newTotalScore = updatedQuestions.reduce((acc, q) => acc + q.marksAwarded, 0)
      const classNameValue = params.className || params.courseCode || prev.className || prev.courseCode

      const updated: EvaluationResultPayload = {
        ...prev,
        assessmentName: params.assessmentName || prev.assessmentName,
        subject: params.subject || prev.subject,
        className: classNameValue,
        courseCode: classNameValue,
        section: params.section || prev.section,
        assessmentDate: params.assessmentDate || prev.assessmentDate,
        instructions: params.instructions !== undefined ? params.instructions : prev.instructions,
        maximumMarks: newMaxMarks,
        overallScore: newTotalScore,
        questions: updatedQuestions,
      }

      try {
        localStorage.setItem('smart_grade_active_evaluation', JSON.stringify(updated))
      } catch (e) {
        console.error('Error saving updated evaluation to localStorage', e)
      }

      return updated
    })

    addNotification({
      title: 'Configuration Saved',
      message: `Evaluation metadata synchronized successfully.`,
      type: 'info',
    })
  }

  const finalizeEvaluation = () => {
    let updatedPayload: EvaluationResultPayload | null = null

    setEvaluation((prev) => {
      const updatedQuestions = prev.questions.map((q) => ({
        ...q,
        manualReviewRequired: false,
        status: q.status === 'manual_review_required' ? ('teacher_reviewed' as const) : q.status,
      }))

      updatedPayload = {
        ...prev,
        status: 'finalized',
        questionsRequiringReview: 0,
        questions: updatedQuestions,
      }

      return updatedPayload
    })

    if (updatedPayload) {
      const payload: EvaluationResultPayload = updatedPayload
      reportService
        .addFinalizedReport({
          id: `REP-2026-${Math.floor(100 + Math.random() * 900)}`,
          assessmentName: payload.assessmentName,
          subject: payload.subject || 'Computer Science',
          className: payload.className || payload.courseCode || 'CS106B',
          section: payload.section || 'Section A',
          evaluationDate: payload.assessmentDate || new Date().toISOString().split('T')[0],
          studentCount: 48,
          averageScore: Math.round((payload.overallScore / payload.maximumMarks) * 100),
          averageConfidence: payload.overallConfidence,
          manualReviewsCount: 0,
          teacherOverridesCount: payload.teacherOverrides,
          status: 'completed',
          teacherName: 'Dr. Sarah Jenkins',
          courseCode: payload.courseCode || payload.className || 'CS106B',
          maximumMarks: payload.maximumMarks,
          isArchived: false,
        })
        .then(() => {
          refreshMetrics()
        })
    }

    addNotification({
      title: 'Evaluation Finalized',
      message: 'Evaluation finalized successfully.',
      type: 'success',
    })
  }

  return (
    <EvaluationContext.Provider
      value={{
        evaluation,
        reportsCount,
        archivedCount,
        queueCount,
        pendingReviewCount,
        overrideQuestionMarks,
        updateEvaluationConfig,
        finalizeEvaluation,
        setQueueCount,
        refreshMetrics,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  )
}

export const useEvaluation = () => {
  const context = useContext(EvaluationContext)
  if (!context) {
    throw new Error('useEvaluation must be used within an EvaluationProvider')
  }
  return context
}
