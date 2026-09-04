import React, { createContext, useContext, useState } from 'react'
import { EvaluationResultPayload, MOCK_EVALUATION_RESULT } from '../api/mockEvaluationResults'
import { useNotifications } from './NotificationContext'

interface EvaluationContextType {
  evaluation: EvaluationResultPayload
  overrideQuestionMarks: (
    questionId: string,
    newMarks: number,
    reason: string,
    notes: string
  ) => void
  finalizeEvaluation: () => void
}

const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined)

export const EvaluationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [evaluation, setEvaluation] = useState<EvaluationResultPayload>(MOCK_EVALUATION_RESULT)
  const { addNotification } = useNotifications()

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

  const finalizeEvaluation = () => {
    setEvaluation((prev) => ({
      ...prev,
      status: 'finalized',
    }))
    addNotification({
      title: 'Evaluation Finalized',
      message: 'Final grades published successfully.',
      type: 'success',
    })
  }

  return (
    <EvaluationContext.Provider
      value={{ evaluation, overrideQuestionMarks, finalizeEvaluation }}
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
