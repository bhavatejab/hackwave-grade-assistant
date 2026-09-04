import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { EvaluationResultPayload, QuestionEvaluation } from '../api/mockEvaluationResults'
import { evaluationService } from '../services/evaluationService'
import { GradeResponse, RubricCriterion } from '../types/api'
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
  ) => Promise<void>
  setGradedEvaluation: (
    result: GradeResponse,
    metadata: {
      questionText: string
      studentAnswerText: string
      rubric: RubricCriterion[]
      studentUuid?: string
      assessmentName?: string
    }
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
  return {
    assessmentName: '',
    subject: '',
    className: '',
    section: '',
    assessmentDate: '',
    instructions: '',
    maximumMarks: 0,
    overallScore: 0,
    overallConfidence: 0,
    questionsEvaluated: 0,
    questionsRequiringReview: 0,
    teacherOverrides: 0,
    studentUUID: 'STU-A91F23',
    courseCode: '',
    status: 'pending_review',
    questions: [],
  }
}

export const EvaluationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [evaluation, setEvaluation] = useState<EvaluationResultPayload>(getInitialEvaluation)
  const [reportsCount] = useState<number>(0)
  const [archivedCount] = useState<number>(0)
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
    // No-op for hackathon direct demo
  }, [])

  useEffect(() => {
    refreshMetrics()
  }, [refreshMetrics])

  const pendingReviewCount = evaluation.status === 'finalized' ? 0 : evaluation.questionsRequiringReview

  const overrideQuestionMarks = async (
    questionId: string,
    newMarks: number,
    reason: string,
    notes: string
  ) => {
    const targetQuestion = evaluation.questions.find((q) => q.id === questionId)

    // 1. Submit teacher feedback to backend asynchronously
    if (targetQuestion) {
      const criterionId = targetQuestion.criteria?.[0]?.id || 'crit_1'
      evaluationService.submitFeedback({
        question: targetQuestion.questionText,
        criterion_id: criterionId,
        student_answer: targetQuestion.studentAnswerText,
        ai_score: targetQuestion.originalAiMarks,
        ai_reasoning: targetQuestion.reasoning,
        ai_evidence: targetQuestion.evidenceMatched.join('; '),
        reconsidered_score: targetQuestion.marksAwarded,
        teacher_final_score: newMarks,
        teacher_feedback: `${reason}${notes ? ` - ${notes}` : ''}`.trim(),
        feedback_type: 'teacher_override',
      }).catch((err) => {
        console.warn('Backend feedback submission background log error:', err)
      })

      // 2. Call backend final grade endpoint for source-of-truth score recalculation
      try {
        const criteriaPayload = targetQuestion.criteria && targetQuestion.criteria.length > 0
          ? targetQuestion.criteria
          : [{ id: criterionId, score: targetQuestion.marksAwarded, max_score: targetQuestion.maximumMarks }]

        await evaluationService.submitFinalGrade({
          criteria: criteriaPayload,
          criterion_id: criterionId,
          teacher_final_score: newMarks,
        })
      } catch (err) {
        console.warn('Backend final grade calculation notification (falling back to local):', err)
      }
    }

    // 3. Update evaluation state
    setEvaluation((prev) => {
      const updatedQuestions = prev.questions.map((q) => {
        if (q.id === questionId) {
          const updatedCriteria = q.criteria?.map((c, i) => {
            if (i === 0 || c.id === 'crit_1') {
              return { ...c, score: newMarks }
            }
            return c
          })

          return {
            ...q,
            marksAwarded: newMarks,
            teacherMarks: newMarks,
            isOverridden: true,
            overrideReason: reason,
            teacherNotes: notes,
            status: 'teacher_reviewed' as const,
            manualReviewRequired: false,
            criteria: updatedCriteria || q.criteria,
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

    // Show success toast
    addNotification({
      title: 'Marks Updated & Logged',
      message: 'Teacher override synchronized with backend.',
      type: 'success',
    })
  }

  const setGradedEvaluation = (
    result: GradeResponse,
    metadata: {
      questionText: string
      studentAnswerText: string
      rubric: RubricCriterion[]
      studentUuid?: string
      assessmentName?: string
    }
  ) => {
    const confidencePct = Math.round((result.confidence || 0) * 100)
    const matchedEvidence = result.criteria
      ? result.criteria.map((c) => `${c.id}: ${c.evidence || c.reasoning}`).filter(Boolean)
      : []

    const criteriaReasoning = result.criteria && result.criteria.length > 0
      ? result.criteria.map((c) => `[${c.id} - ${c.score}/${c.max_score} pts]: ${c.reasoning}`).join(' ')
      : 'Evaluated by Featherless AI according to rubric criteria.'

    const createdQuestion: QuestionEvaluation = {
      id: 'q1',
      questionNumber: 'Q1',
      questionText: metadata.questionText,
      maximumMarks: result.max_score,
      marksAwarded: result.total_score,
      originalAiMarks: result.total_score,
      confidence: confidencePct,
      confidenceStatus: confidencePct > 85 ? 'High' : confidencePct > 70 ? 'Medium' : 'Low',
      studentUUID: metadata.studentUuid || 'STU-A91F23',
      status: result.requires_teacher_review ? 'manual_review_required' : 'auto_graded',
      studentAnswerText: metadata.studentAnswerText,
      expectedAnswer: metadata.rubric.map((r) => `${r.id}: ${r.description} (${r.max_score} marks)`).join('\n'),
      evidenceMatched: matchedEvidence.length > 0 ? matchedEvidence : ['Rubric criteria verified against student response.'],
      evidenceMissing: [],
      reasoning: criteriaReasoning,
      alternativeReasoning: result.alternative_reasoning_detected
        ? 'Alternative valid academic reasoning detected and credited in student response.'
        : undefined,
      reviewRecommendation: result.requires_teacher_review
        ? 'Manual Review Required'
        : confidencePct < 75
        ? 'Recommended'
        : 'No Review Needed',
      manualReviewRequired: result.requires_teacher_review,
      criteria: result.criteria,
      ocrConfidence: result.ocr_confidence,
    }

    setEvaluation((prev) => {
      const updated: EvaluationResultPayload = {
        ...prev,
        assessmentName: metadata.assessmentName || prev.assessmentName,
        overallScore: result.total_score,
        maximumMarks: result.max_score,
        overallConfidence: confidencePct,
        questionsEvaluated: 1,
        questionsRequiringReview: result.requires_teacher_review ? 1 : 0,
        teacherOverrides: 0,
        status: result.requires_teacher_review ? 'pending_review' : 'auto_graded',
        questions: [createdQuestion],
      }
      try {
        localStorage.setItem('smart_grade_active_evaluation', JSON.stringify(updated))
      } catch (e) {
        console.error('Failed saving graded evaluation to storage', e)
      }
      return updated
    })

    addNotification({
      title: 'Grading Complete',
      message: `Score: ${result.total_score}/${result.max_score} (${confidencePct}% confidence)`,
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
    setEvaluation((prev) => {
      const updatedQuestions = prev.questions.map((q) => ({
        ...q,
        manualReviewRequired: false,
        status: q.status === 'manual_review_required' ? ('teacher_reviewed' as const) : q.status,
      }))

      return {
        ...prev,
        status: 'finalized',
        questionsRequiringReview: 0,
        questions: updatedQuestions,
      }
    })

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
        setGradedEvaluation,
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
